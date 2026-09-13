import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Copy, Check, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { AnalysisReport } from '../types/analysisTypes';

interface TechnicalDetailsProps {
  report: AnalysisReport;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(report, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Technical Details &amp; Structured JSON
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Gemini 3.8 Flash
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Inspect raw validated payload, OCR bounding boxes, and security metadata
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 space-y-4 border-t border-slate-800/80 mt-2">
          {/* Engine Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block mb-0.5 font-medium">Model Engine</span>
              <span className="text-cyan-400 font-mono font-bold">gemini-3.8-flash</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block mb-0.5 font-medium">Processing Mode</span>
              <span className="text-slate-200 font-mono font-bold">Multimodal Vision</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block mb-0.5 font-medium">Prompt Safety</span>
              <span className="text-emerald-400 font-mono font-bold">Untrusted Data Wall</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 block mb-0.5 font-medium">Analyzed Timestamp</span>
              <span className="text-slate-300 font-mono text-[11px] truncate block">
                {new Date(report.analyzedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* JSON Tree Box */}
          <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-[11px]">analysis_report.json</span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto max-h-80 leading-relaxed scrollbar-thin">
              {jsonString}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
