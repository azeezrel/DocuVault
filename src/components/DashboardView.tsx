import React, { useMemo } from 'react';
import {
  Upload,
  Folder,
  ArrowRight,
  FileText,
  Clock,
  HardDrive,
  Calendar,
  Eye,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';

export const DashboardView: React.FC = () => {
  const {
    documents,
    deadlines,
    attentionCounts,
    setIsUploadModalOpen,
    setActiveView,
    setSelectedDocForView,
  } = useVault();

  const { currentUser } = useAuth();

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = useMemo(() => {
    if (currentUser?.name) {
      return currentUser.name.split(' ')[0];
    }
    return 'User';
  }, [currentUser]);

  // Storage metric
  const storageMetrics = useMemo(() => {
    const quotaMb = currentUser?.storageQuotaMb || 15360; // 15 GB default
    const quotaGb = (quotaMb / 1024).toFixed(0);
    const activeDocs = documents.filter((d) => !d.isDeleted);

    if (activeDocs.length === 0) {
      return {
        display: `0 MB / ${quotaGb} GB`,
      };
    }

    const usedMb = activeDocs.reduce((sum, doc) => {
      const sizeStr = doc.fileSize || '';
      if (sizeStr.includes('MB')) {
        return sum + (parseFloat(sizeStr) || 1.8);
      } else if (sizeStr.includes('KB')) {
        return sum + (parseFloat(sizeStr) || 500) / 1024;
      }
      return sum + 1.2;
    }, 0);

    let display = '0 MB';
    if (usedMb >= 1024) {
      display = `${(usedMb / 1024).toFixed(1)} GB / ${quotaGb} GB`;
    } else {
      display = `${usedMb.toFixed(1)} MB / ${quotaGb} GB`;
    }

    return { display };
  }, [documents, currentUser]);

  // Active non-deleted documents
  const activeDocs = useMemo(() => {
    return documents.filter((d) => !d.isDeleted);
  }, [documents]);

  const recentDocs = useMemo(() => {
    return activeDocs.slice(0, 5);
  }, [activeDocs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto pb-16">
      {/* 1. Greeting & Quick Actions Card */}
      <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          {/* Greeting Person */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome to your personal document vault.
            </p>
          </div>

          {/* Quick Actions: Upload Document & Browse Documents */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Actions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Action 1: Upload Document */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="p-4 sm:p-5 rounded-2xl border border-sky-100 bg-white hover:bg-sky-50/70 hover:border-sky-300 text-left transition-all shadow-2xs group flex items-center gap-4 cursor-pointer"
                id="quick-action-upload"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    Upload Document
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add new files to your vault
                  </p>
                </div>
              </button>

              {/* Action 2: Browse Documents */}
              <button
                onClick={() => setActiveView('documents')}
                className="p-4 sm:p-5 rounded-2xl border border-sky-100 bg-white hover:bg-sky-50/70 hover:border-sky-300 text-left transition-all shadow-2xs group flex items-center gap-4 cursor-pointer"
                id="quick-action-browse-docs"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Folder className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    Browse Documents
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View and manage your files
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Documents */}
        <div
          onClick={() => setActiveView('documents')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Documents</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-700 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {activeDocs.length}
          </p>
        </div>

        {/* Storage Used */}
        <div
          onClick={() => setActiveView('settings')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Used</p>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-700 transition-colors">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-black text-slate-900 mt-2 truncate">
            {storageMetrics.display}
          </p>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => setActiveView('reminders')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiring Soon</p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {attentionCounts.expiring}
          </p>
        </div>

        {/* Active Reminders */}
        <div
          onClick={() => setActiveView('important-dates')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reminders</p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {deadlines.length}
          </p>
        </div>
      </div>

      {/* 3. Recent Documents List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Recent Documents</span>
          </h3>
          <button
            onClick={() => setActiveView('documents')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentDocs.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900">No documents uploaded yet.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-3 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                      {doc.title || doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      📁 {doc.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'VALID'
                        ? 'bg-sky-100 text-sky-800'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocForView(doc);
                    }}
                    className="p-1 text-slate-400 hover:text-sky-600 rounded"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
