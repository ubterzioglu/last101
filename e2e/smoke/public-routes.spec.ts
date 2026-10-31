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

// Blog routes: DB-free assertions only. The legacy /yazi-dizisi tree is a
// permanent redirect (308) to /blog, handled in next.config; /blog and the
// editorial author page render without any seeded data (code fallback).
const REDIRECT_OPTIONS = { maxRedirects: 0 } as const;
const UUID_ZERO = '00000000-0000-0000-0000-000000000000';

function locationPath(location: string | undefined): string {
  if (!location) return '';
  return location.startsWith('http') ? new URL(location).pathname : location;
}

test('legacy /yazi-dizisi redirects permanently to /blog', async ({ request }) => {
  const response = await request.get('/yazi-dizisi', REDIRECT_OPTIONS);

  expect(response.status()).toBe(308);
  expect(locationPath(response.headers()['location'])).toBe('/blog');
});

test('legacy /yazi-dizisi post URL redirects permanently to the same /blog slug', async ({ request }) => {
  const response = await request.get(`/yazi-dizisi/x--${UUID_ZERO}`, REDIRECT_OPTIONS);

  expect(response.status()).toBe(308);
  expect(locationPath(response.headers()['location'])).toBe(`/blog/x--${UUID_ZERO}`);
});

test('/blog returns 200 with one h1 and its canonical URL', async ({ page }) => {
  const pageErrors = trackErrors(page);
  const response = await page.goto('/blog', { waitUntil: 'domcontentloaded' });

  expect(response, 'no response for /blog').not.toBeNull();
  expect(response!.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://almanya101.de/blog');
  expect(pageErrors, `page errors on /blog: ${pageErrors.join(' | ')}`).toHaveLength(0);
});

test('/blog/yazar/almanya101 returns 200 with one h1 (code fallback author)', async ({ page }) => {
  const pageErrors = trackErrors(page);
  const response = await page.goto('/blog/yazar/almanya101', { waitUntil: 'domcontentloaded' });

  expect(response, 'no response for /blog/yazar/almanya101').not.toBeNull();
  expect(response!.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  expect(pageErrors, `page errors: ${pageErrors.join(' | ')}`).toHaveLength(0);
});

test('root /almanya101 shim redirects permanently to the author page', async ({ request }) => {
  const response = await request.get('/almanya101', REDIRECT_OPTIONS);

  expect(response.status()).toBe(308);
  expect(locationPath(response.headers()['location'])).toBe('/blog/yazar/almanya101');
});

test('unknown root slug returns 404', async ({ request }) => {
  const response = await request.get('/bu-yazar-yok-e2e-0000', REDIRECT_OPTIONS);

  expect(response.status()).toBe(404);
});
