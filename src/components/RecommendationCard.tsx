import React from 'react';
import { ShieldAlert, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { RiskLevel } from '../types/analysisTypes';

interface RecommendationCardProps {
  generalRecommendation: string;
  overallRisk: RiskLevel;
  hasPrivacyFindings: boolean;
  onProtectScreenshot: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  generalRecommendation,
  overallRisk,
  hasPrivacyFindings,
  onProtectScreenshot
}) => {
  const isHighOrCritical = overallRisk === 'CRITICAL' || overallRisk === 'HIGH';

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 p-6 sm:p-7 space-y-4 shadow-xl shadow-indigo-950/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-400 shrink-0">
            {isHighOrCritical ? <ShieldAlert className="w-6 h-6 text-red-400" /> : <CheckCircle className="w-6 h-6 text-cyan-400" />}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Cybersecurity &amp; Privacy Recommendation
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {hasPrivacyFindings
                ? 'Do not share this screenshot publicly until sensitive information is redacted.'
                : 'Safe Handling & Sharing Guidelines'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {generalRecommendation || 'Verify all security certificate domains and redact visible personal data or tokens prior to external distribution.'}
            </p>
          </div>
        </div>

        {hasPrivacyFindings && (
          <button
            onClick={onProtectScreenshot}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Lock className="w-4 h-4" />
            <span>Protect Screenshot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
