import { AnalysisReport, RiskLevel } from '../types/analysisTypes';

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No image file was selected.' };
  }

  const normalizedType = file.type.toLowerCase();
  const isTypeAllowed = ALLOWED_IMAGE_TYPES.includes(normalizedType) ||
    /\.(png|jpe?g|webp)$/i.test(file.name);

  if (!isTypeAllowed) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a PNG, JPEG, or WEBP screenshot.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image file is too large (${sizeMb}MB). Maximum allowed upload size is 20MB.`
    };
  }

  return { valid: true };
}

export function sanitizeRiskLevel(rawRisk: unknown, fallback: RiskLevel = 'LOW'): RiskLevel {
  if (typeof rawRisk !== 'string') return fallback;
  const upper = rawRisk.trim().toUpperCase();
  if (upper === 'CRITICAL' || upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
    return upper as RiskLevel;
  }
  return fallback;
}

export function sanitizeAnalysisResponse(data: any): AnalysisReport {
  if (!data || typeof data !== 'object') {
    throw new Error('Received an empty or malformed response from the analysis engine.');
  }

  const securityWarnings = Array.isArray(data.securityWarnings)
    ? data.securityWarnings.map((w: any, index: number) => ({
        id: w.id || `sec-${index}-${Date.now()}`,
        category: String(w.category || 'General Security Warning'),
        warningTitle: String(w.warningTitle || w.category || 'Security Warning Notice'),
        warningText: String(w.warningText || ''),
        errorCode: String(w.errorCode || ''),
        technicalMeaning: String(w.technicalMeaning || 'Technical context unavailable.'),
        simpleExplanation: String(w.simpleExplanation || 'No simple explanation provided.'),
        possibleCauses: Array.isArray(w.possibleCauses) ? w.possibleCauses.map(String) : [],
        recommendedActions: Array.isArray(w.recommendedActions) ? w.recommendedActions.map(String) : ['Exercise caution and verify identity.'],
        avoidActions: Array.isArray(w.avoidActions) ? w.avoidActions.map(String) : ['Do not enter passwords or payment details.'],
        confidence: typeof w.confidence === 'number' ? Math.min(100, Math.max(0, w.confidence)) : 85,
        isUnknownOrUnclear: Boolean(w.isUnknownOrUnclear || (w.warningTitle && /unknown|unclear/i.test(w.warningTitle)))
      }))
    : [];

  const privacyFindings = Array.isArray(data.privacyFindings)
    ? data.privacyFindings.map((p: any, index: number) => {
        const rawBox = p.boundingBox || {};
        // Bounding box percentages (0-100)
        let x = typeof rawBox.x === 'number' ? rawBox.x : 10;
        let y = typeof rawBox.y === 'number' ? rawBox.y : 10;
        let width = typeof rawBox.width === 'number' ? rawBox.width : 30;
        let height = typeof rawBox.height === 'number' ? rawBox.height : 8;

        // If coordinates are normalized 0-1 instead of 0-100, scale them
        if (x <= 1 && y <= 1 && width <= 1 && height <= 1 && (width > 0 || height > 0)) {
          x = x * 100;
          y = y * 100;
          width = width * 100;
          height = height * 100;
        }

        // Clamp values
        x = Math.max(0, Math.min(95, x));
        y = Math.max(0, Math.min(95, y));
        width = Math.max(2, Math.min(100 - x, width));
        height = Math.max(2, Math.min(100 - y, height));

        return {
          id: p.id || `priv-${index}-${Date.now()}`,
          type: String(p.type || 'Sensitive Information'),
          maskedValue: String(p.maskedValue || '[REDACTED]'),
          risk: sanitizeRiskLevel(p.risk, 'MEDIUM'),
          reason: String(p.reason || 'This information could expose personal or access credentials if shared.'),
          recommendedAction: String(p.recommendedAction || 'Redact or blur this information prior to distributing this screenshot.'),
          boundingBox: { x, y, width, height, label: String(p.type || 'Sensitive Data') },
          confidence: typeof p.confidence === 'number' ? Math.min(100, Math.max(0, p.confidence)) : 85,
          enabledForRedaction: true
        };
      })
    : [];

  return {
    analysisStatus: (data.analysisStatus === 'warning' || data.analysisStatus === 'error') ? data.analysisStatus : 'success',
    securityRisk: sanitizeRiskLevel(data.securityRisk, securityWarnings.length > 0 ? 'HIGH' : 'LOW'),
    privacyRisk: sanitizeRiskLevel(data.privacyRisk, privacyFindings.length > 0 ? 'MEDIUM' : 'LOW'),
    overallRisk: sanitizeRiskLevel(data.overallRisk, 'LOW'),
    summary: String(data.summary || 'Security and privacy analysis completed.'),
    generalRecommendation: String(data.generalRecommendation || 'Review the findings below before sharing or taking action.'),
    securityWarnings,
    privacyFindings,
    analyzedAt: new Date().toISOString()
  };
}
