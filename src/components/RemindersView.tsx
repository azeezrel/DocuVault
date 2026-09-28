import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { LifeDeadline } from '../types';

export const RemindersView: React.FC = () => {
  const { deadlines, addDeadline, removeDeadline, documents, setSelectedDocForView } = useVault();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<'renewal' | 'expiration' | 'notice_deadline' | 'payment_due' | 'filing_deadline' | 'review_date'>('expiration');
  const [newDocId, setNewDocId] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const targetDate = new Date(newDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const selectedDoc = documents.find((d) => d.id === newDocId);

    const deadline: LifeDeadline = {
      id: 'dl-' + Date.now(),
      title: newTitle,
      date: newDate,
      daysRemaining: diffDays,
      urgency: diffDays <= 7 ? 'high' : diffDays <= 30 ? 'medium' : 'low',
      category: newCategory,
      eventType: newCategory as any,
      documentId: newDocId || undefined,
      documentTitle: selectedDoc?.title || 'Personal Record',
      reminderScheduleDays: [90, 30, 7, 1],
    };

    addDeadline(deadline);
    setNewTitle('');
    setNewDate('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Reminders & Life Deadlines</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Automated Monitor
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Proactive tracking of passport expirations, rent renewals, insurance policies, and certifications
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-sky-200 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="font-bold text-sm text-slate-900">Add New Life Deadline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Title / Reminder</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Vehicle Insurance Renewal"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Event Type</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400"
              >
                <option value="expiration">Expiration Date</option>
                <option value="renewal">Renewal Date</option>
                <option value="notice_deadline">Notice Deadline</option>
                <option value="payment_due">Payment Due Date</option>
                <option value="filing_deadline">Filing Deadline</option>
                <option value="review_date">Review Date</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Target Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Link to Document</label>
              <select
                value={newDocId}
                onChange={(e) => setNewDocId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400"
              >
                <option value="">None (Personal event)</option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-2xs"
            >
              Save Deadline
            </button>
          </div>
        </form>
      )}

      {/* Deadlines Timeline (Concept #5 & #6) */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 tracking-wider">
            CHRONOLOGICAL LIFE TIMELINE
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {deadlines.length} Active Deadlines
          </span>
        </div>

        {deadlines.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-slate-800">No active deadlines recorded</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When documents are uploaded with expiration dates, DocuMind AI automatically registers them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {deadlines.map((dl) => (
              <div
                key={dl.id}
                className="p-4 hover:bg-sky-50/50 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 text-center py-1 px-1.5 rounded-lg border ${
                      dl.urgency === 'high'
                        ? 'bg-sky-100 text-sky-900 border-sky-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="block text-[10px] font-bold uppercase leading-tight">
                      {dl.date.split(' ')[1] || 'DATE'}
                    </span>
                    <span className="block text-sm font-extrabold leading-tight">
                      {dl.date.split(' ')[0] || ''}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{dl.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {dl.documentTitle ? `Linked to: ${dl.documentTitle}` : 'Personal task'} • Due {dl.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      dl.daysRemaining < 0
                        ? 'bg-sky-200 text-sky-900 font-extrabold'
                        : dl.daysRemaining <= 14
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {dl.daysRemaining < 0
                      ? 'EXPIRED'
                      : dl.daysRemaining === 0
                      ? 'DUE TODAY'
                      : `${dl.daysRemaining} days left`}
                  </span>

                  {dl.documentId && (
                    <button
                      onClick={() => {
                        const found = documents.find((d) => d.id === dl.documentId);
                        if (found) setSelectedDocForView(found);
                      }}
                      className="p-1.5 text-slate-400 hover:text-sky-600 rounded-md"
                      title="View Document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => removeDeadline(dl.id)}
                    className="p-1.5 text-slate-300 hover:text-sky-800 rounded-md"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
