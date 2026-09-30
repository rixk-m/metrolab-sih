# METROLAB — Full Project Implementation Plan

## Project Type

A production-grade, immersive web platform for the digital type evaluation of Non-Automatic Weighing Instruments (NAWIs), with OIML R 76-based test workflows, calculation automation, compliance evaluation, report generation, repository management, auditability, and role-based access.

---

# 0. PROJECT VISION

## Product Vision

Build a platform that digitizes the complete NAWI type-evaluation lifecycle:

Instrument Registration
→ Evaluation Setup
→ Laboratory Conditions
→ Applicable Test Selection
→ Observation Entry
→ Automatic Calculation
→ Compliance Evaluation
→ Review
→ Approval / Signature
→ Standardized Test Report
→ Repository / History
→ Analytics / Audit

The product has two connected experiences:

### Experience A — Immersive Public Website

A premium, cinematic, interactive 3D experience used for:

- Product storytelling
- Demonstration
- Explaining the problem and solution
- Demonstrating metrology concepts
- Attracting stakeholders
- Providing entry into the application

### Experience B — Functional Metrology Application

A serious laboratory application used for:

- Instrument registration
- Evaluation management
- Test execution
- Observation recording
- Calculations
- Compliance decisions
- Review and approval
- Report generation
- Repository and history
- Analytics
- Administration

The public experience can be experimental and cinematic. The laboratory application must prioritize accuracy, usability, traceability, accessibility, and clarity.

---

# 1. GUIDING PRINCIPLES

1. Accuracy over visual decoration.
2. No regulatory rule or calculation should be invented.
3. Rules should be versioned and configurable.
4. Calculations must be deterministic and testable.
5. Every important result must be explainable.
6. Data should never be silently overwritten.
7. The 3D experience must have a communication purpose.
8. Scroll interaction must drive meaningful scene changes.
9. Functional screens should remain fast and usable.
10. All security controls must exist server-side, not only in the UI.
11. Demo data must be clearly distinguishable from production data.
12. The product must be extensible for future OIML ruleset revisions.
13. The system must preserve an audit trail.
14. The application must support graceful degradation when WebGL or heavy animation is unavailable.

---

# 2. HIGH-LEVEL PHASE MAP

## Phase 01 — Project Initialization & Governance

Establish repository, documentation conventions, environments, branching, coding standards, and project tracking.

## Phase 02 — Domain Research & Requirements

Translate the NAWI problem statement into precise product requirements, workflows, roles, entities, test concepts, calculations, and compliance rules.

## Phase 03 — Reference Collection & Experience Research

Organize visual references, interaction references, 3D references, typography references, motion references, and report/UI references.

## Phase 04 — Product Architecture

Define frontend, backend, database, 3D, animation, storage, reporting, authentication, testing, and deployment architecture.

## Phase 05 — Design System & UX Foundation

Build the visual language, typography, colors, spacing, component rules, animation principles, accessibility rules, and responsive behavior.

## Phase 06 — 3D Experience Architecture

Plan and prototype the WebGL laboratory, 3D assets, camera choreography, scroll-driven scenes, interaction model, performance strategy, and fallbacks.

## Phase 07 — Database, Authentication & RBAC

Implement data models, Supabase/PostgreSQL, authentication, roles, RLS, storage, user profiles, laboratories, and audit foundations.

## Phase 08 — Metrology Rules & Calculation Engine

Implement a separate rules/configuration system and deterministic calculation/compliance engine.

## Phase 09 — Instrument & Evaluation Management

Build instrument registration, evaluation creation, laboratory condition recording, test applicability, and evaluation lifecycle.

## Phase 10 — Test Execution Workspace

Build the complete digital test-entry experience with validation, observations, calculations, status tracking, autosave, and interactive visualizations.

## Phase 11 — Review, Approval & Signature Workflow

Build reviewer workflows, issue/remark handling, approval states, digital signature support, and controlled transitions.

## Phase 12 — Report Generation Engine

Create standardized report structures, dynamic population, PDF generation, editable output support, photographs, signatures, revision metadata, and document control.

## Phase 13 — Repository, History, Search & Analytics

Build report repository, instrument history, advanced filtering, global search, dashboards, operational analytics, and audit timelines.

## Phase 14 — Immersive Public Website

Build the cinematic scrolling 3D marketing/product experience from scratch and connect it to the real application.

## Phase 15 — Integration, Security Hardening & Quality Assurance

Integrate all modules, test calculations, security, data integrity, performance, accessibility, browser compatibility, 3D fallbacks, and report accuracy.

## Phase 16 — Deployment, Documentation & Demonstration

Prepare production deployment, environment configuration, seed/demo dataset, technical documentation, user guide, architecture documentation, and hackathon/demo presentation flow.

## Phase 17 — Post-Launch Extensibility & Maintenance

Create governance for ruleset updates, release management, monitoring, backups, future integrations, and controlled product evolution.

---

# 3. PHASE 01 — PROJECT INITIALIZATION & GOVERNANCE

## Objective

Create the project foundation before building screens.

## Tasks

### 1. Repository Initialization

Create:

- Git repository
- Development branch
- Main/release branch
- Pull request convention
- Commit naming convention
- Issue/task structure

### 2. Project Root Organization

Maintain:

- 01_IMPLEMENTATION_PLAN
- 02_REFERENCE_IMAGES
- 03_REFERENCE_WEBSITES
- 04_DESIGN_SYSTEM
- 05_TECHNOLOGY
- 06_PRODUCT_REQUIREMENTS
- 07_3D_ASSETS
- 08_CONTENT
- 09_DATABASE
- 10_OIML_R76
- 11_REPORT_TEMPLATES
- 12_USER_FLOWS
- 13_APPLICATION

### 3. Development Environments

Define:

- Local development
- Staging
- Production

Define environment variables for:

- Database
- Authentication
- Storage
- PDF generation
- Email
- Application URL
- Monitoring

### 4. Coding Standards

Define:

- TypeScript strictness
- ESLint
- Prettier
- Naming conventions
- Component conventions
- API/service conventions
- Error-handling conventions
- Testing standards

## Deliverables

- Repository
- README
- Coding standards
- Environment template
- Project folder structure
- Development instructions

## Definition of Done

A new developer or AI coding agent can clone the project and understand how to run and contribute to it.

---

# 4. PHASE 02 — DOMAIN RESEARCH & REQUIREMENTS

## Objective

Convert the problem statement into a complete product specification.

## Tasks

### 1. Stakeholder Identification

Define:

- Laboratory administrator
- Laboratory evaluator
- Reviewer
- Approving officer
- Viewer
- System administrator

### 2. User Jobs

Document what each role needs to accomplish.

### 3. End-to-End Workflow

Document:

Registration
→ Evaluation
→ Test
→ Calculation
→ Compliance
→ Review
→ Approval
→ Report
→ Archive

### 4. Functional Requirements

Define:

- Instrument management
- Manufacturer management
- Evaluation management
- Test management
- Observation entry
- Calculation
- Compliance
- Attachments
- Reporting
- Search
- Repository
- Analytics
- RBAC
- Audit
- Revision

### 5. Non-Functional Requirements

Define:

- Performance
- Reliability
- Security
- Accessibility
- Availability
- Traceability
- Scalability
- Maintainability

### 6. Domain Terminology

Create controlled terminology for:

- Instrument
- Evaluation
- Test
- Observation
- Result
- Error
- Permissible limit
- Compliance
- Report
- Revision
- Reference standard
- Calibration certificate

## Deliverables

- PROBLEM_STATEMENT.md
- OBJECTIVES.md
- FUNCTIONAL_REQUIREMENTS.md
- NON_FUNCTIONAL_REQUIREMENTS.md
- USER_ROLES.md
- FEATURES.md
- SUCCESS_CRITERIA.md
- Glossary

## Definition of Done

Every major requirement has an owner module and traceable place in the architecture.

---

# 5. PHASE 03 — REFERENCE COLLECTION & EXPERIENCE RESEARCH

## Objective

Create a visual and interaction reference library before design begins.

## Reference Categories

Collect references for:

- Opening typography
- Intro animation
- 3D environments
- 3D instruments
- Camera movement
- Scroll transitions
- Horizontal scroll
- Pinned scenes
- Cursor interactions
- Navigation
- Loading transitions
- Data visualization
- Test interfaces
- Tables
- Dashboards
- Report layouts
- Mobile behavior

## Required Reference Websites

Use as inspiration:

- Open SBS / Brig.ht City — https://open-sbs.brig.ht/city
- Mont-Fort — https://mont-fort.com/
- David Whyte Experience — https://davidwhyte.com/experience/

## Important Rule

References describe the interaction quality and visual direction. Do not clone their layouts or identity.

## Deliverables

- Reference image folders populated
- Reference website notes
- Interaction reference notes
- "Things to avoid" reference board
- Visual moodboard
- Animation moodboard

## Definition of Done

The design team/coding agent can understand the intended experience without guessing.

---

# 6. PHASE 04 — PRODUCT ARCHITECTURE

## Objective

Define the complete technical architecture before major implementation.

## Preferred Architecture

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Component system

### 3D

- Three.js
- React Three Fiber
- Drei
- GLTF/GLB assets
- WebGL
- Post-processing only where useful

### Animation

- GSAP
- ScrollTrigger
- Lenis
- Framer Motion for interface animation

### Backend

- Next.js server actions/API or service layer
- PostgreSQL/Supabase
- Supabase Auth
- Supabase Storage

### Validation

- Zod
- React Hook Form

### Charts

- Recharts / D3 where justified

### Reporting

- PDF generation service/library
- Editable document generation strategy

## Architecture Layers

### UI Layer

Components, pages, navigation, accessibility.

### Feature Layer

Evaluation, instruments, reports, analytics.

### Domain Layer

Metrology rules, calculations, compliance.

### Service Layer

Database, storage, report generation, authentication.

### Infrastructure Layer

Supabase, deployment, logging, monitoring.

## Deliverables

- Architecture diagram
- Module boundaries
- Data flow
- API/service boundaries
- Folder architecture
- Technology decision record

## Definition of Done

Core business logic does not depend on individual UI components.

---

# 7. PHASE 05 — DESIGN SYSTEM & UX FOUNDATION

## Objective

Create the visual language used by both the immersive website and functional application.

## Visual Direction

Core attributes:

- Precision
- Scientific
- Industrial
- Cinematic
- Premium
- Minimal
- Technical
- Modern

Avoid:

- Generic SaaS look
- Excessive glassmorphism
- Excessive neon
- Random gradients
- Excessive rounded cards
- Decorative UI with no purpose

## Typography

Define:

- Display font
- UI font
- Technical/numeric font
- Heading scale
- Body scale
- Labels
- Data values

## Colors

Define:

- Background
- Surface
- Elevated surface
- Primary text
- Secondary text
- Border
- Accent
- Pass
- Fail
- Warning
- Pending

## Components

Create:

- Button
- Link
- Navigation
- Input
- Select
- Textarea
- Checkbox
- Radio
- Table
- Tabs
- Modal/drawer
- Toast
- Tooltip
- Badge
- Progress
- Status
- Timeline
- Search
- Command menu

## Motion

Define:

- Intro timing
- Hover timing
- Page transitions
- Scroll animation
- 3D transition speed
- Reduced-motion behavior

## Accessibility

Define:

- Keyboard behavior
- Focus behavior
- Contrast
- Screen-reader labels
- Motion reduction

## Deliverables

- Design system
- UI component inventory
- Typography document
- Color document
- Animation principles
- Accessibility rules

---

# 8. PHASE 06 — 3D EXPERIENCE ARCHITECTURE

## Objective

Make 3D an integral part of the storytelling.

## Core Concept

The user should feel as if they are moving through a digital metrology laboratory.

3D should not be a static hero decoration.

## 3D Scenes

Plan scenes such as:

### Scene 01 — Welcome

Typography:

WELCOME TO METROLAB

Dark environment slowly emerges.

### Scene 02 — Precision

A weighing instrument appears.

### Scene 03 — Manual Problem

Spreadsheets, documents, observations and disconnected workflow elements surround the instrument.

### Scene 04 — Digital Transformation

Data collapses into one digital workflow.

### Scene 05 — Instrument Inspection

Camera moves around the weighing instrument.

### Scene 06 — Test Laboratory

Reference masses interact with the instrument.

### Scene 07 — OIML R76 Test Network

Tests become an interactive 3D network.

### Scene 08 — Measurement

Actual observation → calculated error → applicable limit.

### Scene 09 — Compliance

The result moves into the acceptable range or indicates review/failure.

### Scene 10 — Report

Data transforms into a digital report.

### Scene 11 — Entry into Application

The camera transitions from the public experience into the real application.

## Interaction Model

Users can interact using:

- Scroll
- Mouse movement
- Cursor
- Click/tap
- Hover where supported
- Keyboard access
- Reduced-motion fallback

## Camera System

Implement:

- Scroll-driven camera path
- Smooth interpolation
- Mouse parallax
- Look-at targets
- Dolly movement
- Zoom transitions
- Scene anchoring

## Scroll System

Use:

- Lenis
- GSAP ScrollTrigger
- Pinned scenes
- Timeline-based transitions

## Performance

Implement:

- Dynamic 3D imports
- Optimized GLB/GLTF
- Texture optimization
- Adaptive pixel ratio
- Low-power fallback
- Reduced motion
- Mobile simplification

## Deliverables

- 3D concept document
- Scene map
- Camera choreography document
- Interaction map
- Asset inventory
- Performance strategy

---

# 9. PHASE 07 — DATABASE, AUTHENTICATION & RBAC

## Objective

Create secure data foundations.

## Core Entities

Proposed entities:

- users
- laboratories
- manufacturers
- instruments
- evaluations
- test_categories
- test_definitions
- test_observations
- test_results
- calculation_results
- compliance_results
- reports
- report_versions
- attachments
- calibration_certificates
- signatures
- audit_logs
- rulesets
- rule_versions

## Instrument Data

Capture:

- Manufacturer
- Applicant
- Model
- Instrument type
- Serial number
- Capacity parameters
- Scale interval parameters
- Accuracy class
- Display parameters
- Power information
- Software/firmware information
- Other applicable technical details

## Authentication

Implement:

- Login
- Logout
- Password recovery
- Session management
- User profile
- Role assignment

## RBAC

### Administrator

Full system management.

### Evaluator

Create evaluations and enter observations.

### Reviewer

Review and return evaluations.

### Approving Officer

Approve/sign finalized reports.

### Viewer

Read-only access.

## Security

Implement:

- Supabase RLS
- Server-side authorization
- Input validation
- Secure file handling
- File size/type limits
- Secret management

## Deliverables

- Database schema
- Migrations
- RLS policies
- Auth flow
- Role system
- Storage buckets/policies
- Audit foundation

---

# 10. PHASE 08 — METROLOGY RULES & CALCULATION ENGINE

## Objective

Create the technical brain of the platform.

## Critical Rule

Do not hard-code regulatory calculations inside UI components.

Do not invent requirements.

Use the applicable controlled/current OIML R 76 source and document the specific ruleset/version used.

## Architecture

Suggested:

/lib/metrology/
/lib/calculations/
/lib/compliance/
/lib/rules/

## Rule Layer

Each rule should identify:

- Ruleset version
- Rule/test ID
- Applicable condition
- Inputs
- Formula or evaluation logic
- Units
- Output
- Tolerance/limit where applicable
- Pass/fail logic
- Explanation

## Calculation Engine

Potential modules:

- error calculation
- permissible-error calculation
- repeatability calculation
- eccentricity calculation
- weighing performance
- zero-related checks
- tare-related checks
- discrimination-related checks
- influence-factor calculations
- other configured tests

Only implement exact tests and formulas supported by the configured ruleset.

## Compliance Engine

Return a structured result:

- testId
- requirementId
- observedValue
- permissibleLimit
- deviation
- status
- explanation
- rulesetVersion

Statuses:

- PASS
- FAIL
- WARNING
- NOT_APPLICABLE
- PENDING
- RULE_NOT_CONFIGURED

## Missing Rule Behavior

If a rule is unavailable:

RULE NOT CONFIGURED

Never silently approximate or generate a pass/fail result.

## Unit Handling

Standardize units and conversions.

Validate:

- zero/negative inputs
- impossible ranges
- missing required values
- precision
- incompatible units

## Testing

Every calculation module requires:

- Unit tests
- Boundary tests
- Invalid-input tests
- Regression tests
- Known example cases

## Deliverables

- Rule engine
- Calculation engine
- Compliance engine
- Unit-handling system
- Automated test suite
- Ruleset versioning

---

# 11. PHASE 09 — INSTRUMENT & EVALUATION MANAGEMENT

## Objective

Build the foundation for laboratory workflow.

## Instrument Management

Features:

- Create instrument
- Edit instrument
- View instrument
- Search
- Filter
- Archive
- Evaluation history

## Evaluation Creation

Wizard:

### Step 1

Instrument identity.

### Step 2

Technical specifications.

### Step 3

Laboratory details.

### Step 4

Environmental conditions.

### Step 5

Reference standards/equipment.

### Step 6

Applicable test selection.

### Step 7

Review configuration.

## Evaluation States

- Draft
- In Progress
- Awaiting Review
- Needs Changes
- Approved
- Signed
- Completed
- Archived

## Deliverables

- Instrument module
- Evaluation wizard
- Evaluation lifecycle
- Validation
- Autosave
- Draft recovery

---

# 12. PHASE 10 — TEST EXECUTION WORKSPACE

## Objective

Create a high-quality laboratory testing interface.

## Layout

### Left

Test navigation.

### Center

Observation entry.

### Right

Live calculation and compliance panel.

## Test Navigation

Show:

- Test name
- Category
- Status
- Completion
- Applicable/not applicable

## Observation Entry

Support:

- Numeric data
- Text observations
- Dropdowns
- Boolean checks
- Multiple trials
- Tables
- Test-specific inputs

## Live Calculation

As the user enters data:

- Calculate derived values
- Update status
- Explain calculations
- Show applicable limits
- Show missing inputs

## 3D Test Visualizer

Where meaningful, display a small interactive 3D representation of the instrument.

Example:

For an eccentricity-style workflow, show reference load position changes.

## Attachments

Allow:

- Instrument photographs
- Nameplate photographs
- Test setup photographs
- Supporting documents
- Calibration certificates

## Autosave

Display state:

Saving...
Saved at HH:MM:SS

## Offline/Recovery

Where practical, retain temporary unsynced observation data and recover it after reconnection.

## Deliverables

- Test workspace
- All configured test forms
- Validation
- Calculation display
- Compliance display
- Attachments
- Autosave
- Recovery behavior

---

# 13. PHASE 11 — REVIEW, APPROVAL & SIGNATURE WORKFLOW

## Objective

Create controlled report review.

## Workflow

Evaluator:

SUBMIT FOR REVIEW

Reviewer:

- Review observations
- Review calculations
- Review compliance
- Add remarks
- Request changes
- Approve

Approving Officer:

- Final review
- Approve
- Digitally sign where enabled

## Review Status

- Pending Review
- Changes Requested
- Approved
- Rejected/Returned
- Signed
- Final

## Review Interface

Display:

- Test summary
- Failed tests
- Warnings
- Missing information
- Rule versions
- Audit history

## Deliverables

- Review workspace
- Remarks system
- Approval workflow
- Signature workflow
- Status transition restrictions

---

# 14. PHASE 12 — REPORT GENERATION ENGINE

## Objective

Generate a professional, standardized test report from stored data.

## Report Structure

1. Cover page
2. Document control
3. Instrument identification
4. Applicant/manufacturer information
5. Technical specifications
6. Laboratory conditions
7. Reference standards/equipment
8. Applicable ruleset
9. Test procedures
10. Observations
11. Calculations
12. Compliance results
13. Photographs
14. Remarks/deviations
15. Final evaluation
16. Approval/signature area
17. Revision history

## Dynamic Population

Automatically populate:

- Instrument details
- Laboratory data
- Evaluation ID
- Dates
- Test data
- Calculations
- Compliance
- Photographs
- Signatures

## Report Metadata

Include:

- Report ID
- Revision
- Ruleset version
- Creation timestamp
- Last modified timestamp
- Generated by
- Approved by

## Output

Support:

- PDF
- Editable document where technically appropriate

## PDF Quality

Ensure:

- Page numbering
- Tables across pages
- Repeating headers
- Image scaling
- Signature blocks
- Controlled footer
- No clipping
- No overflow
- Deterministic layout

## Deliverables

- Report engine
- PDF templates
- Editable output strategy
- Sample reports
- Report versioning

---

# 15. PHASE 13 — REPOSITORY, HISTORY, SEARCH & ANALYTICS

## Objective

Turn generated reports and tests into an organized information system.

## Repository

Search by:

- Report ID
- Manufacturer
- Model
- Serial number
- Evaluation ID
- Evaluator
- Date
- Status
- Instrument type
- Accuracy class

## Filters

- In progress
- Passed
- Failed
- Awaiting review
- Approved
- Signed
- Archived

## Instrument History

Each instrument profile should show:

- Current status
- Previous evaluations
- Test history
- Reports
- Attachments
- Certificates
- Revision history

## Analytics

Build:

- Evaluations over time
- Completed evaluations
- Pending reviews
- Pass/fail distribution
- Average evaluation duration
- Tests by manufacturer
- Tests by instrument category
- Failure categories
- Evaluator workload

## Audit Timeline

Example:

Instrument Created
→ Evaluation Created
→ Test Started
→ Observation Added
→ Calculation Completed
→ Submitted for Review
→ Reviewed
→ Approved
→ Signed
→ Report Generated

## Deliverables

- Repository
- Search
- Filters
- Instrument history
- Analytics dashboard
- Audit timeline

---

# 16. PHASE 14 — IMMERSIVE PUBLIC WEBSITE

## Objective

Build the public website completely from scratch as a cinematic 3D storytelling experience.

## Opening Sequence

Start with a minimal dark scene.

Typography appears:

WELCOME TO METROLAB

Then the website gradually reveals the digital laboratory.

## Core Requirement

Do not build the website as a normal list of sections.

It must behave like one continuous scene.

## Recommended Story

### Scene 01 — Welcome

Typography-led introduction.

### Scene 02 — The Instrument

A premium 3D weighing instrument appears.

### Scene 03 — Precision

Camera approaches the instrument.

Measurement data appears.

### Scene 04 — The Problem

Spreadsheets and fragmented manual workflows surround the instrument.

### Scene 05 — Transformation

Manual artifacts reorganize into one digital workflow.

### Scene 06 — Inspection

Camera navigates through instrument components.

### Scene 07 — Testing

Reference load interaction demonstrates test execution.

### Scene 08 — OIML R76

Tests become a spatial network.

### Scene 09 — Calculation

Observed value transforms into calculated error and evaluation result.

### Scene 10 — Compliance

Result is presented against applicable limit.

### Scene 11 — Report

Data assembles into a finished test report.

### Scene 12 — Platform

Camera enters the actual product dashboard/workspace.

### Scene 13 — CTA

PRECISION STARTS HERE.

START EVALUATION →

## Mandatory Motion

- Lenis scrolling
- GSAP ScrollTrigger
- Camera choreography
- Mouse parallax
- Object transformations
- Text reveals
- Scroll velocity effects
- 3D hotspots
- Section transitions

## Definition of Done

Disabling the 3D canvas should materially reduce the intended experience. The 3D scene must communicate product concepts rather than decorate the page.

---

# 17. PHASE 15 — INTEGRATION, SECURITY & QUALITY ASSURANCE

## Objective

Make the whole system trustworthy and production-ready.

## Functional Testing

Test:

- Login
- Permissions
- Instrument creation
- Evaluation creation
- Test entry
- Validation
- Calculations
- Compliance
- Attachments
- Review
- Approval
- Report generation
- Repository
- Search
- Analytics

## Calculation QA

For each configured rule:

- Normal case
- Minimum boundary
- Maximum boundary
- Exact limit
- Just inside limit
- Just outside limit
- Missing input
- Invalid input

## Security Testing

Check:

- Authorization bypass
- RLS policies
- File upload controls
- Injection
- Broken object access
- Session handling
- Sensitive data exposure
- Server/client secret separation

## Accessibility Testing

Check:

- Keyboard navigation
- Focus
- Contrast
- Labels
- Reduced motion
- Mobile usability

## Browser Testing

Test modern:

- Chrome
- Edge
- Firefox
- Safari where available

## Responsive Testing

At minimum:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

## 3D Testing

Test:

- WebGL available
- WebGL unavailable
- Low-power device
- Reduced-motion
- Mobile
- High-DPI display

## Performance

Track:

- Initial page load
- JS size
- 3D asset size
- FPS in 3D scenes
- Memory use
- Largest contentful paint
- Interaction responsiveness

## Report QA

Every generated report must be visually inspected.

## Deliverables

- Test plan
- Automated tests
- Regression suite
- Security checklist
- Accessibility checklist
- Performance report
- Release candidate

---

# 18. PHASE 16 — DEPLOYMENT, DOCUMENTATION & DEMONSTRATION

## Objective

Prepare the application for real usage and presentation.

## Deployment

Recommended environments:

### Development

For active development.

### Staging

For QA and demonstrations.

### Production

For actual users.

## Deployment Tasks

- Configure production database
- Configure storage
- Configure auth
- Configure environment variables
- Configure domains
- Configure HTTPS
- Configure logging
- Configure backups
- Configure monitoring

## Demo Dataset

Seed:

- 10+ instruments
- 20+ evaluations
- Multiple manufacturers
- Passed tests
- Failed tests
- Pending reviews
- Completed reports
- Attachments
- Multiple user roles

## Demo Evaluation

Create one complete showcase evaluation.

Example:

Evaluation ID:
NAWI-2026-DEMO-001

Instrument:
Electronic Platform Scale

Use realistic but clearly demo-labelled values.

## Documentation

Create:

- Technical architecture
- Installation guide
- Environment setup
- Database documentation
- Rules engine documentation
- Calculation methodology
- Report generation documentation
- Admin guide
- User guide
- API/service documentation
- Deployment guide
- Troubleshooting guide

## Presentation Flow

The demo should show:

Welcome animation
→ 3D laboratory
→ Instrument
→ Testing
→ Automatic calculation
→ Compliance
→ Report generation
→ Dashboard
→ Repository

---

# 19. PHASE 17 — POST-LAUNCH EXTENSIBILITY & MAINTENANCE

## Objective

Make the platform maintainable when requirements change.

## Ruleset Updates

When applicable standards/recommendations change:

1. Create new ruleset version.
2. Do not mutate historical results silently.
3. Associate each evaluation with its ruleset version.
4. Test new calculations.
5. Review changes.
6. Deploy updated rules.
7. Preserve historical compatibility.

## Application Updates

Use:

- Versioned releases
- Migration scripts
- Changelog
- Rollback strategy
- Automated regression tests

## Monitoring

Monitor:

- Application errors
- Report-generation failures
- Database failures
- Storage failures
- Authentication failures
- Performance issues

## Backup

Maintain:

- Database backups
- Important document storage backups
- Recovery plan

---

# 20. COMPLETE APPLICATION PAGE MAP

## Public

- /
- /platform
- /oiml-r76
- /how-it-works
- /features
- /about
- /login

## Application

- /dashboard
- /evaluations
- /evaluations/new
- /evaluations/[id]
- /evaluations/[id]/tests
- /evaluations/[id]/review
- /instruments
- /instruments/[id]
- /reports
- /reports/[id]
- /analytics
- /documents
- /users
- /settings
- /audit

---

# 21. COMPLETE CORE DATA FLOW

Instrument:

Manufacturer
→ Instrument
→ Technical Specification
→ Evaluation

Evaluation:

Evaluation
→ Laboratory Conditions
→ Reference Equipment
→ Applicable Tests

Test:

Test Definition
→ Observation Input
→ Validation
→ Calculation
→ Compliance

Review:

Results
→ Reviewer
→ Remarks
→ Approval

Report:

Approved Evaluation
→ Report Generation
→ PDF/Editable Output
→ Version
→ Repository

History:

Instrument
→ Evaluation History
→ Reports
→ Audit Timeline

---

# 22. DEMO MODE ARCHITECTURE

The project must support a controlled demo mode.

Demo mode should:

- Have seeded data
- Avoid destroying real data
- Clearly identify demo records
- Allow the evaluator to experience the entire workflow
- Include a completed report
- Include at least one failed test
- Include at least one warning/review case

---

# 23. ERROR & EDGE CASE STRATEGY

The product must explicitly handle:

- Missing instrument configuration
- Missing rule
- Invalid numeric data
- Out-of-range input
- Duplicate serial number where prohibited
- Incomplete evaluation
- Network interruption
- Failed file upload
- PDF generation failure
- Unauthorized action
- Concurrent edit conflict
- Deleted/archived instrument
- Ruleset mismatch
- Failed calculation

Never display:

- NaN
- Infinity
- undefined
- empty pass/fail decision
- unexplained numerical output

---

# 24. AUDITABILITY REQUIREMENTS

Record important events such as:

- Created
- Updated
- Observation added
- Observation modified
- Calculation executed
- Result changed
- Test completed
- Review requested
- Changes requested
- Approved
- Signed
- Report generated
- Report regenerated
- Report archived

Store:

- User
- Timestamp
- Action
- Entity
- Previous data where appropriate
- New data where appropriate
- Reason where required

---

# 25. PERFORMANCE STRATEGY

## Public Website

Use:

- Dynamic 3D loading
- Scene-level code splitting
- Optimized models
- Texture compression
- Lazy assets
- Reduced-motion mode
- Mobile scene simplification

## Application

Prioritize:

- Fast forms
- Fast search
- Efficient database queries
- Pagination
- Virtualized large tables where required
- Optimized report generation

---

# 26. AI CODING AGENT EXECUTION RULES

When an AI coding agent is given this project:

### Step 1

Read the entire project structure.

### Step 2

Read:

- 01_IMPLEMENTATION_PLAN
- 02_REFERENCE_IMAGES
- 03_REFERENCE_WEBSITES
- 04_DESIGN_SYSTEM
- 05_TECHNOLOGY
- 06_PRODUCT_REQUIREMENTS
- 10_OIML_R76

before making major architecture decisions.

### Step 3

Inspect existing implementation.

### Step 4

Do not preserve poor UI merely because it already exists.

### Step 5

Implement in phases.

### Step 6

Keep working features working while changing the experience.

### Step 7

Run tests after each major domain module.

### Step 8

Run the application and visually inspect major pages.

### Step 9

Iterate on animation and UI quality.

### Step 10

Do not declare completion until the primary user journey works end-to-end.

---

# 27. MILESTONE STRUCTURE

## Milestone 1 — Foundations

Project initialized
+ requirements
+ technology
+ architecture

## Milestone 2 — Design

Design system
+ UX flows
+ reference library

## Milestone 3 — Core Backend

Database
+ auth
+ RBAC
+ storage

## Milestone 4 — Metrology Engine

Rules
+ calculations
+ compliance

## Milestone 5 — Evaluation Platform

Instrument
+ evaluation
+ test workspace

## Milestone 6 — Reporting

Review
+ approval
+ report generation

## Milestone 7 — Operations

Repository
+ analytics
+ audit

## Milestone 8 — Immersive Web Experience

3D
+ scroll
+ storytelling
+ navigation

## Milestone 9 — QA

Security
+ calculations
+ accessibility
+ performance

## Milestone 10 — Production

Deployment
+ documentation
+ demo data
+ release

---

# 28. FINAL END-TO-END ACCEPTANCE TEST

The project is not complete until a demo user can perform this journey without manual developer intervention:

1. Open public website.
2. See the animated opening typography:
   WELCOME TO METROLAB.
3. Scroll through the immersive 3D laboratory.
4. Interact with the instrument.
5. Understand the manual-testing problem.
6. See the digital transformation.
7. Enter the application.
8. Log in.
9. Create an evaluation.
10. Register/select an instrument.
11. Enter technical specifications.
12. Enter laboratory/environmental conditions.
13. Select applicable configured tests.
14. Enter observations.
15. See calculations update.
16. See compliance state update.
17. Attach photographs/documents.
18. Save and resume the evaluation.
19. Submit for review.
20. Reviewer reviews results.
21. Changes can be requested if necessary.
22. Evaluation is approved.
23. Report is generated.
24. Report is exported.
25. Report appears in repository.
26. Instrument history contains the evaluation.
27. Audit history records important actions.
28. Dashboard analytics reflect the evaluation.
29. User permissions prevent unauthorized actions.
30. Historical report data remains traceable to its ruleset/version.

---

# 29. FINAL QUALITY BAR

The project must satisfy both sides of the product.

## EXPERIENCE QUALITY

The public website should feel:

- Immersive
- 3D
- Cinematic
- Interactive
- Aesthetic
- Premium
- Scroll-driven
- Memorable

## SOFTWARE QUALITY

The application should feel:

- Professional
- Accurate
- Traceable
- Secure
- Modular
- Maintainable
- Fast
- Accessible
- Report-ready

## PRODUCT QUALITY

The platform should clearly demonstrate:

- Digitalization of NAWI testing
- Automated calculations
- Configurable compliance rules
- Standardized reporting
- Reduced manual repetition
- Centralized history
- Role-based workflow
- Auditability
- Extensibility

---

# 30. MASTER BUILD SEQUENCE

The recommended execution sequence is:

```text
01 Project Initialization
        ↓
02 Domain Research & Requirements
        ↓
03 Reference Collection
        ↓
04 Architecture
        ↓
05 Design System
        ↓
06 3D Architecture
        ↓
07 Database + Auth + RBAC
        ↓
08 OIML Rules + Calculation Engine
        ↓
09 Instruments + Evaluations
        ↓
10 Test Workspace
        ↓
11 Review + Approval
        ↓
12 Report Engine
        ↓
13 Repository + Analytics
        ↓
14 Immersive Public Website
        ↓
15 Integration + QA + Security
        ↓
16 Deployment + Documentation
        ↓
17 Maintenance + Future Rulesets
```

---

# 31. PROJECT SUCCESS DEFINITION

The project succeeds when it is no longer just a prototype website.

It should function as a coherent digital product in which:

**The public experience explains the product.**

**The 3D experience demonstrates the concept.**

**The application performs the workflow.**

**The calculation engine performs the technical logic.**

**The compliance engine explains the result.**

**The report engine produces the document.**

**The repository preserves the record.**

**The audit system preserves trust.**

**The architecture allows future standards/ruleset updates.**
