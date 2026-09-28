import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  LayoutGrid,
  List as ListIcon,
  Star,
  Share2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  Calendar,
  AlertCircle,
  Tag,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { DocumentItem, DocumentCategory } from '../types';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    selectedCategory,
    setSelectedCategory,
    selectedFolder,
    setSelectedFolder,
    searchQuery,
    setSearchQuery,
    setSelectedDocForView,
    deleteDocument,
    restoreDocument,
    toggleFavorite,
    setIsUploadModalOpen,
    openUploadModal,
    setDocToShare,
    setIsShareModalOpen,
  } = useVault();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'uploaded' | 'expiry'>('uploaded');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [deletedToast, setDeletedToast] = useState<{ id: string; title: string } | null>(null);

  // Active documents (excluding soft-deleted)
  const activeDocs = useMemo(() => {
    return documents.filter((d: DocumentItem) => !d.isDeleted);
  }, [documents]);

  // Filter documents
  const filtered = useMemo(() => {
    return activeDocs.filter((doc) => {
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!doc.isFavorite) return false;
      } else if (selectedCategory === 'Recent') {
        // show recent
      } else if (selectedCategory !== 'All') {
        if (doc.category !== selectedCategory) return false;
      }

      // Folder filter
      if (selectedFolder) {
        if (doc.folder !== selectedFolder && !doc.folder?.startsWith(selectedFolder)) {
          return false;
        }
      }

      // Status filter
      if (filterStatus !== 'ALL') {
        if (doc.status !== filterStatus) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          doc.name.toLowerCase().includes(q) ||
          doc.title.toLowerCase().includes(q) ||
          doc.summary?.toLowerCase().includes(q) ||
          doc.documentType?.toLowerCase().includes(q) ||
          doc.tags?.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [activeDocs, selectedCategory, selectedFolder, filterStatus, searchQuery]);

  // Sort documents
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'expiry') {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return b.id.localeCompare(a.id);
    });
  }, [filtered, sortBy]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span
              onClick={() => {
                setSelectedCategory('All');
                setSelectedFolder(null);
              }}
              className="cursor-pointer hover:text-sky-600 transition-colors"
            >
              My Documents
            </span>
            {selectedCategory !== 'All' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span
                  onClick={() => setSelectedFolder(null)}
                  className="cursor-pointer hover:text-sky-600 transition-colors font-medium text-slate-700"
                >
                  {selectedCategory}
                </span>
              </>
            )}
            {selectedFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-sky-700">{selectedFolder.split('/').pop()}</span>
              </>
            )}
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {selectedFolder
                ? selectedFolder.split('/').pop()
                : selectedCategory === 'Favorites'
                ? 'Starred Documents'
                : selectedCategory === 'Recent'
                ? 'Recent Activity'
                : selectedCategory === 'All'
                ? 'All Documents'
                : `📁 ${selectedCategory} Documents`}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              {sorted.length} {sorted.length === 1 ? 'file' : 'files'}
            </span>
          </h1>
        </div>

        {/* View toggles & Upload action */}
        <div className="flex items-center gap-2.5">
          {/* View mode toggle: Table or Grid */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Upload Button */}
          <button
            onClick={() =>
              openUploadModal(
                selectedCategory !== 'All' &&
                  selectedCategory !== 'Favorites' &&
                  selectedCategory !== 'Recent'
                  ? (selectedCategory as DocumentCategory)
                  : undefined
              )
            }
            className="flex items-center gap-2 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>
              {selectedCategory !== 'All' &&
              selectedCategory !== 'Favorites' &&
              selectedCategory !== 'Recent'
                ? `Upload to ${selectedCategory}`
                : 'Upload Document'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter / Sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-2.5 rounded-xl border border-sky-100/70">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1 text-slate-800 outline-none focus:border-sky-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="VALID">Valid</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 ml-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1 text-slate-800 outline-none focus:border-sky-400"
            >
              <option value="uploaded">Recently Added</option>
              <option value="name">Name (A-Z)</option>
              <option value="expiry">Expiration Date</option>
            </select>
          </div>
        </div>

        {/* Clear filters if any */}
        {(selectedFolder || filterStatus !== 'ALL' || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFolder(null);
              setFilterStatus('ALL');
            }}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-sky-100 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 mx-auto flex items-center justify-center mb-3">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No documents found in this view</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No document matching "${searchQuery}". Try asking DocuMind AI assistant or upload a new file.`
              : selectedCategory !== 'All'
              ? `Your ${selectedCategory} category is empty. Upload your first document to automatically track key dates.`
              : 'Your DocuMind is ready. Drag and drop any documents, contracts, certificates, or receipts.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() =>
                openUploadModal(
                  selectedCategory !== 'All' &&
                    selectedCategory !== 'Favorites' &&
                    selectedCategory !== 'Recent'
                    ? (selectedCategory as DocumentCategory)
                    : undefined
                )
              }
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-sky-200 cursor-pointer"
            >
              {selectedCategory !== 'All'
                ? `Upload to ${selectedCategory}`
                : 'Upload Document Now'}
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Detailed Table View */
        <div className="bg-white border border-sky-100 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-sky-100 text-slate-600 font-bold tracking-wider">
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4">NAME & TITLE</th>
                  <th className="py-3 px-4">CATEGORY & TYPE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DOC NUMBER</th>
                  <th className="py-3 px-4">EXPIRY DATE</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocForView(doc)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors group"
                  >
                    {/* Star favorite */}
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                    >
                      <button
                        className="text-slate-300 hover:text-amber-500 p-0.5 rounded cursor-pointer transition-colors"
                        title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            doc.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Name & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{doc.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <span>📁</span>
                          <span>{doc.category}</span>
                        </span>
                        <p className="text-[11px] text-sky-600 font-medium">
                          {doc.documentType || doc.folder || 'General Document'}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'VALID'
                            ? 'bg-sky-100 text-sky-800'
                            : doc.status === 'EXPIRING_SOON'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : doc.status === 'EXPIRED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : doc.status === 'NO_EXPIRATION'
                            ? 'bg-slate-100 text-slate-700'
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
                          ? 'No Expiry'
                          : 'Review'}
                      </span>
                    </td>

                    {/* Doc Number */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {doc.documentNumber || doc.metadataDetails?.certificateId || '—'}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3 px-4">
                      {doc.expiryDate ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.expiryDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setDocToShare(doc);
                            setIsShareModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-sky-600 p-1 rounded hover:bg-sky-50 transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedDocForView(doc)}
                          className="text-slate-400 hover:text-sky-600 p-1 rounded hover:bg-sky-50 transition-colors"
                          title="Open Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteDocument(doc.id);
                            setDeletedToast({ id: doc.id, title: doc.title });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Move to Recycle Bin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForView(doc)}
              className="bg-white border border-sky-100 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(doc.id);
                    }}
                    className="text-slate-300 hover:text-amber-500 p-1 rounded transition-colors"
                    title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        doc.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{doc.name}</p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'VALID'
                        ? 'bg-sky-100 text-sky-800'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-sky-200 text-sky-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <span className="text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    📁 {doc.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {doc.summary || 'Document organized in personal vault.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] font-medium">
                  {doc.expiryDate
                    ? `Exp: ${doc.expiryDate}`
                    : doc.status === 'NO_EXPIRATION'
                    ? 'No Expiration'
                    : 'Needs Review'}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setDocToShare(doc);
                      setIsShareModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-sky-600 p-1"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedDocForView(doc)}
                    className="text-slate-400 hover:text-sky-600 p-1"
                    title="Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(doc.id);
                      setDeletedToast({ id: doc.id, title: doc.title });
                    }}
                    className="text-slate-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Move to Recycle Bin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Undo Delete Toast */}
      {deletedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-xs font-semibold">
            &ldquo;{deletedToast.title}&rdquo; moved to Recycle Bin
          </span>
          <button
            onClick={() => {
              restoreDocument(deletedToast.id);
              setDeletedToast(null);
            }}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 underline ml-2 cursor-pointer"
          >
            Undo
          </button>
          <button
            onClick={() => setDeletedToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
