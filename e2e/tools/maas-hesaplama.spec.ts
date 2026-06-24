import { test, expect } from '@playwright/test';

/**
 * Faz 1 — Maaş Hesaplayıcı (/maas-hesaplama). Authenticated (chromium-auth).
 * Self-contained; each test navigates fresh. No shared state.
 *
 * Real behavior (MaasClient.tsx):
 *  - Defaults: amount=5000, period=monthly, type=gross.
 *  - Result cards hidden until "Hesapla" is clicked.
 *  - After calc: 6 cards (Net/Brüt/Kesinti × Aylık/Yıllık).
 *  - Breakdown sections ("Aylık Kesintiler"/"Yıllık Kesintiler") toggle open.
 */

const PARSE_EUR = (text: string): number =>
  Number(text.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));

const cardValue = (page: import('@playwright/test').Page, heading: string) =>
  page.getByRole('heading', { name: heading }).locator('xpath=following-sibling::div[1]');

test.describe('Maaş Hesaplayıcı', () => {
  test('giriş sonrası sayfa açılır, hesaplamadan önce sonuç yok', async ({ page }) => {
    await page.goto('/maas-hesaplama');

    // Login duvarını geçmiş olmalıyız.
    await expect(page).not.toHaveURL(/\/giris/);
    await expect(page.getByRole('button', { name: /^Hesapla$/ })).toBeVisible();

    // Sonuç kartları henüz yok.
    await expect(page.getByRole('heading', { name: 'Net Maaş (Aylık)' })).toHaveCount(0);
  });

  test('Hesapla 6 sonuç kartı üretir, brüt > net', async ({ page }) => {
    await page.goto('/maas-hesaplama');
    await page.getByRole('button', { name: /^Hesapla$/ }).click();

    for (const label of [
      'Net Maaş (Aylık)',
      'Net Maaş (Yıllık)',
      'Brüt Maaş (Aylık)',
      'Brüt Maaş (Yıllık)',
      'Toplam Kesinti (Aylık)',
      'Toplam Kesinti (Yıllık)',
    ]) {
      await expect(page.getByRole('heading', { name: label })).toBeVisible();
    }

    const net = PARSE_EUR(await cardValue(page, 'Net Maaş (Aylık)').innerText());
    const gross = PARSE_EUR(await cardValue(page, 'Brüt Maaş (Aylık)').innerText());

    expect(net).toBeGreaterThan(0);
    expect(gross).toBeGreaterThan(net);
  });

  test('aylık kesinti kırılımı açılır ve Lohnsteuer satırı görünür', async ({ page }) => {
    await page.goto('/maas-hesaplama');
    await page.getByRole('button', { name: /^Hesapla$/ }).click();

    const toggle = page.getByRole('button', { name: 'Aylık Kesintiler' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByText(/Lohnsteuer/).first()).toBeVisible();
  });

  test('net hedeften brüt hesaplama (tersine mod) çalışır', async ({ page }) => {
    await page.goto('/maas-hesaplama');

    await page.getByRole('button', { name: /^Net$/ }).click();
    await page.getByPlaceholder('5000').fill('3000');
    await page.getByRole('button', { name: /^Hesapla$/ }).click();

    const gross = PARSE_EUR(await cardValue(page, 'Brüt Maaş (Aylık)').innerText());
    // Net 3000 hedefi için gerekli brüt 3000'den büyük olmalı.
    expect(gross).toBeGreaterThan(3000);
  });
});
