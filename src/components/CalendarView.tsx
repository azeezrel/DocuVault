import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const CalendarView: React.FC = () => {
  const { deadlines, documents, setSelectedDocForView, setIsUploadModalOpen } = useVault();

  // Sort deadlines by date
  const sorted = [...deadlines].sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Life Calendar & Expiration Timeline</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Timeline
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Visual roadmap of every upcoming policy renewal, visa expiry, rent deadline, and milestone
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

      {/* Timeline view */}
      <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider mb-6">
          UPCOMING LIFE EVENTS & EXPIRATIONS
        </h3>

        {sorted.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No upcoming events or deadlines recorded. Upload documents to populate the timeline.
          </div>
        ) : (
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-200">
            {sorted.map((item, index) => (
              <div key={item.id} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[1.85rem] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    item.daysRemaining < 0
                      ? 'bg-sky-800'
                      : item.daysRemaining <= 14
                      ? 'bg-sky-600'
                      : 'bg-sky-400'
                  }`}
                ></div>

                <div className="bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                          {item.date}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.documentTitle ? `Referenced Document: ${item.documentTitle}` : 'Personal Administrative Task'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          item.daysRemaining < 0
                            ? 'bg-sky-200 text-sky-950 font-extrabold'
                            : item.daysRemaining <= 14
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {item.daysRemaining < 0
                          ? 'Expired'
                          : item.daysRemaining === 0
                          ? 'Due Today'
                          : `In ${item.daysRemaining} days`}
                      </span>

                      {item.documentId && (
                        <button
                          onClick={() => {
                            const found = documents.find((d) => d.id === item.documentId);
                            if (found) setSelectedDocForView(found);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>View Doc</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
