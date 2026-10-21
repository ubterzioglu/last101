import { expect, test } from '@playwright/test';

/**
 * Anonim ziyaretçi üyelik kapısındaki araçlara erişememeli; /giris?next=<path>
 * adresine yönlenmeli. Liste lib/utils/gated-routes.ts GATED_PREFIXES ile
 * senkron tutulmalı. Araç akış testleri e2e/tools/ altında (auth'lu) koşar.
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

for (const route of GATED_PREFIXES) {
  test(`anonim istek ${route} için /giris'e yönlenir`, async ({ page }) => {
    await page.goto(route);

    await expect(page).toHaveURL(new RegExp(`/giris\\?next=${encodeURIComponent(route)}`));
    await expect(page.locator('#email')).toBeVisible();
  });
}
