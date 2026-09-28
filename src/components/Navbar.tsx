import React, { useState } from 'react';
import {
  Upload,
  Bell,
  Shield,
  ShieldCheck,
  FileText,
  ChevronDown,
  AlertTriangle,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const {
    setIsUploadModalOpen,
    setActiveView,
    attentionCounts,
    deadlines,
    setSelectedDocForView,
    documents,
  } = useVault();

  const { currentUser, signOut } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalAttention =
    attentionCounts.expired + attentionCounts.expiring + attentionCounts.review;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-sky-100 shadow-[0_1px_3px_rgba(2,132,199,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 min-w-max">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-200">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">DocuMind</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Personal Document Command Center</p>
            </div>
          </button>
        </div>

        {/* Center: Clean Spacer */}
        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-sky-200 transition-colors whitespace-nowrap"
            id="nav-upload-btn"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Document</span>
          </button>

          {/* Attention / Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 transition-colors"
              aria-label="Notifications"
              id="notifications-bell-btn"
            >
              <Bell className="w-5 h-5" />
              {totalAttention > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalAttention}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-sky-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Action Items & Deadlines</span>
                    <span className="px-1.5 py-0.5 rounded text-xs bg-sky-100 text-sky-800 font-bold">
                      {totalAttention}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-sm">
                  {deadlines.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <p className="text-xs">All documents are up-to-date.</p>
                      <p className="text-[11px] text-slate-400 mt-1">No pending renewals or urgent notices.</p>
                    </div>
                  ) : (
                    deadlines.slice(0, 6).map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => {
                          if (dl.documentId) {
                            const found = documents.find((d) => d.id === dl.documentId);
                            if (found) setSelectedDocForView(found);
                          }
                          setIsNotificationsOpen(false);
                        }}
                        className="p-3 hover:bg-sky-50/60 cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg ${
                            dl.urgency === 'high'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {dl.daysRemaining <= 0 ? (
                            <AlertTriangle className="w-4 h-4 text-sky-800" />
                          ) : (
                            <Clock className="w-4 h-4 text-sky-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-xs truncate">{dl.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {dl.daysRemaining < 0
                              ? `Expired ${Math.abs(dl.daysRemaining)} days ago`
                              : dl.daysRemaining === 0
                              ? 'Expires today'
                              : `Due in ${dl.daysRemaining} days (${dl.date})`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveView('reminders');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                  >
                    View All Life Deadlines & Reminders →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Operations Quick Switch Button if Admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Switch to Admin Operations Console"
              id="navbar-admin-quick-switch-btn"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-colors"
              id="user-profile-menu-btn"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser?.avatarInitials || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'VO')}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Vault Owner'}
                </p>
                {currentUser?.role === 'admin' ? (
                  <p className="text-[10px] text-indigo-600 font-bold leading-tight flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>Admin User</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-sky-600 font-medium leading-tight">Personal Vault</p>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveView('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & Preferences</span>
                </button>

                {/* Role-Protected Admin Entry: Only visible if admin or for testing /admin */}
                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left font-bold text-sky-700 bg-sky-50/70 hover:bg-sky-100/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-600" />
                      <span>Admin Operations (/admin)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-200 text-sky-900">
                      ADMIN
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>Admin Area (/admin)</span>
                    </div>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                      RESTRICTED
                    </span>
                  </button>
                )}

                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full px-3 py-2 text-left font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
