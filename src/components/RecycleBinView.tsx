import React from 'react';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const RecycleBinView: React.FC = () => {
  const {
    recycleBinDocuments,
    restoreDocument,
    permanentDeleteDocument,
    emptyRecycleBin,
    setSelectedDocForView,
  } = useVault();

  const [confirmEmpty, setConfirmEmpty] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
            <Trash2 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Recycle Bin</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {recycleBinDocuments.length} items
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Soft-deleted documents are retained for 30 days before permanent purging
            </p>
          </div>
        </div>

        {recycleBinDocuments.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmEmpty ? (
              <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-200 rounded-lg animate-in fade-in duration-150">
                <span className="text-xs font-bold text-rose-800 px-2">Permanently delete all?</span>
                <button
                  onClick={() => {
                    emptyRecycleBin();
                    setConfirmEmpty(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-extrabold cursor-pointer"
                >
                  Yes, Empty
                </button>
                <button
                  onClick={() => setConfirmEmpty(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmEmpty(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Recycle Bin</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Retention notice banner */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-600">
          <p className="font-bold text-slate-900">Protected Retention Window</p>
          <p className="mt-0.5">
            Documents sent to the Recycle Bin are safely preserved. You can restore them to their original folders at any time, or permanently delete them when you're ready.
          </p>
        </div>
      </div>

      {/* Deleted Document List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {recycleBinDocuments.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Trash2 className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5] mb-2" />
            <p className="text-sm font-semibold text-slate-700">Recycle Bin is Empty</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Any documents you remove from your personal folders will appear here for safe recovery.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Category / Original Path</th>
                  <th className="py-3 px-4">Deleted Date</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recycleBinDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer" onClick={() => setSelectedDocForView(doc)}>
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{doc.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {doc.folder || doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {doc.deletedAt || 'Recently'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {doc.fileSize || '1.2 MB'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => restoreDocument(doc.id)}
                          className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                        {confirmDeleteId === doc.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                permanentDeleteDocument(doc.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(doc.id)}
                            className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
