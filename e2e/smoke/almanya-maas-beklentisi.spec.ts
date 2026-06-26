import { expect, test } from '@playwright/test';

const QUESTION_CARD = 'tool-question-card';
const RESULT_CARD = 'tool-result';

test.describe('Almanya Maas Beklentisi Araci', () => {
  test('yuksek uzmanlik profili daha yuksek brut aralik uretir', async ({ page }) => {
    await page.goto('/almanya-maas-beklentisi');

    await answerPath(page, [
      'Yazılım / veri / ürün / BT',
      'Niş uzmanlık, kritik teknoloji veya kıt beceri taşıyorum',
      '10+ yıl veya belirgin uzman/lead seviye',
      'Tanınabilir üniversite diplomam var',
      'Net ve dosyam güçlü',
      'İş ve resmi süreçleri rahat yürütebilirim',
      'Münih / Frankfurt benzeri pahalı merkezler',
      'Kurumsal / global yapı / büyük grup',
      'Uluslararası veya ihracat odaklı şirket',
      '37-40 saat tam zamanlı',
      'Takım yönetimi veya açık lead rolüm var',
      'Somut teklifim var veya sayı konuşuluyor',
      'Bekar / tek gelir / Steuerklasse 1',
      'Çocuk yok',
      'Standart GKV, kilise vergisi yok',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Aylik brut beklenti');
    await expect(page.getByTestId(RESULT_CARD)).toContainText('Tahmin guveni');
    await expect(page.getByTestId(RESULT_CARD)).toContainText('Cok yuksek kira baskisi');

    const highGross = await readRangeFloor(page, 'Aylik brut beklenti');
    expect(highGross).toBeGreaterThan(7000);
  });

  test('daha zayif ve dusuk maliyetli profil daha dusuk brut band ve kira baskisi verir', async ({ page }) => {
    await page.goto('/almanya-maas-beklentisi');

    await answerPath(page, [
      'Hizmet / perakende / başlangıç rolleri',
      'Daha çok destek, operasyon veya standart uygulama rolüyüm',
      '0-2 yıl',
      'Yeni mezun veya eğitimden işe geçiş aşamasındayım',
      'Belirsiz, bu yüzden pazarlık gücüm düşebilir',
      'Çok zayıfım veya neredeyse yok',
      'Daha düşük maliyetli doğu/ikincil şehirler',
      'Küçük ekip veya küçük şirket',
      'Startup veya çok erken aşama yapı',
      '20-25 saat part-time',
      'Bireysel katkıcıyım',
      'Henüz somut teklif yok',
      'Bekar / tek gelir / Steuerklasse 1',
      'Çocuk yok',
      'Standart GKV, kilise vergisi yok',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Gorece dusuk kira baskisi');
    const lowGross = await readRangeFloor(page, 'Aylik brut beklenti');
    expect(lowGross).toBeLessThan(3000);
  });

  test('geri donme ve sifirlama 15 soruluk akista calisir', async ({ page }) => {
    await page.goto('/almanya-maas-beklentisi');

    await answerPath(page, [
      'Operasyon / satış / ofis / lojistik',
      'Temiz uzmanlık rolüyüm, standart piyasa seviyesindeyim',
      '3-5 yıl',
      'Mesleki diploma, önlisans veya ustalık temelim var',
      'Kısmen net ama teyit gerekiyor',
      'Temelim var ama akıcı değilim',
      'NRW hattı ve dengeli büyük pazarlar',
      'Orta ölçekli şirket',
      'Klasik özel sektör',
      '37-40 saat tam zamanlı',
      'Süreç, müşteri veya küçük koordinasyon sorumluluğum var',
      'İleri görüşme veya son turdayım',
      'Evli, gelirler dengeli / Steuerklasse 4',
      'Bir çocuk var',
      'Standart GKV, kilise vergisi yok',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toBeVisible();
    await page.getByRole('button', { name: '← Son soruya dön' }).click();
    await expect(page.getByTestId(QUESTION_CARD)).toContainText(
      'Net tahmini için hangi sigorta/vergi varsayımı sana daha yakın?'
    );

    await pickOption(page, 'Standart GKV, kilise vergisi yok');
    await expect(page.getByTestId(RESULT_CARD)).toBeVisible();

    await page.getByTestId('tool-reset').click();
    await expect(page.getByTestId(QUESTION_CARD)).toContainText(
      'Seni en iyi anlatan meslek grubu hangisi?'
    );
  });
});

async function answerPath(page: import('@playwright/test').Page, labels: string[]) {
  for (const label of labels) {
    await pickOption(page, label);
  }
}

async function pickOption(page: import('@playwright/test').Page, label: string) {
  await page.getByTestId(QUESTION_CARD).getByRole('button', { name: label, exact: true }).click();
}

async function readRangeFloor(page: import('@playwright/test').Page, label: string) {
  const metricText = await page.getByText(label, { exact: true }).locator('xpath=..').textContent();
  const numbers =
    metricText
      ?.match(/[\d.,]+/g)
      ?.map((value) => Number(value.replace(/\./g, '').replace(',', '.')))
      .filter((value) => Number.isFinite(value)) ?? [];

  return numbers[0] ?? 0;
}
