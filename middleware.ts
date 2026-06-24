import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Interactive tools that require a (free) membership. Visiting any of these
 * without a session redirects to /giris?next=<path>. Content/SEO pages, the
 * home page, and the existing admin/devuser/kose auth systems are NOT gated.
 */
const GATED_PREFIXES = [
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  '/software-hub',
];

function isGatedPath(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  // Refresh the Supabase session cookies on every matched request.
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Gate only the interactive tools; everything else just gets a refreshed session.
  if (isGatedPath(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/giris';
    redirectUrl.search = '';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  /**
   * Run on all paths except Next.js internals, static assets and API routes.
   * This keeps session cookies fresh site-wide while the gating logic above
   * applies only to GATED_PREFIXES. admin/devuser/kose pass through untouched
   * (cookie refresh only, no redirect).
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$).*)',
  ],
};
