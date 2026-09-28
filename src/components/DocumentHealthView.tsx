import React, { useState, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  FolderCheck,
  FolderX,
  FileWarning,
  Eye,
  Check,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { DocumentItem } from '../types';

export const DocumentHealthView: React.FC = () => {
  const { documents, setSelectedDocForView, attentionCounts, vaultHealth, verifyDocument } = useVault();
  const [comparingDocs, setComparingDocs] = useState<{ docA: DocumentItem; docB: DocumentItem; similarity: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'expired' | 'expiring' | 'review' | 'missingMeta' | 'duplicates' | 'uncategorized'>('all');

  const activeDocs: DocumentItem[] = useMemo(
    () => documents.filter((d: DocumentItem) => !d.isDeleted),
    [documents]
  );

  // Categorized documents check
  const properlyCategorized = activeDocs.filter((d: DocumentItem) => d.category && d.folder && d.folder !== 'Unassigned').length;
  const categorizedPercent = activeDocs.length > 0 ? Math.round((properlyCategorized / activeDocs.length) * 100) : 100;

  // Important dates identified
  const withDates = activeDocs.filter((d: DocumentItem) => d.expiryDate || d.issueDate).length;
  const datesPercent = activeDocs.length > 0 ? Math.round((withDates / activeDocs.length) * 100) : 100;

  // Detect duplicate candidates based on similar titles / base filenames (Concept #10)
  const duplicates: { docA: DocumentItem; docB: DocumentItem; similarity: number }[] = [];
  for (let i = 0; i < activeDocs.length; i++) {
    for (let j = i + 1; j < activeDocs.length; j++) {
      const a = activeDocs[i];
      const b = activeDocs[j];
      const nameA = a.name.toLowerCase().replace(/[-_.\s]/g, '');
      const nameB = b.name.toLowerCase().replace(/[-_.\s]/g, '');

      if (a.contentHash && b.contentHash && a.contentHash === b.contentHash) {
        duplicates.push({ docA: a, docB: b, similarity: 100 });
      } else if (nameA === nameB) {
        duplicates.push({ docA: a, docB: b, similarity: 98 });
      } else if (nameA.includes(nameB) || nameB.includes(nameA)) {
        duplicates.push({ docA: a, docB: b, similarity: 88 });
      }
    }
  }

  // Filtered documents for audit table
  const filteredDocs = useMemo(() => {
    switch (activeFilter) {
      case 'expired':
        return activeDocs.filter((d) => d.status === 'EXPIRED');
      case 'expiring':
        return activeDocs.filter((d) => d.status === 'EXPIRING_SOON');
      case 'review':
        return activeDocs.filter((d) => d.status === 'NEEDS_REVIEW' || (!d.verifiedByHuman && (d.aiConfidence || 100) < 75));
      case 'missingMeta':
        return activeDocs.filter((d) => !d.documentNumber || d.documentNumber === 'N/A' || !d.issueDate || !d.owner);
      case 'uncategorized':
        return activeDocs.filter((d) => !d.folder || d.folder === 'Unassigned' || !d.category);
      case 'duplicates':
        const dupIds = new Set<string>();
        duplicates.forEach((dup) => {
          dupIds.add(dup.docA.id);
          dupIds.add(dup.docB.id);
        });
        return activeDocs.filter((d) => dupIds.has(d.id));
      default:
        return activeDocs;
    }
  }, [activeDocs, activeFilter, duplicates]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>DocuMind Health & Integrity</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Auditor
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Automated audit of categorization, date extraction, duplicates, and missing metadata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            Overall Health: <strong className="text-sky-700 font-extrabold">{vaultHealth.score}%</strong>
          </span>
        </div>
      </div>

      {/* Requirement #11: The Exact Document Health Breakdown Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-5 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold tracking-tight">Vault Health Command Center</h2>
          </div>
          <span className="text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
            Grade {vaultHealth.securityRating}
          </span>
        </div>

        {/* The 7 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-sky-500/20 border-sky-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Documents</span>
            <span className="text-xl font-extrabold block mt-1 text-white">{vaultHealth.totalDocuments}</span>
          </button>

          <button
            onClick={() => setActiveFilter('expired')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'expired'
                ? 'bg-rose-500/20 border-rose-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-rose-300">Expired</span>
            <span className="text-xl font-extrabold block mt-1 text-rose-400">{vaultHealth.expiredCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('expiring')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'expiring'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-300">Expiring Soon</span>
            <span className="text-xl font-extrabold block mt-1 text-amber-400">{vaultHealth.expiringSoonCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('review')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'review'
                ? 'bg-purple-500/20 border-purple-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-purple-300">Needs Review</span>
            <span className="text-xl font-extrabold block mt-1 text-purple-400">{vaultHealth.needsReviewCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('missingMeta')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'missingMeta'
                ? 'bg-sky-500/20 border-sky-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-sky-300">Missing Metadata</span>
            <span className="text-xl font-extrabold block mt-1 text-sky-400">{vaultHealth.missingMetadataCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('duplicates')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'duplicates'
                ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-indigo-300">Duplicates</span>
            <span className="text-xl font-extrabold block mt-1 text-indigo-400">{vaultHealth.possibleDuplicatesCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('uncategorized')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeFilter === 'uncategorized'
                ? 'bg-teal-500/20 border-teal-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-300">Uncategorized</span>
            <span className="text-xl font-extrabold block mt-1 text-teal-400">{vaultHealth.uncategorizedCount}</span>
          </button>
        </div>

        {/* Dynamic Action Banner: "12 documents are missing important information. [Review Documents →]" */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileQuestion className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                {vaultHealth.missingMetadataCount > 0
                  ? `${vaultHealth.missingMetadataCount} documents are missing important information.`
                  : vaultHealth.needsReviewCount > 0
                  ? `${vaultHealth.needsReviewCount} documents require human-in-the-loop verification.`
                  : vaultHealth.expiredCount > 0
                  ? `${vaultHealth.expiredCount} documents have expired.`
                  : 'Your document vault is well-organized and verified!'}
              </p>
              <p className="text-[11px] text-slate-400">
                {vaultHealth.missingMetadataCount > 0
                  ? 'Audit detected missing policy numbers, issue dates, or primary holders.'
                  : 'DocuMind intelligence has indexed all active dates and metadata.'}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setActiveFilter(
                vaultHealth.missingMetadataCount > 0
                  ? 'missingMeta'
                  : vaultHealth.needsReviewCount > 0
                  ? 'review'
                  : 'all'
              )
            }
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filtered Documents List */}
      <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {activeFilter === 'all'
                ? 'All Documents'
                : activeFilter === 'expired'
                ? 'Expired Documents'
                : activeFilter === 'expiring'
                ? 'Expiring Soon'
                : activeFilter === 'review'
                ? 'Documents Needing Review'
                : activeFilter === 'missingMeta'
                ? 'Documents with Missing Metadata'
                : activeFilter === 'duplicates'
                ? 'Potential Duplicates'
                : 'Uncategorized Documents'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredDocs.length} items
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-xl border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No documents under this filter</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Everything is verified and clear.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {doc.folder || doc.category} · {doc.documentNumber || 'Missing Doc #'} · {doc.expiryDate || 'No Expiry'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(!doc.verifiedByHuman && (doc.aiConfidence || 100) < 75) && (
                    <button
                      type="button"
                      onClick={() => verifyDocument(doc.id)}
                      className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Verify
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedDocForView(doc)}
                    className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate Detection Section (Concept #10) */}
      {duplicates.length > 0 && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-sky-700" />
              <h3 className="font-bold text-sm text-sky-950">
                Duplicate Documents Detected by AI
              </h3>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-white px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
              {duplicates.length} Pair{duplicates.length > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            AI detected possible duplicate documents or revisions. Compare them to keep only the latest version.
          </p>

          <div className="space-y-3">
            {duplicates.map((dup, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span>{dup.docA.name}</span>
                    <span className="text-slate-400">↔</span>
                    <span>{dup.docB.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Similarity: <strong className="text-sky-700">{dup.similarity}%</strong> • The second document appears to be a newer revision.
                  </p>
                </div>

                <button
                  onClick={() => setComparingDocs(dup)}
                  className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  Compare Side-by-Side
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {comparingDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Duplicate Comparison</h3>
                <p className="text-xs text-sky-700 font-semibold">Similarity: {comparingDocs.similarity}%</p>
              </div>
              <button
                onClick={() => setComparingDocs(null)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block truncate">{comparingDocs.docA.name}</span>
                <p className="text-[11px] text-slate-500">Uploaded: {comparingDocs.docA.uploadedAt}</p>
                <p className="text-[11px] text-slate-500">Type: {comparingDocs.docA.documentType}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{comparingDocs.docA.summary}</p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950 block truncate">{comparingDocs.docB.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-200 text-sky-900">
                    Newer
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Uploaded: {comparingDocs.docB.uploadedAt}</p>
                <p className="text-[11px] text-slate-500">Type: {comparingDocs.docB.documentType}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{comparingDocs.docB.summary}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setComparingDocs(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Keep Both
              </button>
              <button
                onClick={() => setComparingDocs(null)}
                className="px-4 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Keep Newer Version Only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
