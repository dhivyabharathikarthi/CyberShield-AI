import React, { useEffect, useRef, useState } from 'react';
import { Download, ShieldCheck, Lock, Eye, RefreshCw, Sliders, AlertTriangle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { BoundingBox, PrivacyFinding, RedactionMode } from '../types/analysisTypes';
import { createRedactedImage } from '../utils/redaction';

interface ProtectedImageProps {
  originalImageSrc: string;
  originalFileName: string;
  findings: PrivacyFinding[];
  onBackToReport: () => void;
}

export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  originalImageSrc,
  originalFileName,
  findings,
  onBackToReport
}) => {
  const [redactionMode, setRedactionMode] = useState<RedactionMode>('blackout');
  const [includeLabels, setIncludeLabels] = useState(true);
  const [activeTab, setActiveTab] = useState<'protected' | 'original' | 'compare'>('protected');
  const [protectedDataUrl, setProtectedDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [customBoxes, setCustomBoxes] = useState<BoundingBox[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDragBox, setCurrentDragBox] = useState<BoundingBox | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate redacted image copy
  useEffect(() => {
    let isCurrent = true;
    setIsGenerating(true);

    createRedactedImage(originalImageSrc, findings, {
      mode: redactionMode,
      includeLabel: includeLabels,
      customBoxes
    })
      .then((url) => {
        if (isCurrent) {
          setProtectedDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Redaction failed:', err);
        if (isCurrent) setIsGenerating(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [originalImageSrc, findings, redactionMode, includeLabels, customBoxes]);

  // Handle manual box drawing on image
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawStart({ x, y });
    setCurrentDragBox({ x, y, width: 0, height: 0, label: 'Custom Box' });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !drawStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const x = Math.min(drawStart.x, currentX);
    const y = Math.min(drawStart.y, currentY);
    const width = Math.abs(currentX - drawStart.x);
    const height = Math.abs(currentY - drawStart.y);

    setCurrentDragBox({ x, y, width, height, label: 'Custom Box', isManual: true });
  };

  const handleMouseUp = () => {
    if (!isDrawingMode || !drawStart || !currentDragBox) return;
    if (currentDragBox.width > 2 && currentDragBox.height > 2) {
      setCustomBoxes((prev) => [...prev, currentDragBox]);
    }
    setDrawStart(null);
    setCurrentDragBox(null);
  };

  const removeCustomBox = (index: number) => {
    setCustomBoxes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    if (!protectedDataUrl) return;
    const link = document.createElement('a');
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    link.download = `protected_${baseName}.png`;
    link.href = protectedDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasLowConfidenceFindings = findings.some((f) => f.confidence < 75);

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-5 sm:p-6 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">
                  Protected Screenshot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Share
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-medium">
                Sensitive information has been redacted. The original uploaded image remains unmodified.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToReport}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Back to Analysis
            </button>
            <button
              onClick={handleDownload}
              disabled={!protectedDataUrl || isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Save Protected Image</span>
            </button>
          </div>
        </div>

        {hasLowConfidenceFindings && (
          <div className="mt-2 p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Review Advisory:</strong> Some detected elements have lower AI confidence scores. Please review the preview carefully and use the manual box tool if any extra text needs redaction.
            </span>
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
        {/* View Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('protected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'protected'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Protected View
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original View
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
        </div>

        {/* Redaction Style Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Style:</span>
            <select
              value={redactionMode}
              onChange={(e) => setRedactionMode(e.target.value as RedactionMode)}
              className="bg-slate-950 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="blackout">Solid Blackout Box</option>
              <option value="blur">Gaussian Blur</option>
              <option value="pixelate">Pixelation Filter</option>
            </select>
          </div>

          {redactionMode === 'blackout' && (
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLabels}
                onChange={(e) => setIncludeLabels(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span>Show [REDACTED] watermark</span>
            </label>
          )}

          {/* Manual Box Tool */}
          <button
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isDrawingMode
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-950/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Click and drag on the image to redact custom areas"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isDrawingMode ? 'Drawing Active (Click & Drag)' : '+ Custom Redact Area'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-hidden">
        {activeTab === 'compare' ? (
          /* Side by side */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block text-center">
                Original Screenshot (Unprotected)
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 flex items-center justify-center min-h-[300px]">
                <img
                  src={originalImageSrc}
                  alt="Original Screenshot"
                  className="max-h-[420px] object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 block text-center">
                Protected Screenshot (Redacted)
              </span>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-2 flex items-center justify-center min-h-[300px]">
                {protectedDataUrl ? (
                  <img
                    src={protectedDataUrl}
                    alt="Protected Redacted Screenshot"
                    className="max-h-[420px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-xs text-slate-400 animate-pulse">Rendering redaction...</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Single view (Protected or Original) */
          <div className="relative flex items-center justify-center min-h-[340px] max-h-[560px]">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`relative max-w-full max-h-[560px] flex items-center justify-center ${
                isDrawingMode ? 'cursor-crosshair select-none' : ''
              }`}
            >
              <img
                src={activeTab === 'original' ? originalImageSrc : (protectedDataUrl || originalImageSrc)}
                alt={activeTab === 'original' ? 'Original Screenshot' : 'Protected Screenshot'}
                className="max-h-[540px] w-auto object-contain rounded-lg shadow-2xl"
              />

              {/* Dragging preview box */}
              {isDrawingMode && currentDragBox && (
                <div
                  style={{
                    left: `${currentDragBox.x}%`,
                    top: `${currentDragBox.y}%`,
                    width: `${currentDragBox.width}%`,
                    height: `${currentDragBox.height}%`
                  }}
                  className="absolute border-2 border-dashed border-amber-400 bg-amber-400/30 pointer-events-none rounded"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Redaction Boxes Manager */}
      {customBoxes.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Custom Manual Redaction Regions ({customBoxes.length})
            </span>
            <button
              onClick={() => setCustomBoxes([])}
              className="text-[11px] text-red-400 hover:underline"
            >
              Clear All Custom Boxes
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {customBoxes.map((box, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2"
              >
                <span>Box #{idx + 1} ({Math.round(box.width)}% × {Math.round(box.height)}%)</span>
                <button
                  onClick={() => removeCustomBox(idx)}
                  className="text-slate-400 hover:text-red-400 cursor-pointer"
                  title="Remove this box"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
