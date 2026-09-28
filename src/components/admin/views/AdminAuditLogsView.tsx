import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Activity,
  FileText,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AuditLogEntry, AuditActionType } from '../../../types';

interface AdminAuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | AuditActionType>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.ipAddress.includes(searchTerm);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,User,Email,Action,Resource,IP_Address,Severity,Details\n' +
      filteredLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.user}","${l.userEmail}","${l.action}","${l.resource.replace(
              /"/g,
              '""'
            )}","${l.ipAddress}","${l.severity}","${(l.details || '').replace(/"/g, '""')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lifevault-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <span>Platform Audit Logs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological audit trail recording document uploads, deletions, metadata modifications, role adjustments, and AI jobs.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, user, or resource..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="Login">Login</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Deleted">Deleted</option>
            <option value="Updated Metadata">Updated Metadata</option>
            <option value="Retried Job">Retried Job</option>
            <option value="Changed Role">Changed Role</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No audit logs matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-blue-50/50 text-slate-600 font-semibold border-b border-blue-100">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{log.user}</span>
                        <span className="text-[10px] text-slate-400">{log.userEmail}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {log.resource}
                    </td>

                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {log.details || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
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
