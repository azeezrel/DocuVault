import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpPage: React.FC = () => {
  const { setAuthScreen, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms || !name.trim() || !email.trim()) return;
    signUp(name, email, password);
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
          id="signup-back-to-landing-top"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Page</span>
        </button>
      </div>

      {/* Sign Up Card */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Your Vault</h2>
          <p className="text-xs text-slate-500 mt-1">
            Start organizing your personal documents with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-slate-700 font-bold mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-400 focus:bg-white text-slate-900 text-xs transition-colors"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-400 mt-0.5 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 leading-tight">
              I agree to the Zero-Knowledge Privacy Agreement and understand my documents are encrypted with AES-256.
            </span>
          </label>

          <button
            type="submit"
            disabled={!terms}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="signup-submit-btn"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center text-xs text-slate-500">
          <div>
            Already have a DocuMind account?{' '}
            <button
              onClick={() => setAuthScreen('signin')}
              className="font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              Sign In
            </button>
          </div>

          <div>
            <button
              onClick={() => setAuthScreen('welcome')}
              className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-sky-600 transition-colors cursor-pointer text-xs py-1"
              id="signup-back-to-landing-bottom"
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
