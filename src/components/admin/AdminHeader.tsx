import React, { useState } from 'react';
import {
  ArrowLeft,
  Server,
  Activity,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Cpu,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';

interface AdminHeaderProps {
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onRefreshData, isRefreshing = false }) => {
  const { currentUser, toggleUserRole, signOut } = useAuth();
  const { setActiveView } = useVault();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-blue-100 text-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Admin Branding & Environment Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Server className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  DocuMind <span className="text-blue-600">Admin</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  SRE / Operations
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Platform Operations & Document Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Telemetry status */}
        <div className="hidden lg:flex items-center gap-4 text-xs bg-blue-50/70 px-3.5 py-1.5 rounded-full border border-blue-200/60">
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Systems Online</span>
          </div>
          <span className="text-blue-300">•</span>
          <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>API: 38ms</span>
          </div>
          <span className="text-blue-300">•</span>
          <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Gemini 3.8 Flash Active</span>
          </div>
        </div>

        {/* Right: Actions, Role Switcher & Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Refresh Operational Metrics */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              title="Refresh telemetry & status"
              className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-xs font-semibold text-blue-900 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Role: <strong className="text-blue-700 uppercase font-mono">{currentUser?.role || 'admin'}</strong></span>
              <ChevronDown className="w-3 h-3 text-blue-500" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-blue-100 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1.5 border-b border-blue-50">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Role-Based Access Control
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">Simulate account role:</p>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      if (currentUser?.role !== 'admin') toggleUserRole();
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between cursor-pointer ${
                      currentUser?.role === 'admin'
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-blue-50/60'
                    }`}
                  >
                    <span>Administrator (Full Ops)</span>
                    {currentUser?.role === 'admin' && <UserCheck className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      if (currentUser?.role === 'admin') toggleUserRole();
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between cursor-pointer ${
                      currentUser?.role === 'user'
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-blue-50/60'
                    }`}
                  >
                    <span>Standard User (No /admin)</span>
                    {currentUser?.role === 'user' && <UserCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Return to Personal Vault Button */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap shadow-xs cursor-pointer"
            title="Switch view to personal document vault"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Personal Vault</span>
            <span className="sm:hidden">Vault</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
            title="End session and log out"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
