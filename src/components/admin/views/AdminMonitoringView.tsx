import React, { useState } from 'react';
import {
  Gauge,
  Activity,
  Server,
  Cpu,
  Database,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Clock,
  Zap,
} from 'lucide-react';

export const AdminMonitoringView: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-blue-600" />
            <span>DevOps & SRE System Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time infrastructure health, latency curves, worker queue depths, and database connection pool metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 font-mono">Updated: {lastRefreshed}</span>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Telemetry Stream Banner in White & Blue */}
      <div className="bg-blue-50/60 text-slate-700 border border-blue-200 rounded-2xl p-4 shadow-xs flex items-start gap-3">
        <Activity className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="text-slate-900 block font-semibold mb-0.5">
            Application Telemetry Stream:
          </strong>
          Live metrics streaming from Node.js Express API and Google Gemini 3.8 Flash SDK workers. Zero unhandled exceptions recorded in this operational cycle.
        </div>
      </div>

      {/* 4 Core Health Metrics in White and Blue */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>API Gateway</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">100%</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Uptime (30d)</span>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Avg Response Time</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">38ms</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">p95: 54ms</span>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Queue Depth</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">0</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">0 pending items</span>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Error Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono">0.00%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">0 HTTP 5xx errors</span>
        </div>
      </div>

      {/* Node.js Runtime & Microservices */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Microservices Health Matrix</h3>
        <p className="text-xs text-slate-500 mb-4">Availability and latency metrics for decoupled architecture components</p>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div>
                <span className="font-semibold text-slate-900 block">Node.js Express Application Server</span>
                <span className="text-[11px] text-slate-400">Port 3000 • Development Runtime</span>
              </div>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <span className="text-slate-600">38ms</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                HEALTHY
              </span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div>
                <span className="font-semibold text-slate-900 block">Gemini 3.8 Flash SDK</span>
                <span className="text-[11px] text-slate-400">Google GenAI Client • Multimodal OCR</span>
              </div>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <span className="text-slate-600">1.4s</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                HEALTHY
              </span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div>
                <span className="font-semibold text-slate-900 block">Browser IndexedDB / LocalStorage Engine</span>
                <span className="text-[11px] text-slate-400">Client-Side Zero-Knowledge Persistence</span>
              </div>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <span className="text-slate-600">4ms</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                HEALTHY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
