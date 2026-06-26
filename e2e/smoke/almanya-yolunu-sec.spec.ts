import { expect, test } from '@playwright/test';

const RESULT_CARD = 'tool-result';
const QUESTION_CARD = 'tool-question-card';

test.describe('Almanya Yolunu Seç Aracı', () => {
  test('güçlü teklif, diploma ve maaş profili EU Mavi Kart sonucuna gider', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Çalışmak ve kariyer kurmak',
      'Almanya\'da bana kapı açan bir işveren veya ekip var',
      'Önümüzdeki 6 ay içinde',
      'Evet, imzalı veya çok net teklifim var',
      'İşveren sponsorlu tam zamanlı bir rol',
      'Mühendislik / teknik üretim',
      '5+ yıl',
      'Tanınabilir üniversite diplomam var',
      'Ne gerektiğini biliyorum ve dosyam güçlü',
      'Mavi Kart eşiğine yakın veya üstünde',
      'Günlük ve resmi işlerde kullanabilecek seviyedeyim',
      'B2+ seviyesinde rahat kullanıyorum',
      'İlk ayları çevirecek sağlam planım var',
      '35-44 arası, deneyimim daha belirleyici',
      'Kısmen esneğim ama sınırlarım var',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('EU Mavi Kart başlangıçta en güçlü aday görünüyor');
    await expect(page.getByTestId(RESULT_CARD)).toContainText('Uygunluk');
    await expect(page.getByTestId(RESULT_CARD)).toContainText('Hazırlık');
    await expect(page.getByTestId(RESULT_CARD)).toContainText('Blokaj riski');
  });

  test('teklif var ama maaş sınırdaysa Fachkräfte öne çıkar', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Çalışmak ve kariyer kurmak',
      'Almanya\'da bana kapı açan bir işveren veya ekip var',
      'Bu yıl içinde ama biraz hazırlıkla',
      'Evet, imzalı veya çok net teklifim var',
      'İşveren sponsorlu tam zamanlı bir rol',
      'Ofis / operasyon / satış / yönetim',
      '2-4 yıl',
      'Mesleki diploma, ustalık veya önlisans temelim var',
      'Kabaca biliyorum ama teyit etmem gerek',
      'Var ama daha çok standart uzman maaşı gibi',
      'Temelim var ama akıcı değilim',
      'İş görecek temel seviyedeyim',
      'Kısmen var ama dikkatli olmam gerekir',
      '25-34 arası, büyüme dönemindeyim',
      'Kısmen esneğim ama sınırlarım var',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Fachkräfte yolu şu an daha gerçekçi görünüyor');
  });

  test('teklif yok ama yeterlilik, dil ve bütçe varsa Chancenkarte çıkar', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Çalışmak ve kariyer kurmak',
      'Yakın çevre, referans veya network desteğim var',
      'Bu yıl içinde ama biraz hazırlıkla',
      'Hayır, önce yolumu ve pazarı kurmam gerekiyor',
      'Önce Almanya\'da iş arama zemini kurmak',
      'Ofis / operasyon / satış / yönetim',
      '2-4 yıl',
      'Tanınabilir üniversite diplomam var',
      'Kabaca biliyorum ama teyit etmem gerek',
      'Henüz teklif olmadığı için bilmiyorum',
      'Temelim var ama akıcı değilim',
      'B2+ seviyesinde rahat kullanıyorum',
      'İlk ayları çevirecek sağlam planım var',
      '25-34 arası, büyüme dönemindeyim',
      'Şehir ve rol tarafında oldukça esneğim',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Chancenkarte senin için mantıklı ilk araştırma yolu olabilir');
  });

  test('aile bağı baskınsa aile birleşimi sonucu döner', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Aile birleşimi ile gitmek',
      'Almanya\'da eşim veya çekirdek ailem var',
      'Önümüzdeki 6 ay içinde',
      'Hayır, önce yolumu ve pazarı kurmam gerekiyor',
      'Aile bağı üzerinden taşınmak',
      'Ofis / operasyon / satış / yönetim',
      '0-1 yıl',
      'Öğrenci kabulü veya akademik hazırlığım daha güçlü',
      'Şimdilik bu başlık bende erken aşamada',
      'Henüz teklif olmadığı için bilmiyorum',
      'Temelim var ama akıcı değilim',
      'İş görecek temel seviyedeyim',
      'Kısmen var ama dikkatli olmam gerekir',
      '25-34 arası, büyüme dönemindeyim',
      'Kısmen esneğim ama sınırlarım var',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Aile birleşimi senin için ana giriş yolu');
  });

  test('pratik eğitim niyeti ve temel Almanca Ausbildung sonucuna gider', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Ausbildung ile başlamak',
      'Henüz ciddi bir bağlantım yok',
      'Bu yıl içinde ama biraz hazırlıkla',
      'Hayır, önce yolumu ve pazarı kurmam gerekiyor',
      'Uygulamalı eğitim ve meslek öğrenmek',
      'Sağlık / bakım / klinik',
      '0-1 yıl',
      'Mesleki diploma, ustalık veya önlisans temelim var',
      'Kabaca biliyorum ama teyit etmem gerek',
      'Henüz teklif olmadığı için bilmiyorum',
      'Temelim var ama akıcı değilim',
      'İş görecek temel seviyedeyim',
      'Kısmen var ama dikkatli olmam gerekir',
      '18-24 ve daha esneğim',
      'Şehir ve rol tarafında oldukça esneğim',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Ausbildung yolu başlangıç için daha uygun görünüyor');
  });

  test('uygunluk düşük ve blokaj yüksekse LIMITED sonucu döner', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    await answerPath(page, [
      'Çalışmak ve kariyer kurmak',
      'Henüz ciddi bir bağlantım yok',
      '1 yıldan uzun vadede',
      'Hayır, önce yolumu ve pazarı kurmam gerekiyor',
      'İşveren sponsorlu tam zamanlı bir rol',
      'Tasarım / medya / yaratıcı hizmetler',
      '0-1 yıl',
      'Şu an bu taraf oldukça zayıf',
      'Bu taraf belirsiz ve beni yavaşlatıyor',
      'Henüz teklif olmadığı için bilmiyorum',
      'Çok zayıfım veya yok denecek kadar az',
      'Çok sınırlı',
      'Bu taraf en büyük risk alanım',
      '45+ ve daha seçiciyim',
      'Dar bir şehir veya rol çerçevem var',
    ]);

    await expect(page.getByTestId(RESULT_CARD)).toContainText('Önce profilini güçlendirmen gerekiyor');
  });

  test('geri dönme ve sıfırlama 15 soruluk akışta çalışır', async ({ page }) => {
    await page.goto('/almanya-yolunu-sec');

    const blueCardPath = [
      'Çalışmak ve kariyer kurmak',
      'Almanya\'da bana kapı açan bir işveren veya ekip var',
      'Önümüzdeki 6 ay içinde',
      'Evet, imzalı veya çok net teklifim var',
      'İşveren sponsorlu tam zamanlı bir rol',
      'Mühendislik / teknik üretim',
      '5+ yıl',
      'Tanınabilir üniversite diplomam var',
      'Ne gerektiğini biliyorum ve dosyam güçlü',
      'Mavi Kart eşiğine yakın veya üstünde',
      'Günlük ve resmi işlerde kullanabilecek seviyedeyim',
      'B2+ seviyesinde rahat kullanıyorum',
      'İlk ayları çevirecek sağlam planım var',
      '35-44 arası, deneyimim daha belirleyici',
      'Kısmen esneğim ama sınırlarım var',
    ];

    await answerPath(page, blueCardPath);
    await expect(page.getByTestId(RESULT_CARD)).toBeVisible();

    await page.getByRole('button', { name: '← Son soruya dön' }).click();
    await expect(page.getByTestId(QUESTION_CARD)).toContainText(
      'Şehir, rol ve başlangıç modeli konusunda ne kadar esneksin?'
    );

    await pickOption(page, 'Şehir ve rol tarafında oldukça esneğim');
    await expect(page.getByTestId(RESULT_CARD)).toBeVisible();

    await page.getByTestId('tool-reset').click();
    await expect(page.getByTestId(QUESTION_CARD)).toContainText(
      'Almanya\'ya gitmek istemendeki ana amaç şu an hangisi?'
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
