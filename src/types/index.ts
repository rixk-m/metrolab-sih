// MetroLab — Core Domain Types
// These types represent the core entities in the MetroLab platform.
// They are derived from the Product Requirements and Database Schema.

// ============================================================
// Enums & Constants
// ============================================================

export type UserRole = 'administrator' | 'evaluator' | 'reviewer' | 'approving_officer' | 'viewer';

export type EvaluationStatus =
  | 'draft'
  | 'in_progress'
  | 'awaiting_review'
  | 'changes_requested'
  | 'approved'
  | 'signed'
  | 'completed'
  | 'archived';

export type TestStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type ComplianceStatus =
  | 'PASS'
  | 'FAIL'
  | 'WARNING'
  | 'NOT_APPLICABLE'
  | 'PENDING'
  | 'RULE_NOT_CONFIGURED';

export type AccuracyClass = 'I' | 'II' | 'III' | 'IIII';

export type InstrumentStatus = 'active' | 'archived' | 'under_evaluation';

// ============================================================
// User & Authentication
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Laboratory
// ============================================================

export interface Laboratory {
  id: string;
  name: string;
  address: string;
  accreditation_number: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Manufacturer
// ============================================================

export interface Manufacturer {
  id: string;
  name: string;
  country: string | null;
  address: string | null;
  contact_info: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Instrument
// ============================================================

export interface Instrument {
  id: string;
  manufacturer_id: string;
  manufacturer?: Manufacturer;
  applicant_name: string | null;
  applicant_address: string | null;
  model_name: string;
  instrument_type: string;
  serial_number: string;
  accuracy_class: AccuracyClass;
  max_capacity: number;
  min_capacity: number;
  scale_interval: number;
  verification_scale_interval: number | null;
  unit: string;
  num_intervals: number | null;
  display_type: string | null;
  power_supply: string | null;
  software_version: string | null;
  description: string | null;
  status: InstrumentStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Evaluation
// ============================================================

export interface Evaluation {
  id: string;
  evaluation_number: string;
  instrument_id: string;
  instrument?: Instrument;
  laboratory_id: string | null;
  laboratory?: Laboratory;
  evaluator_id: string;
  evaluator?: User;
  reviewer_id: string | null;
  reviewer?: User;
  approver_id: string | null;
  approver?: User;
  status: EvaluationStatus;
  evaluation_type: string;
  temperature: number | null;
  humidity: number | null;
  barometric_pressure: number | null;
  environmental_notes: string | null;
  reference_standards: string | null;
  applicable_ruleset_id: string | null;
  applicable_ruleset?: Ruleset;
  notes: string | null;
  started_at: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Test Definitions & Categories
// ============================================================

export interface TestCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface TestDefinition {
  id: string;
  category_id: string;
  category?: TestCategory;
  name: string;
  code: string;
  description: string | null;
  standard_reference: string | null;
  procedure_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Evaluation Tests & Observations
// ============================================================

export interface EvaluationTest {
  id: string;
  evaluation_id: string;
  test_definition_id: string;
  test_definition?: TestDefinition;
  status: TestStatus;
  is_applicable: boolean;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestObservation {
  id: string;
  evaluation_test_id: string;
  trial_number: number;
  nominal_value: number | null;
  applied_load: number | null;
  indication: number | null;
  error: number | null;
  permissible_error: number | null;
  unit: string;
  notes: string | null;
  recorded_by: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Calculation & Compliance Results
// ============================================================

export interface CalculationResult {
  id: string;
  evaluation_test_id: string;
  calculation_type: string;
  inputs: Record<string, unknown>;
  formula_id: string | null;
  result_value: number | null;
  result_unit: string | null;
  metadata: Record<string, unknown>;
  calculated_at: string;
  calculated_by: string | null;
  created_at: string;
}

export interface ComplianceResult {
  id: string;
  evaluation_test_id: string;
  requirement_id: string | null;
  ruleset_version_id: string | null;
  observed_value: number | null;
  permissible_limit: number | null;
  deviation: number | null;
  status: ComplianceStatus;
  explanation: string | null;
  metadata: Record<string, unknown>;
  evaluated_at: string;
  created_at: string;
}

// ============================================================
// Ruleset & Compliance Configuration
// ============================================================

export interface Ruleset {
  id: string;
  name: string;
  standard: string;
  version: string;
  description: string | null;
  effective_date: string | null;
  retired_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RulesetRequirement {
  id: string;
  ruleset_id: string;
  clause_reference: string | null;
  requirement_name: string;
  description: string | null;
  test_definition_id: string | null;
  parameter: string | null;
  operator: string | null;
  threshold_value: number | null;
  threshold_unit: string | null;
  formula: string | null;
  applicability_condition: string | null;
  validation_status: 'verified' | 'unverified' | 'needs_review';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Reports
// ============================================================

export interface Report {
  id: string;
  report_number: string;
  evaluation_id: string;
  evaluation?: Evaluation;
  version: number;
  status: 'draft' | 'generated' | 'approved' | 'archived';
  generated_by: string | null;
  approved_by: string | null;
  content_snapshot: Record<string, unknown>;
  file_path: string | null;
  generated_at: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Evidence / Attachments
// ============================================================

export interface Attachment {
  id: string;
  entity_type: 'evaluation' | 'instrument' | 'test' | 'report';
  entity_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  description: string | null;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
}

// ============================================================
// Audit Log
// ============================================================

export interface AuditLog {
  id: string;
  user_id: string;
  user?: User;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// ============================================================
// Dashboard & Analytics
// ============================================================

export interface DashboardStats {
  total_instruments: number;
  active_evaluations: number;
  completed_evaluations: number;
  pending_reviews: number;
  reports_generated: number;
  compliance_rate: number;
  passed_tests: number;
  failed_tests: number;
}

export interface RecentEvaluation {
  id: string;
  evaluation_number: string;
  instrument_name: string;
  instrument_type: string;
  status: EvaluationStatus;
  date: string;
}
