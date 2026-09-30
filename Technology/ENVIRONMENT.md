# Environment Configuration

Example `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=server_only_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

## Rules
- `.env.local` must remain local.
- Never upload secrets to GitHub.
- Production secrets should be configured through the deployment platform.
- Service-role credentials must only be used server-side.
