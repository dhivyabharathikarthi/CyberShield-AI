import { RiskLevel } from '../types/analysisTypes';

export interface RiskConfig {
  level: RiskLevel;
  label: string;
  badgeClass: string;
  bgCardClass: string;
  borderClass: string;
  textClass: string;
  dotColorClass: string;
  description: string;
  iconName: 'ShieldAlert' | 'AlertTriangle' | 'AlertCircle' | 'ShieldCheck';
}

export const RISK_LEVELS: Record<RiskLevel, RiskConfig> = {
  CRITICAL: {
    level: 'CRITICAL',
    label: 'Critical Risk',
    badgeClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
    bgCardClass: 'bg-gradient-to-br from-red-950/40 via-red-900/20 to-slate-900/60 border-red-500/40 shadow-red-950/30',
    borderClass: 'border-red-500/50',
    textClass: 'text-red-400',
    dotColorClass: 'bg-red-500',
    description: 'Immediate privacy or security exposure (e.g., active secret keys, authentication tokens, credentials, or malicious deception warnings).',
    iconName: 'ShieldAlert'
  },
  HIGH: {
    level: 'HIGH',
    label: 'High Risk',
    badgeClass: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    bgCardClass: 'bg-gradient-to-br from-orange-950/40 via-orange-900/20 to-slate-900/60 border-orange-500/40 shadow-orange-950/30',
    borderClass: 'border-orange-500/50',
    textClass: 'text-orange-400',
    dotColorClass: 'bg-orange-500',
    description: 'Severe security warning (TLS/SSL certificate mismatch, dangerous site) or multiple identifiable personal data items.',
    iconName: 'AlertTriangle'
  },
  MEDIUM: {
    level: 'MEDIUM',
    label: 'Medium Risk',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    bgCardClass: 'bg-gradient-to-br from-amber-950/30 via-amber-900/15 to-slate-900/60 border-amber-500/30 shadow-amber-950/20',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    dotColorClass: 'bg-amber-500',
    description: 'Potential personal information (email, phone, student ID) or advisory warning requiring user verification.',
    iconName: 'AlertCircle'
  },
  LOW: {
    level: 'LOW',
    label: 'Low Risk',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    bgCardClass: 'bg-gradient-to-br from-emerald-950/30 via-emerald-900/15 to-slate-900/60 border-emerald-500/30 shadow-emerald-950/20',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    dotColorClass: 'bg-emerald-500',
    description: 'No significant sensitive information or dangerous cybersecurity warning detected in the visible screenshot.',
    iconName: 'ShieldCheck'
  }
};

export function getRiskConfig(level: RiskLevel): RiskConfig {
  return RISK_LEVELS[level] || RISK_LEVELS.LOW;
}

export function calculateCompositeRisk(
  securityWarningsCount: number,
  hasCriticalWarning: boolean,
  privacyFindingsCount: number,
  hasCriticalSecrets: boolean
): { security: RiskLevel; privacy: RiskLevel; overall: RiskLevel } {
  // Security calculation
  let security: RiskLevel = 'LOW';
  if (hasCriticalWarning) {
    security = 'CRITICAL';
  } else if (securityWarningsCount >= 2) {
    security = 'HIGH';
  } else if (securityWarningsCount === 1) {
    security = 'MEDIUM';
  }

  // Privacy calculation
  let privacy: RiskLevel = 'LOW';
  if (hasCriticalSecrets) {
    privacy = 'CRITICAL';
  } else if (privacyFindingsCount >= 3) {
    privacy = 'HIGH';
  } else if (privacyFindingsCount >= 1) {
    privacy = 'MEDIUM';
  }

  // Overall calculation
  let overall: RiskLevel = 'LOW';
  if (security === 'CRITICAL' || privacy === 'CRITICAL') {
    overall = 'CRITICAL';
  } else if (security === 'HIGH' || privacy === 'HIGH') {
    overall = 'HIGH';
  } else if (security === 'MEDIUM' || privacy === 'MEDIUM') {
    overall = 'MEDIUM';
  }

  return { security, privacy, overall };
}
