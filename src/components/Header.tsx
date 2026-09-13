import React from 'react';
import { Shield, ShieldAlert, Lock, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAcademicModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAcademicModal }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0B1120] flex items-center justify-center" title="Active Engine">
              <Lock className="w-2.5 h-2.5 text-black" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CyberShield <span className="text-cyan-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full">
                Guardian v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Powered Screenshot Security &amp; Privacy Guardian
            </p>
          </div>
        </div>

        {/* Action badges */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenAcademicModal}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700 transition-all shadow-sm hover:text-cyan-300"
            title="View Academic Problem & Methodology Framework"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Framework</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Persistent Storage</span>
          </div>
        </div>
      </div>
    </header>
  );
};
