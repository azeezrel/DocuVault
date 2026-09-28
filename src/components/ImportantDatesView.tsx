import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const ImportantDatesView: React.FC = () => {
  const { deadlines, documents, setSelectedDocForView, setIsUploadModalOpen } = useVault();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  // Days for calendar matrix (September 2026 starts on Tuesday, has 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Important Dates</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Personal Calendar
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Interactive timeline of policy renewals, registration deadlines, and contract notice dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Calendar | List Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-sky-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-sky-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-6">
          {/* September 2026 Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>September 2026</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  Current Month
                </span>
              </h3>
              <span className="text-xs text-slate-400">Time Anchor: 21 Sep 2026</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3 rounded-xl bg-sky-50/60 border border-sky-200">
                <div className="w-12 text-center shrink-0">
                  <span className="text-xs font-extrabold text-sky-700 block">21</span>
                  <span className="text-[10px] font-bold uppercase text-sky-600">Today</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-900">DocuMind Personal Command Center Operational</p>
                    <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-800 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your personal vault is active and monitoring document expirations.
                  </p>
                </div>
              </div>

              {deadlines
                .filter((d) => d.daysRemaining <= 30)
                .map((dl) => (
                  <div
                    key={dl.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/60 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-200 transition-colors"
                  >
                    <div className="w-12 text-center shrink-0">
                      <span className="text-xs font-extrabold text-slate-800 block">
                        {dl.date.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {dl.date.split(' ')[1] || 'Sep'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-slate-900">{dl.title}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dl.daysRemaining < 0
                              ? 'bg-rose-100 text-rose-800'
                              : dl.daysRemaining <= 14
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {dl.daysRemaining < 0
                            ? 'Past Due'
                            : dl.daysRemaining === 0
                            ? 'Due Today'
                            : `Due in ${dl.daysRemaining}d`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Category: {dl.category} {dl.documentTitle ? `• Doc: ${dl.documentTitle}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* October & Beyond Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">October 2026 & Future Milestones</h3>
            <div className="space-y-3">
              {deadlines.filter((d) => d.daysRemaining > 30).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No deadlines detected beyond next month. Upload policies or certificates to track renewals.
                </p>
              ) : (
                deadlines
                  .filter((d) => d.daysRemaining > 30)
                  .map((dl) => (
                    <div
                      key={dl.id}
                      className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/60 border border-slate-200"
                    >
                      <div className="w-12 text-center shrink-0">
                        <span className="text-xs font-extrabold text-slate-800 block">
                          {dl.date.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {dl.date.split(' ')[1] || 'Oct'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-900">{dl.title}</p>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            In {dl.daysRemaining} days
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Category: {dl.category}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Calendar Month Grid View */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-slate-900">{currentMonth}</h3>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {/* Empty offset days for Tuesday start */}
            <div className="h-20 bg-slate-50/30 rounded-xl"></div>
            <div className="h-20 bg-slate-50/30 rounded-xl"></div>

            {daysInMonth.map((day) => {
              const isToday = day === 21;
              const hasEvents = deadlines.some((d) => d.date.startsWith(`${day} `));
              return (
                <div
                  key={day}
                  className={`h-20 p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'border-sky-400 bg-sky-50/70 font-bold'
                      : hasEvents
                      ? 'border-sky-200 bg-white'
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isToday ? 'text-sky-700 font-extrabold' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] bg-sky-200 text-sky-800 px-1 rounded font-bold">
                        Today
                      </span>
                    )}
                  </div>

                  {hasEvents && (
                    <div className="text-[9px] bg-sky-100 text-sky-900 rounded p-1 font-semibold truncate">
                      Event Due
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
