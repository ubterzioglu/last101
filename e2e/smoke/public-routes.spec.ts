import { test, expect } from '@playwright/test';

/**
 * Public route smoke — self-contained, no shared state, no seeding.
 *
 * IMPORTANT context (verified against the running app, not the README):
 *  - middleware.ts gates 8 interactive tools behind login (GATED_PREFIXES):
 *    anonymous visits redirect to /giris. We assert the GATE works here,
 *    not the tool internals (those need an authenticated session — handled
 *    separately by the project owner).
 *  - Confirmed publicly reachable (anonymous, HTTP 200): "/" and "/haberler".
 *    Other content routes are asserted leniently (must not 5xx / must not
 *    throw a runtime error) because availability depends on data/CMS state.
 */

// Strictly public — must return 200 for anonymous users.
const STRICT_PUBLIC: string[] = ['/', '/haberler'];

// Content routes that should at least not error (200/3xx/404 acceptable; never 5xx, never JS crash).
const LENIENT_PUBLIC: string[] = [
  '/belgeler',
  '/hizmet-rehberi',
  '/yazi-dizisi',
  '/blog',
  '/hakkimizda',
  '/iletisim',
  '/impressum',
  '/rehber',
];

// Login-gated interactive tools (middleware.ts GATED_PREFIXES).
const GATED_TOOLS: string[] = [
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  '/software-hub',
];

function trackErrors(page: import('@playwright/test').Page): string[] {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  return pageErrors;
}

for (const route of STRICT_PUBLIC) {
  test(`strict public ${route} returns 200 without errors`, async ({ page }) => {
    const pageErrors = trackErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response, `no response for ${route}`).not.toBeNull();
    expect(response!.status(), `status for ${route}`).toBe(200);
    await expect(page.locator('body')).toBeVisible();
    expect(pageErrors, `page errors on ${route}: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });
}

for (const route of LENIENT_PUBLIC) {
  test(`public ${route} does not 5xx or crash`, async ({ page }) => {
    const pageErrors = trackErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response, `no response for ${route}`).not.toBeNull();
    // Server errors are never acceptable; 404 may be legitimate (data-driven page).
    expect(response!.status(), `5xx on ${route}`).toBeLessThan(500);
    expect(pageErrors, `page errors on ${route}: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });
}

for (const tool of GATED_TOOLS) {
  test(`gated tool ${tool} is not publicly accessible to anonymous users`, async ({ page, baseURL }) => {
    await page.goto(tool, { waitUntil: 'domcontentloaded' });

    // The login gate must prevent anonymous access. The gate is considered
    // working if the anonymous user does NOT end up on the exact tool URL with
    // the tool actually served. In production this redirects to /giris; in
    // other environments it may land elsewhere (e.g. a 404). The one thing that
    // must never happen: the bare tool path served directly to an anon user.
    const finalUrl = new URL(page.url());
    const exactToolUrl = finalUrl.pathname === tool;

    // If still on the exact tool path, the gate failed to redirect — that's a fail.
    expect(exactToolUrl, `anon user reached ${tool} directly (gate bypassed)`).toBe(false);
  });
}
