import React, { useState } from 'react';
import {
  ShieldCheck,
  MailCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EmailVerificationPage: React.FC = () => {
  const { setAuthScreen, verifyEmailCode, currentUser } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyEmailCode(code);
    if (!success) {
      setError(true);
    }
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
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
            <MailCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Verify Your Email</h2>
          <p className="text-xs text-slate-500 mt-1">
            We sent a verification code to <strong>{currentUser?.email || 'your email'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1 text-center">6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setError(false);
                setCode(e.target.value);
              }}
              placeholder="000000"
              className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest outline-none focus:border-sky-400 focus:bg-white text-slate-900 transition-colors"
            />
          </div>

          {error && (
            <p className="text-center text-xs text-rose-600 font-semibold">
              Invalid verification code. Please check your email inbox.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>Confirm & Launch Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => verifyEmailCode()}
            className="w-full py-2 border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Enter Vault Directly (No Email Needed)</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => setAuthScreen('signin')}
            className="text-xs font-bold text-slate-600 hover:text-sky-700 flex items-center justify-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
