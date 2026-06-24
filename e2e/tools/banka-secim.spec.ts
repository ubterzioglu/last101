import { test, expect } from '@playwright/test';

/**
 * Faz 3 — Banka Seçim Aracı (/banka-secim). Authenticated (chromium-auth).
 * Fully client-side (data.ts), deterministic — no Supabase dependency.
 *
 * Real behavior (BankaClient.tsx + data.ts):
 *  - 20 questions; each option is a button. Selecting auto-advances.
 *  - "Soru X / 20" progress; "← Geri" disabled on Q1.
 *  - After Q20 -> "Sonuç" with 3 ranked recommendations + "Sonucu Kopyala".
 */

const TOTAL_QUESTIONS = 20;

test.describe('Banka Seçim Aracı', () => {
  test('giriş sonrası ilk soru ekranı görünür', async ({ page }) => {
    await page.goto('/banka-secim');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: 'Banka Seçim Aracı' })).toBeVisible();
    await expect(page.getByText(`Soru 1 / ${TOTAL_QUESTIONS}`)).toBeVisible();
    // İlk soruda "Geri" pasif.
    await expect(page.getByRole('button', { name: /Geri/ })).toBeDisabled();
  });

  test('şık seçince otomatik bir sonraki soruya ilerler', async ({ page }) => {
    await page.goto('/banka-secim');

    await expect(page.getByText('Soru 1 / 20')).toBeVisible();
    // İlk sorudaki ilk seçeneğe tıkla (soru kartındaki ilk option butonu).
    await firstOption(page).click();

    // Otomatik ilerleme: artık Soru 2.
    await expect(page.getByText('Soru 2 / 20')).toBeVisible();
    await expect(page.getByRole('button', { name: /Geri/ })).toBeEnabled();
  });

  test('20 soru tamamlanınca 3 öneri ile sonuç ekranı gelir', async ({ page }) => {
    await page.goto('/banka-secim');

    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      await expect(page.getByText(`Soru ${i} / ${TOTAL_QUESTIONS}`)).toBeVisible();
      await firstOption(page).click();
    }

    // Sonuç ekranı.
    await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Ana Öneri/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Alternatif/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Üçüncü Seçenek/ })).toBeVisible();

    // Uygunluk skoru gösteriliyor.
    await expect(page.getByText(/Uygunluk Skoru:/).first()).toBeVisible();
    // Kopyala butonu var.
    await expect(page.getByRole('button', { name: /Sonucu Kopyala/ })).toBeVisible();
  });

  test('sonuç ekranında Sıfırla ilk soruya döndürür', async ({ page }) => {
    await page.goto('/banka-secim');
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      await firstOption(page).click();
    }
    await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeVisible();

    // Sonuç ekranındaki Sıfırla butonu (turuncu).
    await page.getByRole('button', { name: 'Sıfırla' }).click();
    await expect(page.getByText('Soru 1 / 20')).toBeVisible();
  });
});

/**
 * The first answer option inside the question card. Options are buttons whose
 * first child is the bold label; we scope to the yellow question card to avoid
 * matching nav/info buttons.
 */
function firstOption(page: import('@playwright/test').Page) {
  return page
    .locator('div.border-google-yellow')
    .getByRole('button')
    .first();
}
