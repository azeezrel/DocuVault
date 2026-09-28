import React from 'react';
import {
  Star,
  FileText,
  Share2,
  Trash2,
  Eye,
  Plus,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const FavoritesView: React.FC = () => {
  const {
    documents,
    toggleFavorite,
    setSelectedDocForView,
    setDocToShare,
    setIsShareModalOpen,
    deleteDocument,
    setIsUploadModalOpen,
  } = useVault();

  const favoriteDocs = documents.filter((d) => !d.isDeleted && d.isFavorite);

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Star className="w-4 h-4 fill-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Favorites</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {favoriteDocs.length}
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Favorites List: Clean, name-focused with no bulky captions */}
      {favoriteDocs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-2xs">
          <Star className="w-10 h-10 text-amber-300 stroke-[1.5] mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No favorites yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Click the star icon next to any document to add it to your favorites.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForView(doc)}
              className="bg-white border border-sky-100 hover:border-sky-300 hover:bg-sky-50/30 rounded-xl px-4 py-3 transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
            >
              {/* Document Icon & Name Only */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-sky-700 transition-colors truncate block">
                    {doc.title || doc.name}
                  </span>
                </div>
              </div>

              {/* Minimalist Controls */}
              <div
                className="flex items-center gap-1.5 shrink-0 ml-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleFavorite(doc.id)}
                  className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove from favorites"
                >
                  <Star className="w-4 h-4 fill-amber-500" />
                </button>

                <button
                  onClick={() => setSelectedDocForView(doc)}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                  title="Open document"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setDocToShare(doc);
                    setIsShareModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Move to Recycle Bin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
