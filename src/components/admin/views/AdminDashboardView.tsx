import React from 'react';
import {
  Files,
  Cpu,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { AdminTab, ProcessingJob } from '../../../types';
import { useVault } from '../../../context/VaultContext';

interface AdminDashboardViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  processingJobs: ProcessingJob[];
  onRetryAllFailed?: () => void;
  usersCount?: number;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateTab,
  processingJobs,
}) => {
  const { attentionCounts, vaultHealth } = useVault();

  return (
    <div className="space-y-6">
      {/* Live Document Health Overview */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-blue-50">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Vault Health Score</span>
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {vaultHealth.score}% Clean
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Expired Documents</span>
              <span className="font-bold text-slate-900 font-mono">
                {attentionCounts.expired || 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Expiring in 90 Days</span>
              <span className="font-bold text-slate-900 font-mono">
                {attentionCounts.expiring || 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Missing Critical Dates</span>
              <span className="font-bold text-slate-900 font-mono">
                {attentionCounts.missingDates || 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Review Required</span>
              <span className="font-bold text-slate-900 font-mono">
                {attentionCounts.review || 0}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('health')}
          className="w-full mt-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Full Document Health Audit</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Processing Pipeline Preview */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-blue-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Real-Time Ingestion Queue</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live document intake, optical character recognition, and entity extraction pipeline
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('processing')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({processingJobs.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {processingJobs.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-3">
              <Files className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-sm font-bold text-slate-800">No documents in processing queue</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Documents uploaded through your Personal Vault are processed here in real time with OCR, categorization, and Gemini entity extraction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-blue-50 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Document</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processingJobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{job.documentName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{job.stage}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {job.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{job.aiConfidence}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{job.latencySeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
