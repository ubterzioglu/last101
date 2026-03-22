We are modifying a Supabase Edge Function.

Before writing code:

1. Confirm current function behavior.
2. Confirm security layers:
   - Origin control
   - Rate limiting
   - Input validation
   - Duplicate checks (if register)
3. Confirm RLS expectations.
4. Ensure no security guarantees are weakened.

Rules:

- Do NOT remove origin checks.
- Do NOT remove rate limiting.
- Do NOT expose service role key.
- Do NOT allow direct table exposure.
- Do NOT bypass devuser_public view if not necessary.

After change:
Update STATE.md if behavior changes.

Now propose implementation safe

Example:
- Edge Function origin control: `const allowedOrigins = [
  "https://almanya101.de",
  "https://devuser.vercel.app",
  "http://localhost:3000"
]; `
- Never : "*"