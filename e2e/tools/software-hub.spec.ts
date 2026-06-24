import { test, expect } from '@playwright/test';

/**
 * Faz 8 — Software Hub (/software-hub). Authenticated (chromium-auth).
 *
 * software-hub is NOT a standalone tool: app/(site)/software-hub/page.tsx is a
 * server redirect to the devuser dashboard ('/devuser/dev...'). For a logged-in
 * user the gate passes and they land on the dashboard. This test verifies that
 * real behavior (redirect target + dashboard renders), not a tool UI.
 */

test.describe('Software Hub', () => {
  test('giriş yapmış kullanıcı devuser paneline yönlendirilir', async ({ page }) => {
    await page.goto('/software-hub');

    // Login duvarına TAKILMAMALI.
    await expect(page).not.toHaveURL(/\/giris/);

    // Devuser dashboard'a yönlenir.
    await expect(page).toHaveURL(/\/devuser\/dev/);
  });

  test('yönlendirilen panel içeriği yüklenir', async ({ page }) => {
    await page.goto('/software-hub');
    await expect(page).toHaveURL(/\/devuser\/dev/);

    // Dashboard karşılama başlığı görünür (üye paneli yüklendi).
    await expect(
      page.getByRole('heading', { name: /hoş geldin|yalnız değilsin|almanya101/i }).first()
    ).toBeVisible();

    // Panelde temel modüllerden en az biri görünür.
    await expect(
      page.getByRole('heading', { name: /founder kayıt|üye veritabanı|haberler|etkinlik/i }).first()
    ).toBeVisible();
  });
});
