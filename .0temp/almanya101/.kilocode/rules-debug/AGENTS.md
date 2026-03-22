# Debug Mode Rules (Non-Obvious Only)

## API Debugging

- **Legacy API wrapper errors**: Check `app/api/[...slug]/route.ts` - it catches errors and returns `{ error: 'Internal server error' }` with 500 status
- **Handler not found**: Returns `{ error: 'Not found' }` with 404 - means no matching `.js` file in `/api/` or file doesn't export default function
- **Auth failures**: `getSupabaseUserFromRequest()` returns `null` silently - check Supabase key validity and token format

## Admin Auth Issues

- **Rate limiting**: `_devuser-admin.js` blocks after 12 failed attempts for 30 minutes per IP+URL combination
- **Attempt tracking**: Stored in-memory `adminAttemptStore` Map - resets on server restart
- **Multiple auth headers**: Checks `x-admin-key`, `x-bookmarks-admin-key`, `x-admin-password`, `x-admin-token`, and `Authorization: Bearer` in order

## Static File 404s

- **Path resolution order**: exact path → path.html → path/index.html
- **Blocked paths**: Check `BLOCKED_TOP_LEVEL` set (`.git`, `.github`, `.idea`, `.vscode`, `.vercel`, `.astro`, `.claude`, `.serena`, `node_modules`, `api`, `supabase`)
- **Blocked root files**: `.env`, `.env.local`, `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `vercel.json`

## Supabase Connection Issues

- **Key probing**: `supabase-config.js` API probes keys at runtime - check `isWorkingPublishableKey()` for connectivity
- **Key cache**: 5-minute cache in `keyProbeCache` - may need to wait or restart for new keys
- **CORS errors**: Check `allowedOrigins` array in `api/supabase-config.js`

## Session Token Issues

- **Custom format**: Not JWT - uses `base64url(payload).hmac_signature` format
- **TTL**: 12 hours from `TOKEN_TTL_SECONDS` in `_devuser-auth.js`
- **Secret**: Requires `DEVUSER_AUTH_SECRET` env var - tokens invalid without it

## Client-Side Config Loading

- **Path calculation**: `devuser/supabase-config.js` calculates depth from `window.location.pathname`
- **Error exposure**: Failures stored in `window.ALMANYA101_SUPABASE_ERROR`
- **Config object**: Loaded config stored in `window.ALMANYA101_SUPABASE`
