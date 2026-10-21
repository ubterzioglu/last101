import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  HOMEPAGE_FAQ_ITEMS,
  HOMEPAGE_ITEMS,
  HOME_GUIDE_STEPS,
  HOME_INTENT_ITEMS,
  HOME_SERVICE_GROUPS,
} from '@/constants/home-data';

type PreviousCard = readonly [href: string, title: string, description: string];

/**
 * Every card the home grid showed before the redesign, in order. The old grid
 * had 31 cards because /is-ilanlari appeared twice ("İşe Alım Firmaları" and
 * "İş İlanları"); the first card is kept, so 30 remain.
 */
const PREVIOUS_CARDS: readonly PreviousCard[] = [
  ['/almanya-yolunu-sec', 'Almanya Yolunu Seç', 'Çalışma, Ausbildung, üniversite veya aile birleşimi gibi ana yollar arasında sana en uygun rotayı bul.'],
  ['/almanya-maas-beklentisi', 'Almanya Maaş Beklentisi', 'Meslek, deneyim ve lokasyona göre brüt-net maaş beklentini çerçevele.'],
  ['/almanyaya-hazir-misin', "Almanya'ya Hazır Mısın?", 'Belge, dil, bütçe ve zamanlama açısından ne kadar hazır olduğunu ölç.'],
  ['/hangi-sehir-sana-uygun', 'Hangi Şehir Sana Uygun?', 'Yaşam tarzın ve bütçene göre hangi şehir veya eyalet profilinin sana daha yakın olduğunu gör.'],
  ['/topluluk-ve-danismanlik', 'Topluluk ve Danışmanlık Eşleştirici', 'İhtiyacına göre resmi danışmanlık, topluluk ve entegrasyon destek kanallarına yönel.'],
  ['/kariyer-ve-egitim-rotasi', 'Kariyer ve Eğitim Rotası', 'İş, yüksek lisans, denklik veya Ausbildung arasında daha mantıklı rotayı seç.'],
  ['/almanya-yasam-tarzi-uyumu', 'Almanya Yaşam Tarzı Uyumu', 'Büyük şehir, sakin yaşam, aile düzeni ve sosyal tempo beklentilerine göre yaşam profilini gör.'],
  ['/ilk-90-gun-planlayici', 'İlk 90 Gün Planlayıcı', "Almanya'daki ilk haftadan üçüncü aya kadar hangi adımı ne zaman atacağını sırala."],
  ['/once-hangi-sorunu-cozmelisin', 'Önce Hangi Sorunu Çözmelisin?', 'Vize, dil, konut, denklik veya finansman içinde önce hangisinin blokaj yarattığını belirle.'],
  ['/almanyada-is-bulma-olasiligi', "Almanya'da İş Bulma Olasılığı", 'Meslek, dil, deneyim ve denklik durumuna göre iş bulma gücünü yorumla.'],
  ['/banka-secim', 'Banka Seçim Aracı', 'Banka profilinizi belirleyin.'],
  ['/sigorta-secim', 'Sigorta Seçim Aracı', 'Sigortaları önceliklendirin.'],
  ['/maas-hesaplama', 'Brüt Net Maaş Hesaplama', 'Net maaşınızı anında görün.'],
  ['/stepstone-karsilastirma', 'StepStone 2026 Maaş Karşılaştırma', 'Maaşlarınızı karşılaştırın.'],
  ['/vatandaslik-testi', 'Vatandaşlık Testi', 'Deneme sınavı çözün.'],
  ['/para-transferi', 'Para Transferi Seçim Aracı', 'Uygun aracı bulun!'],
  ['/vize-secim', 'Almanya Vize Seçim Aracı', 'Hangi vizeye başvurmanız gerektiğini öğrenin.'],
  ['/tatil/almanya', '2026 Almanya Tatil Planlayıcı', '2026 tatilinizi planlayın.'],
  ['/tatil/turkiye', '2026 Türkiye Tatil Planlayıcı', '2026 tatilinizi planlayın.'],
  ['/hizmet-rehberi', 'Türk Hizmet Rehberi', 'Doktor, avukat, restoran, market - Türkçe destek bulun!'],
  ['/is-ilanlari', 'İşe Alım Firmaları', "Almanya'daki işe alım ajanslarını inceleyin."],
  ['/yazi-dizisi', 'Yazı Dizisi', 'Adım adım rehberler ve yazılar.'],
  ['/haberler', 'Haberler', 'Güncel haberler ve gelişmeler.'],
  ['/belgeler', 'Yararlı Belgeler', 'İhtiyacınız olan belgeler ve formlar.'],
  ['/ekibimize-katil', 'Bize Katıl!', 'Ekibimize katılmak için tıkla!'],
  ['/hakkimizda', 'Biz kimiz?', 'almanya101 ekibini tanıyın!'],
  ['/hizmet-rehberi/oneri', 'Hizmet Öner', 'Uzman ekleyin!'],
  ['/iletisim', 'İletişim', 'Bize hızlıca ulaşın.'],
  ['/software-hub', 'Software Hub', 'Yazılım projelerimizi keşfedin!'],
  ['/topluluk', 'Topluluğa Katıl', 'Türk topluluğuna dahil olun!'],
];

const GROUP_IDS = ['araclar', 'icerik', 'topluluk'] as const;

describe('home service items', () => {
  it('keeps every previous card with its title, description and order', () => {
    expect(HOMEPAGE_ITEMS.map((item) => [item.href, item.title, item.description])).toEqual(
      PREVIOUS_CARDS.map((card) => [...card])
    );
  });

  it('lists every href once (the duplicate /is-ilanlari card is merged)', () => {
    const hrefs = HOMEPAGE_ITEMS.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.filter((href) => href === '/is-ilanlari')).toHaveLength(1);
  });

  it('gives every item a lucide icon that renders an svg', () => {
    for (const item of HOMEPAGE_ITEMS) {
      const markup = renderToStaticMarkup(createElement(item.icon, { 'aria-hidden': true }));

      expect(markup, item.href).toMatch(/^<svg[^>]*class="lucide/);
    }
  });

  it('puts every item in one of the three home groups', () => {
    for (const item of HOMEPAGE_ITEMS) {
      expect(GROUP_IDS, item.href).toContain(item.group);
    }
  });

  it('defines the three groups with their titles and category tones, none of them empty', () => {
    expect(HOME_SERVICE_GROUPS).toEqual([
      { id: 'araclar', title: 'Araçlar', tone: 'blue' },
      { id: 'icerik', title: 'İçerik ve rehber', tone: 'green' },
      { id: 'topluluk', title: 'Topluluk ve biz', tone: 'orange' },
    ]);

    for (const group of HOME_SERVICE_GROUPS) {
      expect(HOMEPAGE_ITEMS.filter((item) => item.group === group.id).length, group.id).toBeGreaterThan(0);
    }
  });

  it('groups interactive tools, content and community links', () => {
    const groupOf = (href: string) => HOMEPAGE_ITEMS.find((item) => item.href === href)?.group;

    expect(groupOf('/maas-hesaplama')).toBe('araclar');
    expect(groupOf('/almanya-yolunu-sec')).toBe('araclar');
    expect(groupOf('/haberler')).toBe('icerik');
    expect(groupOf('/belgeler')).toBe('icerik');
    expect(groupOf('/topluluk')).toBe('topluluk');
    expect(groupOf('/iletisim')).toBe('topluluk');
  });

  it('no longer carries remote Unsplash photos', () => {
    const source = readFileSync(path.resolve(__dirname, '../constants/home-data.ts'), 'utf8');

    expect(source).not.toMatch(/unsplash/i);
    for (const item of HOMEPAGE_ITEMS) {
      expect(Object.keys(item)).not.toContain('image');
    }
  });
});

describe('home intent strip', () => {
  it('links the four everyday intents to existing routes', () => {
    expect(HOME_INTENT_ITEMS).toEqual([
      { label: "Almanya'ya taşınıyorum", href: '/almanya-yolunu-sec' },
      { label: 'İş arıyorum', href: '/is-ilanlari' },
      { label: 'Maaşımı hesaplayacağım', href: '/maas-hesaplama' },
      { label: 'Belgelerimi hazırlıyorum', href: '/belgeler' },
    ]);

    const cardHrefs = new Set(HOMEPAGE_ITEMS.map((item) => item.href));
    for (const intent of HOME_INTENT_ITEMS) {
      expect(cardHrefs, intent.href).toContain(intent.href);
    }
  });
});

describe('home guide and FAQ copy', () => {
  it('keeps the six first steps in order', () => {
    expect(HOME_GUIDE_STEPS).toEqual([
      'Adres kaydı (Anmeldung)',
      'Vergi numarası (Steuernummer)',
      'Sağlık sigortası (Krankenversicherung)',
      'Banka hesabı açma',
      'Telefon hattı ve internet',
      'Oturum izni (Aufenthaltstitel)',
    ]);
  });

  it('keeps the five FAQ questions that also feed the FAQ JSON-LD', () => {
    expect(HOMEPAGE_FAQ_ITEMS.map((item) => item.question)).toEqual([
      "Almanya'ya yeni taşınan biri önce hangi adımları tamamlamalı?",
      'Almanya iş bulma sürecinde hangi kaynaklara odaklanmalıyım?',
      'Almanya101 hangi konularda yardımcı olur?',
      'Topluluk neden önemli?',
      "Almanya'ya taşınırken en sık yapılan hatalar neler?",
    ]);
  });

  it('keeps the FAQ answers word for word', () => {
    const answers = HOMEPAGE_FAQ_ITEMS.map((item) => item.answer);

    expect(answers[0]).toMatch(/^İlk haftalarda adres kaydı, vergi numarası.*güvenilir kaynaklarla ilerlemek en sağlıklı yoldur\.$/);
    expect(answers[1]).toMatch(/^İş ilanı platformları, sektör bazlı topluluklar.*daha hızlı sonuç verir\.$/);
    expect(answers[2]).toMatch(/^Almanya101; yaşam rehberleri, iş ilanları.*yol haritası sunmaktır\.$/);
    expect(answers[3]).toMatch(/^Yeni bir ülkede doğru insanlara hızlı ulaşmak.*birçok konuda fark yaratır\.$/);
    expect(answers[4]).toMatch(/^En yaygın hatalar: adres kaydı süresini kaçırmak \(14 gün sınırı var\).*güncel deneyimler paylaşılmaktadır\.$/);
    expect(answers.map((answer) => answer.length)).toEqual([332, 312, 353, 298, 395]);
  });
});
