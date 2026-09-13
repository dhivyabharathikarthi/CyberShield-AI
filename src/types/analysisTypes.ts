export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BoundingBox {
  x: number; // percentage 0-100 (left)
  y: number; // percentage 0-100 (top)
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label?: string;
  isManual?: boolean;
}

export interface SecurityWarning {
  id: string;
  category: string;
  warningTitle: string;
  warningText: string;
  errorCode: string;
  technicalMeaning: string;
  simpleExplanation: string;
  possibleCauses: string[];
  recommendedActions: string[];
  avoidActions: string[];
  confidence: number;
  isUnknownOrUnclear: boolean;
}

export interface PrivacyFinding {
  id: string;
  type: string;
  maskedValue: string;
  risk: RiskLevel;
  reason: string;
  recommendedAction: string;
  boundingBox: BoundingBox;
  confidence: number;
  enabledForRedaction?: boolean;
}

export interface AcademicFramework {
  problem: string;
  fieldObservation: string;
  rootCause: string;
  aiIdeation: string;
  solutionSelection: string;
  technicalImplementation: string;
  testingValidation: string;
}

export interface AnalysisReport {
  analysisStatus: 'success' | 'warning' | 'error';
  securityRisk: RiskLevel;
  privacyRisk: RiskLevel;
  overallRisk: RiskLevel;
  summary: string;
  generalRecommendation: string;
  securityWarnings: SecurityWarning[];
  privacyFindings: PrivacyFinding[];
  analyzedAt: string;
  imageMeta?: {
    name: string;
    sizeBytes: number;
    mimeType: string;
    width?: number;
    height?: number;
  };
  academicContext?: AcademicFramework;
}

export type RedactionMode = 'blackout' | 'blur' | 'pixelate';
