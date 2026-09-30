# System Architecture

## High-Level Flow

User
  ↓
Next.js Web Interface
  ↓
Authentication / Authorization
  ↓
Application API / Server Actions
  ↓
Business Logic
  ├── Instrument Management
  ├── Test Management
  ├── OIML R76 Test Rules
  ├── Calculations
  ├── Reports
  └── Audit Logs
  ↓
PostgreSQL Database
  +
Supabase Storage

## Main Modules

### 1. Authentication
- Login/logout
- Role-based permissions
- Protected routes

### 2. Instrument Registry
Stores:
- Manufacturer
- Model
- Instrument type
- Capacity
- Verification scale interval
- Accuracy class
- Serial/model information

### 3. Test Management
Supports:
- Test creation
- Test execution
- Measurements
- Pass/fail status
- Evidence attachments
- Tester information

### 4. Compliance Engine
Responsible for:
- Applying configured test rules
- Measurement calculations
- Error calculations
- Tolerance checks
- Final test status

### 5. Reporting
Generates:
- Test summaries
- Detailed results
- Compliance reports
- Evidence references
- Audit information

### 6. Audit Trail
Records important actions with:
- User
- Action
- Timestamp
- Entity
- Previous/new state where appropriate

## Recommended Architecture Pattern

Presentation → Application → Domain/Rules → Data

This keeps regulatory/business rules independent from UI components.
