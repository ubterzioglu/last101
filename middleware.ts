import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Refresh the Supabase session cookies on every matched request.
  //
  // Interactive tool URLs are indexable: anonymous visitors get a
  // server-rendered intro (200) from the tool page itself and logged-in users
  // get the interactive tool at the same address (see lib/tools/access.ts and
  // components/tools/ToolIntroPanel.tsx). The middleware therefore no longer
  // redirects; personal APIs keep their own authorization checks.
  const { response } = await updateSession(request);

  return response;
}

export const config = {
  /**
   * Run on all paths except Next.js internals, static assets and API routes.
   * This keeps session cookies fresh site-wide. admin/devuser/kose pass
   * through untouched (cookie refresh only).
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$).*)',
  ],
};
