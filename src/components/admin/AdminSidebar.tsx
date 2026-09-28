import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  Bot,
  ActivitySquare,
  HardDrive,
  BellRing,
  ShieldAlert,
  Sliders,
  Gauge,
  ArrowLeft,
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useVault } from '../../context/VaultContext';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  usersCount?: number;
  failedJobsCount?: number;
  unresolvedHealthIssuesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  usersCount = 1,
  failedJobsCount = 0,
  unresolvedHealthIssuesCount = 0,
}) => {
  const { setActiveView, documents } = useVault();

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'users' as AdminTab,
      label: 'Users',
      icon: Users,
      badge: usersCount ? `${usersCount}` : null,
    },
    {
      id: 'processing' as AdminTab,
      label: 'Document Processing',
      icon: FileCheck2,
      badge: failedJobsCount > 0 ? `${failedJobsCount} alert` : documents.length > 0 ? `${documents.length}` : null,
    },
    {
      id: 'ai-ops' as AdminTab,
      label: 'AI Operations',
      icon: Bot,
      badge: 'Gemini 3.8',
    },
    {
      id: 'health' as AdminTab,
      label: 'Document Health',
      icon: ActivitySquare,
      badge: unresolvedHealthIssuesCount > 0 ? `${unresolvedHealthIssuesCount}` : null,
    },
    {
      id: 'storage' as AdminTab,
      label: 'Storage',
      icon: HardDrive,
      badge: null,
    },
    {
      id: 'notifications' as AdminTab,
      label: 'Reminders & Queue',
      icon: BellRing,
      badge: null,
    },
    {
      id: 'audit' as AdminTab,
      label: 'Audit Logs',
      icon: ShieldAlert,
      badge: 'Live',
    },
    {
      id: 'config' as AdminTab,
      label: 'System Settings',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'monitoring' as AdminTab,
      label: 'System Health',
      icon: Gauge,
      badge: 'Online',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-blue-100 text-slate-700 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none shadow-2xs">
      {/* Category header */}
      <div className="px-3 py-2 mb-2 flex items-center justify-between">
        <span className="text-[11px] font-extrabold tracking-wider text-blue-900 uppercase">
          OPERATIONAL CONTROL
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
          PROD-V1
        </span>
      </div>

      {/* Nav items list */}
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Switcher: Quick Back Link */}
      <div className="pt-3 border-t border-blue-100 mt-2">
        <button
          onClick={() => setActiveView('home')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Exit to Personal Vault</span>
        </button>
      </div>
    </aside>
  );
};
