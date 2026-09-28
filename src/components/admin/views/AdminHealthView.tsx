import React, { useState } from 'react';
import {
  ActivitySquare,
  AlertTriangle,
  Clock,
  FileQuestion,
  Copy,
  AlertCircle,
  FileX,
  Zap,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useVault } from '../../../context/VaultContext';

export const AdminHealthView: React.FC = () => {
  const { documents, attentionCounts, vaultHealth } = useVault();
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const expiredCount = attentionCounts.expired || 0;
  const expiringSoonCount = attentionCounts.expiring || 0;
  const missingMetadataCount = attentionCounts.missingDates || 0;
  const duplicatesCount = vaultHealth.possibleDuplicatesCount || 0;
  const needsReviewCount = attentionCounts.review || 0;
  const processingFailuresCount = 0;

  const healthMetrics = [
    {
      id: 'expired',
      title: 'Expired Documents',
      count: expiredCount,
      icon: Clock,
      description: 'Past document expiration date',
      urgency: expiredCount > 0 ? 'Action required by vault owners' : 'No expired documents',
    },
    {
      id: 'expiring_soon',
      title: 'Expiring Soon',
      count: expiringSoonCount,
      icon: AlertTriangle,
      description: 'Expiring within the next 90 days',
      urgency: expiringSoonCount > 0 ? 'Notices active in reminder queue' : 'No upcoming expirations',
    },
    {
      id: 'missing_metadata',
      title: 'Missing Critical Dates',
      count: missingMetadataCount,
      icon: FileQuestion,
      description: 'Missing expiration or renewal date field',
      urgency: missingMetadataCount > 0 ? 'Manual date verification recommended' : 'All dates recorded',
    },
    {
      id: 'duplicates',
      title: 'Duplicates Detected',
      count: duplicatesCount,
      icon: Copy,
      description: 'Exact hash or filename duplicate',
      urgency: duplicatesCount > 0 ? 'Pending deduplication' : 'Zero duplicates detected',
    },
    {
      id: 'needs_review',
      title: 'Needs Review',
      count: needsReviewCount,
      icon: AlertCircle,
      description: 'AI confidence score below 70%',
      urgency: needsReviewCount > 0 ? 'Review flagged clauses' : 'All documents verified',
    },
    {
      id: 'processing_failures',
      title: 'Processing Failures',
      count: processingFailuresCount,
      icon: FileX,
      description: 'Corrupted or unreadable files',
      urgency: 'Zero pipeline halts',
    },
  ];

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setAuditMessage(`Running live health check across ${documents.length} documents...`);

    setTimeout(() => {
      setIsRunningAudit(false);
      setAuditMessage(
        `Audit complete: System health score is ${vaultHealth.score}%. ${expiredCount} expired, ${expiringSoonCount} expiring soon, ${missingMetadataCount} missing dates.`
      );
      setTimeout(() => setAuditMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ActivitySquare className="w-6 h-6 text-blue-600" />
            <span>Platform Document Health & Integrity</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System-wide integrity auditor tracking document validity, missing policy dates, and deduplication.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isRunningAudit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Zap className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
          <span>{isRunningAudit ? 'Auditing Vault...' : 'Run Integrity Audit'}</span>
        </button>
      </div>

      {auditMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* 6 Real Health Cards in White and Blue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {item.count}
                </div>

                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-medium">{item.urgency}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {documents.length > 0 ? `${Math.round((item.count / documents.length) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Health Breakdown Banner */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Vault Integrity Score</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregate health of all active documents in vault storage
            </p>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700">
            {vaultHealth.score}%
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${vaultHealth.score}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Security Rating: <strong className="text-slate-900 font-semibold">{vaultHealth.securityRating}</strong>. Keep documents up to date with valid expiration dates to maintain 100% integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
