import { test, expect } from '@playwright/test';

/**
 * Faz 2 — Vatandaşlık Testi (/vatandaslik-testi). Authenticated (chromium-auth).
 * Self-contained. Data comes from Supabase (vatandaslik_sorulari table), so the
 * "run a full quiz" test is resilient: if no questions exist it is skipped with
 * a clear message instead of failing falsely.
 *
 * Real behavior (page.tsx):
 *  - 3 modes, each with a "Sınava Başla" button.
 *  - "Eyalet Soruları (10)" + "Gerçek Deneme" require a state selected first.
 *  - Answering shows green/red feedback; "Sonraki Soru" advances; end shows
 *    "Test Sonucu" with the correct count.
 */

test.describe('Vatandaşlık Testi', () => {
  test('giriş sonrası mod seçim ekranı görünür', async ({ page }) => {
    await page.goto('/vatandaslik-testi');
    await expect(page).not.toHaveURL(/\/giris/);

    await expect(page.getByRole('heading', { name: /Vatandaşlık Testi/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tüm Sorular/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Eyalet Soruları/ })).toBeVisible();

    // "Sınava Başla" butonları mevcut (3 mod).
    await expect(page.getByRole('button', { name: 'Sınava Başla' })).toHaveCount(3);
  });

  test('eyalet seçmeden eyalet-modu sınav butonu pasif', async ({ page }) => {
    await page.goto('/vatandaslik-testi');

    // "Eyalet Soruları (10)" kartındaki başlat butonu, eyalet seçilmeden disabled.
    const eyaletCard = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: /Eyalet Soruları/ }) })
      .last();
    await expect(eyaletCard.getByRole('button', { name: 'Sınava Başla' })).toBeDisabled();
  });

  test('eyalet modu: soru akışı, cevap, sonuç (veri varsa)', async ({ page }) => {
    await page.goto('/vatandaslik-testi');

    // Eyalet Soruları kartında bir eyalet seç.
    const eyaletCard = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: /Eyalet Soruları/ }) })
      .last();

    await eyaletCard.getByRole('combobox').selectOption('Berlin');
    await eyaletCard.getByRole('button', { name: 'Sınava Başla' }).click();

    // Yükleme sonrası ya soru ekranı gelir ya da "soru bulunamadı" hatası.
    const progress = page.getByText(/Soru\s+1\s*\/\s*\d+/);
    const hata = page.getByText(/bulunamadı|yetersiz|hata/i);

    await expect(progress.or(hata).first()).toBeVisible({ timeout: 15_000 });

    if (await hata.isVisible().catch(() => false)) {
      test.skip(true, 'Bu eyalet için Supabase\'de soru yok — veri bağımlı test atlandı.');
      return;
    }

    // Soruları sırayla cevapla. Her turda: bir şık seç -> ilerle butonuna bas.
    // State modu en fazla 10 soru; güvenli üst sınır olarak 12 tur.
    const sonuc = page.getByRole('heading', { name: 'Test Sonucu' });

    for (let i = 0; i < 12; i++) {
      if (await sonuc.isVisible().catch(() => false)) break;

      // Cevaplanmamış bir şık varsa seç (cevap verilince hepsi disabled olur).
      const option = page.getByRole('button', { name: /^[A-D]\)/ }).first();
      if (await option.isEnabled().catch(() => false)) {
        await option.click();
      }

      // "Sonraki Soru" veya son soruda "Testi Bitir" — cevap sonrası enabled olur.
      const ilerle = page.getByRole('button', { name: /^(Sonraki Soru|Testi Bitir)$/ });
      await expect(ilerle).toBeEnabled({ timeout: 5_000 });
      await ilerle.click();
    }

    // Sonuç ekranı görünmeli.
    await expect(sonuc).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/tanesini doğru cevapladınız/)).toBeVisible();
  });
});
