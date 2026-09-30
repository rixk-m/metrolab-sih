# Deployment

## Recommended Hosting
Frontend/application: Vercel

Database/Auth/Storage: Supabase

Source control: GitHub

## Deployment Flow

Developer
  ↓
GitHub
  ↓
Vercel Build
  ↓
Production Application
  ↓
Supabase Database/Auth/Storage

## Pre-Deployment Checklist
- Environment variables configured
- Database migrations applied
- Authentication configured
- RLS policies reviewed
- Production build succeeds
- API authorization tested
- File upload permissions tested
- Audit logging verified
- No secrets committed
