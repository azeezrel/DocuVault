import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Check,
  Folder,
  Calendar,
  Hash,
  AlertTriangle,
  Sparkles,
  Bot,
  Layers,
  Clock,
  ArrowRight,
  ShieldAlert,
  Building,
  User,
  Eye,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import {
  DocumentCategory,
  DocumentItem,
  DuplicateWarning,
  DocumentDetectedEvent,
  DocumentRecommendedAction,
} from '../types';
import {
  analyzeDocumentWithGemini,
  calculateDeterministicStatus,
  calculateDaysRemaining,
} from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: DocumentCategory[] = [
  'Education',
  'Career',
  'Finance',
  'Insurance',
  'Personal',
  'Property',
  'Vehicles',
  'Health',
  'Legal',
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addDocument, uploadTargetCategory, selectedCategory, checkDuplicate } = useVault();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [contentHash, setContentHash] = useState<string>('');

  // AI Pipeline State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateWarning | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Extracted Document Form State (Human-in-the-Loop)
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Document');
  const [category, setCategory] = useState<DocumentCategory>('Education');
  const [subcategory, setSubcategory] = useState('');
  const [folder, setFolder] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [holderName, setHolderName] = useState('John Ahmed');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [summary, setSummary] = useState('');
  const [aiConfidence, setAiConfidence] = useState(96);
  const [confidenceWarning, setConfidenceWarning] = useState<string | null>(null);
  const [detectedEvents, setDetectedEvents] = useState<DocumentDetectedEvent[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<DocumentRecommendedAction[]>([]);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [verifiedByHuman, setVerifiedByHuman] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync category when modal opens
  useEffect(() => {
    if (isOpen) {
      if (uploadTargetCategory && uploadTargetCategory !== ('All' as any)) {
        setCategory(uploadTargetCategory);
      } else if (
        selectedCategory &&
        selectedCategory !== 'All' &&
        selectedCategory !== 'Favorites' &&
        selectedCategory !== 'Recent'
      ) {
        setCategory(selectedCategory as DocumentCategory);
      } else {
        setCategory('Education');
      }
      resetForm();
    }
  }, [isOpen, uploadTargetCategory, selectedCategory]);

  const resetForm = () => {
    setSelectedFile(null);
    setFileDataUrl(undefined);
    setContentHash('');
    setIsAnalyzing(false);
    setDuplicateWarning(null);
    setShowCompareModal(false);
    setDocTitle('');
    setDocType('Document');
    setSubcategory('');
    setFolder('');
    setDocNumber('');
    setIssuingOrg('');
    setHolderName(currentUser?.name || 'John Ahmed');
    setIssueDate('');
    setExpiryDate('');
    setSummary('');
    setAiConfidence(96);
    setConfidenceWarning(null);
    setDetectedEvents([]);
    setRecommendedActions([]);
    setSelectedActionIds([]);
    setVerifiedByHuman(false);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    const pseudoHash = `${file.name}-${file.size}-${file.lastModified}`;
    setContentHash(pseudoHash);

    // 1. AI Duplicate Detection (Exact Hash + Semantic Similarity)
    const duplicate = checkDuplicate(file.name, pseudoHash);
    if (duplicate) {
      setDuplicateWarning(duplicate);
    } else {
      setDuplicateWarning(null);
    }

    // Read Data URL for preview
    let dataUrl: string | undefined;
    try {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      setFileDataUrl(dataUrl);
    } catch (e) {
      console.warn('Could not load dataUrl preview', e);
    }

    // 2. Trigger DocuMind AI Document Intelligence
    setIsAnalyzing(true);
    setAnalysisStep('OCR & Document Understanding...');

    try {
      setTimeout(() => setAnalysisStep('AI Classification & Entity Extraction...'), 400);
      setTimeout(() => setAnalysisStep('Extracting Document Events & Reminders...'), 800);

      const aiData = await analyzeDocumentWithGemini({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        mimeType: file.type || 'application/pdf',
      });

      // Populate extracted state
      const initialTitle = aiData.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setDocTitle(initialTitle);
      setDocType(aiData.documentType || 'Document');
      if (aiData.category) {
        setCategory(aiData.category as DocumentCategory);
      }
      setSubcategory(aiData.subcategory || '');
      setFolder(aiData.folder || `${aiData.category || category}/${aiData.subcategory || 'General'}`);
      setDocNumber(aiData.documentNumber || '');
      setIssuingOrg(aiData.metadataDetails?.issuingOrganization || aiData.metadataDetails?.provider || '');
      setHolderName(aiData.owner || currentUser?.name || 'John Ahmed');
      setIssueDate(aiData.issueDate || new Date().toISOString().split('T')[0]);
      setExpiryDate(aiData.expiryDate || '');
      setSummary(aiData.summary || `Extracted and classified as ${aiData.documentType || 'Document'}.`);
      setAiConfidence(aiData.aiConfidence || 95);
      setConfidenceWarning(aiData.confidenceWarning || null);

      const events = aiData.detectedEvents || [];
      setDetectedEvents(events);

      const actions = aiData.recommendedActions || [];
      setRecommendedActions(actions);
      setSelectedActionIds(actions.map((a) => a.id));

      if ((aiData.aiConfidence || 95) < 75) {
        setConfidenceWarning(
          aiData.confidenceWarning || `Optical recognition confidence is ${aiData.aiConfidence}%. Please review carefully.`
        );
      }
    } catch (err) {
      console.error('Error during AI document analysis:', err);
      // Fallback values
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      setDocNumber(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
      setIssueDate(new Date().toISOString().split('T')[0]);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const toggleActionSelected = (actionId: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);

    try {
      const fileSizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);
      const fileSizeStr =
        selectedFile.size > 1024 * 1024
          ? `${fileSizeMb} MB`
          : `${Math.round(selectedFile.size / 1024)} KB`;

      const finalTitle = docTitle.trim() || selectedFile.name;
      const finalFolder = folder || `${category}/${subcategory || 'General'}`;

      // Calculate status deterministically
      const isNoExpiry = docType.includes('Degree') || docType.includes('Receipt') || docType.includes('Land');
      const finalStatus = calculateDeterministicStatus(expiryDate, isNoExpiry);

      // Finalize recommended actions with execution status
      const finalizedActions = recommendedActions.map((act) => ({
        ...act,
        executed: selectedActionIds.includes(act.id),
      }));

      // Enrich detected events with days remaining
      const finalizedEvents = detectedEvents.map((evt) => ({
        ...evt,
        daysRemaining: calculateDaysRemaining(evt.date),
        status:
          calculateDaysRemaining(evt.date) < 0
            ? ('OVERDUE' as const)
            : calculateDaysRemaining(evt.date) <= 30
            ? ('DUE_SOON' as const)
            : ('UPCOMING' as const),
      }));

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        userId: currentUser?.id,
        title: finalTitle,
        name: selectedFile.name,
        documentType: docType,
        category: category,
        subcategory: subcategory || 'General',
        folder: finalFolder,
        owner: holderName.trim() || currentUser?.name || 'John Ahmed',
        documentNumber: docNumber.trim() || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        expiryDate: expiryDate ? expiryDate : null,
        status: confidenceWarning && !verifiedByHuman ? 'NEEDS_REVIEW' : finalStatus,
        aiConfidence: verifiedByHuman ? 99 : aiConfidence,
        confidenceWarning: verifiedByHuman ? null : confidenceWarning,
        verifiedByHuman: verifiedByHuman,
        processingStatus: 'ready',
        summary: summary || `${finalTitle} organized in ${category} → ${subcategory || 'General'}.`,
        keyTerms: [category, subcategory, docType, docNumber].filter(Boolean),
        tags: [category.toLowerCase(), docType.toLowerCase()],
        fileSize: fileSizeStr,
        fileType: selectedFile.type || 'application/pdf',
        fileDataUrl: fileDataUrl,
        contentHash: contentHash,
        version: 1,
        uploadedAt: new Date().toISOString(),
        isFavorite: false,
        isDeleted: false,
        eventType: 'expiration',
        eventDate: expiryDate || null,
        detectedEvents: finalizedEvents,
        recommendedActions: finalizedActions,
        reminderCreated: finalizedEvents.length > 0 || selectedActionIds.some((id) => id.includes('reminder')),
        reminderSchedules: [90, 30, 7, 1],
        metadataDetails: {
          issuingOrganization: issuingOrg,
          holderName: holderName,
          policyNumber: docNumber,
          certificateId: docNumber,
        },
      };

      addDocument(newDoc);
      onClose();
    } catch (error) {
      console.error('Error adding document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">DocuMind Ingestion Engine</h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  AI Intelligence Layer
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Understand · Classify · Extract · Detect Events · Recommend Actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Dialog / Banner (Requirement #10) */}
        {duplicateWarning && (
          <div className="mx-6 mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50/90 flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  ⚠ Potential Duplicate Detected
                </h3>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  <span className="font-semibold text-slate-900">{selectedFile?.name}</span> is similar to{' '}
                  <span className="font-semibold text-slate-900">{duplicateWarning.existingDoc.name}</span> in{' '}
                  <span className="font-medium text-amber-900">{duplicateWarning.existingDoc.folder}</span>.
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-700">
                  <span>Match type: {duplicateWarning.matchType === 'exact_hash' ? 'Exact Hash Duplicate (100%)' : `Semantic Similarity (${duplicateWarning.similarityScore}%)`}</span>
                </div>
              </div>
            </div>

            {/* Compare & Resolution Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/60">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                Compare Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setDuplicateWarning(null)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Keep Both
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel Upload
              </button>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Modal */}
        {showCompareModal && duplicateWarning && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-slate-900">Side-by-Side Document Comparison</h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Existing Document */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Existing in Vault</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{duplicateWarning.existingDoc.title}</div>
                  <div className="text-[11px] text-slate-500">{duplicateWarning.existingDoc.folder}</div>
                  <div className="text-[11px] text-slate-600">Doc #: {duplicateWarning.existingDoc.documentNumber}</div>
                  <div className="text-[11px] text-slate-600">Expiry: {duplicateWarning.existingDoc.expiryDate || 'None'}</div>
                  <div className="text-[11px] text-slate-600">Size: {duplicateWarning.existingDoc.fileSize || 'N/A'}</div>
                </div>

                {/* Newly Uploaded Document */}
                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
                  <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">New Upload</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{docTitle || selectedFile?.name}</div>
                  <div className="text-[11px] text-sky-700">{category}/{subcategory || 'General'}</div>
                  <div className="text-[11px] text-slate-600">Doc #: {docNumber || 'Pending extraction'}</div>
                  <div className="text-[11px] text-slate-600">Expiry: {expiryDate || 'None'}</div>
                  <div className="text-[11px] text-slate-600">Size: {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'N/A'}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompareModal(false);
                    setDuplicateWarning(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold cursor-pointer hover:bg-sky-700"
                >
                  Confirm & Keep Both
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCompareModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer hover:bg-slate-100"
                >
                  Discard Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* File Picker Drop Zone */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
          />

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-sky-500 bg-sky-50/70'
                  : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-100 text-sky-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Drop your document here or <span className="text-sky-600 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                DocuMind will automatically read the document, classify into folders, extract metadata, and identify important dates.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500 font-medium">
                <span className="px-2 py-0.5 rounded bg-slate-100">PDF</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">JPG</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">PNG</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">DOCX</span>
                <span>up to 25MB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Selected File Card with Re-upload option */}
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {Math.round(selectedFile.size / 1024)} KB · {selectedFile.type || 'application/pdf'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-100/70 rounded-lg transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {/* AI Processing Animation */}
              {isAnalyzing && (
                <div className="p-4 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50/50 flex items-center gap-3 animate-pulse">
                  <Bot className="w-5 h-5 text-sky-600 shrink-0 animate-bounce" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-sky-900">DocuMind Intelligence Pipeline Running</div>
                    <div className="text-[11px] text-sky-700">{analysisStep || 'Analyzing document structure...'}</div>
                  </div>
                </div>
              )}

              {/* AI Confidence & Human-in-the-loop Banner (Requirement #9) */}
              {!isAnalyzing && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-800">DocuMind Confidence Score</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          aiConfidence >= 85
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {aiConfidence}% Optical Confidence
                      </span>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={verifiedByHuman}
                        onChange={(e) => setVerifiedByHuman(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                      />
                      <span className="font-semibold">Verified by me</span>
                    </label>
                  </div>

                  {confidenceWarning && !verifiedByHuman && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-800 text-xs leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Human-in-the-Loop Review: </span>
                        {confidenceWarning} Please review extracted fields below before confirming.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Editable Extracted Metadata Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-600" />
                    Document Metadata & Classification
                  </h3>
                  <span className="text-[11px] text-slate-400">AI auto-populated; edit anytime</span>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Microsoft Certified: Azure DevOps Engineer Expert"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-slate-900"
                  />
                </div>

                {/* Category & Subcategory (AI Classification with User Override) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category (Override)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value as DocumentCategory;
                        setCategory(newCat);
                        setFolder(`${newCat}/${subcategory || 'General'}`);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subcategory / Folder
                    </label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => {
                        setSubcategory(e.target.value);
                        setFolder(`${category}/${e.target.value || 'General'}`);
                      }}
                      placeholder="e.g. Certifications, Vehicle, Identity, Land"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Issuing Organization & Holder */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Issuer / Provider
                    </label>
                    <input
                      type="text"
                      value={issuingOrg}
                      onChange={(e) => setIssuingOrg(e.target.value)}
                      placeholder="e.g. Microsoft, ABC Insurance, Government"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Document Holder
                    </label>
                    <input
                      type="text"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      placeholder="e.g. John Ahmed"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Doc Number & Primary Expiration Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      Document / Policy #
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      placeholder="e.g. INS-92831, ABC-123456"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Expiry / Renewal Date
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Detected Events Engine (Requirement #4 & #5) */}
                {detectedEvents.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        AI-Detected Document Events
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                        Automated Reminder Engine (90/30/7/1d)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {detectedEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-indigo-100 shadow-2xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{evt.title}</span>
                            <span className="text-slate-500 text-[11px] ml-2">({evt.eventType})</span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-indigo-700">{evt.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommended Actions (Requirement #12) */}
                {recommendedActions.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        Recommended Next Actions
                      </div>
                      <span className="text-[10px] text-sky-600 font-medium">User-Confirmed Actions</span>
                    </div>

                    <div className="space-y-1.5">
                      {recommendedActions.map((act) => {
                        const isSelected = selectedActionIds.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            onClick={() => toggleActionSelected(act.id)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-white border-sky-300 text-slate-900 shadow-2xs'
                                : 'bg-slate-50/70 border-slate-200 text-slate-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleActionSelected(act.id)}
                              className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5 mt-0.5 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="font-semibold">{act.title}</p>
                              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{act.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting || isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving to DocuMind...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Ingest & Save Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
