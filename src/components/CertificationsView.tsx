import React from 'react';
import {
  Award,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const CertificationsView: React.FC = () => {
  const { documents, setSelectedDocForView, setIsUploadModalOpen } = useVault();

  const certs = documents.filter(
    (d) =>
      !d.isDeleted &&
      (d.category === 'Education' ||
        d.category === 'Career' ||
        d.folder?.includes('Certifications') ||
        d.documentType.toLowerCase().includes('certificate') ||
        d.documentType.toLowerCase().includes('degree'))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Certifications & Qualifications</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Education & Career
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Verified credentials, university degrees, professional exams, and renewal cycles
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.length === 0 ? (
          <div className="col-span-full bg-white border border-sky-100 rounded-2xl p-12 text-center">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-800">No certifications loaded</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Upload university diplomas, NYSC certificates, AWS/Azure/GCP credentials, or training badges.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition-colors"
            >
              Upload Certificate
            </button>
          </div>
        ) : (
          certs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForView(doc)}
              className="bg-white border border-sky-100 rounded-xl p-4 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'VALID'
                        ? 'bg-sky-100 text-sky-800'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-100 text-amber-900'
                        : doc.status === 'EXPIRED'
                        ? 'bg-rose-100 text-rose-800'
                        : doc.status === 'NO_EXPIRATION'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {doc.status === 'VALID'
                      ? 'Valid'
                      : doc.status === 'EXPIRING_SOON'
                      ? 'Expiring Soon'
                      : doc.status === 'EXPIRED'
                      ? 'Expired'
                      : doc.status === 'NO_EXPIRATION'
                      ? 'No Expiration'
                      : 'Needs Review'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 mt-3 group-hover:text-sky-700 transition-colors line-clamp-2">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{doc.name}</p>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[11px]">Credential ID:</span>
                    <span className="font-mono font-medium text-slate-700 text-[11px]">
                      {doc.documentNumber || 'VERIFIED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[11px]">Issued:</span>
                    <span className="font-medium text-slate-700 text-[11px]">{doc.issueDate || 'Verified'}</span>
                  </div>
                  {doc.expiryDate && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-[11px]">Valid Until:</span>
                      <span className="font-bold text-sky-700 text-[11px]">{doc.expiryDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-semibold">
                <span>View Full Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
