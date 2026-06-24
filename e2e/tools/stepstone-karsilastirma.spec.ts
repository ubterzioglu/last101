import { test, expect } from '@playwright/test';

/**
 * Faz 7 — Stepstone 2026 Karşılaştırma (/stepstone-karsilastirma). Authenticated.
 * Client-side comparison form (StepstoneClient.tsx), deterministic.
 * Verified against production DOM (discovery run).
 *
 * Real behavior:
 *  - "Profil Bilgileri" form: salary input (placeholder "4500") + 8 selects.
 *  - PRODUCTION requires ALL fields; an incomplete form shows
 *    "Eksik alanlar: ..." instead of a result.
 *  - With every field filled, "Karşılaştır" produces a comparison (Stepstone
 *    medians + the user's yearly gross).
 */

async function fillAllSelects(page: import('@playwright/test').Page) {
  const selects = page.locator('select');
  const count = await selects.count();
  for (let i = 0; i < count; i++) {
    // index 1 skips the "Seç" placeholder (index 0).
    await selects.nth(i).selectOption({ index: 1 });
  }
}

const PARSE_EUR = (text: string): number =>
  Number(text.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));

test.describe('Stepstone Karşılaştırma', () => {
  test('giriş sonrası profil formu görünür, sonuç gizli', async ({ page }) => {
    await page.goto('/stepstone-karsilastirma');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: 'Stepstone 2026 Karşılaştırma' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Profil Bilgileri' })).toBeVisible();
    await expect(page.getByPlaceholder('4500')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Karşılaştır' })).toBeVisible();

    // Henüz karşılaştırma yapılmadı: medyan sonucu yok.
    await expect(page.getByText(/Median:/)).toHaveCount(0);
  });

  test('eksik alanlarla Karşılaştır "Eksik alanlar" uyarısı verir', async ({ page }) => {
    await page.goto('/stepstone-karsilastirma');

    // Sadece maaş gir, selectleri boş bırak.
    await page.getByPlaceholder('4500').fill('4500');
    await page.getByRole('button', { name: 'Karşılaştır' }).click();

    // Production tüm alanları zorunlu tutar.
    await expect(page.getByText(/Eksik alanlar/)).toBeVisible();
  });

  test('tüm alanlar dolu: Karşılaştır medyan karşılaştırması üretir', async ({ page }) => {
    await page.goto('/stepstone-karsilastirma');

    await page.getByPlaceholder('4500').fill('4500');
    await fillAllSelects(page);
    await page.getByRole('button', { name: 'Karşılaştır' }).click();

    // Artık eksik alan uyarısı olmamalı.
    await expect(page.getByText(/Eksik alanlar/)).toHaveCount(0);

    // Stepstone medyan karşılaştırması görünür (sonuç üretildi).
    await expect(page.getByText(/Median:/).first()).toBeVisible({ timeout: 10_000 });

    // Yıllık brüt (aylık 4500 × 12 = 54.000) sonuçta yer alır.
    await expect(page.getByText(/54\.000/).first()).toBeVisible();
  });
});
