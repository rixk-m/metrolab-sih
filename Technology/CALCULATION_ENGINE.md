# Measurement & Calculation Engine

The calculation engine should be isolated from the user interface.

## Core Inputs
- Nominal/load value
- Instrument indication
- Scale interval
- Accuracy class
- Applicable permissible error
- Test condition

## Core Outputs
- Error
- Permissible error
- Pass/Fail
- Test metadata

## Recommended Pattern

Input → Normalize → Calculate → Compare → Record → Report

## Important
Regulatory thresholds and test rules should be maintained as versioned configuration/data rather than scattered throughout UI code.

The implementation must be validated against the applicable official standard and regulatory requirements before being used for real-world legal-metrology decisions.
