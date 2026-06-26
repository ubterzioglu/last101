import { formatCurrency } from '@/lib/salary/calculator';
import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact } from '@/lib/tools/helpers';
import type { ToolConfig, ToolResult } from '@/lib/tools/types';

const BASE_SALARIES: Record<string, number> = {
  yazilim: 6000,
  muhendislik: 5600,
  saglik: 4800,
  operasyon: 4200,
  hizmet: 3200,
  yeni: 3000,
};

const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  junior: 0.9,
  mid: 1,
  senior: 1.18,
};

const LOCATION_MULTIPLIERS: Record<string, number> = {
  pahali: 1.12,
  buyuk: 1.05,
  nrw: 1,
  orta: 0.95,
  dogu: 0.88,
};

const NET_RATIOS: Record<string, number> = {
  bekar: 0.62,
  evli: 0.68,
  aile: 0.72,
};

const COST_PRESSURE: Record<string, string> = {
  pahali: 'Yüksek kira baskısı',
  buyuk: 'Orta-yüksek kira baskısı',
  nrw: 'Dengeli maliyet baskısı',
  orta: 'Daha yönetilebilir maliyet baskısı',
  dogu: 'Görece düşük maliyet baskısı',
};

function createSalaryResult(): ToolResult {
  return {
    id: 'ESTIMATE',
    title: 'Almanya maaş çerçeven hazır',
    matchLabel: 'Tahmini aralık',
    tone: 'blue',
    summary: '',
    why: [],
    steps: [],
  };
}

export const toolConfig: ToolConfig = {
  slug: 'almanya-maas-beklentisi',
  path: '/almanya-maas-beklentisi',
  title: 'Almanya Maaş Beklentisi Aracı',
  description:
    'Meslek, deneyim, lokasyon ve hane durumuna göre Almanya için tahmini brüt-net maaş aralığını yorumla.',
  intro:
    'Bu araç sana kesin bir teklif vermez; ama Almanya\'da hangi aralıkta düşünmen gerektiğini, kira baskısının ne kadar etkili olabileceğini ve teklif okurken nelere dikkat etmen gerektiğini hızlıca çerçeveler.',
  why:
    'Almanya iş piyasasında brüt rakamı görmek kolay, ama şehir farkı, vergi sınıfı ve yaşam maliyeti yüzünden aynı rakam herkes için aynı anlama gelmez. Bu araç o tabloyu sadeleştirir.',
  whoFor: [
    'İş görüşmesine girmeden önce hangi maaş bandını hedeflemesi gerektiğini görmek isteyenler.',
    'Şehir farkının cebine etkisini kaba hatlarıyla anlamak isteyenler.',
    'Brüt rakamı görüp net tarafta ne beklemesi gerektiğini kabaca anlamak isteyenler.',
  ],
  howItWorks: [
    'Meslek grubunu, deneyimini ve yaşamak istediğin lokasyon profilini sorar.',
    'Bu bilgilere göre brüt aralık ve yaklaşık net yansıma üretir.',
    'Sonuçta maliyet baskısını ve teklif değerlendirirken dikkat edilmesi gereken noktaları özetler.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 4,
  initialQuestionId: 'profession',
  officialSources: [
    OFFICIAL_SOURCES.arbeitsagentur,
    OFFICIAL_SOURCES.makeItInGermany,
  ],
  relatedTools: ['almanya-yolunu-sec', 'almanyada-is-bulma-olasiligi', 'hangi-sehir-sana-uygun'],
  faqs: [
    {
      question: 'Bu araç net maaşı kesin hesaplıyor mu?',
      answer:
        'Hayır. Bu araç kesin bordro hesaplaması değil, karar aşamasında kullanılacak tahmini aralık üretir.',
    },
    {
      question: 'Şehir farkı neden önemli?',
      answer:
        'Aynı maaş Münih ile Leipzig\'de aynı satın alma gücünü yaratmaz. Özellikle kira ve günlük giderler büyük fark yaratır.',
    },
    {
      question: 'Mesleğim listedeki gruplardan birine tam uymuyorsa ne yapmalıyım?',
      answer:
        'Sana en yakın iş ailesini seç. Sonucu teklif pazarlığına temel çerçeve olarak kullan; kesin referans olarak alma.',
    },
  ],
  questions: [
    {
      id: 'profession',
      text: 'Seni en iyi anlatan meslek grubu hangisi?',
      options: [
        { key: 'yazilim', label: 'Yazılım / veri / ürün / BT', next: 'experience', effects: { facts: { profession: 'yazilim' } } },
        { key: 'muhendislik', label: 'Mühendislik / teknik üretim', next: 'experience', effects: { facts: { profession: 'muhendislik' } } },
        { key: 'saglik', label: 'Sağlık / bakım / klinik alanlar', next: 'experience', effects: { facts: { profession: 'saglik' } } },
        { key: 'operasyon', label: 'Operasyon / satış / ofis / lojistik', next: 'experience', effects: { facts: { profession: 'operasyon' } } },
        { key: 'hizmet', label: 'Hizmet / perakende / başlangıç rolleri', next: 'experience', effects: { facts: { profession: 'hizmet' } } },
        { key: 'yeni', label: 'Yeni mezun veya kariyer başlangıcı', next: 'experience', effects: { facts: { profession: 'yeni' } } },
      ],
    },
    {
      id: 'experience',
      text: 'Deneyim seviyen hangi banda daha yakın?',
      options: [
        { key: 'junior', label: '0-2 yıl', next: 'location', effects: { facts: { experience: 'junior' } } },
        { key: 'mid', label: '3-5 yıl', next: 'location', effects: { facts: { experience: 'mid' } } },
        { key: 'senior', label: '6+ yıl veya uzman seviye', next: 'location', effects: { facts: { experience: 'senior' } } },
      ],
    },
    {
      id: 'location',
      text: 'En çok baktığın şehir/lokasyon profili hangisi?',
      options: [
        { key: 'pahali', label: 'Münih / Frankfurt benzeri pahalı merkezler', next: 'household', effects: { facts: { location: 'pahali' } } },
        { key: 'buyuk', label: 'Berlin / Hamburg gibi büyük şehirler', next: 'household', effects: { facts: { location: 'buyuk' } } },
        { key: 'nrw', label: 'NRW hattı ve dengeli büyük pazarlar', next: 'household', effects: { facts: { location: 'nrw' } } },
        { key: 'orta', label: 'Orta ölçekli şehirler', next: 'household', effects: { facts: { location: 'orta' } } },
        { key: 'dogu', label: 'Daha düşük maliyetli doğu/ikincil şehirler', next: 'household', effects: { facts: { location: 'dogu' } } },
      ],
    },
    {
      id: 'household',
      text: 'Hane ve vergi varsayımına en yakın seçenek hangisi?',
      options: [
        { key: 'bekar', label: 'Bekar / tek gelir', next: 'RESULT:ESTIMATE', effects: { facts: { household: 'bekar' } } },
        { key: 'evli', label: 'Evli / çift gelir dengeli', next: 'RESULT:ESTIMATE', effects: { facts: { household: 'evli' } } },
        { key: 'aile', label: 'Aile / çocuklu hane', next: 'RESULT:ESTIMATE', effects: { facts: { household: 'aile' } } },
      ],
    },
  ],
  resolveResult: ({ resultId, state }) => {
    if (resultId !== 'ESTIMATE') {
      return createSalaryResult();
    }

    const profession = getFact<string>(state, 'profession', 'operasyon');
    const experience = getFact<string>(state, 'experience', 'mid');
    const location = getFact<string>(state, 'location', 'nrw');
    const household = getFact<string>(state, 'household', 'bekar');

    const base = BASE_SALARIES[profession] ?? BASE_SALARIES.operasyon;
    const adjusted = base * (EXPERIENCE_MULTIPLIERS[experience] ?? 1) * (LOCATION_MULTIPLIERS[location] ?? 1);
    const lower = adjusted * 0.92;
    const upper = adjusted * 1.08;
    const ratio = NET_RATIOS[household] ?? NET_RATIOS.bekar;

    return {
      id: 'ESTIMATE',
      title: 'Tahmini maaş beklentin',
      matchLabel: 'Karar çerçevesi',
      tone: 'blue',
      summary:
        'Bu aralık, seçtiğin meslek grubu, deneyim seviyesi ve lokasyon profiline göre oluşturuldu. Gerçek teklif; şirket tipi, Alman dil seviyesi, denklik durumu ve pazarlık gücüne göre yukarı veya aşağı kayabilir.',
      metrics: [
        {
          label: 'Aylık brüt beklenti',
          value: `${formatCurrency(lower)} - ${formatCurrency(upper)}`,
          tone: 'blue',
        },
        {
          label: 'Aylık net tahmin',
          value: `${formatCurrency(lower * ratio)} - ${formatCurrency(upper * ratio)}`,
          tone: 'green',
        },
        {
          label: 'Yıllık brüt çerçeve',
          value: `${formatCurrency(lower * 12)} - ${formatCurrency(upper * 12)}`,
          tone: 'yellow',
        },
        {
          label: 'Yaşam maliyeti baskısı',
          value: COST_PRESSURE[location] ?? COST_PRESSURE.nrw,
          tone: 'orange',
        },
      ],
      why: [
        'Meslek grubun piyasadaki taban beklentiyi belirliyor.',
        'Deneyim seviyesi pazarlık gücünü ve rol seniority\'sini doğrudan etkiliyor.',
        'Lokasyon seçimi özellikle kira baskısı nedeniyle aynı maaşın gerçek etkisini değiştiriyor.',
      ],
      steps: [
        'Görüşmelere girerken hedef aralığını brüt yıllık rakam olarak not et.',
        'Net karar verirken şehir bazlı kira ve sigorta baskısını ayrıca kontrol et.',
        'Teklif gelirse bu aracı kaba çerçeve olarak kullan; kesin net hesabı için maaş hesaplayıcı ile çapraz kontrol yap.',
        'Sözleşmede taşınma desteği, bonus ve uzaktan çalışma gibi kalemleri de maaş kadar ciddiye al.',
      ],
      caution:
        'Bu tahmin ne kadar kesin? Orta seviyede. Şirket büyüklüğü, rol kapsamı, Almanca seviyesi ve denklik durumu gerçek teklifte büyük fark yaratabilir.',
      officialSources: [OFFICIAL_SOURCES.arbeitsagentur, OFFICIAL_SOURCES.makeItInGermany],
      relatedTools: ['almanyada-is-bulma-olasiligi', 'hangi-sehir-sana-uygun'],
    };
  },
};
