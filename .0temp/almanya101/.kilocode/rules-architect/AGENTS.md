# Architect Mode Rules (Non-Obvious Only)

## Hybrid Architecture Constraints

- **Next.js + Static HTML**: Project serves both Next.js App Router routes AND static HTML files from root directories
- **Static file route**: `app/[...slug]/route.ts` serves files from root directories with path traversal protection
- **API compatibility layer**: `app/api/[...slug]/route.ts` wraps legacy Express-style handlers in `/api/*.js`

## Security Architecture

- **Path traversal**: `BLOCKED_TOP_LEVEL` and `BLOCKED_ROOT_FILES` sets in `app/[...slug]/route.ts`
- **Origin validation**: `ALLOWED_ORIGINS` set in each API handler
- **Bearer token auth**: `getSupabaseUserFromRequest()` in `_supabase-user.js`
- **Admin auth**: `verifyAdminKey()` in `_devuser-admin.js` with rate limiting
- **CSP headers**: Configured in `vercel.json` - allows `cdn.jsdelivr.net`, `cdn.tailwindcss.com`, `*.supabase.co`

## Database Architecture

- **RLS policies**: Protect sensitive data (e.g., WhatsApp numbers in tournament tables)
- **Public views**: `*_public` views exclude sensitive fields for frontend queries
- **Tournament pattern**: Anon users can INSERT (register) but not SELECT/UPDATE/DELETE; authenticated users have full access

## Session Token Design

- **Custom format**: NOT JWT - uses `base64url(payload).hmac_signature`
- **TTL**: 12 hours
- **Signing**: HMAC-SHA256 with `DEVUSER_AUTH_SECRET` env var
- **Implementation**: `_devuser-auth.js`

## Client-Side Config Loading

- **Dynamic path calculation**: `devuser/supabase-config.js` calculates API path based on URL depth
- **Runtime key probing**: `api/supabase-config.js` probes Supabase to find working key
- **Cache**: 5-minute key cache with fallback

## Static Directory Management

- **New directories**: Must be added to `STATIC_TRACE_GLOBS` in `next.config.ts`
- **File resolution**: exact path → path.html → path/index.html

## Deployment

- **Platform**: Vercel with Next.js framework
- **GitHub Actions**: Manual trigger only (`workflow_dispatch`) - auto-deploy disabled
