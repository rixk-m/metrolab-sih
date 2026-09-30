-- ==============================================================================
-- MetroLab Database Schema — PostgreSQL / Supabase
-- Compliant with OIML R 76-1 (2006) Type Evaluation Workflows
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM (
  'administrator',
  'evaluator',
  'reviewer',
  'approving_officer',
  'viewer'
);

CREATE TYPE accuracy_class AS ENUM (
  'I',
  'II',
  'III',
  'IIII'
);

CREATE TYPE instrument_status AS ENUM (
  'active',
  'under_evaluation',
  'archived'
);

CREATE TYPE evaluation_status AS ENUM (
  'draft',
  'in_progress',
  'awaiting_review',
  'changes_requested',
  'approved',
  'signed',
  'completed',
  'archived'
);

CREATE TYPE test_execution_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'failed',
  'skipped'
);

CREATE TYPE test_compliance_status AS ENUM (
  'pass',
  'fail',
  'conditional',
  'not_tested'
);

CREATE TYPE report_status AS ENUM (
  'draft',
  'pending_review',
  'approved',
  'signed',
  'published'
);

-- -----------------------------------------------------------------------------
-- 1. Profiles / Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'evaluator',
  organization TEXT NOT NULL DEFAULT 'National Metrology Laboratory',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Manufacturers Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS manufacturers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  contact_email TEXT,
  contact_person TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Instruments Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturers(id) ON DELETE RESTRICT,
  model_name TEXT NOT NULL,
  instrument_type TEXT NOT NULL, -- 'Electronic Non-Automatic Weighing Instrument'
  accuracy_class accuracy_class NOT NULL DEFAULT 'III',
  max_capacity NUMERIC(12, 4) NOT NULL, -- e.g. 15000 (g)
  min_capacity NUMERIC(12, 4) NOT NULL, -- e.g. 100 (g)
  verification_scale_interval_e NUMERIC(12, 4) NOT NULL, -- e.g. 5 (g)
  actual_scale_interval_d NUMERIC(12, 4) NOT NULL, -- e.g. 1 (g)
  number_of_intervals_n INTEGER GENERATED ALWAYS AS (ROUND(max_capacity / verification_scale_interval_e)) STORED,
  tare_range TEXT,
  serial_number TEXT UNIQUE NOT NULL,
  device_version TEXT,
  description TEXT,
  status instrument_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. Test Categories & Test Definitions (OIML R 76 Modules)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES test_categories(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL, -- e.g. 'A.4.4.1'
  name TEXT NOT NULL, -- e.g. 'Weighing Performance Test'
  description TEXT,
  standard_reference TEXT NOT NULL DEFAULT 'OIML R 76-1:2006',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. Evaluations Table (Digital Lifecycle Container)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_number TEXT UNIQUE NOT NULL, -- e.g. 'EV-2026-0042'
  instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE RESTRICT,
  evaluator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approving_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status evaluation_status NOT NULL DEFAULT 'draft',
  evaluation_type TEXT NOT NULL DEFAULT 'Full Type Evaluation (OIML R 76)',
  standard TEXT NOT NULL DEFAULT 'OIML R 76-1 (2006)',
  temperature_c NUMERIC(5, 2) NOT NULL DEFAULT 20.5,
  relative_humidity_pct NUMERIC(5, 2) NOT NULL DEFAULT 48.0,
  atmospheric_pressure_kpa NUMERIC(6, 2) NOT NULL DEFAULT 101.32,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  review_remarks TEXT,
  signature_hash TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. Evaluation Tests (Instances of tests applied to an evaluation)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluation_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  test_definition_id UUID NOT NULL REFERENCES test_definitions(id) ON DELETE RESTRICT,
  status test_execution_status NOT NULL DEFAULT 'pending',
  compliance test_compliance_status NOT NULL DEFAULT 'not_tested',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(evaluation_id, test_definition_id)
);

-- -----------------------------------------------------------------------------
-- 7. Test Observations (Granular metrological measurement entries)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_test_id UUID NOT NULL REFERENCES evaluation_tests(id) ON DELETE CASCADE,
  run_number INTEGER NOT NULL DEFAULT 1,
  load_point_g NUMERIC(14, 4) NOT NULL,
  indication_g NUMERIC(14, 4) NOT NULL,
  turning_point_added_g NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
  calculated_l_g NUMERIC(14, 4) NOT NULL, -- L = I + 0.5d - delta_L
  error_e_g NUMERIC(12, 4) NOT NULL, -- E = I - L_nominal
  corrected_error_ec_g NUMERIC(12, 4) NOT NULL, -- Ec = E - E0
  mpe_g NUMERIC(12, 4) NOT NULL, -- Maximum Permissible Error
  compliance_status test_compliance_status NOT NULL DEFAULT 'pass',
  position_id TEXT, -- For eccentricity: 'center', 'corner_1', etc.
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. Compliance Results Summary
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compliance_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  test_definition_id UUID NOT NULL REFERENCES test_definitions(id) ON DELETE CASCADE,
  status test_compliance_status NOT NULL DEFAULT 'pass',
  max_error_observed NUMERIC(12, 4) NOT NULL,
  max_permissible_error NUMERIC(12, 4) NOT NULL,
  ratio_to_mpe NUMERIC(8, 4),
  details JSONB DEFAULT '{}'::jsonb,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. Reports Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_number TEXT UNIQUE NOT NULL, -- e.g. 'REP-2026-0042'
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE RESTRICT,
  version INTEGER NOT NULL DEFAULT 1,
  status report_status NOT NULL DEFAULT 'draft',
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_storage_path TEXT
);

-- -----------------------------------------------------------------------------
-- 10. Documents & Evidence Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE SET NULL,
  instrument_id UUID REFERENCES instruments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'evidence', -- 'evidence', 'datasheet', 'certificate', 'photo'
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. Audit Logs (Immutable Traceability Ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL, -- 'EVALUATION_CREATED', 'TEST_COMPLETED', 'REPORT_APPROVED'
  entity_type TEXT NOT NULL, -- 'evaluation', 'instrument', 'observation', 'report'
  entity_id TEXT NOT NULL,
  details TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Indexes for Performance & Traceability
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_instruments_manufacturer ON instruments(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_instruments_serial ON instruments(serial_number);
CREATE INDEX IF NOT EXISTS idx_evaluations_instrument ON evaluations(instrument_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluation_tests_eval ON evaluation_tests(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_test_observations_test ON test_observations(evaluation_test_id);
CREATE INDEX IF NOT EXISTS idx_reports_evaluation ON reports(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_documents_evaluation ON documents(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
