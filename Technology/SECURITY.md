# Security & Privacy

## Authentication
- Use Supabase Auth or equivalent managed authentication.
- Protect private routes.
- Use secure session handling.

## Authorization
Suggested roles:
- Admin
- Laboratory/Inspector
- Tester
- Reviewer
- Viewer

Permissions should be enforced server-side.

## Database Security
- Use Row Level Security where applicable.
- Do not expose service-role credentials to the browser.
- Use parameterized queries / ORM-safe operations.

## File Security
- Validate file type and size.
- Store private evidence in protected storage.
- Generate controlled access URLs.
- Avoid exposing internal storage paths.

## Application Security
- Validate input with Zod.
- Sanitize user-generated content.
- Protect against unauthorized state changes.
- Keep secrets in environment variables.
- Never commit `.env` files.

## Auditability
Important events should be logged, including:
- Login/security events
- Instrument creation/update
- Test creation
- Measurement submission
- Test completion
- Report generation
- Role/permission changes
