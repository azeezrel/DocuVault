import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  Share2,
  Clock,
  Eye,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  UserCheck,
  Building,
  Briefcase,
  Stethoscope
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const SecurityView: React.FC = () => {
  const { documents, setDocToShare, setIsShareModalOpen } = useVault();
  const [activeShares, setActiveShares] = useState([
    {
      id: 'sh-1',
      documentTitle: 'Federal Republic of Nigeria Passport',
      recipient: 'Visa Application Center',
      expiresIn: '48 hours',
      views: 2,
      permission: 'View only (Watermarked)',
      status: 'Active',
    },
    {
      id: 'sh-2',
      documentTitle: 'B.Sc Computer Science Degree Certificate',
      recipient: 'Prospective Employer (HR)',
      expiresIn: '5 days',
      views: 1,
      permission: 'View & Verify',
      status: 'Active',
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeShare = (id: string) => {
    setActiveShares((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Vault Security & Temporary Sharing</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                AES-256
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Zero-knowledge vault encryption with time-limited, revocable links for third parties
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (documents.length > 0) {
              setDocToShare(documents[0]);
              setIsShareModalOpen(true);
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Create New Share Link</span>
        </button>
      </div>

      {/* Security Architecture Cards (Concept #14) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Encrypted Document Storage</h4>
          <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
            Every file is encrypted at rest using military-grade AES-256 standards with sandboxed browser keys.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-sky-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vault Status: Protected</span>
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Key className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Zero Third-Party Training</h4>
          <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
            Document queries processed by the AI engine are never stored or used to train public foundation models.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-sky-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Privacy Standard: Sovereign</span>
          </div>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900">Time-Limited Access Links</h4>
          <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
            Temporary secure links expire automatically or can be manually revoked instantly at any time.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-sky-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-Revoke: Enforced</span>
          </div>
        </div>
      </div>

      {/* Concept #15 Personal Sharing Center */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-900 tracking-wider">
              ACTIVE THIRD-PARTY SHARING AUDIT
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Documents currently shared with your doctor, accountant, employer, or landlord
            </p>
          </div>
          <span className="text-xs text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
            {activeShares.length} Active Link{activeShares.length === 1 ? '' : 's'}
          </span>
        </div>

        {activeShares.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active shared links. Your documents remain strictly private.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeShares.map((share) => (
              <div
                key={share.id}
                className="p-4 hover:bg-sky-50/40 transition-colors flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{share.documentTitle}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-sky-100 text-sky-800">
                      {share.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Shared with: <strong className="text-slate-700">{share.recipient}</strong> •{' '}
                    {share.permission} • Expires in {share.expiresIn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(share.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copiedId === share.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-sky-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => revokeShare(share.id)}
                    className="p-1.5 text-slate-300 hover:text-sky-800 rounded-md transition-colors"
                    title="Revoke access immediately"
                  >
                    <Trash2 className="w-4 h-4" />
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
