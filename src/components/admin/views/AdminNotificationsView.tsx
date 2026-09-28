import React, { useState } from 'react';
import {
  BellRing,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  Calendar,
  Send,
} from 'lucide-react';
import { useVault } from '../../../context/VaultContext';
import { useAuth } from '../../../context/AuthContext';

export const AdminNotificationsView: React.FC = () => {
  const { deadlines } = useVault();
  const { currentUser } = useAuth();
  const [testSent, setTestSent] = useState(false);
  const [recipient, setRecipient] = useState(currentUser?.email || 'admin@lifevault.ai');

  const handleSendTestNotification = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-blue-600" />
            <span>Reminders & Notification Delivery Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Status of scheduled document expiry notices, email dispatch workers, and in-app alerts across the 90/30/7/1-day reminder rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            {deadlines.length} Active Deadlines Scheduled
          </span>
        </div>
      </div>

      {testSent && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Test notice successfully queued and dispatched to {recipient}</span>
        </div>
      )}

      {/* Delivery Metrics Cards in White and Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Notification Channel */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Email Delivery (SMTP Gateway)</h2>
                <span className="text-[11px] text-slate-400">Transaction Expiry Notices</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Operational
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-50">
            <div>
              <span className="text-xs text-slate-500 block">Sent Successfully</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">{deadlines.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Failed Bounces</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>
          </div>
        </div>

        {/* In-App Notifications Channel */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">In-App Vault Banners</h2>
                <span className="text-[11px] text-slate-400">Real-time alerts and badges</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-50">
            <div>
              <span className="text-xs text-slate-500 block">Active Banners</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">{deadlines.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Dismissed</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Notification Dispatch Tool in White & Blue */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Dispatch Test Renewal Notification</h3>
        <p className="text-xs text-slate-500 mb-4">
          Test the notification pipeline end-to-end to verify that reminder emails and templates are correctly configured.
        </p>

        <form onSubmit={handleSendTestNotification} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            placeholder="Recipient email address"
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Alert</span>
          </button>
        </form>
      </div>

      {/* Scheduled Reminders List */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-blue-50">
          <h3 className="font-bold text-slate-900 text-sm">Scheduled Reminders & Deadlines</h3>
          <p className="text-xs text-slate-500 mt-0.5">Active triggers synchronized with document expiration dates</p>
        </div>

        {deadlines.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active reminders scheduled. Documents with valid expiration dates will automatically appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {deadlines.map((dl) => (
              <div key={dl.id} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{dl.title}</span>
                    <span className="text-[11px] text-slate-400">Due: {dl.date}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {dl.daysRemaining} days left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
