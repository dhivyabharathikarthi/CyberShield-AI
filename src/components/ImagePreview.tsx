import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, RefreshCw, Shield, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { AnalysisReport, PrivacyFinding } from '../types/analysisTypes';

interface ImagePreviewProps {
  imageSrc: string;
  fileName: string;
  fileSize?: number;
  report: AnalysisReport | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onReset: () => void;
  onGoToProtect?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  fileName,
  fileSize,
  report,
  isAnalyzing,
  onAnalyze,
  onReset,
  onGoToProtect
}) => {
  const [showOverlays, setShowOverlays] = useState(true);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl shadow-slate-950/40">
      {/* Title & Metadata bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="truncate max-w-[240px] sm:max-w-md">{fileName}</span>
              {report && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Analyzed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Size: {formatFileSize(fileSize)} • Unmodified source image
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {report && report.privacyFindings.length > 0 && (
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Toggle bounding box highlight markers"
            >
              {showOverlays ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showOverlays ? 'Hide Findings Overlay' : 'Show Findings Overlay'}</span>
            </button>
          )}

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/80 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Screenshot</span>
          </button>
        </div>
      </div>

      {/* Image Stage with Interactive Bounding Boxes */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center min-h-[300px] max-h-[520px]">
        <div className="relative max-w-full max-h-[520px] flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Uploaded Screenshot Target"
            className="max-h-[520px] w-auto object-contain rounded-lg shadow-2xl"
          />

          {/* Bounding Box Highlights */}
          {report && showOverlays && report.privacyFindings.map((finding, idx) => {
            const { x, y, width, height } = finding.boundingBox;
            const isCritical = finding.risk === 'CRITICAL' || finding.risk === 'HIGH';
            return (
              <div
                key={finding.id || idx}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                className={`absolute pointer-events-none rounded transition-all duration-300 border-2 ${
                  isCritical
                    ? 'border-red-500/90 bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'border-amber-400/90 bg-amber-400/15 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                }`}
              >
                <span
                  className={`absolute -top-6 left-0 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1 ${
                    isCritical
                      ? 'bg-red-950 text-red-300 border border-red-500/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/60'
                  }`}
                >
                  <Lock className="w-2.5 h-2.5" />
                  {finding.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Image data is securely processed server-side. No permanent storage.</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {!report ? (
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Screenshot...' : 'Analyze Screenshot'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onGoToProtect}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Protect Screenshot</span>
              </button>
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
