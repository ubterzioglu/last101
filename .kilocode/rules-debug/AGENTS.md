# Debug Mode Rules

## Non-Obvious Debugging Info

### DevUser Client Quirks
- `getDevUserClient()` fetches config dynamically from `/api/supabase-config/` instead of using env vars directly
- Session persistence is DISABLED in devuser client (`persistSession: false`)

### Header/Footer Visibility
- Header/Footer hide when `body[data-devuser]` attribute is set
- Admin and devuser pages must set `document.body.setAttribute('data-devuser', 'true')`

### Admin Auth
- Rate limit: 12 attempts / 15 min, then 30 min block
- Two modes: simple (`ADMIN_PANEL_PASSWORD`) or DB mode (`admin_api_keys` table with PBKDF2)

### Build Failures
- Docker build FAILS on ESLint issues - always run `npm run lint` before deploy
- Missing `SUPABASE_SERVICE_ROLE_KEY` breaks admin service mode
- Wrong service key causes "Invalid API key" errors

### API Routes for Debugging
- `/api/health/` - Health check endpoint
- `/api/supabase-config/` - Returns Supabase config for client-side
