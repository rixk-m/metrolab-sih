# MetroLab — Design System v1.0

A practical UI foundation for the MetroLab SIH application, focused on a professional government/engineering workflow: instrument records, testing, standards, verification, reporting and auditability.

## Visual direction
- Premium, minimal, technical and trustworthy
- Light + dark mode
- Dense enough for operational dashboards, but never visually crowded
- Clear hierarchy, restrained color and strong data readability

## Core principles
1. Accuracy first — measurement values and test states must be easy to scan.
2. Evidence over decoration — UI should prioritize records, results, standards and audit trails.
3. Semantic states — PASS, FAIL, PENDING and REVIEW must remain understandable without color.
4. Consistency — use the shared tokens rather than one-off colors, spacing or radii.
5. Accessibility — visible focus states, keyboard support, adequate contrast and non-color status cues.

## Suggested application shell
Top header: MetroLab logo/name, workspace/context, notifications, theme switcher, user menu.
Left sidebar: Dashboard, Instruments, Test Bench, Test Runs, Standards / R76, Reports, Audit Log, Settings.
Main area: page title + context/actions + content.
Right-side drawers: optional for filters, test details or quick actions.

## Recommended dashboard
KPI row → Test/verification activity → instrument/test queue → recent results → alerts/exceptions.

## Suggested typography hierarchy
Display: 36–48px / bold
Page title: 24–30px / semibold
Section title: 18–20px / semibold
Body: 14–16px / regular
Metadata: 12–14px / medium
Measurement data: mono/tabular numerals where precision matters.

## Files
- tokens/design-tokens.json — design tokens
- css/metrolab-tokens.css — CSS variables for light/dark mode
- components/ — reusable component rules
