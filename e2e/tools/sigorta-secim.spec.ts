import { test, expect } from '@playwright/test';

/**
 * Faz 4 — Sigorta Seçim Aracı (/sigorta-secim). Authenticated (chromium-auth).
 * Fully client-side (data.ts), deterministic — no Supabase dependency.
 *
 * Real behavior (SigortaClient.tsx + data.ts):
 *  - 20 questions; selecting an option auto-advances.
 *  - "Soru X / 20" progress; "← Geri" disabled on Q1.
 *  - After Q20 -> "Sonuç" classified into must/should/nice with "Skor:" values
 *    and a "Sonucu Kopyala" button.
 */

const TOTAL_QUESTIONS = 20;

function firstOption(page: import('@playwright/test').Page) {
  return page.locator('div.border-google-yellow').getByRole('button').first();
}

test.describe('Sigorta Seçim Aracı', () => {
  test('giriş sonrası ilk soru ekranı görünür', async ({ page }) => {
    await page.goto('/sigorta-secim');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: 'Sigorta Seçim Aracı' })).toBeVisible();
    await expect(page.getByText(`Soru 1 / ${TOTAL_QUESTIONS}`)).toBeVisible();
    await expect(page.getByRole('button', { name: /Geri/ })).toBeDisabled();
  });

  test('şık seçince otomatik ilerler', async ({ page }) => {
    await page.goto('/sigorta-secim');
    await expect(page.getByText('Soru 1 / 20')).toBeVisible();
    await firstOption(page).click();
    await expect(page.getByText('Soru 2 / 20')).toBeVisible();
  });

  test('20 soru tamamlanınca skorlu sonuç ekranı gelir', async ({ page }) => {
    await page.goto('/sigorta-secim');

    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      await expect(page.getByText(`Soru ${i} / ${TOTAL_QUESTIONS}`)).toBeVisible();
      await firstOption(page).click();
    }

    await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeVisible();
    // En az bir sigorta önerisi skoruyla görünür.
    await expect(page.getByText(/Skor:/).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Sonucu Kopyala/ })).toBeVisible();
  });

  test('sonuç ekranında Sıfırla ilk soruya döndürür', async ({ page }) => {
    await page.goto('/sigorta-secim');
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      await firstOption(page).click();
    }
    await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Sıfırla' }).click();
    await expect(page.getByText('Soru 1 / 20')).toBeVisible();
  });
});
