// MetroLab — Demo Data Service
// Provides realistic demo data when NEXT_PUBLIC_DEMO_MODE is true.
// This replaces Supabase calls during development.

import type {
  User,
  UserRole,
  Manufacturer,
  Instrument,
  Evaluation,
  TestCategory,
  TestDefinition,
  EvaluationTest,
  TestObservation,
  ComplianceResult,
  Report,
  AuditLog,
  DashboardStats,
  RecentEvaluation,
  Ruleset,
  RulesetRequirement,
  Laboratory,
} from '@/types';

// ============================================================
// Demo Users
// ============================================================

export const demoUsers: User[] = [
  {
    id: 'usr-001',
    email: 'rishikesh.admin@metrolab.in',
    full_name: 'Rishikesh Sharma',
    role: 'administrator',
    organization: 'Central Metrology Laboratory',
    avatar_url: null,
    is_active: true,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-09-20T10:30:00Z',
  },
  {
    id: 'usr-002',
    email: 'priya.evaluator@metrolab.in',
    full_name: 'Priya Nair',
    role: 'evaluator',
    organization: 'Central Metrology Laboratory',
    avatar_url: null,
    is_active: true,
    created_at: '2026-08-05T09:00:00Z',
    updated_at: '2026-09-18T14:20:00Z',
  },
  {
    id: 'usr-003',
    email: 'arjun.reviewer@metrolab.in',
    full_name: 'Arjun Mehta',
    role: 'reviewer',
    organization: 'Central Metrology Laboratory',
    avatar_url: null,
    is_active: true,
    created_at: '2026-08-10T09:00:00Z',
    updated_at: '2026-09-15T11:00:00Z',
  },
  {
    id: 'usr-004',
    email: 'meena.approver@metrolab.in',
    full_name: 'Dr. Meena Iyer',
    role: 'approving_officer',
    organization: 'Central Metrology Laboratory',
    avatar_url: null,
    is_active: true,
    created_at: '2026-08-12T09:00:00Z',
    updated_at: '2026-09-22T16:45:00Z',
  },
  {
    id: 'usr-005',
    email: 'vikram.viewer@metrolab.in',
    full_name: 'Vikram Patel',
    role: 'viewer',
    organization: 'State Weights & Measures',
    avatar_url: null,
    is_active: true,
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-09-25T08:00:00Z',
  },
];

// ============================================================
// Demo Laboratory
// ============================================================

export const demoLaboratory: Laboratory = {
  id: 'lab-001',
  name: 'Central Metrology Laboratory',
  address: 'Plot No. 12, Industrial Area, Sector 5, New Delhi – 110001',
  accreditation_number: 'CML/NABL/2026/0142',
  contact_person: 'Rishikesh Sharma',
  contact_email: 'lab@metrolab.in',
  contact_phone: '+91-11-2345-6789',
  created_at: '2026-07-15T09:00:00Z',
  updated_at: '2026-09-20T10:30:00Z',
};

// ============================================================
// Demo Manufacturers
// ============================================================

export const demoManufacturers: Manufacturer[] = [
  {
    id: 'mfr-001',
    name: 'Essae Digitronics Pvt. Ltd.',
    country: 'India',
    address: 'Bengaluru, Karnataka',
    contact_info: 'info@essae.in',
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'mfr-002',
    name: 'Mettler-Toledo India Pvt. Ltd.',
    country: 'India',
    address: 'Mumbai, Maharashtra',
    contact_info: 'sales@mt.com',
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'mfr-003',
    name: 'Sartorius India Pvt. Ltd.',
    country: 'India',
    address: 'Bengaluru, Karnataka',
    contact_info: 'contact@sartorius.com',
    created_at: '2026-08-15T09:00:00Z',
    updated_at: '2026-08-15T09:00:00Z',
  },
  {
    id: 'mfr-004',
    name: 'Contech Instruments Ltd.',
    country: 'India',
    address: 'Navi Mumbai, Maharashtra',
    contact_info: 'info@contechinstruments.com',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-09-01T09:00:00Z',
  },
];

// ============================================================
// Demo Instruments
// ============================================================

export const demoInstruments: Instrument[] = [
  {
    id: 'ins-001',
    manufacturer_id: 'mfr-001',
    applicant_name: 'National Trading Corporation',
    applicant_address: 'Connaught Place, New Delhi',
    model_name: 'PLT-300',
    instrument_type: 'Electronic Platform Scale',
    serial_number: 'ESS-PLT-2026-04521',
    accuracy_class: 'III',
    max_capacity: 300,
    min_capacity: 2,
    scale_interval: 0.1,
    verification_scale_interval: 0.1,
    unit: 'kg',
    num_intervals: 3000,
    display_type: 'LCD with backlight',
    power_supply: 'AC 230V / Rechargeable battery',
    software_version: 'v3.2.1',
    description: 'Stainless steel platform electronic scale for commercial trade',
    status: 'active',
    created_by: 'usr-002',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-25T14:30:00Z',
  },
  {
    id: 'ins-002',
    manufacturer_id: 'mfr-002',
    applicant_name: 'Metro Pharma Ltd.',
    applicant_address: 'Andheri East, Mumbai',
    model_name: 'BR-01',
    instrument_type: 'Bench Scale',
    serial_number: 'MT-BR-2026-11034',
    accuracy_class: 'II',
    max_capacity: 30,
    min_capacity: 0.2,
    scale_interval: 0.01,
    verification_scale_interval: 0.01,
    unit: 'kg',
    num_intervals: 3000,
    display_type: 'LED',
    power_supply: 'AC 230V',
    software_version: 'v5.0.2',
    description: 'High precision bench scale for pharmaceutical applications',
    status: 'under_evaluation',
    created_by: 'usr-002',
    created_at: '2026-09-12T11:00:00Z',
    updated_at: '2026-09-24T16:00:00Z',
  },
  {
    id: 'ins-003',
    manufacturer_id: 'mfr-004',
    applicant_name: 'Bharat Logistics Pvt. Ltd.',
    applicant_address: 'JNPT, Navi Mumbai',
    model_name: 'WB-60T',
    instrument_type: 'Weighbridge',
    serial_number: 'CT-WB-2026-00187',
    accuracy_class: 'III',
    max_capacity: 60000,
    min_capacity: 400,
    scale_interval: 20,
    verification_scale_interval: 20,
    unit: 'kg',
    num_intervals: 3000,
    display_type: 'LCD remote indicator',
    power_supply: 'AC 415V three-phase',
    software_version: 'v2.1.0',
    description: '60-tonne pit-type weighbridge for vehicle weighment',
    status: 'active',
    created_by: 'usr-002',
    created_at: '2026-09-05T09:00:00Z',
    updated_at: '2026-09-22T11:30:00Z',
  },
  {
    id: 'ins-004',
    manufacturer_id: 'mfr-003',
    applicant_name: 'Fresh Mart Retail India',
    applicant_address: 'Whitefield, Bengaluru',
    model_name: 'RS-15',
    instrument_type: 'Retail Scale',
    serial_number: 'SAR-RS-2026-07892',
    accuracy_class: 'III',
    max_capacity: 15,
    min_capacity: 0.04,
    scale_interval: 0.005,
    verification_scale_interval: 0.005,
    unit: 'kg',
    num_intervals: 3000,
    display_type: 'Dual LCD (operator + customer)',
    power_supply: 'AC 230V / Battery',
    software_version: 'v4.0.0',
    description: 'Retail counter scale with customer-facing display',
    status: 'active',
    created_by: 'usr-002',
    created_at: '2026-09-15T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
];

// ============================================================
// Demo Ruleset
// ============================================================

export const demoRuleset: Ruleset = {
  id: 'rs-001',
  name: 'OIML R76-1 (2006)',
  standard: 'OIML R76',
  version: '1-2006',
  description: 'Non-automatic weighing instruments — Part 1: Metrological and technical requirements — Tests',
  effective_date: '2006-01-01',
  retired_date: null,
  is_active: true,
  created_at: '2026-08-01T09:00:00Z',
  updated_at: '2026-08-01T09:00:00Z',
};

export const demoRulesetRequirements: RulesetRequirement[] = [
  {
    id: 'rr-001',
    ruleset_id: 'rs-001',
    clause_reference: 'A.4.4',
    requirement_name: 'Repeatability (Max Load)',
    description: 'The difference between results of weighings shall not exceed the absolute value of the maximum permissible error (mpe) for the applied load.',
    test_definition_id: 'td-001',
    parameter: 'range_of_indications',
    operator: '<=',
    threshold_value: null,
    threshold_unit: 'e',
    formula: 'max(indications) - min(indications) <= mpe',
    applicability_condition: null,
    validation_status: 'unverified',
    sort_order: 1,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'rr-002',
    ruleset_id: 'rs-001',
    clause_reference: 'A.4.5',
    requirement_name: 'Eccentricity Error',
    description: 'The error of indication for each eccentric position shall not exceed the maximum permissible error (mpe) for the applied load.',
    test_definition_id: 'td-002',
    parameter: 'eccentricity_error',
    operator: '<=',
    threshold_value: null,
    threshold_unit: 'e',
    formula: '|indication - reference| <= mpe',
    applicability_condition: null,
    validation_status: 'unverified',
    sort_order: 2,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'rr-003',
    ruleset_id: 'rs-001',
    clause_reference: 'A.4.6',
    requirement_name: 'Weighing Performance (Increasing Load)',
    description: 'The error of indication at each test point shall not exceed the maximum permissible error (mpe) for the applied load.',
    test_definition_id: 'td-003',
    parameter: 'indication_error',
    operator: '<=',
    threshold_value: null,
    threshold_unit: 'e',
    formula: '|error| <= mpe',
    applicability_condition: 'increasing_load',
    validation_status: 'unverified',
    sort_order: 3,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
];

// ============================================================
// Demo Test Definitions
// ============================================================

export const demoTestCategories: TestCategory[] = [
  { id: 'tc-001', name: 'Metrological Tests', description: 'Core metrological performance tests', sort_order: 1, created_at: '2026-08-01T09:00:00Z' },
  { id: 'tc-002', name: 'Functional Tests', description: 'Functional device operation tests', sort_order: 2, created_at: '2026-08-01T09:00:00Z' },
];

export const demoTestDefinitions: TestDefinition[] = [
  {
    id: 'td-001',
    category_id: 'tc-001',
    name: 'Repeatability Test',
    code: 'RPT',
    description: 'Determine the ability of the instrument to provide consistent results under repeated identical loading conditions.',
    standard_reference: 'OIML R76 A.4.4',
    procedure_description: 'Load the instrument to approximately 50% Max and Max capacity. Repeat each load a minimum of 3 times (or as required). Record indications.',
    is_active: true,
    sort_order: 1,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'td-002',
    category_id: 'tc-001',
    name: 'Eccentric Loading Test',
    code: 'ECC',
    description: 'Determine the effect of off-center loading on the accuracy of the instrument.',
    standard_reference: 'OIML R76 A.4.5',
    procedure_description: 'Place a test load equal to approximately 1/3 Max at the center and at each eccentric position. Record indications at each position.',
    is_active: true,
    sort_order: 2,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'td-003',
    category_id: 'tc-001',
    name: 'Weighing Performance Test',
    code: 'WPT',
    description: 'Determine the errors of indication across the weighing range with increasing and decreasing loads.',
    standard_reference: 'OIML R76 A.4.6',
    procedure_description: 'Apply test loads at selected points from Min to Max (increasing) and from Max to Min (decreasing). Record indications at each point.',
    is_active: true,
    sort_order: 3,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'td-004',
    category_id: 'tc-002',
    name: 'Zero-Setting / Zero Indication',
    code: 'ZRO',
    description: 'Verify that the zero-setting device operates correctly and the zero indication returns within limits.',
    standard_reference: 'OIML R76 A.4.1',
    procedure_description: 'Check the zero indication at power on and after zero-setting operations. Verify the zero-tracking and initial zero-setting range.',
    is_active: true,
    sort_order: 4,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 'td-005',
    category_id: 'tc-002',
    name: 'Tare Test',
    code: 'TAR',
    description: 'Verify the correct operation of the tare device.',
    standard_reference: 'OIML R76 A.4.8',
    procedure_description: 'Apply a tare load and verify that the instrument zeroes correctly. Then apply a net load and verify correct net indication.',
    is_active: true,
    sort_order: 5,
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z',
  },
];

// ============================================================
// Demo Evaluations
// ============================================================

export const demoEvaluations: Evaluation[] = [
  {
    id: 'eval-001',
    evaluation_number: 'NAWI-2026-DEMO-001',
    instrument_id: 'ins-001',
    laboratory_id: 'lab-001',
    evaluator_id: 'usr-002',
    reviewer_id: null,
    approver_id: null,
    status: 'in_progress',
    evaluation_type: 'Type Approval',
    temperature: 22.5,
    humidity: 48,
    barometric_pressure: 1013.25,
    environmental_notes: 'Conditions stable throughout testing period',
    reference_standards: 'OIML F1 class reference weights (traceable to NPL India)',
    applicable_ruleset_id: 'rs-001',
    notes: 'Demo evaluation for PLT-300 platform scale',
    started_at: '2026-09-25T10:00:00Z',
    submitted_at: null,
    reviewed_at: null,
    approved_at: null,
    completed_at: null,
    created_at: '2026-09-25T09:30:00Z',
    updated_at: '2026-09-25T14:30:00Z',
  },
  {
    id: 'eval-002',
    evaluation_number: 'NAWI-2026-DEMO-002',
    instrument_id: 'ins-002',
    laboratory_id: 'lab-001',
    evaluator_id: 'usr-002',
    reviewer_id: 'usr-003',
    approver_id: null,
    status: 'awaiting_review',
    evaluation_type: 'Type Approval',
    temperature: 23.0,
    humidity: 45,
    barometric_pressure: 1012.8,
    environmental_notes: null,
    reference_standards: 'OIML E2 class reference weights',
    applicable_ruleset_id: 'rs-001',
    notes: 'Bench scale evaluation',
    started_at: '2026-09-22T08:00:00Z',
    submitted_at: '2026-09-24T16:00:00Z',
    reviewed_at: null,
    approved_at: null,
    completed_at: null,
    created_at: '2026-09-22T07:45:00Z',
    updated_at: '2026-09-24T16:00:00Z',
  },
  {
    id: 'eval-003',
    evaluation_number: 'NAWI-2026-DEMO-003',
    instrument_id: 'ins-003',
    laboratory_id: 'lab-001',
    evaluator_id: 'usr-002',
    reviewer_id: 'usr-003',
    approver_id: 'usr-004',
    status: 'completed',
    evaluation_type: 'Verification',
    temperature: 28.0,
    humidity: 55,
    barometric_pressure: 1010.5,
    environmental_notes: 'Outdoor testing at weighbridge site',
    reference_standards: 'OIML M1 class reference weights (1000 kg standard test trucks)',
    applicable_ruleset_id: 'rs-001',
    notes: 'Weighbridge periodic verification',
    started_at: '2026-09-18T06:00:00Z',
    submitted_at: '2026-09-19T17:00:00Z',
    reviewed_at: '2026-09-20T10:00:00Z',
    approved_at: '2026-09-21T11:00:00Z',
    completed_at: '2026-09-21T11:00:00Z',
    created_at: '2026-09-18T05:30:00Z',
    updated_at: '2026-09-21T11:00:00Z',
  },
  {
    id: 'eval-004',
    evaluation_number: 'NAWI-2026-DEMO-004',
    instrument_id: 'ins-004',
    laboratory_id: 'lab-001',
    evaluator_id: 'usr-002',
    reviewer_id: 'usr-003',
    approver_id: 'usr-004',
    status: 'completed',
    evaluation_type: 'Type Approval',
    temperature: 22.0,
    humidity: 50,
    barometric_pressure: 1013.0,
    environmental_notes: null,
    reference_standards: 'OIML F1 class reference weights',
    applicable_ruleset_id: 'rs-001',
    notes: 'Retail scale evaluation',
    started_at: '2026-09-15T09:00:00Z',
    submitted_at: '2026-09-16T16:00:00Z',
    reviewed_at: '2026-09-17T10:00:00Z',
    approved_at: '2026-09-17T14:00:00Z',
    completed_at: '2026-09-17T14:00:00Z',
    created_at: '2026-09-15T08:30:00Z',
    updated_at: '2026-09-17T14:00:00Z',
  },
];

// ============================================================
// Demo Evaluation Tests
// ============================================================

export const demoEvaluationTests: EvaluationTest[] = [
  // eval-001 tests
  { id: 'et-001', evaluation_id: 'eval-001', test_definition_id: 'td-001', status: 'completed', is_applicable: true, notes: null, started_at: '2026-09-25T10:30:00Z', completed_at: '2026-09-25T11:15:00Z', created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T11:15:00Z' },
  { id: 'et-002', evaluation_id: 'eval-001', test_definition_id: 'td-002', status: 'in_progress', is_applicable: true, notes: null, started_at: '2026-09-25T11:30:00Z', completed_at: null, created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T12:00:00Z' },
  { id: 'et-003', evaluation_id: 'eval-001', test_definition_id: 'td-003', status: 'not_started', is_applicable: true, notes: null, started_at: null, completed_at: null, created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T10:00:00Z' },
  { id: 'et-004', evaluation_id: 'eval-001', test_definition_id: 'td-004', status: 'completed', is_applicable: true, notes: 'Zero stable at power on', started_at: '2026-09-25T10:00:00Z', completed_at: '2026-09-25T10:20:00Z', created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T10:20:00Z' },
  { id: 'et-005', evaluation_id: 'eval-001', test_definition_id: 'td-005', status: 'not_started', is_applicable: true, notes: null, started_at: null, completed_at: null, created_at: '2026-09-25T10:00:00Z', updated_at: '2026-09-25T10:00:00Z' },
];

// ============================================================
// Demo Test Observations (for eval-001, Repeatability)
// ============================================================

export const demoObservations: TestObservation[] = [
  { id: 'obs-001', evaluation_test_id: 'et-001', trial_number: 1, nominal_value: 150, applied_load: 150, indication: 150.0, error: 0, permissible_error: 0.5, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T10:35:00Z', created_at: '2026-09-25T10:35:00Z', updated_at: '2026-09-25T10:35:00Z' },
  { id: 'obs-002', evaluation_test_id: 'et-001', trial_number: 2, nominal_value: 150, applied_load: 150, indication: 150.1, error: 0.1, permissible_error: 0.5, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T10:40:00Z', created_at: '2026-09-25T10:40:00Z', updated_at: '2026-09-25T10:40:00Z' },
  { id: 'obs-003', evaluation_test_id: 'et-001', trial_number: 3, nominal_value: 150, applied_load: 150, indication: 150.0, error: 0, permissible_error: 0.5, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T10:45:00Z', created_at: '2026-09-25T10:45:00Z', updated_at: '2026-09-25T10:45:00Z' },
  { id: 'obs-004', evaluation_test_id: 'et-001', trial_number: 4, nominal_value: 300, applied_load: 300, indication: 300.0, error: 0, permissible_error: 1.0, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T10:50:00Z', created_at: '2026-09-25T10:50:00Z', updated_at: '2026-09-25T10:50:00Z' },
  { id: 'obs-005', evaluation_test_id: 'et-001', trial_number: 5, nominal_value: 300, applied_load: 300, indication: 300.1, error: 0.1, permissible_error: 1.0, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T10:55:00Z', created_at: '2026-09-25T10:55:00Z', updated_at: '2026-09-25T10:55:00Z' },
  { id: 'obs-006', evaluation_test_id: 'et-001', trial_number: 6, nominal_value: 300, applied_load: 300, indication: 300.0, error: 0, permissible_error: 1.0, unit: 'kg', notes: null, recorded_by: 'usr-002', recorded_at: '2026-09-25T11:00:00Z', created_at: '2026-09-25T11:00:00Z', updated_at: '2026-09-25T11:00:00Z' },
];

// ============================================================
// Demo Compliance Results
// ============================================================

export const demoComplianceResults: ComplianceResult[] = [
  {
    id: 'cr-001',
    evaluation_test_id: 'et-001',
    requirement_id: 'rr-001',
    ruleset_version_id: 'rs-001',
    observed_value: 0.1,
    permissible_limit: 0.5,
    deviation: 0.1,
    status: 'PASS',
    explanation: 'Range of indications at 50% Max (0.1 kg) is within the maximum permissible error (0.5 kg = 5e). PASS.',
    metadata: { test_load: 150, unit: 'kg' },
    evaluated_at: '2026-09-25T11:15:00Z',
    created_at: '2026-09-25T11:15:00Z',
  },
  {
    id: 'cr-002',
    evaluation_test_id: 'et-001',
    requirement_id: 'rr-001',
    ruleset_version_id: 'rs-001',
    observed_value: 0.1,
    permissible_limit: 1.0,
    deviation: 0.1,
    status: 'PASS',
    explanation: 'Range of indications at Max (0.1 kg) is within the maximum permissible error (1.0 kg = 10e). PASS.',
    metadata: { test_load: 300, unit: 'kg' },
    evaluated_at: '2026-09-25T11:15:00Z',
    created_at: '2026-09-25T11:15:00Z',
  },
];

// ============================================================
// Demo Reports
// ============================================================

export const demoReports: Report[] = [
  {
    id: 'rpt-001',
    report_number: 'RPT-NAWI-2026-003',
    evaluation_id: 'eval-003',
    version: 1,
    status: 'approved',
    generated_by: 'usr-002',
    approved_by: 'usr-004',
    content_snapshot: {},
    file_path: null,
    generated_at: '2026-09-21T11:30:00Z',
    approved_at: '2026-09-21T12:00:00Z',
    created_at: '2026-09-21T11:30:00Z',
    updated_at: '2026-09-21T12:00:00Z',
  },
  {
    id: 'rpt-002',
    report_number: 'RPT-NAWI-2026-004',
    evaluation_id: 'eval-004',
    version: 1,
    status: 'approved',
    generated_by: 'usr-002',
    approved_by: 'usr-004',
    content_snapshot: {},
    file_path: null,
    generated_at: '2026-09-17T14:30:00Z',
    approved_at: '2026-09-17T15:00:00Z',
    created_at: '2026-09-17T14:30:00Z',
    updated_at: '2026-09-17T15:00:00Z',
  },
];

// ============================================================
// Demo Audit Logs
// ============================================================

export const demoAuditLogs: AuditLog[] = [
  { id: 'aud-001', user_id: 'usr-002', action: 'instrument.created', entity_type: 'instrument', entity_id: 'ins-001', previous_value: null, new_value: { model: 'PLT-300' }, metadata: null, ip_address: null, created_at: '2026-09-10T10:00:00Z' },
  { id: 'aud-002', user_id: 'usr-002', action: 'evaluation.created', entity_type: 'evaluation', entity_id: 'eval-001', previous_value: null, new_value: { status: 'draft' }, metadata: null, ip_address: null, created_at: '2026-09-25T09:30:00Z' },
  { id: 'aud-003', user_id: 'usr-002', action: 'evaluation.started', entity_type: 'evaluation', entity_id: 'eval-001', previous_value: { status: 'draft' }, new_value: { status: 'in_progress' }, metadata: null, ip_address: null, created_at: '2026-09-25T10:00:00Z' },
  { id: 'aud-004', user_id: 'usr-002', action: 'observation.recorded', entity_type: 'test_observation', entity_id: 'obs-001', previous_value: null, new_value: { indication: 150.0 }, metadata: { test: 'Repeatability' }, ip_address: null, created_at: '2026-09-25T10:35:00Z' },
  { id: 'aud-005', user_id: 'usr-002', action: 'test.completed', entity_type: 'evaluation_test', entity_id: 'et-001', previous_value: { status: 'in_progress' }, new_value: { status: 'completed' }, metadata: { test: 'Repeatability' }, ip_address: null, created_at: '2026-09-25T11:15:00Z' },
  { id: 'aud-006', user_id: 'usr-002', action: 'evaluation.submitted', entity_type: 'evaluation', entity_id: 'eval-002', previous_value: { status: 'in_progress' }, new_value: { status: 'awaiting_review' }, metadata: null, ip_address: null, created_at: '2026-09-24T16:00:00Z' },
  { id: 'aud-007', user_id: 'usr-003', action: 'evaluation.reviewed', entity_type: 'evaluation', entity_id: 'eval-003', previous_value: { status: 'awaiting_review' }, new_value: { status: 'approved' }, metadata: null, ip_address: null, created_at: '2026-09-20T10:00:00Z' },
  { id: 'aud-008', user_id: 'usr-004', action: 'evaluation.approved', entity_type: 'evaluation', entity_id: 'eval-003', previous_value: { status: 'approved' }, new_value: { status: 'completed' }, metadata: null, ip_address: null, created_at: '2026-09-21T11:00:00Z' },
  { id: 'aud-009', user_id: 'usr-002', action: 'report.generated', entity_type: 'report', entity_id: 'rpt-001', previous_value: null, new_value: { report_number: 'RPT-NAWI-2026-003' }, metadata: null, ip_address: null, created_at: '2026-09-21T11:30:00Z' },
  { id: 'aud-010', user_id: 'usr-001', action: 'user.created', entity_type: 'user', entity_id: 'usr-005', previous_value: null, new_value: { role: 'viewer' }, metadata: null, ip_address: null, created_at: '2026-09-01T09:00:00Z' },
];

// ============================================================
// Dashboard Stats
// ============================================================

export const demoDashboardStats: DashboardStats = {
  total_instruments: 4,
  active_evaluations: 2,
  completed_evaluations: 2,
  pending_reviews: 1,
  reports_generated: 2,
  compliance_rate: 94.8,
  passed_tests: 8,
  failed_tests: 1,
};

export const demoRecentEvaluations: RecentEvaluation[] = [
  { id: 'eval-001', evaluation_number: 'NAWI-2026-DEMO-001', instrument_name: 'PLT-300', instrument_type: 'Platform Scale', status: 'in_progress', date: '2026-09-25' },
  { id: 'eval-002', evaluation_number: 'NAWI-2026-DEMO-002', instrument_name: 'BR-01', instrument_type: 'Bench Scale', status: 'awaiting_review', date: '2026-09-24' },
  { id: 'eval-003', evaluation_number: 'NAWI-2026-DEMO-003', instrument_name: 'WB-60T', instrument_type: 'Weighbridge', status: 'completed', date: '2026-09-21' },
  { id: 'eval-004', evaluation_number: 'NAWI-2026-DEMO-004', instrument_name: 'RS-15', instrument_type: 'Retail Scale', status: 'completed', date: '2026-09-17' },
];

// ============================================================
// Current Demo User
// ============================================================

export function getDemoCurrentUser(): User {
  return demoUsers[0]; // Administrator by default
}

export function getDemoUserByRole(role: UserRole): User | undefined {
  return demoUsers.find(u => u.role === role);
}
