# CSP Fix Tracking Document

Created: 2026-03-03
Status: COMPLETED
Method: Systematic Debugging

---

## Issue 1: CSP Violations [COMPLETED]

### Root Cause
Missing domains in Content-Security-Policy header.

### Changes Made to vercel.json

**New CSP:**
```
script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdn.tailwindcss.com gc.zgo.at www.clarity.ms
style-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdn.tailwindcss.com fonts.googleapis.com
font-src 'self' data: fonts.gstatic.com
connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co cdn.jsdelivr.net
```

---

## Issue 2: Supabase Config Exposure [COMPLETED]

### Root Cause
Hardcoded Supabase URL and anon key in supabase-config.js visible in browser Sources tab.

### Changes Made

1. **Created `/api/supabase-config.js`** - API endpoint that serves config from environment variables
2. **Updated `supabase-config.js`** - Now fetches config from API endpoint asynchronously
3. **Created `.env.example`** - Template for required environment variables
4. **Updated `typing.html`** - Made getSupabaseClient() async

### Required Environment Variables
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## Issue 3: RLS Policy Vulnerability [COMPLETED]

### Root Cause
Tournament tables (`typing_participants`, `tavla_participants`, etc.) had permissive RLS policies:
```sql
-- VULNERABLE: Everyone can read ALL data including WhatsApp
CREATE POLICY "Typing: Herkes okuyabilir" ON typing_participants
    FOR SELECT USING (true);  -- ← Exposes all data!
```

### Changes Made

1. **Created migration `20260303120000_fix_tournament_rls_policies.sql`**
   - Dropped permissive policies
   - Created secure public views (hide WhatsApp, LinkedIn)
   - Added proper RLS policies:
     - Anon: Can INSERT (for registration), cannot SELECT
     - Authenticated: Can read/update own records only

2. **Created public views:**
   - `typing_participants_public`
   - `tavla_participants_public`
   - `vct_participants_public`
   - `promote_participants_public`
   - `typing_bracket_public`
   - `tavla_bracket_public`

3. **Updated `typing.html`:**
   - SELECT queries use `*_public` views
   - INSERT still goes to main table (allowed)

### Security Model After Fix

| User Type | SELECT | INSERT | UPDATE |
|-----------|--------|--------|--------|
| Anon | ❌ Blocked | ✅ Allowed | ❌ Blocked |
| Authenticated | ✅ Own only | ✅ Allowed | ✅ Own only |
| Service Role | ✅ Full | ✅ Full | ✅ Full |

---

## Deployment Steps

1. **Set environment variables in Vercel:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. **Run SQL migration in Supabase:**
   ```bash
   supabase db push
   ```

3. **Deploy to Vercel:**
   ```bash
   git push
   ```

---

## Files Modified

- `vercel.json` - CSP headers
- `api/supabase-config.js` - New API endpoint
- `devuser/supabase-config.js` - Async config loading
- `devuser/typing.html` - Public view usage, async client
- `supabase/migrations/20260303120000_fix_tournament_rls_policies.sql` - New migration
- `.env.example` - Environment variable template
