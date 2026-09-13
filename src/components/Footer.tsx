import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface FooterProps {
  onOpenAcademicModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAcademicModal }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Academic & Cybersecurity Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-slate-400">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200 block text-xs">
              Academic Cybersecurity Disclaimer
            </span>
            <p className="text-[11px] leading-relaxed">
              CyberShield AI is an academic cybersecurity and privacy guardian designed for educational and risk-awareness purposes. This application is NOT an antivirus, malware scanner, or penetration testing tool, and does not guarantee that any website, file, or certificate is definitely safe or malicious. It assesses visible visual evidence conservatively.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-300">CyberShield AI</span>
            <span>•</span>
            <span>AI-Powered Screenshot Security &amp; Privacy Guardian</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAcademicModal}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Academic Model
            </button>
            <span>•</span>
            <span>Privacy by Design</span>
            <span>•</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
