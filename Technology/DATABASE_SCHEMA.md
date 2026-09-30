# Database Schema — Initial Design

## users / profiles
- id
- full_name
- email
- role
- organization
- created_at

## instruments
- id
- manufacturer
- model_name
- instrument_type
- capacity
- scale_interval
- accuracy_class
- serial_number
- status
- created_at
- updated_at

## test_cases
- id
- name
- category
- description
- standard_reference
- active

## test_sessions
- id
- instrument_id
- tester_id
- status
- started_at
- completed_at
- overall_result
- notes

## measurements
- id
- test_session_id
- test_case_id
- nominal_value
- applied_value
- indication
- error
- permissible_error
- result
- created_at

## evidence
- id
- test_session_id
- file_name
- storage_path
- file_type
- uploaded_by
- uploaded_at

## audit_logs
- id
- user_id
- action
- entity_type
- entity_id
- metadata
- created_at

## Relationships
profiles 1 → N test_sessions
instruments 1 → N test_sessions
test_sessions 1 → N measurements
test_cases 1 → N measurements
test_sessions 1 → N evidence
profiles 1 → N audit_logs
