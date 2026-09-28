import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { setAuthScreen, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPasswordReset(email);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4">
      <div
        onClick={() => setAuthScreen('welcome')}
        className="cursor-pointer flex items-center gap-2.5 mb-6 group"
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

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {isSent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Recovery Email Dispatched</p>
              <p className="text-xs text-slate-500 mt-1">
                We sent a secure password reset link to <strong>{email}</strong>.
              </p>
            </div>
            <button
              onClick={() => setAuthScreen('signin')}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center">
          <button
            onClick={() => setAuthScreen('signin')}
            className="text-xs font-bold text-slate-600 hover:text-sky-700 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
          <button
            onClick={() => setAuthScreen('welcome')}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>Back to Main Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
