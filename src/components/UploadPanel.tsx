import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleScenarios';
import { validateImageFile } from '../utils/validation';

interface UploadPanelProps {
  onImageSelected: (file: File | null, dataUrl: string, name: string) => void;
  disabled?: boolean;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onImageSelected, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(file, reader.result, file.name);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read selected image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (scenario: SampleScenario) => {
    if (disabled) return;
    setUploadError(null);
    try {
      // Convert SVG/dataUrl to blob/file
      const res = await fetch(scenario.imageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], scenario.filename, { type: 'image/svg+xml' });
      onImageSelected(file, scenario.imageDataUrl, scenario.filename);
    } catch {
      onImageSelected(null, scenario.imageDataUrl, scenario.filename);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.008] shadow-2xl shadow-cyan-950/40'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900/80'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Upload a Screenshot
            </h2>
            <p className="text-sm text-slate-400">
              Drag &amp; drop your screenshot here, or click to browse files from your computer.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              Choose Image
            </button>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-slate-400" /> Supported: PNG, JPG, JPEG, WEBP
            </span>
            <span>•</span>
            <span>Max 20MB</span>
            <span>•</span>
            <span>Client-side Preview</span>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Preset Realistic Scenarios for Academic Testing */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Or Try a Pre-Configured Test Scenario
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            1-click instant verification for academic examiners
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSample(scenario);
              }}
              disabled={disabled}
              className="group text-left p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between space-y-2.5 cursor-pointer disabled:opacity-50"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      scenario.category === 'Security Warning'
                        ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                        : scenario.category === 'Privacy Leak'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        : scenario.category === 'Phishing Alert'
                        ? 'bg-orange-950/60 text-orange-300 border border-orange-500/30'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {scenario.category}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {scenario.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate max-w-[170px]">{scenario.filename}</span>
                <span className="font-semibold text-cyan-400 group-hover:underline">Load Scenario →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
