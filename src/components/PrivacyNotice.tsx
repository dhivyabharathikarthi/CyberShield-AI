import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 sm:p-5 flex items-start space-x-3.5">
      <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="space-y-1 text-xs leading-relaxed text-slate-400">
        <span className="font-bold text-slate-200 block">
          Privacy Notice &amp; Data Handling Policy
        </span>
        <p>
          Upload only screenshots you are authorized to analyze. Avoid uploading real production passwords, active live authentication tokens, or high-risk financial credentials. All image analysis is processed ephemerally on the backend without permanent database retention or logging of sensitive tokens.
        </p>
      </div>
    </div>
  );
};
