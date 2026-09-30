// MetroLab — Calculation Engine
// Deterministic, testable, auditable calculation utilities.
// Business logic is separated from UI components.
//
// IMPORTANT: Regulatory thresholds and acceptance criteria are maintained
// as versioned configuration, NOT hard-coded. Where OIML R76 rules are
// referenced, they are marked with validation_status.

import type { AccuracyClass, ComplianceStatus, TestObservation } from '@/types';

// ============================================================
// Types
// ============================================================

export interface CalculationInput {
  observations: TestObservation[];
  scaleInterval: number; // e (verification scale interval)
  accuracyClass: AccuracyClass;
  maxCapacity: number;
  minCapacity: number;
  testType: string;
}

export interface CalculationOutput {
  calculationType: string;
  inputs: Record<string, unknown>;
  resultValue: number | null;
  resultUnit: string;
  details: string;
  isValid: boolean;
  errors: string[];
}

export interface ComplianceEvaluation {
  testId: string;
  requirementId: string | null;
  observedValue: number;
  permissibleLimit: number;
  deviation: number;
  status: ComplianceStatus;
  explanation: string;
  rulesetVersion: string;
  validationStatus: 'verified' | 'unverified' | 'needs_review';
}

// ============================================================
// Maximum Permissible Error (MPE) Calculation
// Based on OIML R76 Table 3 — for initial verification
// STATUS: UNVERIFIED — Requires validation against official standard
// ============================================================

interface MpeRange {
  minIntervals: number;
  maxIntervals: number;
  mpeInE: number;
}

// NOTE: These MPE ranges are commonly referenced in OIML R76 literature
// but MUST be validated against the specific applicable edition before
// use in production. They are marked UNVERIFIED.
const MPE_RANGES_INITIAL: Record<AccuracyClass, MpeRange[]> = {
  'I': [
    { minIntervals: 0, maxIntervals: 50000, mpeInE: 0.5 },
    { minIntervals: 50001, maxIntervals: 200000, mpeInE: 1.0 },
  ],
  'II': [
    { minIntervals: 0, maxIntervals: 5000, mpeInE: 0.5 },
    { minIntervals: 5001, maxIntervals: 20000, mpeInE: 1.0 },
    { minIntervals: 20001, maxIntervals: 100000, mpeInE: 1.5 },
  ],
  'III': [
    { minIntervals: 0, maxIntervals: 500, mpeInE: 0.5 },
    { minIntervals: 501, maxIntervals: 2000, mpeInE: 1.0 },
    { minIntervals: 2001, maxIntervals: 10000, mpeInE: 1.5 },
  ],
  'IIII': [
    { minIntervals: 0, maxIntervals: 50, mpeInE: 0.5 },
    { minIntervals: 51, maxIntervals: 200, mpeInE: 1.0 },
    { minIntervals: 201, maxIntervals: 1000, mpeInE: 1.5 },
  ],
};

/**
 * Calculate the Maximum Permissible Error (MPE) for a given load.
 * 
 * STATUS: UNVERIFIED — Based on commonly referenced OIML R76 Table 3.
 * Must be validated against the applicable official standard edition.
 * 
 * @param loadValue - The applied load value
 * @param scaleInterval - The verification scale interval (e)
 * @param accuracyClass - The accuracy class of the instrument
 * @returns MPE in the same unit as the load, or null if cannot be calculated
 */
export function calculateMPE(
  loadValue: number,
  scaleInterval: number,
  accuracyClass: AccuracyClass,
): number | null {
  if (scaleInterval <= 0 || loadValue < 0) return null;

  const numberOfIntervals = Math.round(loadValue / scaleInterval);
  const ranges = MPE_RANGES_INITIAL[accuracyClass];

  if (!ranges) return null;

  for (const range of ranges) {
    if (numberOfIntervals >= range.minIntervals && numberOfIntervals <= range.maxIntervals) {
      return range.mpeInE * scaleInterval;
    }
  }

  // If beyond defined ranges, use the last range's MPE
  const lastRange = ranges[ranges.length - 1];
  return lastRange.mpeInE * scaleInterval;
}

/**
 * Calculate the error of indication.
 * Error = Indication - Applied Load (reference mass value)
 */
export function calculateError(indication: number, appliedLoad: number): number {
  return Number((indication - appliedLoad).toFixed(10));
}

// ============================================================
// Repeatability Calculation
// ============================================================

export interface RepeatabilityResult {
  loadValue: number;
  unit: string;
  indications: number[];
  maxIndication: number;
  minIndication: number;
  range: number;
  mean: number;
  mpe: number | null;
  status: ComplianceStatus;
  explanation: string;
}

/**
 * Calculate repeatability for a set of repeated weighings at the same load.
 * 
 * The range (max - min) of indications must not exceed the absolute value
 * of the maximum permissible error for the applied load.
 * 
 * STATUS: UNVERIFIED — Acceptance criterion requires validation.
 */
export function calculateRepeatability(
  observations: TestObservation[],
  scaleInterval: number,
  accuracyClass: AccuracyClass,
): RepeatabilityResult[] {
  // Group observations by nominal value
  const grouped = new Map<number, TestObservation[]>();
  for (const obs of observations) {
    if (obs.nominal_value === null || obs.indication === null) continue;
    const key = obs.nominal_value;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(obs);
  }

  const results: RepeatabilityResult[] = [];

  for (const [loadValue, obs] of grouped) {
    const indications = obs.map(o => o.indication!);
    const maxIndication = Math.max(...indications);
    const minIndication = Math.min(...indications);
    const range = Number((maxIndication - minIndication).toFixed(10));
    const mean = Number((indications.reduce((a, b) => a + b, 0) / indications.length).toFixed(10));
    const mpe = calculateMPE(loadValue, scaleInterval, accuracyClass);

    let status: ComplianceStatus = 'PENDING';
    let explanation = '';

    if (mpe === null) {
      status = 'RULE_NOT_CONFIGURED';
      explanation = 'Unable to determine MPE for this load. Rule configuration required.';
    } else if (range <= Math.abs(mpe)) {
      status = 'PASS';
      explanation = `Range of indications (${range} ${obs[0].unit}) ≤ MPE (${Math.abs(mpe)} ${obs[0].unit}). PASS.`;
    } else {
      status = 'FAIL';
      explanation = `Range of indications (${range} ${obs[0].unit}) > MPE (${Math.abs(mpe)} ${obs[0].unit}). FAIL.`;
    }

    results.push({
      loadValue,
      unit: obs[0].unit,
      indications,
      maxIndication,
      minIndication,
      range,
      mean,
      mpe,
      status,
      explanation,
    });
  }

  return results;
}

// ============================================================
// Eccentricity Calculation
// ============================================================

export interface EccentricityResult {
  position: string;
  indication: number;
  referenceValue: number;
  error: number;
  mpe: number | null;
  status: ComplianceStatus;
  explanation: string;
}

/**
 * Calculate eccentricity test results.
 * 
 * The error at each eccentric position must not exceed the MPE
 * for the applied load.
 * 
 * STATUS: UNVERIFIED — Acceptance criterion requires validation.
 */
export function calculateEccentricity(
  observations: { position: string; indication: number; referenceValue: number }[],
  scaleInterval: number,
  accuracyClass: AccuracyClass,
): EccentricityResult[] {
  return observations.map(obs => {
    const error = calculateError(obs.indication, obs.referenceValue);
    const mpe = calculateMPE(obs.referenceValue, scaleInterval, accuracyClass);

    let status: ComplianceStatus = 'PENDING';
    let explanation = '';

    if (mpe === null) {
      status = 'RULE_NOT_CONFIGURED';
      explanation = 'Unable to determine MPE. Rule configuration required.';
    } else if (Math.abs(error) <= Math.abs(mpe)) {
      status = 'PASS';
      explanation = `Error at position ${obs.position} (${error}) ≤ MPE (±${Math.abs(mpe)}). PASS.`;
    } else {
      status = 'FAIL';
      explanation = `Error at position ${obs.position} (${error}) > MPE (±${Math.abs(mpe)}). FAIL.`;
    }

    return {
      position: obs.position,
      indication: obs.indication,
      referenceValue: obs.referenceValue,
      error,
      mpe,
      status,
      explanation,
    };
  });
}

// ============================================================
// Weighing Performance Calculation
// ============================================================

export interface WeighingPerformanceResult {
  testPoint: number;
  indication: number;
  error: number;
  mpe: number | null;
  correctedError: number | null;
  status: ComplianceStatus;
  explanation: string;
}

/**
 * Calculate weighing performance test results.
 * 
 * The error at each test point must not exceed the MPE.
 * 
 * STATUS: UNVERIFIED — Acceptance criterion requires validation.
 */
export function calculateWeighingPerformance(
  observations: TestObservation[],
  scaleInterval: number,
  accuracyClass: AccuracyClass,
): WeighingPerformanceResult[] {
  return observations
    .filter(obs => obs.nominal_value !== null && obs.indication !== null)
    .map(obs => {
      const error = calculateError(obs.indication!, obs.nominal_value!);
      const mpe = calculateMPE(obs.nominal_value!, scaleInterval, accuracyClass);

      let status: ComplianceStatus = 'PENDING';
      let explanation = '';

      if (mpe === null) {
        status = 'RULE_NOT_CONFIGURED';
        explanation = 'Unable to determine MPE. Rule configuration required.';
      } else if (Math.abs(error) <= Math.abs(mpe)) {
        status = 'PASS';
        explanation = `Error (${error} ${obs.unit}) ≤ MPE (±${Math.abs(mpe)} ${obs.unit}) at ${obs.nominal_value} ${obs.unit}. PASS.`;
      } else {
        status = 'FAIL';
        explanation = `Error (${error} ${obs.unit}) > MPE (±${Math.abs(mpe)} ${obs.unit}) at ${obs.nominal_value} ${obs.unit}. FAIL.`;
      }

      return {
        testPoint: obs.nominal_value!,
        indication: obs.indication!,
        error,
        mpe,
        correctedError: null,
        status,
        explanation,
      };
    });
}

// ============================================================
// Overall Test Compliance
// ============================================================

/**
 * Determine the overall compliance status from individual results.
 */
export function determineOverallStatus(statuses: ComplianceStatus[]): ComplianceStatus {
  if (statuses.length === 0) return 'PENDING';
  if (statuses.some(s => s === 'FAIL')) return 'FAIL';
  if (statuses.some(s => s === 'RULE_NOT_CONFIGURED')) return 'RULE_NOT_CONFIGURED';
  if (statuses.some(s => s === 'WARNING')) return 'WARNING';
  if (statuses.some(s => s === 'PENDING')) return 'PENDING';
  if (statuses.every(s => s === 'NOT_APPLICABLE')) return 'NOT_APPLICABLE';
  if (statuses.every(s => s === 'PASS' || s === 'NOT_APPLICABLE')) return 'PASS';
  return 'PENDING';
}

// ============================================================
// Input Validation
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateObservationInput(
  indication: number | null | undefined,
  nominalValue: number | null | undefined,
  unit: string | null | undefined,
): ValidationResult {
  const errors: string[] = [];

  if (indication === null || indication === undefined) {
    errors.push('Indication value is required.');
  } else if (typeof indication !== 'number' || isNaN(indication)) {
    errors.push('Indication must be a valid number.');
  }

  if (nominalValue === null || nominalValue === undefined) {
    errors.push('Nominal/reference value is required.');
  } else if (typeof nominalValue !== 'number' || isNaN(nominalValue)) {
    errors.push('Nominal value must be a valid number.');
  } else if (nominalValue < 0) {
    errors.push('Nominal value cannot be negative.');
  }

  if (!unit || unit.trim() === '') {
    errors.push('Unit is required.');
  }

  return { isValid: errors.length === 0, errors };
}

// ============================================================
// Formatting Utilities
// ============================================================

/**
 * Format a number with appropriate precision for display.
 * Uses the scale interval to determine display resolution.
 */
export function formatMeasurement(value: number, scaleInterval: number): string {
  if (scaleInterval >= 1) return value.toFixed(0);
  const decimals = Math.max(0, -Math.floor(Math.log10(scaleInterval)));
  return value.toFixed(decimals);
}

/**
 * Get a human-readable label for a compliance status.
 */
export function getStatusLabel(status: ComplianceStatus): string {
  const labels: Record<ComplianceStatus, string> = {
    PASS: 'Pass',
    FAIL: 'Fail',
    WARNING: 'Warning',
    NOT_APPLICABLE: 'Not Applicable',
    PENDING: 'Pending',
    RULE_NOT_CONFIGURED: 'Rule Not Configured',
  };
  return labels[status] || status;
}
