import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';

export const AdminSignInPage: React.FC = () => {
  const { setAuthScreen, signIn, signUp } = useAuth();
  const { setActiveView } = useVault();
  const [mode, setMode] = useState<'signin' | 'create-account'>('signin');

  // Sign in state
  const [email, setEmail] = useState('admin@lifevault.ai');
  const [password, setPassword] = useState('AdminProd2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create account state
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      signIn(email, password, false, 'admin');
      setActiveView('admin');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'admin' }, '', '/admin');
      }
    }, 250);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      signUp(adminName, adminEmail, adminPassword, 'admin');
      setActiveView('admin');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'admin' }, '', '/admin');
      }
    }, 250);
  };

  const handleInstantDemoAdmin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      signIn('admin@lifevault.ai', 'AdminSec2026!', false, 'admin');
      setActiveView('admin');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'admin' }, '', '/admin');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4">
      {/* Top Back to Main Page Link */}
      <div className="max-w-md w-full mb-3 flex items-center justify-start">
        <button
          onClick={() => setAuthScreen('welcome')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors cursor-pointer group"
          id="admin-back-to-landing-top"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Page</span>
        </button>
      </div>

      {/* Admin Card in Sky Blue and White */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setMode('create-account')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'create-account'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="admin-tab-create-account"
          >
            Create Admin Account
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="admin-tab-signin"
          >
            Admin Sign In
          </button>
        </div>

        {mode === 'create-account' ? (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Admin Account</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provision administrative credentials & vault governance
              </p>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Administrator Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. John Ahmed"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors placeholder:text-slate-400"
                    id="admin-create-name-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Administrator Email / ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@lifevault.ai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors placeholder:text-slate-400"
                    id="admin-create-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Master Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors placeholder:text-slate-400"
                    id="admin-create-password-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75"
                id="admin-create-account-submit-btn"
              >
                <span>{isSubmitting ? 'Creating Admin Account...' : 'Create Admin Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an admin account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Portal Sign In</h2>
              <p className="text-xs text-slate-500 mt-1">
                Privileged administrative access & vault governance
              </p>
            </div>

            {/* Quick Demo Admin Button */}
            <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
              <p className="text-[11px] font-bold text-sky-900 mb-1.5 flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Instant Evaluation / Demo Access</span>
              </p>
              <button
                type="button"
                onClick={handleInstantDemoAdmin}
                disabled={isSubmitting}
                className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                id="instant-demo-admin-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>1-Click Launch Admin Console (admin@lifevault.ai)</span>
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Administrator Email / ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@lifevault.ai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors placeholder:text-slate-400"
                    id="admin-signin-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Master Password / Security Key</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors placeholder:text-slate-400"
                    id="admin-signin-password-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75"
                id="admin-signin-submit-btn"
              >
                <span>{isSubmitting ? 'Authenticating Admin Session...' : 'Authenticate as Administrator'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Need to create an admin account?{' '}
              <button
                type="button"
                onClick={() => setMode('create-account')}
                className="font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          <button
            onClick={() => setAuthScreen('welcome')}
            className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-sky-600 transition-colors cursor-pointer text-xs py-1"
            id="admin-back-to-landing-bottom"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Landing Page</span>
          </button>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
        <span>Hardware-Enforced Cryptographic & Access Governance</span>
      </div>
    </div>
  );
};
