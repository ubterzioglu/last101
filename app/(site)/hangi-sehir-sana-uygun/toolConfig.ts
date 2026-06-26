import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact, pickTopScores } from '@/lib/tools/helpers';
import type { ToolConfig } from '@/lib/tools/types';

const CITY_LABELS: Record<string, string> = {
  berlin: 'Berlin profili',
  hamburg: 'Hamburg profili',
  nrw: 'NRW / Köln-Düsseldorf hattı',
  munich: 'Münih / Güney Almanya profili',
  leipzig: 'Leipzig / daha uygun maliyetli doğu profili',
};

const CITY_NOTES: Record<string, string> = {
  berlin: 'Uluslararası çevre güçlüdür; konut rekabeti sert olabilir.',
  hamburg: 'Dengeli ama pahalı sayılabilecek bir düzen sunar.',
  nrw: 'İş pazarı, ulaşım ve günlük yaşam arasında denge sunar.',
  munich: 'Maaş potansiyeli güçlüdür; kira baskısı yüksektir.',
  leipzig: 'Maliyet avantajı yüksektir; pazar bazı sektörlerde daha dardır.',
};

export const toolConfig: ToolConfig = {
  slug: 'hangi-sehir-sana-uygun',
  path: '/hangi-sehir-sana-uygun',
  title: 'Hangi Şehir Sana Uygun? Aracı',
  description:
    'Yaşam tarzı, bütçe, iş pazarı ve aile düzeni tercihine göre sana daha uygun şehir veya eyalet profilini keşfet.',
  intro:
    'Bu araç “kesin taşınma tavsiyesi” vermez. Onun yerine seni hangi şehir tipinin zorlayacağını ve hangi profilin daha doğal oturacağını anlamana yardım eder.',
  why:
    'Aynı ülkede bile şehir seçimi, iş fırsatı kadar kira, ulaşım, sosyal tempo ve aile düzeni bakımından hayatı tamamen değiştirebilir. Bu araç bu dengeyi görünür kılar.',
  whoFor: [
    'Berlin mi, NRW mi, Münih mi diye kararsız kalanlar.',
    'Bütçesi sınırlı olduğu için şehir seçimini daha dikkatli yapmak isteyenler.',
    'Aile, öğrenci veya kariyer odaklı yaşam arasında uyum arayanlar.',
  ],
  howItWorks: [
    'Kira toleransı, büyük şehir isteği, uluslararası çevre ve aile düzeni gibi sinyalleri toplar.',
    'Şehir profillerine puan ekleyerek en güçlü eşleşmeleri sıralar.',
    'Sonuçta sana uyan tarafları ve zorlayabilecek trade-off’ları birlikte gösterir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
  initialQuestionId: 'budget',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.arbeitsagentur,
    OFFICIAL_SOURCES.handbookGermany,
  ],
  relatedTools: ['almanya-maas-beklentisi', 'almanya-yasam-tarzi-uyumu', 'ilk-90-gun-planlayici'],
  faqs: [
    {
      question: 'Bu araç bana tek bir şehir mi önerir?',
      answer:
        'Hayır. Araç genelde birkaç güçlü eşleşme verir ve her birinin artı/eksi tarafını birlikte gösterir.',
    },
    {
      question: 'Düşük bütçeyle büyük şehir seçemez miyim?',
      answer:
        'Seçebilirsin; araç yalnızca bunun daha yüksek kira baskısı yaratacağını görünür hale getirir.',
    },
  ],
  questions: [
    {
      id: 'budget',
      text: 'Kira ve yaşam maliyeti konusunda seni en iyi anlatan cümle hangisi?',
      options: [
        {
          key: 'tight',
          label: 'Bütçem sıkı, uygun maliyet çok önemli',
          next: 'city-size',
          effects: { scores: { leipzig: 3, nrw: 2, munich: -2, berlin: -1 } },
        },
        {
          key: 'balanced',
          label: 'Denge arıyorum; tek kriter maliyet değil',
          next: 'city-size',
          effects: { scores: { nrw: 2, hamburg: 2, berlin: 1 } },
        },
        {
          key: 'flex',
          label: 'Fırsat güçlü ise pahalı şehir de düşünebilirim',
          next: 'city-size',
          effects: { scores: { munich: 3, hamburg: 1, berlin: 1 } },
        },
      ],
    },
    {
      id: 'city-size',
      text: 'Günlük hayat için hangi ritim sana daha yakın?',
      options: [
        {
          key: 'big',
          label: 'Hızlı, büyük, çok seçenekli şehir',
          next: 'international',
          effects: { scores: { berlin: 3, hamburg: 2, munich: 2 } },
        },
        {
          key: 'mixed',
          label: 'Şehir büyük olabilir ama günlük hayat dengeli olsun',
          next: 'international',
          effects: { scores: { nrw: 3, hamburg: 2 } },
        },
        {
          key: 'calm',
          label: 'Daha sakin ve kontrollü tempo istiyorum',
          next: 'international',
          effects: { scores: { leipzig: 3, nrw: 1, munich: 1 } },
        },
      ],
    },
    {
      id: 'international',
      text: 'Uluslararası topluluk ve yabancı dil ile ilerleyebilme senin için ne kadar önemli?',
      options: [
        {
          key: 'high',
          label: 'Çok önemli',
          next: 'career',
          effects: { scores: { berlin: 3, munich: 2, hamburg: 2 } },
        },
        {
          key: 'medium',
          label: 'Faydalı olur ama şart değil',
          next: 'career',
          effects: { scores: { nrw: 2, hamburg: 1, berlin: 1 } },
        },
        {
          key: 'low',
          label: 'Çok kritik değil',
          next: 'career',
          effects: { scores: { leipzig: 2, nrw: 1 } },
        },
      ],
    },
    {
      id: 'career',
      text: 'İş tarafında seni en çok ne motive ediyor?',
      options: [
        {
          key: 'global',
          label: 'Uluslararası şirketler ve network',
          next: 'family',
          effects: { scores: { berlin: 2, munich: 3, hamburg: 2 } },
        },
        {
          key: 'balanced',
          label: 'Çeşitli sektör ve daha dengeli yaşam',
          next: 'family',
          effects: { scores: { nrw: 3, hamburg: 2 } },
        },
        {
          key: 'cost',
          label: 'Maliyet avantajı ile kontrollü başlangıç',
          next: 'family',
          effects: { scores: { leipzig: 3, nrw: 1 } },
        },
      ],
    },
    {
      id: 'family',
      text: 'Aile düzeni ve günlük kolaylık tarafı senin için ne kadar belirleyici?',
      options: [
        {
          key: 'high',
          label: 'Çok belirleyici',
          next: 'RESULT:CITY_MATCH',
          effects: { scores: { nrw: 3, hamburg: 2, leipzig: 1 }, facts: { familyNeed: 'high' } },
        },
        {
          key: 'medium',
          label: 'Önemli ama tek kriter değil',
          next: 'RESULT:CITY_MATCH',
          effects: { scores: { nrw: 2, hamburg: 1, munich: 1 }, facts: { familyNeed: 'medium' } },
        },
        {
          key: 'low',
          label: 'Daha çok kariyer ve şehir deneyimi odaklıyım',
          next: 'RESULT:CITY_MATCH',
          effects: { scores: { berlin: 2, munich: 2 }, facts: { familyNeed: 'low' } },
        },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const topMatches = pickTopScores(state, ['berlin', 'hamburg', 'nrw', 'munich', 'leipzig'], 3);
    const primary = topMatches[0]?.key ?? 'nrw';
    const familyNeed = getFact<string>(state, 'familyNeed', 'medium');

    return {
      id: 'CITY_MATCH',
      title: `${CITY_LABELS[primary]} sana daha yakın görünüyor`,
      matchLabel: 'Şehir profili eşleşmesi',
      tone: primary === 'munich' ? 'orange' : primary === 'leipzig' ? 'green' : 'blue',
      summary:
        'Sonuç tek bir doğru şehir üretmiyor; ama tercihlerin, seni belirli şehir profillerine yaklaştırıyor. Aşağıdaki üçlü, araştırmaya önce buradan başlaman için en mantıklı eşleşmeler.',
      metrics: topMatches.map((item, index) => ({
        label: index === 0 ? 'İlk eşleşme' : index === 1 ? 'İkinci eşleşme' : 'Üçüncü eşleşme',
        value: CITY_LABELS[item.key],
        tone: index === 0 ? 'blue' : 'yellow',
      })),
      why: [
        CITY_NOTES[primary],
        familyNeed === 'high'
          ? 'Aile düzeni beklentin, dengeli ve günlük hayatı daha yönetilebilir profilleri öne çekti.'
          : 'Kariyer ve tempo tercihlerin, daha dinamik şehir profillerine puan verdi.',
        'Bu eşleşme taşınma kararı değil, araştırma önceliği üretir. Son aşamada iş pazarı ve kira aramasını ayrıca doğrulamalısın.',
      ],
      steps: [
        `${CITY_LABELS[primary]} için kira, ulaşım ve iş ilanı yoğunluğunu ayrı not al.`,
        'İlk üç eşleşmenin her biri için birer artı/eksi listesi çıkar.',
        'Bütçe ile yaşam tarzı çakışıyorsa önce geçici başlangıç şehirlerini de değerlendir.',
      ],
      caution:
        'Şehir önerileri genelleştirilmiştir. Aynı eyalet içinde bile mahalle, ulaşım ve sektör farkı günlük yaşamı ciddi biçimde değiştirebilir.',
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur, OFFICIAL_SOURCES.handbookGermany],
      relatedTools: ['almanya-maas-beklentisi', 'almanya-yasam-tarzi-uyumu', 'almanyada-is-bulma-olasiligi'],
    };
  },
};
