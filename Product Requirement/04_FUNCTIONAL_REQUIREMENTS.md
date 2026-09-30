# Functional Requirements

## FR-01 Authentication
Login, logout, sessions, password recovery where applicable and profiles.

## FR-02 User Management
Authorized administrators can create/deactivate users, assign roles and view activity.

## FR-03 Manufacturer Management
Create, edit, search and view manufacturer records.

## FR-04 Instrument Management
Capture manufacturer, applicant, model, type, serial number, capacity, scale intervals, accuracy class, display/power/software details and other applicable parameters. Support create, edit, view, search, filter, archive and evaluation history.

## FR-05 Evaluation Creation
Select/create instrument; enter evaluation metadata, laboratory information, environmental conditions, reference equipment and applicable tests; review and save draft.

## FR-06 Evaluation Lifecycle
Draft → In Progress → Awaiting Review → Changes Requested → Approved → Signed → Completed → Archived.

## FR-07 Test Management
Show applicable tests, status and completion; allow authorized observation entry, validation, calculation and compliance display.

## FR-08 Observation Entry
Support numeric values, text, boolean checks, selections, repeated trials, tables and test-specific inputs.

## FR-09 Automatic Calculation
Calculate configured derived values, errors and applicable limits; expose calculation details and reject invalid/unavailable outputs.

## FR-10 Compliance
Return test/requirement ID, observed value, permissible limit, deviation, status, explanation and ruleset version. Statuses may include PASS, FAIL, WARNING, NOT_APPLICABLE, PENDING and RULE_NOT_CONFIGURED.

## FR-11 Validation
Validate required fields, ranges, units, precision, consistency, missing values and duplicates where applicable.

## FR-12 Attachments
Support authorized photographs, certificates and documents with file validation.

## FR-13 Autosave
Save drafts automatically, show save state and recover work where practical.

## FR-14 Review
Inspect evaluation, calculations and compliance; add remarks, request changes or approve.

## FR-15 Approval/Signature
Controlled final approval and digital signature where enabled.

## FR-16 Reports
Generate standardized reports containing instrument details, conditions, ruleset, observations, calculations, compliance, photographs, remarks, approvals and revisions. Export PDF and editable output where appropriate.

## FR-17 Repository
Search, filter, open, version and retrieve reports and related evidence.

## FR-18 Search
Support report ID, evaluation ID, manufacturer, model, serial number, type, evaluator, date and status.

## FR-19 Dashboard
Show active evaluations, reports, pending reviews, compliance information, recent activity and trends.

## FR-20 Audit Trail
Record creation, changes, observations, calculations, status transitions, review, approval, signature and report generation/regeneration.

## FR-21 Ruleset Versioning
Associate results with a defined ruleset version and preserve historical traceability.

## FR-22 Future Updates
Introduce new rulesets as controlled versions without silently changing historical results.
