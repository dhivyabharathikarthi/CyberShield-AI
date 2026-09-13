/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { ImagePreview } from './components/ImagePreview';
import { AnalysisProgress } from './components/AnalysisProgress';
import { RiskCard } from './components/RiskCard';
import { SecurityFindings } from './components/SecurityFindings';
import { PrivacyFindings } from './components/PrivacyFindings';
import { RecommendationCard } from './components/RecommendationCard';
import { TechnicalDetails } from './components/TechnicalDetails';
import { ProtectedImage } from './components/ProtectedImage';
import { AcademicFrameworkModal } from './components/AcademicFrameworkModal';
import { PrivacyNotice } from './components/PrivacyNotice';
import { Footer } from './components/Footer';
import { AnalysisReport, PrivacyFinding } from './types/analysisTypes';
import { analyzeScreenshotImage } from './services/analysisApi';
import { AlertCircle, ShieldCheck, Sparkles, RefreshCw, Lock } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isProtectMode, setIsProtectMode] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);

  // Handle image selection
  const handleImageSelected = (file: File | null, dataUrl: string, name: string) => {
    setSelectedFile(file);
    setImageDataUrl(dataUrl);
    setFileName(name);
    setAnalysisReport(null);
    setAnalysisError(null);
    setIsProtectMode(false);
  };

  // Trigger Gemini Analysis
  const handleAnalyzeScreenshot = async () => {
    if (!imageDataUrl) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const mimeType = selectedFile?.type || (imageDataUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png');
      const report = await analyzeScreenshotImage(imageDataUrl, mimeType, fileName);
      setAnalysisReport(report);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err?.message || 'Failed to analyze screenshot. Please check the network connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset workflow
  const handleReset = () => {
    setSelectedFile(null);
    setImageDataUrl(null);
    setFileName('');
    setAnalysisReport(null);
    setAnalysisError(null);
    setIsProtectMode(false);
  };

  // Toggle individual finding for redaction
  const handleToggleFindingRedaction = (findingId: string) => {
    if (!analysisReport) return;
    const updatedFindings = analysisReport.privacyFindings.map((f) => {
      if (f.id === findingId) {
        return { ...f, enabledForRedaction: f.enabledForRedaction === false ? true : false };
      }
      return f;
    });
    setAnalysisReport({ ...analysisReport, privacyFindings: updatedFindings });
  };

  // Toggle all findings
  const handleSelectAllForRedaction = (selectAll: boolean) => {
    if (!analysisReport) return;
    const updatedFindings = analysisReport.privacyFindings.map((f) => ({
      ...f,
      enabledForRedaction: selectAll
    }));
    setAnalysisReport({ ...analysisReport, privacyFindings: updatedFindings });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <Header onOpenAcademicModal={() => setIsAcademicModalOpen(true)} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Introduction Section */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multimodal Cybersecurity Guardian</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Understand Security Warnings &amp; Redact Sensitive Data
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Understand security warnings and protect sensitive information before sharing screenshots. Translates cryptographic browser alerts into plain language and shields credentials.
          </p>
        </section>

        {/* Primary Workspace View */}
        {isProtectMode && imageDataUrl && analysisReport ? (
          /* 1. Protected / Redaction View */
          <ProtectedImage
            originalImageSrc={imageDataUrl}
            originalFileName={fileName}
            findings={analysisReport.privacyFindings}
            onBackToReport={() => setIsProtectMode(false)}
          />
        ) : (
          /* 2. Upload / Preview / Report View */
          <div className="space-y-8">
            {!imageDataUrl ? (
              /* Step 1: Upload or Select Sample */
              <UploadPanel onImageSelected={handleImageSelected} disabled={isAnalyzing} />
            ) : (
              /* Step 2: Image Preview & Analysis Stage */
              <div className="space-y-8">
                <ImagePreview
                  imageSrc={imageDataUrl}
                  fileName={fileName}
                  fileSize={selectedFile?.size}
                  report={analysisReport}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyzeScreenshot}
                  onReset={handleReset}
                  onGoToProtect={() => setIsProtectMode(true)}
                />

                {/* Analysis Loading Indicator */}
                {isAnalyzing && <AnalysisProgress />}

                {/* Error Banner */}
                {analysisError && (
                  <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start space-x-3 shadow-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-red-300">Analysis Notice</span>
                      <p>{analysisError}</p>
                      <button
                        onClick={handleAnalyzeScreenshot}
                        className="mt-2 text-xs font-bold text-red-300 hover:text-white underline cursor-pointer"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Unified Security & Privacy Report */}
                {analysisReport && !isAnalyzing && (
                  <div className="space-y-8 pt-4 border-t border-slate-800">
                    {/* Overall Risk Card */}
                    <RiskCard
                      overallRisk={analysisReport.overallRisk}
                      securityRisk={analysisReport.securityRisk}
                      privacyRisk={analysisReport.privacyRisk}
                      summary={analysisReport.summary}
                    />

                    {/* Recommendation Callout */}
                    <RecommendationCard
                      generalRecommendation={analysisReport.generalRecommendation}
                      overallRisk={analysisReport.overallRisk}
                      hasPrivacyFindings={analysisReport.privacyFindings.length > 0}
                      onProtectScreenshot={() => setIsProtectMode(true)}
                    />

                    {/* Two Core Functions: Security Translator + Privacy Guardian */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Core Function 1: Security Warning Translator */}
                      <SecurityFindings warnings={analysisReport.securityWarnings} />

                      {/* Core Function 2: Screenshot Privacy Guardian */}
                      <PrivacyFindings
                        findings={analysisReport.privacyFindings}
                        onToggleFindingRedaction={handleToggleFindingRedaction}
                        onSelectAllForRedaction={handleSelectAllForRedaction}
                      />
                    </div>

                    {/* Technical Breakdown & Raw JSON */}
                    <TechnicalDetails report={analysisReport} />

                    {/* Floating Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Unified Security &amp; Privacy Report generated successfully.</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setIsProtectMode(true)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Protect Screenshot</span>
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Analyze Another</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Privacy Notice */}
            <PrivacyNotice />
          </div>
        )}
      </main>

      {/* Academic Methodology Modal */}
      <AcademicFrameworkModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenAcademicModal={() => setIsAcademicModalOpen(true)} />
    </div>
  );
}
