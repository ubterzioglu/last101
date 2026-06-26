import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getScore } from '@/lib/tools/helpers';
import type { ToolConfig } from '@/lib/tools/types';

const ISSUE_TITLES: Record<string, string> = {
  vize: 'Vize ve giriş yolu',
  denklik: 'Denklik ve yeterlilik',
  konut: 'Konut ve adres',
  dil: 'Dil seviyesi',
  finansman: 'Finansman ve bütçe',
  is: 'İş teklifi / iş arama',
};

export const toolConfig: ToolConfig = {
  slug: 'once-hangi-sorunu-cozmelisin',
  path: '/once-hangi-sorunu-cozmelisin',
  title: 'Önce Hangi Sorunu Çözmelisin? Aracı',
  description:
    'Vize, denklik, konut, dil, finansman veya iş arama içinde şu an en büyük blokajı belirle ve ilk aksiyonunu seç.',
  intro:
    'Bu araç bütün sorunlarını aynı anda çözmeye çalışmak yerine, seni gerçekten durduran ana darboğazı seçmene yardım eder.',
  why:
    'Birçok kullanıcı aynı anda dil, evrak, iş, konut ve bütçeyle uğraşıyor. Ama genelde bunlardan biri diğerlerinin önünde kilit rol oynar. Bu araç onu ayıklar.',
  whoFor: [
    'Birden fazla problem arasında hangisinin daha kritik olduğunu seçemeyenler.',
    'Hazırlık listesi uzun olduğu için nereden başlayacağını kaybedenler.',
    'Enerjisini dağınık kullanmak yerine tek bir blokajı çözmek isteyenler.',
  ],
  howItWorks: [
    'Süre baskısı, teklif durumu, evrak ve finansman gibi sinyalleri toplar.',
    'Bu sinyallerden en güçlü blokaj alanını seçer.',
    'Sonuçta tek bir ilk çözüm alanı ve 3 adımlı mini plan verir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 4,
  initialQuestionId: 'pressure',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.recognition,
    OFFICIAL_SOURCES.mbe,
  ],
  relatedTools: ['almanyaya-hazir-misin', 'topluluk-ve-danismanlik', 'almanya-yolunu-sec'],
  faqs: [
    {
      question: 'Birden fazla büyük sorunum varsa araç ne yapar?',
      answer:
        'Araç seni en çok durduran başlığı seçer. Bu, diğer sorunların önemsiz olduğu anlamına gelmez; yalnızca ilk odak noktasını belirler.',
    },
    {
      question: 'Sonuç değişebilir mi?',
      answer:
        'Evet. Teklif, bütçe veya dil durumun değişirse öncelikli blokaj da değişebilir.',
    },
  ],
  questions: [
    {
      id: 'pressure',
      text: 'Şu an seni en çok zorlayan genel baskı hangisi?',
      options: [
        { key: 'time', label: 'Zaman baskısı var, hızlı karar vermem gerek', next: 'offer', effects: { scores: { vize: 2, is: 1 } } },
        { key: 'unclear', label: 'Belirsizlik çok yüksek, neyin önce geldiğini bilmiyorum', next: 'offer', effects: { scores: { vize: 1, denklik: 1, dil: 1, finansman: 1 } } },
        { key: 'resources', label: 'Kaynaklarım sınırlı, hata yapamam', next: 'offer', effects: { scores: { finansman: 2, konut: 1 } } },
      ],
    },
    {
      id: 'offer',
      text: 'Somut teklif veya kabul tarafında durumun nedir?',
      options: [
        { key: 'job', label: 'İş teklifim var ama süreci netleştiremiyorum', next: 'docs', effects: { scores: { vize: 2, denklik: 1 } } },
        { key: 'study', label: 'Eğitim/kabul tarafı daha yakın', next: 'docs', effects: { scores: { finansman: 1, dil: 1 } } },
        { key: 'none', label: 'Henüz somut bir teklif yok', next: 'docs', effects: { scores: { is: 2, dil: 1 } } },
      ],
    },
    {
      id: 'docs',
      text: 'Belge ve yeterlilik tarafında en çok hangisi seni durduruyor?',
      options: [
        { key: 'recognition', label: 'Denklik / diploma tarafı belirsiz', next: 'daily', effects: { scores: { denklik: 3 } } },
        { key: 'visa', label: 'Hangi başvuru yoluna gireceğim net değil', next: 'daily', effects: { scores: { vize: 3 } } },
        { key: 'none', label: 'Belge tarafı sorunlu değil, daha çok başka alanlar zor', next: 'daily' },
      ],
    },
    {
      id: 'daily',
      text: 'Günlük hayat kurulumu açısından seni en çok zorlayan başlık hangisi?',
      options: [
        { key: 'housing', label: 'Konut ve adres konusu', next: 'RESULT:PRIORITY', effects: { scores: { konut: 3 } } },
        { key: 'language', label: 'Dil seviyesi ve iletişim', next: 'RESULT:PRIORITY', effects: { scores: { dil: 3 } } },
        { key: 'money', label: 'Bütçe ve finansal dayanıklılık', next: 'RESULT:PRIORITY', effects: { scores: { finansman: 3 } } },
        { key: 'jobs', label: 'İş bulma veya rol uyumu', next: 'RESULT:PRIORITY', effects: { scores: { is: 3 } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const issues = ['vize', 'denklik', 'konut', 'dil', 'finansman', 'is']
      .map((key) => ({ key, score: getScore(state, key) }))
      .sort((left, right) => right.score - left.score);

    const top = issues[0]?.key ?? 'vize';
    const next = issues[1]?.key ?? 'dil';

    const actionMap: Record<string, string[]> = {
      vize: [
        'Hedef kategori için tek bir başvuru yolu seç ve diğerlerini geçici olarak dondur.',
        'O yolun resmi şartlarını tek listede topla.',
        'Eksik belge ve randevu planını aynı hafta içinde netleştir.',
      ],
      denklik: [
        'Mesleğinin düzenlenmiş olup olmadığını resmi kaynaktan doğrula.',
        'Gerekli kurum ve belge tipini netleştir.',
        'Başvuruyu ne kadar erken başlatabileceğini takvimleştir.',
      ],
      konut: [
        'Geçici ve kalıcı konaklama stratejisini ayrı düşün.',
        'Adres kaydı için kullanılabilir seçenekleri yazılı hale getir.',
        'Şehir tercihini kira gerçekliği ile tekrar daralt.',
      ],
      dil: [
        'Hedef rota için gereken minimum dil seviyesini belirle.',
        'Kısa vadeli yoğun çalışma planı çıkar.',
        'Başvuru dilini ve günlük hayat dilini ayrı ihtiyaçlar olarak ele al.',
      ],
      finansman: [
        'En az ilk aylar için net gider tablosu çıkar.',
        'Gereksiz taşınma veya başvuru maliyetlerini ayıkla.',
        'Gelir başlayana kadar dayanıklılık süreni hesapla.',
      ],
      is: [
        'Teklif yoksa rol hedefini ve pazarını daralt.',
        'CV, profil ve başvuru dilini Almanya odağıyla güncelle.',
        'Başvuru hacmini değil, uygunluk kalitesini artır.',
      ],
    };

    return {
      id: 'PRIORITY',
      title: `Önce çözmen gereken alan: ${ISSUE_TITLES[top]}`,
      matchLabel: 'Birincil blokaj',
      tone: top === 'vize' || top === 'denklik' ? 'yellow' : top === 'finansman' ? 'red' : 'blue',
      summary:
        'Şu an ilerlemeyi en çok kilitleyen başlık bu görünüyor. Diğer sorunları tamamen yok saymak gerekmiyor; ama ilk enerjiyi buraya vermek daha yüksek çarpan yaratır.',
      why: [
        `Birinci blokaj alanı: ${ISSUE_TITLES[top]}.`,
        `İkinci plandaki destekleyici sorun: ${ISSUE_TITLES[next]}.`,
        'Darboğaz çözülmeden diğer alanlara harcanan enerji çoğu zaman dağınık kalır.',
      ],
      steps: actionMap[top] ?? actionMap.vize,
      caution:
        'Bu sonuç bir önceliklendirme önerisidir. Hukuki statü ve resmi başvuru kararları için güncel resmi kaynak kontrolü şarttır.',
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition, OFFICIAL_SOURCES.mbe],
      relatedTools: ['almanyaya-hazir-misin', 'topluluk-ve-danismanlik', 'almanya-yolunu-sec'],
    };
  },
};

