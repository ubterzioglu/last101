import { expect, test } from '@playwright/test';

/**
 * Analitik izin akışı: Google Analytics, GoatCounter ve Microsoft Clarity
 * yalnızca açık kabul sonrası yüklenir; ret sonrası yüklenmez; tercih
 * kalıcıdır ve alt bilgiden geri alınabilir.
 */
const ANALYTIC_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'gc.zgo.at',
  'goatcounter.com',
  'clarity.ms',
];

function analyticRequests(urls: string[]) {
  return urls.filter((u) => ANALYTIC_HOSTS.some((host) => u.includes(host)));
}

const banner = (page: import('@playwright/test').Page) =>
  page.getByRole('region', { name: 'Çerez ve analitik tercihleri' });

test('izin öncesi ve ret sonrası hiçbir analitik istek yapılmaz', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (req) => requests.push(req.url()));

  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  expect(analyticRequests(requests)).toHaveLength(0);

  await page.getByRole('button', { name: 'Reddet' }).click();
  await expect(banner(page)).toBeHidden();

  await page.reload();
  await page.waitForLoadState('networkidle');
  expect(analyticRequests(requests)).toHaveLength(0);
  await expect(banner(page)).toBeHidden();
});

test('kabul sonrası betikler yüklenir, tercih kalıcıdır ve geri alınabilir', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (req) => requests.push(req.url()));

  await page.goto('/');
  await page.getByRole('button', { name: 'Analitik çerezlere izin ver' }).click();

  await expect.poll(() => analyticRequests(requests).length).toBeGreaterThan(0);

  await page.reload();
  await expect(banner(page)).toBeHidden();

  await page.getByRole('button', { name: 'Çerez tercihleri' }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(banner(page)).toBeVisible();
});
