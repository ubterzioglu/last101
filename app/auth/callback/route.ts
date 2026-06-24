import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth (Google) and email-confirmation return handler.
 *
 * Supabase redirects here with a `?code=` param after the user authenticates.
 * We exchange that code for a session (writing auth cookies via the cookie-aware
 * server client) and then redirect to the original `next` target.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');

  const rawNext = searchParams.get('next') ?? '/';
  // Open-redirect guard: only allow internal relative paths.
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed or no code present — send the user back to login with an error flag.
  return NextResponse.redirect(`${origin}/giris?error=auth`);
}
