import { expect, test } from '@playwright/test';

test('ana sayfa resmî adres kaydı bağlantısını ve haber durumunu gösterir', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);

  await expect(page.locator('a[href="https://service.berlin.de/dienstleistung/120686/"]'))
    .toHaveText('Berlin adres kaydı (Bürgeramt)');

  const archiveHeading = page.getByRole('heading', { name: 'Haber Arşivi' });
  if (await archiveHeading.count()) {
    await expect(page.getByText('Bu bölümdeki haberler geçmiş dönemlere aittir. Yayın tarihlerini kartlarda görebilirsiniz.'))
      .toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Almanya Haberleri Neleri Takip Etmeli?' }))
      .toBeVisible();
  }
});
