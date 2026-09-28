import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  statusMessage?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  statusMessage = 'Loading...'
}) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-between p-8 z-50 select-none animate-in fade-in duration-200">
      {/* Top spacing */}
      <div className="w-full"></div>

      {/* Center Brand & Loading State */}
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        {/* Minimal Emblem ◉ */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-200">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-sky-200 border-dashed animate-spin [animation-duration:8s] pointer-events-none opacity-60"></div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">DocuMind</h1>
          <span className="text-xs font-black px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
            AI
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-8">
          Personal Document Command Center
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium shadow-2xs">
          <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      </div>

      {/* Bottom Architectural Credo */}
      <div className="text-center pb-4">
        <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
          Secure • Intelligent • Personal
        </p>
      </div>
    </div>
  );
};
