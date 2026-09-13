import React from 'react';
import { Lock, ShieldAlert, Key, Mail, User, Phone, MapPin, QrCode, CreditCard, FileCode, CheckCircle2, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { PrivacyFinding, RiskLevel } from '../types/analysisTypes';
import { getRiskConfig } from '../utils/riskCalculation';

interface PrivacyFindingsProps {
  findings: PrivacyFinding[];
  onToggleFindingRedaction?: (id: string) => void;
  onSelectAllForRedaction?: (selectAll: boolean) => void;
}

export const PrivacyFindings: React.FC<PrivacyFindingsProps> = ({
  findings,
  onToggleFindingRedaction,
  onSelectAllForRedaction
}) => {
  const getItemIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('key') || lower.includes('secret') || lower.includes('token') || lower.includes('password')) {
      return <Key className="w-4 h-4 text-red-400" />;
    }
    if (lower.includes('email') || lower.includes('mail')) {
      return <Mail className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('phone') || lower.includes('tel')) {
      return <Phone className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('student') || lower.includes('id') || lower.includes('user') || lower.includes('name')) {
      return <User className="w-4 h-4 text-blue-400" />;
    }
    if (lower.includes('qr') || lower.includes('barcode')) {
      return <QrCode className="w-4 h-4 text-indigo-400" />;
    }
    if (lower.includes('address') || lower.includes('location')) {
      return <MapPin className="w-4 h-4 text-orange-400" />;
    }
    if (lower.includes('card') || lower.includes('bank') || lower.includes('account')) {
      return <CreditCard className="w-4 h-4 text-red-400" />;
    }
    return <FileCode className="w-4 h-4 text-cyan-400" />;
  };

  const getRiskDot = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="Critical Risk" />;
      case 'HIGH':
        return <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" title="High Risk" />;
      case 'MEDIUM':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" title="Medium Risk" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" title="Low Risk" />;
    }
  };

  if (!findings || findings.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Screenshot Privacy Findings</h3>
            <p className="text-xs text-slate-400">No sensitive personal identifiers or credentials detected.</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
          The scanner evaluated the screenshot and found no visible email addresses, passwords, API tokens, student IDs, or private data elements.
        </p>
      </div>
    );
  }

  const allSelected = findings.every(f => f.enabledForRedaction !== false);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Screenshot Privacy Guardian
            </h3>
            <p className="text-xs text-slate-400">
              Detected visible sensitive credentials, PII &amp; tokens (values safely masked)
            </p>
          </div>
        </div>

        {onSelectAllForRedaction && (
          <button
            onClick={() => onSelectAllForRedaction(!allSelected)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-center"
          >
            {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            <span>{allSelected ? 'Deselect All' : 'Select All for Redaction'}</span>
          </button>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
        <span>
          <strong>Privacy Rule:</strong> Sensitive values are masked in the UI. Raw credentials are never stored.
        </span>
        <span className="text-[11px] font-mono bg-indigo-900/40 px-2 py-0.5 rounded border border-indigo-500/30">
          {findings.length} findings
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {findings.map((finding) => {
          const riskConfig = getRiskConfig(finding.risk);
          const isEnabled = finding.enabledForRedaction !== false;

          return (
            <div
              key={finding.id}
              className={`p-4 rounded-xl border transition-all ${
                isEnabled
                  ? 'bg-slate-900/90 border-slate-700/90 shadow-md'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left column: Type & Masked Value */}
                <div className="flex items-start space-x-3">
                  {onToggleFindingRedaction && (
                    <button
                      onClick={() => onToggleFindingRedaction(finding.id)}
                      className="mt-1 text-slate-400 hover:text-cyan-400 transition-colors"
                      title={isEnabled ? 'Exclude from redaction' : 'Include in redaction'}
                    >
                      {isEnabled ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  )}

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {getItemIcon(finding.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getRiskDot(finding.risk)}
                      <h4 className="text-sm font-bold text-white">
                        {finding.type}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${riskConfig.badgeClass}`}>
                        {finding.risk}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[11px] text-slate-400">Masked Value:</span>
                      <code className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {finding.maskedValue}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Coordinates & Confidence */}
                <div className="flex items-center gap-3 self-end sm:self-center text-[11px] text-slate-400">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Pos: ({Math.round(finding.boundingBox.x)}%, {Math.round(finding.boundingBox.y)}%)
                  </span>
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Conf: {finding.confidence}%
                  </span>
                </div>
              </div>

              {/* Reason and Recommendation */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">
                    Why it may be sensitive:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {finding.reason}
                  </p>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold block mb-0.5">
                    Recommended action:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {finding.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
