import { test, expect } from '@playwright/test';

/**
 * Public route smoke — self-contained, no shared state, no seeding.
 *
 * IMPORTANT context (verified against the running app, not the README):
 *  - Tool URLs are indexable: anonymous visits return 200 with a
 *    server-rendered intro (asserted in tool-intro.spec.ts). Tool internals
 *    need an authenticated session — handled separately by the project owner.
 *  - Confirmed publicly reachable (anonymous, HTTP 200): "/" and "/haberler".
 *    Other content routes are asserted leniently (must not 5xx / must not
 *    throw a runtime error) because availability depends on data/CMS state.
 */

// Strictly public — must return 200 for anonymous users.
const STRICT_PUBLIC: string[] = [
  '/',
  '/haberler',
  '/almanya-araclari',
  '/almanya-yolunu-sec',
  '/almanya-maas-beklentisi',
  '/almanyaya-hazir-misin',
  '/hangi-sehir-sana-uygun',
  '/topluluk-ve-danismanlik',
  '/kariyer-ve-egitim-rotasi',
  '/almanya-yasam-tarzi-uyumu',
  '/ilk-90-gun-planlayici',
  '/once-hangi-sorunu-cozmelisin',
  '/almanyada-is-bulma-olasiligi',
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
];

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
