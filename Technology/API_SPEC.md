# API / Server Action Specification

## Authentication
POST /api/auth/login
POST /api/auth/logout

## Instruments
GET /api/instruments
POST /api/instruments
GET /api/instruments/:id
PATCH /api/instruments/:id
DELETE /api/instruments/:id

## Test Sessions
GET /api/tests
POST /api/tests
GET /api/tests/:id
PATCH /api/tests/:id
POST /api/tests/:id/start
POST /api/tests/:id/complete

## Measurements
GET /api/tests/:id/measurements
POST /api/tests/:id/measurements

## Evidence
POST /api/tests/:id/evidence
GET /api/tests/:id/evidence

## Reports
GET /api/tests/:id/report

## Audit
GET /api/audit

## API Rules
- Validate all incoming data.
- Require authentication for protected endpoints.
- Apply role-based authorization.
- Never trust client-side pass/fail calculations.
- Store important compliance calculations server-side.
- Log important state-changing operations.
