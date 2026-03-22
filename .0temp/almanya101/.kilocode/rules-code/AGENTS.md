# Code Mode Rules (Non-Obvious Only)

## API Handler Patterns

- **Legacy compatibility layer**: `app/api/[...slug]/route.ts` wraps `/api/*.js` handlers - it transforms Next.js Request to Express-style `function(req, res)` signature
- **Auth helper**: Always use `getSupabaseUserFromRequest(req)` from `_supabase-user.js` for Bearer token verification
- **Admin auth**: Use `verifyAdminKey()` from `_devuser-admin.js` for admin endpoints - it has rate limiting built-in (12 attempts/15 min, 30 min block)
- **Underscore prefix**: Files starting with `_` in `/api/` are helper modules, not direct endpoints

## Supabase Key Precedence

Env var fallback chain (in order):
1. `SUPABASE_SERVICE_ROLE_KEY` (server-only, preferred)
2. `SUPABASE_SERVICE_KEY`
3. `SUPABASE_ANON_KEY`
4. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Revoked keys are tracked in `REVOKED_PUBLIC_KEYS` set in `_supabase-user.js`.

## Static File Serving

- New static directories must be added to `STATIC_TRACE_GLOBS` in `next.config.ts`
- Path traversal protection uses `BLOCKED_TOP_LEVEL` and `BLOCKED_ROOT_FILES` sets in `app/[...slug]/route.ts`
- File resolution tries: exact path → path.html → path/index.html

## Client-Side Config Loading

`devuser/supabase-config.js` dynamically calculates API path based on page depth:
```javascript
const depth = (path.match(/\//g) || []).length - 1;
const prefix = depth > 0 ? '../'.repeat(depth) : './';
```

## Shared Components

`shared-cards.js` uses `data-shared-card="contact|footer"` placeholders. Path resolution via `assetBase()` calculates relative paths from `window.location.pathname`.

## Database Schema Fallback

`insertWithSchemaFallback()` in `devuser-register.js` handles schema drift by removing columns that don't exist - check `removableColumns` set when adding new fields.

## Session Tokens

Custom session tokens in `_devuser-auth.js` use format: `base64url(payload).hmac_signature` with 12-hour TTL. Not JWT - custom format.
