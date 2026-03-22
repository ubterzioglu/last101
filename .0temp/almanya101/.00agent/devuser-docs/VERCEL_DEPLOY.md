We are preparing DevUser for Vercel deployment.

Confirm:

- Frontend is static (HTML/CSS/JS only)
- No server runtime required
- Supabase Edge Functions remain external

Steps:

1. Ensure no local-only URLs exist.
2. Ensure Edge Function URLs use production Supabase URL.
3. Confirm CORS origin includes Vercel domain.
4. Confirm environment variables are NOT exposed in frontend.
5. Confirm no service role key in frontend code.

After deployment changes:
Update STATE.md:
Deployment → Vercel

Now provide safe deployment instru