import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FolderLock,
  CalendarClock,
  Search,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WelcomeScreen: React.FC = () => {
  const { setAuthScreen } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between text-slate-800 selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xs sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">DocuMind</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                  AI
                </span>
              </div>
            </div>
          </div>

          {/* Admin Page Sign In */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuthScreen('admin-signin')}
              className="px-3.5 py-1.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-800 shadow-2xs hover:shadow-xs transition-all text-xs font-bold cursor-pointer"
              title="Admin Page Sign In"
              id="header-admin-signin-btn"
            >
              Admin Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Welcome Container - Centered, Focused, Non-bulky */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
          {/* Subtle Category Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Document Command Center</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            Your documents. <span className="text-sky-600">Your life.</span>
          </h1>

          {/* Compact Value Proposition */}
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
            Securely organize your documents, understand what's inside them, and use AI to find
            important information, deadlines, and records in seconds.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
            <button
              onClick={() => setAuthScreen('signup')}
              className="w-full sm:w-auto flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              id="welcome-create-vault-btn"
            >
              <span>Get Started with DocuMind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAuthScreen('signin')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
              id="welcome-signin-btn"
            >
              Sign In
            </button>
          </div>

          {/* 3 Core Highlights - Clean, Compact 3-Column Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
              <FolderLock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Organize</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Personal, career, finance & family in one place.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
              <Search className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Understand</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Ask AI natural questions across all your files.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
              <CalendarClock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Remember</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Timely alerts before passport, policy, & lease expiries.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Privacy Guarantee */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Private & Encrypted • Client & Zero-Knowledge Security</span>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
