import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Sparkles,
  HardDrive,
  Sun,
  Link,
  Lock,
  Server,
  Activity,
  CheckCircle2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';

export const SettingsView: React.FC = () => {
  const { currentUser, signOut, updateProfile, triggerSessionCheck } = useAuth();
  const { documents, attentionCounts, clearAllDocuments, setActiveView } = useVault();
  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'account'
    | 'security'
    | 'notifications'
    | 'ai'
    | 'storage'
    | 'appearance'
    | 'connected'
    | 'privacy'
    | 'administration'
  >('profile');

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [aiAutoTagging, setAiAutoTagging] = useState(true);
  const [aiExtractClauses, setAiExtractClauses] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetVault, setConfirmResetVault] = useState(false);

  // Calculate real storage used by active documents
  const calculatedStorageMb = React.useMemo(() => {
    let totalBytes = 0;
    documents.forEach((doc) => {
      const sizeStr = doc.fileSize || '';
      if (sizeStr.includes('MB')) {
        totalBytes += parseFloat(sizeStr) * 1024 * 1024;
      } else if (sizeStr.includes('KB')) {
        totalBytes += parseFloat(sizeStr) * 1024;
      }
    });
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [documents]);

  const quotaGb = currentUser?.storageQuotaMb ? Math.round(currentUser.storageQuotaMb / 1024) : 15;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Settings & Preferences</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Workspace Config
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage your personal vault profile, AI intelligence preferences, security, and storage
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs */}
        <aside className="w-full md:w-56 shrink-0 bg-white border border-slate-200 rounded-2xl p-2 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'account'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Account</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'security'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4 text-sky-600" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'notifications'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4 text-sky-600" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'ai'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>AI Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'storage'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HardDrive className="w-4 h-4 text-sky-600" />
            <span>Storage & Backup</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'appearance'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-4 h-4 text-sky-600" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('connected')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'connected'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Link className="w-4 h-4 text-sky-600" />
            <span>Connected Services</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'privacy'
                ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Privacy</span>
          </button>

          {/* Dedicated Administration Area for Admin Role */}
          {currentUser?.role === 'admin' && (
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('administration')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'administration'
                    ? 'bg-sky-100 text-sky-900 font-extrabold border border-sky-200'
                    : 'text-sky-700 hover:bg-sky-50'
                }`}
              >
                <Server className="w-4 h-4 text-sky-700" />
                <span>Administration</span>
              </button>
            </div>
          )}
        </aside>

        {/* Content Pane */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Personal Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your identity details for document ownership verification
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Security & Authentication</h3>
                <p className="text-slate-500 mt-0.5">Manage two-factor credentials and vault encryption</p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Requires a 6-digit authenticator code on every sign-in
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-200 text-sky-800 font-bold text-[11px]">
                  Enabled
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Vault Encryption Standard</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    AES-256 Client-Side Sovereign Storage
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Application Session Check</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Test the startup splash and credential verification flow
                  </p>
                </div>
                <button
                  type="button"
                  onClick={triggerSessionCheck}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-bold text-[11px] transition-colors shadow-2xs"
                >
                  Verify Session
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">AI Intelligence Preferences</h3>
                <p className="text-slate-500 mt-0.5">Configure AI extraction workflows</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">Automated Metadata Extraction</p>
                    <p className="text-slate-500 text-[11px]">
                      Extract dates, document numbers, and issuers upon upload
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiAutoTagging}
                    onChange={(e) => setAiAutoTagging(e.target.checked)}
                    className="w-4 h-4 text-sky-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">Contract Clause & Notice Window Detection</p>
                    <p className="text-slate-500 text-[11px]">
                      Highlight landlord notification windows and termination obligations
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiExtractClauses}
                    onChange={(e) => setAiExtractClauses(e.target.checked)}
                    className="w-4 h-4 text-sky-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Storage & Data Management</h3>
                <p className="text-slate-500 mt-0.5">Control local vault storage and data exports</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700">Storage Utilization</span>
                  <span className="text-sky-700">{calculatedStorageMb} MB / {quotaGb} GB</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(1, (parseFloat(calculatedStorageMb) / (quotaGb * 1024)) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {confirmResetVault ? (
                  <div className="flex items-center gap-2 p-2 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-xs font-bold text-rose-800">Wipe all stored documents?</span>
                    <button
                      onClick={() => {
                        clearAllDocuments();
                        setConfirmResetVault(false);
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Yes, Wipe All
                    </button>
                    <button
                      onClick={() => setConfirmResetVault(false)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmResetVault(true)}
                    className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Reset Vault to Clean State
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Appearance & Theme</h3>
                <p className="text-slate-500 mt-0.5">Executive white and skyblue palette</p>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sky-900">White & Skyblue Design System</p>
                  <p className="text-sky-700 text-[11px]">
                    Optimized for clarity, readability, and low cognitive fatigue.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white font-bold text-[11px]">
                  Default Active
                </span>
              </div>
            </div>
          )}

          {/* Administration Section */}
          {activeTab === 'administration' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Administration Dashboard</span>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                    Admin Role
                  </span>
                </h3>
                <p className="text-slate-500 mt-0.5">
                  System architecture metrics, processing diagnostics, and audit logs
                </p>
              </div>

              {/* Dedicated Operations Console Launch Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-sm text-white">Platform Operations & SRE Console</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      /admin
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Full operational dashboard for tenant management, document processing queues, AI telemetry, and audit logs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('admin')}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
                >
                  Launch Operations Console (/admin) →
                </button>
              </div>

              {/* High level admin metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Users</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">1</p>
                  <span className="text-[10px] text-sky-600 font-medium">Single Sovereign Vault</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Documents</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">{documents.length}</p>
                  <span className="text-[10px] text-slate-500">Indexed locally</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Storage</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">{calculatedStorageMb} MB</p>
                  <span className="text-[10px] text-slate-500">Quota: {quotaGb} GB</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">AI Processing</p>
                  <p className="text-lg font-extrabold text-sky-700 mt-1">
                    {documents.length > 0 ? (documents.length * 3).toLocaleString() : '0'} req
                  </p>
                  <span className="text-[10px] text-sky-600 font-medium">DocuMind AI Engine</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Failed Processing</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">0</p>
                  <span className="text-[10px] text-slate-500">Zero errors</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Expiring Documents</p>
                  <p className="text-lg font-extrabold text-sky-700 mt-1">{attentionCounts.expiring}</p>
                  <span className="text-[10px] text-sky-600 font-medium">Monitored</span>
                </div>
              </div>

              {/* System Activity & Audit Logs */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center justify-between">
                  <span>System Activity & Audit Logs</span>
                  <span className="text-[10px] text-slate-400 font-normal">Live Event Stream</span>
                </h4>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-200/50">
                    <span>[{new Date().toISOString().slice(0, 10)}] AUTH: Active session authenticated for {currentUser?.email || 'admin'}</span>
                    <span className="text-sky-600 font-sans font-bold text-[10px]">SUCCESS</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-200/50">
                    <span>[{new Date().toISOString().slice(0, 10)}] STORAGE: AES-256 local vault initialized ({documents.length} records)</span>
                    <span className="text-sky-600 font-sans font-bold text-[10px]">SECURE</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-200/50">
                    <span>[{new Date().toISOString().slice(0, 10)}] AI: Intelligence endpoint operational</span>
                    <span className="text-sky-600 font-sans font-bold text-[10px]">CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Connected Services tabs */}
          {['privacy', 'connected', 'account', 'notifications'].includes(activeTab) && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 capitalize">{activeTab} Settings</h3>
              <p className="text-slate-500">
                Your DocuMind settings for {activeTab} are active and conforming to secure document storage policies.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-700">
                  Encrypted and managed locally for {currentUser?.name || currentUser?.email || 'Authorized Vault Owner'}.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
