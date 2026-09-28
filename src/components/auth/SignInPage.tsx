import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignInPage: React.FC = () => {
  const { setAuthScreen, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requireMfa, setRequireMfa] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email, password, requireMfa);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div
        onClick={() => setAuthScreen('welcome')}
        className="cursor-pointer flex items-center gap-2.5 mb-6 group"
        title="Go to main page"
      >
        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-600 transition-colors">
          <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">DocuMind</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">AI</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Personal Document Command Center</p>
        </div>
      </div>

      {/* Top Back to Main Page Link */}
      <div className="max-w-md w-full mb-3 flex items-center justify-start">
        <button
          onClick={() => setAuthScreen('welcome')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors cursor-pointer group"
          id="signin-back-to-landing-top"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Page</span>
        </button>
      </div>

      {/* Sign In Card */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your secure personal digital document vault
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">Password</label>
              <button
                type="button"
                onClick={() => setAuthScreen('forgot-password')}
                className="text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={requireMfa}
              onChange={(e) => setRequireMfa(e.target.checked)}
              className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-400 cursor-pointer"
            />
            <span className="text-slate-600 text-[11px] font-medium">
              Verify with Two-Factor Authentication (2FA)
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
            id="signin-submit-btn"
          >
            <span>Sign In to Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center text-xs text-slate-500">
          <div>
            Don't have an account?{' '}
            <button
              onClick={() => setAuthScreen('signup')}
              className="font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100/80">
            <span className="text-slate-400">Platform Administrator? </span>
            <button
              type="button"
              onClick={() => setAuthScreen('admin-signin')}
              className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer underline decoration-indigo-300"
              id="signin-to-admin-portal-btn"
            >
              Admin Portal Sign In →
            </button>
          </div>

          <div>
            <button
              onClick={() => setAuthScreen('welcome')}
              className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-sky-600 transition-colors cursor-pointer text-xs py-1"
              id="signin-back-to-landing-bottom"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Landing Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
