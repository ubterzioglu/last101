import { expect, test } from '@playwright/test';

const TOOLS = [
  { route: '/almanya-yolunu-sec', heading: 'Almanya Yolunu Seç Aracı' },
  { route: '/almanya-maas-beklentisi', heading: 'Almanya Maaş Beklentisi Aracı' },
  { route: '/almanyaya-hazir-misin', heading: "Almanya'ya Hazır Mısın? Aracı" },
  { route: '/hangi-sehir-sana-uygun', heading: 'Hangi Şehir Sana Uygun? Aracı' },
  { route: '/topluluk-ve-danismanlik', heading: 'Topluluk ve Danışmanlık Eşleştirici' },
  { route: '/kariyer-ve-egitim-rotasi', heading: 'Kariyer ve Eğitim Rotası Aracı' },
  { route: '/almanya-yasam-tarzi-uyumu', heading: 'Almanya Yaşam Tarzı Uyumu Aracı' },
  { route: '/ilk-90-gun-planlayici', heading: 'İlk 90 Gün Planlayıcı' },
  { route: '/once-hangi-sorunu-cozmelisin', heading: 'Önce Hangi Sorunu Çözmelisin? Aracı' },
  { route: '/almanyada-is-bulma-olasiligi', heading: "Almanya'da İş Bulma Olasılığı Aracı" },
] as const;

async function walkToResult(page: import('@playwright/test').Page, pick: 'first' | 'last') {
  const result = page.getByTestId('tool-result');

  for (let step = 0; step < 8; step += 1) {
    if (await result.isVisible().catch(() => false)) {
      break;
    }

    const options = page.getByTestId('tool-option');
    const count = await options.count();
    expect(count, 'soru kartında en az bir seçenek olmalı').toBeGreaterThan(0);
    await options.nth(pick === 'first' ? 0 : count - 1).click();
  }

  await expect(result).toBeVisible();
}

for (const tool of TOOLS) {
  test.describe(tool.heading, () => {
    test('anonim kullanıcı için açılır ve temel bloklar görünür', async ({ page }) => {
      await page.goto(tool.route);

      await expect(page.getByRole('heading', { name: tool.heading })).toBeVisible();
      await expect(page.getByText('Nasıl çalışır?')).toBeVisible();
      await expect(page.getByText('Yasal not')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Sıkça Sorulan Sorular' })).toBeVisible();
    });

    test('ilk seçeneklerle ilerleyince sonuç üretir ve sıfırlanabilir', async ({ page }) => {
      await page.goto(tool.route);

      await walkToResult(page, 'first');
      await page.getByTestId('tool-reset').click();
      await expect(page.getByTestId('tool-question-card')).toBeVisible();
    });

    test('son seçeneklerle ilerleyince de dead-end üretmez', async ({ page }) => {
      await page.goto(tool.route);
      await walkToResult(page, 'last');
    });
  });
}
