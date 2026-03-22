# Debug Mode Rules

## Supabase Integration (NOW ACTIVE)

- `lib/supabase/client.ts` - Browser client using `@supabase/ssr`
- `lib/supabase/server.ts` - Server client with cookie handling
- `lib/supabase/devuser.ts` - Special client fetching config from `/api/supabase-config/`

## Environment

- Check `.env.local` for environment variables (not committed to git)
- Dev server runs on `http://localhost:3000` via `npm run dev`
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## API Routes

- `/api/health/` - Health check endpoint
- `/api/supabase-config/` - Returns Supabase config for client-side
- `/api/devuser/list/` - Dev user listing (development only)
- `/api/devuser-count/` - Dev user count (development only)

## DevUser Dashboard

- Uses `DevUserShell` component with CSS from `app/(devuser)/devuser-shell.css`
- Canvas background via `DevUserCanvas` component
- Page controller via `DevUserPageController` component
