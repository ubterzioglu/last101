import type { ToolCatalogItem, ToolSource } from '@/lib/tools/types';

export const DEFAULT_TOOL_LEGAL_NOTE =
  'Bu araç bilgilendirme amaçlıdır. Hukuki, mali veya resmi danışmanlık yerine geçmez. Kurallar oturum statünüze, mesleğinize ve yaşadığınız eyalete göre değişebilir.';

export const OFFICIAL_SOURCES = {
  makeItInGermany: {
    label: 'Make it in Germany',
    href: 'https://www.make-it-in-germany.com/tr/',
  },
  bamf: {
    label: 'BAMF',
    href: 'https://www.bamf.de/',
  },
  recognition: {
    label: 'Anerkennung in Deutschland',
    href: 'https://www.anerkennung-in-deutschland.de/html/tr/index.php',
  },
  arbeitsagentur: {
    label: 'Bundesagentur für Arbeit',
    href: 'https://www.arbeitsagentur.de/',
  },
  handbookGermany: {
    label: 'Handbook Germany',
    href: 'https://handbookgermany.de/tr',
  },
  mbe: {
    label: 'MBE Danışmanlık',
    href: 'https://www.migrationsberatung.org/en/',
  },
} as const satisfies Record<string, ToolSource>;

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    slug: 'almanya-yolunu-sec',
    title: 'Almanya Yolunu Seç',
    description: 'Çalışma, Ausbildung, üniversite veya aile birleşimi gibi ana yollar arasında sana en uygun rotayı bul.',
    ctaLabel: 'Yolunu belirle',
    category: 'Rota ve Strateji',
    questionCount: 15,
    spotlight: 'Hangi ana yoldan başlaman gerektiğini netleştirir.',
  },
  {
    slug: 'almanya-maas-beklentisi',
    title: 'Almanya Maaş Beklentisi',
    description: 'Meslek, deneyim ve lokasyona göre brüt-net maaş beklentini çerçevele.',
    ctaLabel: 'Maaş aralığını gör',
    category: 'Kariyer ve Gelir',
    questionCount: 15,
    spotlight: 'Teklif veya görüşme öncesi hedef maaş bandını gösterir.',
  },
  {
    slug: 'almanyaya-hazir-misin',
    title: 'Almanya\'ya Hazır Mısın?',
    description: 'Belge, dil, bütçe ve zamanlama açısından ne kadar hazır olduğunu ölç.',
    ctaLabel: 'Hazırlığını ölç',
    category: 'Hazırlık ve Yerleşim',
    questionCount: 5,
    spotlight: 'Başvuru öncesi en zayıf hazırlık halkalarını görünür kılar.',
  },
  {
    slug: 'hangi-sehir-sana-uygun',
    title: 'Hangi Şehir Sana Uygun?',
    description: 'Yaşam tarzın ve bütçene göre hangi şehir veya eyalet profilinin sana daha yakın olduğunu gör.',
    ctaLabel: 'Şehir eşleşmeni gör',
    category: 'Yaşam ve Destek',
    questionCount: 5,
    spotlight: 'Şehir kararını bütçe ve yaşam ritmi üzerinden daraltır.',
  },
  {
    slug: 'topluluk-ve-danismanlik',
    title: 'Topluluk ve Danışmanlık Eşleştirici',
    description: 'İhtiyacına göre resmi danışmanlık, topluluk ve entegrasyon destek kanallarına yönel.',
    ctaLabel: 'Destek kanalını bul',
    category: 'Yaşam ve Destek',
    questionCount: 4,
    spotlight: 'Hangi destek kanalına önce gitmen gerektiğini gösterir.',
  },
  {
    slug: 'kariyer-ve-egitim-rotasi',
    title: 'Kariyer ve Eğitim Rotası',
    description: 'İş, yüksek lisans, denklik veya Ausbildung arasında daha mantıklı rotayı seç.',
    ctaLabel: 'Rotanı seç',
    category: 'Rota ve Strateji',
    questionCount: 5,
    spotlight: 'Kısa vadeli giriş ile uzun vadeli kariyer sırasını kurar.',
  },
  {
    slug: 'almanya-yasam-tarzi-uyumu',
    title: 'Almanya Yaşam Tarzı Uyumu',
    description: 'Büyük şehir, sakin yaşam, aile düzeni ve sosyal tempo beklentilerine göre yaşam profilini gör.',
    ctaLabel: 'Uyum profilini öğren',
    category: 'Yaşam ve Destek',
    questionCount: 5,
    spotlight: 'Günlük ritim beklentine uygun yaşam profilini çıkarır.',
  },
  {
    slug: 'ilk-90-gun-planlayici',
    title: 'İlk 90 Gün Planlayıcı',
    description: 'Almanya\'daki ilk haftadan üçüncü aya kadar hangi adımı ne zaman atacağını sırala.',
    ctaLabel: 'İlk 90 günü planla',
    category: 'Hazırlık ve Yerleşim',
    questionCount: 4,
    spotlight: 'İlk hafta, ilk ay ve 90 gün aksiyon sırasını kurar.',
  },
  {
    slug: 'once-hangi-sorunu-cozmelisin',
    title: 'Önce Hangi Sorunu Çözmelisin?',
    description: 'Vize, dil, konut, denklik veya finansman içinde önce hangisinin blokaj yarattığını belirle.',
    ctaLabel: 'Önceliğini belirle',
    category: 'Hazırlık ve Yerleşim',
    questionCount: 4,
    spotlight: 'Seni en çok durduran tek blokajı seçmene yardım eder.',
  },
  {
    slug: 'almanyada-is-bulma-olasiligi',
    title: 'Almanya\'da İş Bulma Olasılığı',
    description: 'Meslek, dil, deneyim ve denklik durumuna göre iş bulma gücünü yorumla.',
    ctaLabel: 'İş şansını gör',
    category: 'Kariyer ve Gelir',
    questionCount: 5,
    spotlight: 'Profilinin iş piyasasındaki rekabet gücünü yorumlar.',
  },
];

export function getToolHref(slug: string) {
  return `/${slug}`;
}

export function getToolCatalogItem(slug: string) {
  return TOOL_CATALOG.find((item) => item.slug === slug) ?? null;
}
