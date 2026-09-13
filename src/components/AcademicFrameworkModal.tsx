import React from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, Cpu, Layers, Sparkles, AlertTriangle } from 'lucide-react';

interface AcademicFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicFrameworkModal: React.FC<AcademicFrameworkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const frameworkSteps = [
    {
      num: '01',
      title: 'REAL PROBLEM',
      subtitle: 'The Human-in-the-Loop Cybersecurity Gap',
      desc: 'Users and students frequently encounter browser warning dialogs (e.g. SSL/TLS mismatches, phishing interstitials) and click through them due to confusing technical jargon. Simultaneously, sharing unredacted screenshots on public forums or tickets leaks API keys, session tokens, and personal student IDs.',
      color: 'border-red-500/40 bg-red-950/20 text-red-300'
    },
    {
      num: '02',
      title: 'FIELD OBSERVATION',
      subtitle: 'Habituation & Accidental Token Exposure',
      desc: 'Observed that non-technical users either ignore critical certificate warnings (thinking it is a simple website glitch) or mistakenly paste credentials and server logs into chat boards, resulting in immediate unauthorized access and identity compromise.',
      color: 'border-orange-500/40 bg-orange-950/20 text-orange-300'
    },
    {
      num: '03',
      title: 'ROOT-CAUSE ANALYSIS',
      subtitle: 'Cryptographic Complexity & Absent Guardrails',
      desc: 'Root cause stems from two vectors: (1) Warning dialogs explain cryptographic failures using cryptic codes (e.g., ERR_CERT_COMMON_NAME_INVALID) without providing actionable plain-language next steps; and (2) Screenshot capture tools lack automated sensitive PII/token detection before distribution.',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    },
    {
      num: '04',
      title: 'AI IDEATION',
      subtitle: 'Multimodal Vision + Structured Schema Translation',
      desc: 'Leveraged Gemini Multimodal AI to simultaneously examine the visual layout of screenshots: translating security alerts into college-level explanations while locating precise bounding box coordinates of passwords, API keys, and sensitive tokens.',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
    },
    {
      num: '05',
      title: 'SOLUTION SELECTION',
      subtitle: 'Zero-Storage Privacy Architecture',
      desc: 'Built CyberShield AI with strict privacy-by-design principles: server-side ephemeral AI inference with structured JSON schemas, client-side HTML5 canvas redaction (blackout, blur, pixelate), and zero persistent database storage of uploaded screenshots.',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300'
    },
    {
      num: '06',
      title: 'TECHNICAL IMPLEMENTATION',
      subtitle: 'Full-Stack TypeScript + Gemini 3.8 Flash SDK',
      desc: 'Integrated Node.js / Express backend with @google/genai, structured JSON response validation, untrusted prompt-injection protection barriers, and a responsive React frontend with interactive redaction studio.',
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300'
    },
    {
      num: '07',
      title: 'TESTING & VALIDATION',
      subtitle: 'Multi-Scenario Real-World Verification',
      desc: 'Validated against TLS certificate errors, exposed API keys (.env), phishing interstitials, student identity cards, and clean baseline documentation to ensure conservative uncertainty communication without false certainty.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                CyberShield AI Academic Framework
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                AI Immersion Methodology: From Problem Discovery to Verified Implementation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Immersion Lifecycle Pipeline */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-400">Academic Project Disclaimer:</strong> CyberShield AI is built as an educational cybersecurity and privacy research tool. It communicates uncertainty clearly and does not make claims of definitive malice or act as an antivirus or penetration testing utility.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {frameworkSteps.map((step) => (
              <div
                key={step.num}
                className={`p-4 rounded-xl border ${step.color} space-y-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-mono text-xs opacity-75">{step.num}</span>
                    <span className="uppercase tracking-wider">{step.title}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white pt-1">{step.subtitle}</h4>
                  <p className="text-xs text-slate-300 pt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
          >
            Close Framework
          </button>
        </div>
      </div>
    </div>
  );
};
