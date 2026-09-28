import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Hash,
  Folder,
  Tag,
  Shield,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  History,
  Edit2,
  Save,
  Star,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { DocumentItem } from '../types';

interface DocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document: doc, onClose }) => {
  const {
    updateDocument,
    deleteDocument,
    toggleFavorite,
    setDocToShare,
    setIsShareModalOpen,
    verifyDocument,
    executeRecommendedAction,
  } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(doc?.title || '');
  const [editDocNumber, setEditDocNumber] = useState(doc?.documentNumber || '');
  const [editExpiryDate, setEditExpiryDate] = useState(doc?.expiryDate || '');
  const [editStatus, setEditStatus] = useState(doc?.status || 'VALID');

  if (!doc) return null;

  const handleSave = () => {
    updateDocument(doc.id, {
      title: editTitle,
      documentNumber: editDocNumber,
      expiryDate: editExpiryDate || null,
      status: editStatus as any,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {doc.documentType}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {doc.folder || doc.category}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 tracking-tight truncate max-w-md">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleFavorite(doc.id)}
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${
                  doc.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                }`}
              />
            </button>
            <button
              onClick={() => {
                setDocToShare(doc);
                setIsShareModalOpen(true);
              }}
              className="p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Human Verification Warning / Action (Concept #9: AI Confidence & Human-in-the-Loop) */}
          {(doc.confidenceWarning || doc.status === 'NEEDS_REVIEW' || !doc.verifiedByHuman) && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/90 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Human-in-the-Loop Verification
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      {doc.aiConfidence || 65}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {doc.confidenceWarning ||
                      'This document contains low-confidence AI extraction or missing critical fields. Please review and confirm below.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => verifyDocument(doc.id)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify & Confirm</span>
              </button>
            </div>
          )}

          {/* AI Extraction Banner (Concept #2) */}
          <div className="bg-sky-50/80 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  DocuMind Intelligence Summary
                </h4>
                <span className="text-[10px] font-semibold text-sky-700">
                  {doc.verifiedByHuman ? 'Verified by Human' : `${doc.aiConfidence || 95}% AI Confidence`}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{doc.summary}</p>
            </div>
          </div>

          {/* Structured Document Metadata Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider">
                DOCUMENT ATTRIBUTES
              </h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Owner</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{doc.owner || 'Owner'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Document Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editDocNumber}
                    onChange={(e) => setEditDocNumber(e.target.value)}
                    className="w-full text-xs font-mono font-bold bg-white border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 outline-none"
                  />
                ) : (
                  <span className="font-bold font-mono text-slate-800 mt-0.5 block">
                    {doc.documentNumber || 'N/A'}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Issue Date</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{doc.issueDate || '—'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Expiry / Event Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 outline-none"
                  />
                ) : (
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {doc.expiryDate || (doc.status === 'NO_EXPIRATION' ? 'No Expiration' : 'Needs Review')}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Category</span>
                <span className="font-bold text-sky-700 mt-0.5 block">
                  {doc.category} {doc.subcategory ? `› ${doc.subcategory}` : ''}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Status</span>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full text-xs font-bold bg-white border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 outline-none"
                  >
                    <option value="VALID">Valid</option>
                    <option value="EXPIRING_SOON">Expiring Soon</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="NO_EXPIRATION">No Expiration</option>
                    <option value="NEEDS_REVIEW">Needs Review</option>
                  </select>
                ) : (
                  <span
                    className={`font-bold mt-0.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] ${
                      doc.status === 'VALID'
                        ? 'bg-sky-100 text-sky-800'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : doc.status === 'EXPIRED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : doc.status === 'NO_EXPIRATION'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {doc.status === 'VALID'
                      ? 'Valid'
                      : doc.status === 'EXPIRING_SOON'
                      ? 'Expiring Soon'
                      : doc.status === 'EXPIRED'
                      ? 'Expired'
                      : doc.status === 'NO_EXPIRATION'
                      ? 'No Expiration'
                      : 'Needs Review'}
                  </span>
                )}
              </div>
            </div>

            {/* Specialized Metadata / AI Confidence Bar */}
            <div className="mt-3 p-3 rounded-xl bg-sky-50/50 border border-sky-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">AI Confidence:</span>
                <span className="font-extrabold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  {doc.aiConfidence ?? 97}%
                </span>
                {doc.metadataDetails?.issuingOrganization && (
                  <span className="text-slate-600">
                    • Issuer: <strong>{doc.metadataDetails.issuingOrganization}</strong>
                  </span>
                )}
              </div>
              {doc.reminderCreated && (
                <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                  Automated Reminders Active
                </span>
              )}
            </div>
          </div>

          {/* AI-Detected Document Events (Concept #4 & #5) */}
          {doc.detectedEvents && doc.detectedEvents.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Detected Document Events
                </h4>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Reminder Engine (90 / 30 / 7 / 1d)
                </span>
              </div>
              <div className="space-y-2">
                {doc.detectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-lg bg-white border border-indigo-100 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{evt.title}</p>
                      <p className="text-[11px] text-slate-500">Event type: {evt.eventType}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-indigo-700 block">{evt.date}</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Lead times: 90, 30, 7, 1 days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommended Actions (Concept #12) */}
          {doc.recommendedActions && doc.recommendedActions.length > 0 && (
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  AI Recommended Next Actions
                </h4>
                <span className="text-[10px] font-semibold text-sky-700">User In Control</span>
              </div>
              <div className="space-y-2">
                {doc.recommendedActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg bg-white border border-sky-100 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="max-w-[75%]">
                      <p className="font-bold text-slate-900">{act.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{act.description}</p>
                    </div>
                    {act.executed ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Executed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => executeRecommendedAction(doc.id, act.id)}
                        className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Execute
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Terms / Clauses */}
          {doc.keyTerms && doc.keyTerms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider mb-2">
                KEY EXTRACTED CLAUSES & TERMS
              </h4>
              <ul className="space-y-1.5">
                {doc.keyTerms.map((term, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contract Intelligence (Concept #8) */}
          {doc.contractDetails && (
            <div className="p-4 rounded-xl bg-slate-50 border border-sky-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider">
                CONTRACT & AGREEMENT INTELLIGENCE
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Notice Period:</span>
                  <p className="font-bold text-slate-800">{doc.contractDetails.noticePeriod || 'Standard'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Term Duration:</span>
                  <p className="font-bold text-slate-800">
                    {doc.contractDetails.startDate} — {doc.contractDetails.endDate}
                  </p>
                </div>
              </div>
              {doc.contractDetails.keyClauses && doc.contractDetails.keyClauses.length > 0 && (
                <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="font-semibold text-slate-700 block mb-1">Key Obligation:</span>
                  {doc.contractDetails.keyClauses.map((clause, i) => (
                    <p key={i} className="mb-1 text-[11px] leading-relaxed">
                      • {clause}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Financial Breakdown (Concept #7) */}
          {doc.financials && doc.financials.amount && (
            <div className="p-4 rounded-xl bg-slate-50 border border-sky-100">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider mb-2">
                RECEIPT & FINANCIAL SUMMARY
              </h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Merchant:</span>
                  <p className="font-bold text-slate-800">{doc.financials.merchant || 'Merchant'}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px]">Total Paid:</span>
                  <p className="text-base font-extrabold text-sky-700">
                    {doc.financials.currency || '₦'}
                    {doc.financials.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Document Timeline (Concept #13) */}
          {doc.timeline && doc.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-sky-600" />
                <span>DOCUMENT RENEWAL TIMELINE</span>
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-sky-200 ml-2">
                {doc.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-4 text-xs">
                    <div className="absolute -left-[1.35rem] top-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white"></div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-slate-900">{item.year}</span>
                      {item.date && <span className="text-[11px] text-slate-400">{item.date}</span>}
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] mt-0.5">{item.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-sky-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              deleteDocument(doc.id);
              onClose();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-sky-800 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove from Vault</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDocToShare(doc);
                setIsShareModalOpen(true);
              }}
              className="px-3 py-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Securely</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
