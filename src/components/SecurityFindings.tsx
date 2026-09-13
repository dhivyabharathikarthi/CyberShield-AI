import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, Code2, AlertOctagon } from 'lucide-react';
import { SecurityWarning } from '../types/analysisTypes';

interface SecurityFindingsProps {
  warnings: SecurityWarning[];
}

export const SecurityFindings: React.FC<SecurityFindingsProps> = ({ warnings }) => {
  const [expandedTech, setExpandedTech] = useState<Record<string, boolean>>({});

  const toggleTech = (id: string) => {
    setExpandedTech((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!warnings || warnings.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security-Warning Translator</h3>
            <p className="text-xs text-slate-400">No active browser or cybersecurity warnings detected in the visible image.</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
          The screenshot does not appear to contain standard browser TLS/SSL certificate mismatch notices, deceptive phishing interstitials, malware download warnings, or security error codes.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Security-Warning Translator
            </h3>
            <p className="text-xs text-slate-400">
              Plain-language breakdown of visible cybersecurity warnings &amp; safe actions
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-semibold text-cyan-300 border border-slate-700">
          {warnings.length} {warnings.length === 1 ? 'Warning Detected' : 'Warnings Detected'}
        </span>
      </div>

      <div className="space-y-4">
        {warnings.map((warning, index) => {
          const isUnknown = warning.isUnknownOrUnclear;
          const showTech = expandedTech[warning.id || index];

          return (
            <div
              key={warning.id || index}
              className={`rounded-2xl border p-5 sm:p-6 space-y-5 transition-all ${
                isUnknown
                  ? 'bg-slate-900/80 border-slate-700'
                  : 'bg-slate-900/90 border-slate-700/80 shadow-lg'
              }`}
            >
              {/* Warning Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-500/40 text-orange-400 shrink-0 mt-0.5">
                    {isUnknown ? <HelpCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {warning.category || 'Security Alert'}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {isUnknown ? 'Unknown or unclear warning' : warning.warningTitle}
                    </h4>
                    {warning.errorCode && (
                      <code className="text-xs font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20 mt-1 inline-block">
                        {warning.errorCode}
                      </code>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Confidence: {warning.confidence}%
                  </span>
                </div>
              </div>

              {/* Exact Warning Text if visible */}
              {warning.warningText && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans font-bold mb-1">
                    Exact Visible Text:
                  </span>
                  &ldquo;{warning.warningText}&rdquo;
                </div>
              )}

              {/* 6 Structured Pedagogical Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. What happened & 2. What does it mean? */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                      <span>1. What happened?</span>
                    </h5>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {isUnknown
                        ? "I couldn't confidently identify this warning from the screenshot."
                        : warning.simpleExplanation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                      <span>2. What does it mean?</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {warning.simpleExplanation}
                    </p>
                  </div>
                </div>

                {/* 3. Why could it matter? & 4. Possible causes */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                      <span>3. Why could it matter?</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isUnknown
                        ? "Proceeding past an unknown warning could expose sensitive credentials or allow untrusted software execution."
                        : "Bypassing this warning may allow an attacker on the same network to intercept unencrypted traffic or harvest logins."}
                    </p>
                  </div>

                  {warning.possibleCauses && warning.possibleCauses.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        4. Possible Causes:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {warning.possibleCauses.map((cause, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                          >
                            {cause}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. What should I do? (Recommended) & 6. What should I NOT do? (Avoid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* What should I do? */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>5. What Should I Do? (Recommended)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {warning.recommendedActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What should I NOT do? */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4" />
                    <span>6. What Should I NOT Do? (Avoid)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {warning.avoidActions.map((avoid, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">✗</span>
                        <span>{avoid}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Details Collapsible */}
              <div className="pt-2">
                <button
                  onClick={() => toggleTech(warning.id || index)}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Technical Explanation</span>
                  {showTech ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showTech && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <p className="text-slate-300 font-mono leading-relaxed">
                      {warning.technicalMeaning}
                    </p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Academic Context: Browser warnings act as security policy enforcers against man-in-the-middle (MITM) and domain spoofing attacks.
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
