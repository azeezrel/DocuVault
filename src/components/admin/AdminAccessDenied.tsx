import React from 'react';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';

export const AdminAccessDenied: React.FC = () => {
  const { currentUser, toggleUserRole } = useAuth();
  const { setActiveView } = useVault();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
        </div>

        <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          403 • Role-Based Access Control
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Administrator Role Required
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The <code className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-mono font-bold">/admin</code> operational console is restricted to platform administrators.
          You are currently authenticated as{' '}
          <strong className="text-slate-900">{currentUser?.name || 'Standard User'}</strong> with role{' '}
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono uppercase font-bold">
            {currentUser?.role || 'user'}
          </span>.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-left text-xs space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span>Account Email:</span>
            <span className="font-mono text-slate-900 font-semibold">{currentUser?.email || 'user@email.com'}</span>
          </div>
          <div className="flex justify-between">
            <span>Required Role:</span>
            <span className="font-mono text-blue-600 font-bold">ADMIN / SUPER_ADMIN</span>
          </div>
          <div className="flex justify-between">
            <span>Security Policy:</span>
            <span className="text-slate-700 font-medium">RBAC Active</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              toggleUserRole();
              setActiveView('admin');
            }}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch Role to Admin (Demo / Evaluation Mode)</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full py-2.5 px-4 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Personal Vault</span>
          </button>
        </div>

        <p className="mt-5 text-[11px] text-slate-400">
          DocuMind Zero-Trust Architecture • All access attempts are recorded in Audit Logs
        </p>
      </div>
    </div>
  );
};
