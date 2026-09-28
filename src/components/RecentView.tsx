import React from 'react';
import {
  Clock,
  FileText,
  Eye,
  Share2,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const RecentView: React.FC = () => {
  const {
    documents,
    setSelectedDocForView,
    setDocToShare,
    setIsShareModalOpen,
    deleteDocument,
    setIsUploadModalOpen
  } = useVault();

  // Sort by upload/modification date
  const recentDocs = [...documents].filter((d) => !d.isDeleted).slice(0, 15);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Recent Documents</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Activity History
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Documents recently uploaded, modified, examined, or shared
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {recentDocs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Clock className="w-12 h-12 text-slate-300 stroke-[1.5] mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-sm">No Recent Activity</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload personal documents or use the AI Assistant to interact with files to build your activity feed.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Category & Folder</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            onClick={() => setSelectedDocForView(doc)}
                            className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer"
                          >
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{doc.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-medium">
                        {doc.folder || doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {doc.uploadedAt || `${idx + 1} hours ago`}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          doc.status === 'VALID'
                            ? 'bg-sky-100 text-sky-800'
                            : doc.status === 'EXPIRING_SOON'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocForView(doc)}
                          className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => {
                            setDocToShare(doc);
                            setIsShareModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Move to Recycle Bin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
