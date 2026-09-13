import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck, Shield, Lock, Activity } from 'lucide-react';
import { RiskLevel } from '../types/analysisTypes';
import { getRiskConfig } from '../utils/riskCalculation';

interface RiskCardProps {
  overallRisk: RiskLevel;
  securityRisk: RiskLevel;
  privacyRisk: RiskLevel;
  summary: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  overallRisk,
  securityRisk,
  privacyRisk,
  summary
}) => {
  const overallConfig = getRiskConfig(overallRisk);
  const securityConfig = getRiskConfig(securityRisk);
  const privacyConfig = getRiskConfig(privacyRisk);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-red-400 stroke-[2.2]" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-orange-400 stroke-[2.2]" />;
      case 'AlertCircle':
        return <AlertCircle className="w-6 h-6 text-amber-400 stroke-[2.2]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-400 stroke-[2.2]" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Composite Overall Banner */}
      <div className={`rounded-2xl border p-6 sm:p-7 shadow-xl transition-all ${overallConfig.bgCardClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 shadow-inner shrink-0 mt-0.5">
              {getIcon(overallConfig.iconName)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overall Composite Risk Assessment
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${overallConfig.badgeClass}`}>
                  {overallRisk}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {overallConfig.label} Detected
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {summary || overallConfig.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-400">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>AI Multimodal Evaluation</span>
          </div>
        </div>
      </div>

      {/* Sub-Risk Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Security Warning Risk */}
        <div className={`p-5 rounded-xl border bg-slate-900/70 ${securityConfig.borderClass} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Security Risk</h3>
                <span className="text-[11px] text-slate-400">Browser &amp; Network Warnings</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${securityConfig.badgeClass}`}>
              {securityRisk}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {securityConfig.description}
          </p>
        </div>

        {/* Privacy & PII Exposure Risk */}
        <div className={`p-5 rounded-xl border bg-slate-900/70 ${privacyConfig.borderClass} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <Lock className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Privacy Risk</h3>
                <span className="text-[11px] text-slate-400">Visible PII &amp; Sensitive Secrets</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${privacyConfig.badgeClass}`}>
              {privacyRisk}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {privacyConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
};
