import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Eye,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  Files,
} from 'lucide-react';
import { ProcessingJob, ProcessingStage, ProcessingStatus } from '../../../types';

interface AdminProcessingViewProps {
  jobs: ProcessingJob[];
  onRetryJob: (jobId: string) => void;
  onRetryAllFailed: () => void;
}

export const AdminProcessingView: React.FC<AdminProcessingViewProps> = ({
  jobs,
  onRetryJob,
  onRetryAllFailed,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | ProcessingStage>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProcessingStatus>('all');
  const [selectedJobForModal, setSelectedJobForModal] = useState<ProcessingJob | null>(null);
  const [retryingJobIds, setRetryingJobIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real job counts without artificial offsets
  const processingCount = jobs.filter((j) => j.status === 'processing').length;
  const completedCount = jobs.filter((j) => j.status === 'complete').length;
  const failedCount = jobs.filter((j) => j.status === 'failed').length;
  const reviewCount = jobs.filter((j) => j.status === 'review_required').length;

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || job.stage === stageFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  const handleRetrySingle = (job: ProcessingJob) => {
    setRetryingJobIds((prev) => new Set(prev).add(job.id));
    setToastMessage(`Re-dispatching "${job.documentName}" to ingestion worker...`);

    setTimeout(() => {
      onRetryJob(job.id);
      setRetryingJobIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
      setToastMessage(`✓ Pipeline re-analysis completed for "${job.documentName}"`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            <span>Document Processing Queue & Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tracking of OCR extraction, Gemini semantic entity classification, vector embedding, and recovery retry jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRetryAllFailed}
            disabled={failedCount === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              failedCount > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Failed Jobs ({failedCount})</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 Real Processing Queue Metric Cards in White and Blue */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Processing</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{processingCount}</div>
          <p className="text-[11px] text-blue-600 mt-1">Active worker jobs</p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{completedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Successfully parsed</p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Failed</span>
            <AlertTriangle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{failedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Errors requiring retry</p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Review Required</span>
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{reviewCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Confidence &lt; 70%</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document name or user..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="OCR">OCR Extraction</option>
            <option value="AI Extraction">AI Extraction</option>
            <option value="Classification">Classification</option>
            <option value="Embedding">Vector Embedding</option>
            <option value="Complete">Complete</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="processing">Processing</option>
            <option value="review_required">Review Required</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xs overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-3">
              <Files className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-sm font-bold text-slate-800">No documents in processing queue</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Documents added to your Personal Vault are automatically analyzed with OCR, Gemini semantic entity classification, and vector indexing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-blue-50/50 text-slate-600 font-semibold border-b border-blue-100">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => {
                  const isRetrying = retryingJobIds.has(job.id);

                  return (
                    <tr key={job.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-900 truncate max-w-xs block">
                            {job.documentName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{job.userName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700">
                          {job.stage}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {job.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {job.aiConfidence}%
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        {job.latencySeconds}s
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedJobForModal(job)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Inspect extraction payload"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleRetrySingle(job)}
                            disabled={isRetrying}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Retry ingestion pipeline"
                          >
                            <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payload Modal in White & Blue */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-blue-100 rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-blue-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedJobForModal.documentName}</h3>
                <p className="text-xs text-slate-500">Job ID: {selectedJobForModal.id}</p>
              </div>
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Stage</span>
                  <span className="font-bold text-slate-900">{selectedJobForModal.stage}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">AI Confidence</span>
                  <span className="font-mono font-bold text-blue-700">{selectedJobForModal.aiConfidence}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Processing Latency</span>
                  <span className="font-mono font-bold text-slate-900">{selectedJobForModal.latencySeconds}s</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Retries</span>
                  <span className="font-mono font-bold text-slate-900">{selectedJobForModal.retryCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-50 flex justify-end">
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
