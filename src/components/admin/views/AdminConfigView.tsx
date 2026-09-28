import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  BellRing,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
} from 'lucide-react';

export const AdminConfigView: React.FC = () => {
  const [defaultModel, setDefaultModel] = useState('gemini-3.8-flash');
  const [fallbackModel, setFallbackModel] = useState('gemini-3.1-flash-lite');
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(25);
  const [recycleRetentionDays, setRecycleRetentionDays] = useState(30);
  const [mfaAdminRequired, setMfaAdminRequired] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>System Configuration & Policy Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global operational parameters governing AI models, retention limits, and security policies.
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>System configuration successfully updated and synced across application clusters.</span>
        </div>
      )}

      {/* Security Architecture Notice in White & Blue */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 shadow-xs flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block font-semibold mb-0.5">
            Zero-Trust Configuration & Secrets Management:
          </strong>
          API keys, webhook credentials, and encryption master seeds are strictly managed server-side and never exposed in the client UI.
        </div>
      </div>

      {/* Configuration Sections in White & Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Model Configuration */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-50">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">AI Engine & Extraction Rules</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Primary Ingestion Model
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-fast)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Spike Fallback Model
            </label>
            <select
              value={fallbackModel}
              onChange={(e) => setFallbackModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Confidence Threshold</label>
              <span className="font-mono text-xs font-bold text-blue-700">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Storage & Retention */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-50">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Storage & Quotas</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Max Upload Size per Document (MB)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={maxFileSizeMb}
              onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Recycle Bin Retention Window (Days)
            </label>
            <input
              type="number"
              min="7"
              max="90"
              value={recycleRetentionDays}
              onChange={(e) => setRecycleRetentionDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={mfaAdminRequired}
                onChange={(e) => setMfaAdminRequired(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600"
              />
              <span className="text-xs text-slate-700 font-medium">
                Mandate Multi-Factor Authentication (MFA) for Administrative Roles
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
