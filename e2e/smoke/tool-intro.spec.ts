import { expect, test } from '@playwright/test';

/**
 * Araç URL'leri indekslenebilir: anonim ziyaretçi aynı adreste 200 ile
 * sunucudan render edilen tanıtım içeriği görür; etkileşimli akış ücretsiz
 * üyelik gerektirir. Liste lib/utils/gated-routes.ts TOOL_PREFIXES ile
 * senkron tutulmalı. /software-hub bir içerik sayfası değil üye alanı
 * girişidir ve panoya yönlenmeye devam eder.
 */
const TOOL_PREFIXES = [
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  '/almanya-maas-beklentisi',
  '/almanya-yasam-tarzi-uyumu',
  '/almanya-yolunu-sec',
  '/almanyada-is-bulma-olasiligi',
  '/almanyaya-hazir-misin',
  '/hangi-sehir-sana-uygun',
  '/ilk-90-gun-planlayici',
  '/kariyer-ve-egitim-rotasi',
  '/once-hangi-sorunu-cozmelisin',
  '/topluluk-ve-danismanlik',
] as const;

for (const route of TOOL_PREFIXES) {
  test(`anonim istek ${route} için 200 ile tanıtım içeriği döner`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response, `${route} yanıt vermedi`).not.toBeNull();
    expect(response!.status(), `${route} durum kodu`).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.locator(`a[href="/giris?next=${encodeURIComponent(route)}"]`).first()
    ).toBeVisible();
  });
}

test('üye alanı girişi /software-hub panoya yönlenir', async ({ page }) => {
  await page.goto('/software-hub');

  await expect(page).toHaveURL(/\/devuser\//);
});
