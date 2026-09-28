import React, { useState } from 'react';
import {
  X,
  Share2,
  Lock,
  Clock,
  Copy,
  Check,
  Shield,
  Eye,
  Download,
  Building,
  UserCheck
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { DocumentItem } from '../types';

interface ShareModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ document: doc, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [recipient, setRecipient] = useState('Employer (HR)');
  const [expiry, setExpiry] = useState('7 days');
  const [allowDownload, setAllowDownload] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !doc) return null;

  const handleGenerate = () => {
    const randomHash = Math.random().toString(36).substring(2, 10);
    const link = `https://lifevault.ai/secure-share/${randomHash}?doc=${encodeURIComponent(
      doc.id
    )}&exp=${encodeURIComponent(expiry)}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Create Secure Share Link</h3>
              <p className="text-[11px] text-slate-500">Time-limited access with revocation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
            <span className="text-[10px] font-bold text-sky-800 uppercase block">Selected File</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">{doc.title}</p>
            <p className="text-[11px] text-slate-500">{doc.category} • {doc.documentType}</p>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Share With</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 text-xs text-slate-800"
            >
              <option value="Employer (HR)">Employer / HR</option>
              <option value="Landlord / Property Manager">Landlord / Property Manager</option>
              <option value="Medical Doctor / Clinic">Medical Doctor / Clinic</option>
              <option value="Accountant / Tax Advisor">Accountant / Tax Advisor</option>
              <option value="Embassy / Visa Center">Embassy / Visa Application</option>
              <option value="Family Member">Family Member</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Access Expiration</label>
            <div className="grid grid-cols-3 gap-2">
              {['24 hours', '7 days', '30 days'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setExpiry(time)}
                  className={`py-2 px-2 rounded-lg font-semibold border transition-all text-center ${
                    expiry === time
                      ? 'bg-sky-50 text-sky-800 border-sky-400 shadow-2xs font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="font-semibold text-slate-800 block">Apply Security Watermark</span>
                <span className="text-[11px] text-slate-400">Embeds "Confidential - {currentUser?.name || 'Vault Owner'}"</span>
              </div>
              <input
                type="checkbox"
                checked={watermark}
                onChange={(e) => setWatermark(e.target.checked)}
                className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-400"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="font-semibold text-slate-800 block">Allow File Download</span>
                <span className="text-[11px] text-slate-400">If unchecked, recipient can only view</span>
              </div>
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-400"
              />
            </label>
          </div>

          {!generatedLink ? (
            <button
              onClick={handleGenerate}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-xs shadow-sm shadow-sky-200 transition-colors mt-2"
            >
              Generate Encrypted Link
            </button>
          ) : (
            <div className="space-y-2 pt-2 animate-in fade-in duration-150">
              <span className="text-[11px] font-bold text-sky-800 block">Encrypted Sharing Link Ready:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-sky-300 rounded-lg text-[11px] font-mono text-slate-700 select-all outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sky-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
