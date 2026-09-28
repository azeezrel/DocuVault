import React, { useState } from 'react';
import {
  Home,
  Folder,
  Star,
  Clock,
  Bell,
  Calendar,
  Sparkles,
  Trash2,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { DocumentCategory } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    documents,
    recycleBinDocuments,
    attentionCounts,
    deadlines,
    selectedCategory,
    setSelectedCategory,
    setSelectedFolder,
  } = useVault();
  const { currentUser, signOut } = useAuth();

  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);

  const activeDocsCount = documents.filter((d) => !d.isDeleted).length;
  const favoriteCount = documents.filter((d) => !d.isDeleted && d.isFavorite).length;
  const overdueCount = deadlines.filter((d) => d.daysRemaining < 0).length;

  const categoryCounts = {
    Career: documents.filter((d) => !d.isDeleted && d.category === 'Career').length,
    Education: documents.filter((d) => !d.isDeleted && d.category === 'Education').length,
    Finance: documents.filter((d) => !d.isDeleted && d.category === 'Finance').length,
    Insurance: documents.filter((d) => !d.isDeleted && d.category === 'Insurance').length,
    Personal: documents.filter((d) => !d.isDeleted && d.category === 'Personal').length,
    Property: documents.filter((d) => !d.isDeleted && d.category === 'Property').length,
    Vehicles: documents.filter((d) => !d.isDeleted && d.category === 'Vehicles').length,
    Health: documents.filter((d) => !d.isDeleted && d.category === 'Health').length,
    Legal: documents.filter((d) => !d.isDeleted && d.category === 'Legal').length,
  };

  const uploadCategoriesList: { id: DocumentCategory; label: string; count: number }[] = [
    { id: 'Career', label: 'Career', count: categoryCounts.Career },
    { id: 'Education', label: 'Education', count: categoryCounts.Education },
    { id: 'Finance', label: 'Finance', count: categoryCounts.Finance },
    { id: 'Insurance', label: 'Insurance', count: categoryCounts.Insurance },
    { id: 'Personal', label: 'Personal', count: categoryCounts.Personal },
    { id: 'Property', label: 'Property', count: categoryCounts.Property },
    { id: 'Vehicles', label: 'Vehicles', count: categoryCounts.Vehicles },
    { id: 'Health', label: 'Health', count: categoryCounts.Health },
    { id: 'Legal', label: 'Legal', count: categoryCounts.Legal },
  ];

  const primaryNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'documents',
      label: 'My Documents',
      icon: Folder,
      badge: activeDocsCount > 0 ? activeDocsCount : null,
      isCollapsible: true,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Star,
      badge: favoriteCount > 0 ? favoriteCount : null,
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      badge: null,
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      badge: overdueCount > 0 ? `${overdueCount}` : null,
      badgeAlert: overdueCount > 0,
    },
    {
      id: 'important-dates',
      label: 'Important Dates',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: Sparkles,
      badge: null,
      isAi: true,
    },
    {
      id: 'recycle-bin',
      label: 'Recycle Bin',
      icon: Trash2,
      badge: recycleBinDocuments.length > 0 ? recycleBinDocuments.length : null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-sky-100 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Brand title inside sidebar */}
      <div className="px-3 py-2 mb-2 flex items-center justify-between">
        <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
          WORKSPACE NAVIGATION
        </span>
      </div>

      {/* Primary Navigation Items */}
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.id === 'documents') {
            return (
              <div key={item.id} className="space-y-1">
                {/* My Documents Row */}
                <div
                  className={`w-full flex items-center justify-between rounded-xl transition-all ${
                    isActive && selectedCategory === 'All'
                      ? 'bg-sky-50 text-sky-700 font-extrabold shadow-2xs border border-sky-100'
                      : isActive
                      ? 'bg-slate-50 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveView('documents');
                      setSelectedCategory('All');
                      setSelectedFolder(null);
                      setIsDocumentsOpen(true);
                    }}
                    className="flex-1 flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-left cursor-pointer"
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-sky-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </button>

                  <div className="flex items-center gap-1 pr-2">
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-sky-200 text-sky-900' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDocumentsOpen(!isDocumentsOpen);
                      }}
                      className="p-1 text-slate-400 hover:text-sky-600 rounded transition-colors cursor-pointer"
                      title={isDocumentsOpen ? 'Collapse categories' : 'Expand categories'}
                    >
                      {isDocumentsOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-categories nested directly under My Documents */}
                {isDocumentsOpen && (
                  <div className="ml-4 pl-3 border-l-2 border-sky-100 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {uploadCategoriesList.map((cat) => {
                      const isCatActive =
                        activeView === 'documents' && selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedFolder(null);
                            setActiveView('documents');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                            isCatActive
                              ? 'bg-sky-100 text-sky-800 font-bold border-l-2 border-sky-600 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate flex items-center gap-2">
                            <span className="text-xs">📁</span>
                            <span>{cat.label}</span>
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full ${
                              isCatActive
                                ? 'bg-sky-200 text-sky-900 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left group cursor-pointer ${
                isActive
                  ? 'bg-sky-50 text-sky-700 font-extrabold shadow-2xs border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-sky-600'
                      : item.isAi
                      ? 'text-sky-500 group-hover:text-sky-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeAlert
                      ? 'bg-rose-100 text-rose-700'
                      : item.isAi
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-3 border-t border-sky-100 space-y-2">
        {/* Settings Button */}
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
            activeView === 'settings'
              ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
          <div
            onClick={() => setActiveView('settings')}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {currentUser?.avatarInitials || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'VO')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.name || 'Ahmed Sanni'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || 'ahmed@company.com'}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
