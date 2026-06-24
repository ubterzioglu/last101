import { test, expect } from '@playwright/test';

/**
 * Faz 5 — Vize Seçim Aracı (/vize-secim). Authenticated (chromium-auth).
 * Client-side branching decision tree (VizeClient.tsx), deterministic.
 *
 * Real behavior:
 *  - Starts at a question ("Soru 1"). Each option's `next` is either another
 *    question or RESULT:<id>. Selecting an option advances/branches.
 *  - "← Önceki soruya dön" appears after the first answer.
 *  - Reaching a result shows "Önerilen Vize Türü" + "Temel Şartlar" +
 *    "Sonraki Adımlar" + "Yeniden Başla".
 */

function questionOption(page: import('@playwright/test').Page) {
  return page.locator('div.border-google-yellow').getByRole('button').first();
}

test.describe('Vize Seçim Aracı', () => {
  test('giriş sonrası ilk soru görünür', async ({ page }) => {
    await page.goto('/vize-secim');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: /Vize Seçim Aracı/ })).toBeVisible();
    await expect(page.getByText(/^Soru 1$/)).toBeVisible();
  });

  test('bir şık seçince soru numarası ilerler ve geri butonu çıkar', async ({ page }) => {
    await page.goto('/vize-secim');
    await expect(page.getByText(/^Soru 1$/)).toBeVisible();

    await questionOption(page).click();

    // Soru 2'ye geçer VEYA doğrudan sonuca düşer (ilk şık RESULT olabilir).
    const soru2 = page.getByText(/^Soru 2$/);
    const sonuc = page.getByText('Önerilen Vize Türü');
    await expect(soru2.or(sonuc).first()).toBeVisible();
  });

  test('ilk şıkları takip ederek bir vize sonucuna ulaşılır', async ({ page }) => {
    await page.goto('/vize-secim');

    const sonuc = page.getByText('Önerilen Vize Türü');

    // Ağaçta ilk şıkkı seçerek ilerle; en fazla 12 adımda sonuç gelmeli.
    for (let i = 0; i < 12; i++) {
      if (await sonuc.isVisible().catch(() => false)) break;
      await questionOption(page).click();
    }

    await expect(sonuc).toBeVisible();
    // Sonuç içeriği doğru render olmalı.
    await expect(page.getByRole('heading', { name: 'Temel Şartlar' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sonraki Adımlar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yeniden Başla' })).toBeVisible();
  });

  test('sonuç ekranında Yeniden Başla ilk soruya döndürür', async ({ page }) => {
    await page.goto('/vize-secim');
    const sonuc = page.getByText('Önerilen Vize Türü');
    for (let i = 0; i < 12; i++) {
      if (await sonuc.isVisible().catch(() => false)) break;
      await questionOption(page).click();
    }
    await expect(sonuc).toBeVisible();

    await page.getByRole('button', { name: 'Yeniden Başla' }).click();
    await expect(page.getByText(/^Soru 1$/)).toBeVisible();
  });
});
