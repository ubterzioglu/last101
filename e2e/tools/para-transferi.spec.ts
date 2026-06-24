import { test, expect } from '@playwright/test';

/**
 * Faz 6 — Para Transferi Seçim Aracı (/para-transferi). Authenticated.
 *
 * NOTE: production currently serves a QUIZ/wizard version (not the calculator
 * in the local source). Tests are written against PRODUCTION's real DOM:
 *  - h1 "Para Transferi Seçim Aracı", "Sıfırla" button.
 *  - First question "Gönderim yönü hangisi?" with direction options.
 *  - "Geri" disabled at start; selecting an option advances (quiz pattern).
 *  - Walking the quiz reaches a recommendation/result.
 */

function questionOption(page: import('@playwright/test').Page) {
  // Question option buttons live in the yellow question card.
  return page.locator('div.border-google-yellow').getByRole('button').first();
}

test.describe('Para Transferi Seçim Aracı', () => {
  test('giriş sonrası ilk soru (gönderim yönü) görünür', async ({ page }) => {
    await page.goto('/para-transferi');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: 'Para Transferi Seçim Aracı' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Gönderim yönü hangisi/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Almanya → Türkiye/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Geri$/ })).toBeDisabled();
  });

  test('yön seçince bir sonraki adıma ilerler', async ({ page }) => {
    await page.goto('/para-transferi');

    await page.getByRole('button', { name: /Almanya → Türkiye/ }).click();

    // İlk sorudan ayrılmış olmalıyız: "Gönderim yönü" sorusu artık görünmez
    // ya da "Geri" artık aktif.
    await expect(page.getByRole('button', { name: /^Geri$/ })).toBeEnabled();
  });

  test('20 soruluk akışı tamamlayınca öneri/sonuç ekranına ulaşılır', async ({ page }) => {
    await page.goto('/para-transferi');

    // Production: 20 soruluk quiz ("Soru X / 20"). İlk şıkkı seçerek ilerle.
    // Akışın bittiğini "Soru ... / 20" ilerleme metninin kaybolmasıyla anlarız.
    const progress = page.getByText(/Soru\s+\d+\s*\/\s*20/);

    for (let i = 0; i < 24; i++) {
      if (!(await progress.isVisible().catch(() => false))) break;
      const opt = questionOption(page);
      if (!(await opt.isVisible().catch(() => false))) break;
      await opt.click();
    }

    // Quiz bitti: ilerleme metni gitti ve bir sonuç/öneri işareti göründü.
    await expect(progress).toHaveCount(0, { timeout: 10_000 });
    await expect(
      page.getByText(/En İyi|Önerilen|Sonuç|Yeniden Başla|Karşılaştır/i).first()
    ).toBeVisible();
  });

  test('Sıfırla ilk soruya döndürür', async ({ page }) => {
    await page.goto('/para-transferi');

    // Bir adım ilerle, sonra Sıfırla ile başa dön.
    await page.getByRole('button', { name: /Almanya → Türkiye/ }).click();
    await page.getByRole('button', { name: 'Sıfırla' }).click();

    await expect(page.getByRole('heading', { name: /Gönderim yönü hangisi/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Geri$/ })).toBeDisabled();
  });
});
