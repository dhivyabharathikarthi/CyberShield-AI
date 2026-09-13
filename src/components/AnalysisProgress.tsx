import React, { useEffect, useState } from 'react';
import { Shield, Search, Lock, Cpu, CheckCircle2 } from 'lucide-react';

export const AnalysisProgress: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Ingesting Screenshot & Validating Image Format', icon: Search },
    { label: 'Gemini Multimodal Visual Feature & OCR Extraction', icon: Cpu },
    { label: 'Security Warning & Certificate Error Translation', icon: Shield },
    { label: 'Scanning for Visible Secrets, Credentials & PII', icon: Lock },
    { label: 'Calculating Risk Matrix & Bounding Box Coordinates', icon: CheckCircle2 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/40">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-1">
          <Shield className="w-6 h-6 animate-pulse text-cyan-300" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Performing Dual Security &amp; Privacy AI Analysis
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Gemini Multimodal AI is evaluating visible security warning indicators and scanning for exposed sensitive tokens.
        </p>
      </div>

      {/* Steps checklist */}
      <div className="max-w-md mx-auto space-y-3 pt-2">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const Icon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3.5 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-950/60 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                  : isDone
                  ? 'bg-slate-900/40 border border-slate-800 text-slate-400'
                  : 'bg-slate-900/20 border border-transparent text-slate-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1">
                <span
                  className={`text-xs font-medium block ${
                    isCurrent ? 'text-cyan-200 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
