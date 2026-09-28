import React, { useState } from 'react';
import {
  HardDrive,
  Trash2,
  FileText,
  TrendingUp,
  Sparkles,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { useVault } from '../../../context/VaultContext';

export const AdminStorageView: React.FC = () => {
  const { documents, recycleBinDocuments, emptyRecycleBin } = useVault();
  const [cleanedRecycleBin, setCleanedRecycleBin] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Real storage calculation
  const totalDocMb = documents.reduce((sum: number, d) => {
    const size = parseFloat(d.fileSize || '1.0');
    return sum + (isNaN(size) ? 1.0 : size);
  }, 0);

  const recycleBinMb = recycleBinDocuments.reduce((sum: number, d) => {
    const size = parseFloat(d.fileSize || '1.0');
    return sum + (isNaN(size) ? 1.0 : size);
  }, 0);

  const totalUsedMb = totalDocMb + (cleanedRecycleBin ? 0 : recycleBinMb);
  const totalQuotaMb = 51200; // 50 GB standard allocation

  const formatSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const handlePurgeRecycleBin = () => {
    emptyRecycleBin();
    setCleanedRecycleBin(true);
    setNotice(`Purged ${formatSize(recycleBinMb)} of deleted documents from storage.`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Largest files derived from actual documents
  const sortedFiles = [...documents]
    .sort((a, b) => parseFloat(b.fileSize || '0') - parseFloat(a.fileSize || '0'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-blue-600" />
            <span>Platform Storage Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real storage consumption, document version retention, recycle bin quotas, and encryption breakdown.
          </p>
        </div>

        <button
          onClick={handlePurgeRecycleBin}
          disabled={cleanedRecycleBin || recycleBinDocuments.length === 0}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
            recycleBinDocuments.length > 0 && !cleanedRecycleBin
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{cleanedRecycleBin || recycleBinDocuments.length === 0 ? 'Recycle Bin Empty' : `Purge Recycle Bin (${formatSize(recycleBinMb)})`}</span>
        </button>
      </div>

      {notice && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Primary Storage Quota Card in White and Blue */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Storage Allocation
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {formatSize(totalUsedMb)}{' '}
              <span className="text-sm font-normal text-slate-400">/ {formatSize(totalQuotaMb)}</span>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {((totalUsedMb / totalQuotaMb) * 100).toFixed(2)}% Utilized
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden my-3">
          <div
            className="bg-blue-600 h-full"
            style={{ width: `${Math.max(1, ((totalDocMb / totalQuotaMb) * 100))}%` }}
            title={`Documents (${formatSize(totalDocMb)})`}
          />
          {!cleanedRecycleBin && recycleBinMb > 0 && (
            <div
              className="bg-blue-300 h-full"
              style={{ width: `${Math.max(0.5, ((recycleBinMb / totalQuotaMb) * 100))}%` }}
              title={`Recycle Bin (${formatSize(recycleBinMb)})`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 mt-4 pt-3 border-t border-blue-50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Documents: <strong className="text-slate-900">{formatSize(totalDocMb)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-300" />
            <span>Recycle Bin: <strong className="text-slate-900">{cleanedRecycleBin ? '0 KB' : formatSize(recycleBinMb)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span>Available: <strong className="text-slate-900">{formatSize(totalQuotaMb - totalUsedMb)}</strong></span>
          </div>
        </div>
      </div>

      {/* Largest Files Table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-blue-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Largest Documents in Vault</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top files sorted by disk space consumption</p>
          </div>
          <span className="text-xs font-semibold text-blue-600">{documents.length} Total Files</span>
        </div>

        {sortedFiles.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No files in storage yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-blue-50/50 text-slate-600 font-semibold border-b border-blue-100">
                <tr>
                  <th className="py-2.5 px-4">File Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">File Size</th>
                  <th className="py-2.5 px-4">Upload Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-900">{file.name || file.title}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{file.category}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{file.fileSize || '1.0 MB'}</td>
                    <td className="py-2.5 px-4 text-slate-500">{file.uploadedAt || 'Recently'}</td>
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
