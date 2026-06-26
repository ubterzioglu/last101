import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { pickHighestScore } from '@/lib/tools/helpers';
import type { ToolConfig } from '@/lib/tools/types';

const PROFILE_TITLES: Record<string, string> = {
  metro: 'Büyük şehir odaklı yaşam profili',
  balance: 'Dengeli şehir yaşamı profili',
  family: 'Aile ve düzen odaklı yaşam profili',
  calm: 'Sakin ve kontrollü tempo profili',
};

export const toolConfig: ToolConfig = {
  slug: 'almanya-yasam-tarzi-uyumu',
  path: '/almanya-yasam-tarzi-uyumu',
  title: 'Almanya Yaşam Tarzı Uyumu Aracı',
  description:
    'Büyük şehir, sosyal tempo, aile düzeni, doğa ve bürokrasi toleransına göre hangi yaşam tarzı profiline daha yakın olduğunu öğren.',
  intro:
    'Bu araç göçmenlik hakkı veya şehir seçimi kararı vermez. Sadece Almanya\'daki günlük hayat beklentinle daha uyumlu yaşam profilini çıkarır.',
  why:
    'Birçok kullanıcı ülkeye değil, hayal ettiği yaşam ritmine taşınmak ister. Bu araç o ritmi kelimelere döker ve beklenti-kırılma riskini azaltır.',
  whoFor: [
    'Almanya\'da nasıl bir hayat istediğini daha net görmek isteyenler.',
    'Büyük şehir temposu ile sakin yaşam arasında kararsız kalanlar.',
    'Kariyer odağı ile günlük huzur beklentisini dengelemeye çalışanlar.',
  ],
  howItWorks: [
    'Sosyal tempo, aile odağı, doğa isteği ve bürokrasi toleransı gibi tercihleri toplar.',
    'Bu tercihlere göre baskın yaşam profilini seçer.',
    'Sonuçta günlük yaşamda seni neyin zorlayabileceğini ve neyin iyi gelebileceğini anlatır.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
  initialQuestionId: 'tempo',
  officialSources: [
    OFFICIAL_SOURCES.handbookGermany,
    OFFICIAL_SOURCES.makeItInGermany,
  ],
  relatedTools: ['hangi-sehir-sana-uygun', 'ilk-90-gun-planlayici', 'topluluk-ve-danismanlik'],
  faqs: [
    {
      question: 'Bu araç şehir seçiminin yerini tutar mı?',
      answer:
        'Hayır. Ama şehir seçimi yaparken seni hangi yaşam ritminin zorlayabileceğini daha iyi görmeni sağlar.',
    },
    {
      question: 'Büyük şehir profili çıkarsa bu iyi midir?',
      answer:
        'İyi veya kötü değildir. Yalnızca sosyal tempo, network ve günlük enerji beklentine daha yakın olduğunu gösterir.',
    },
  ],
  questions: [
    {
      id: 'tempo',
      text: 'Günlük yaşam temposu için hangisi sana daha yakın?',
      options: [
        { key: 'fast', label: 'Hızlı ve seçenekli tempo isterim', next: 'social', effects: { scores: { metro: 3, balance: 1 } } },
        { key: 'medium', label: 'Dengeli ama sıkıcı olmayan tempo isterim', next: 'social', effects: { scores: { balance: 3, family: 1 } } },
        { key: 'slow', label: 'Sakin ve daha kontrollü tempo isterim', next: 'social', effects: { scores: { calm: 3, family: 2 } } },
      ],
    },
    {
      id: 'social',
      text: 'Sosyal hayat ve yeni insanlarla temas senin için ne kadar önemli?',
      options: [
        { key: 'high', label: 'Çok önemli', next: 'family', effects: { scores: { metro: 3, balance: 2 } } },
        { key: 'medium', label: 'Olursa iyi olur ama şart değil', next: 'family', effects: { scores: { balance: 2, family: 1 } } },
        { key: 'low', label: 'Daha çok kendi düzenimi isterim', next: 'family', effects: { scores: { calm: 2, family: 2 } } },
      ],
    },
    {
      id: 'family',
      text: 'Aile düzeni ve günlük öngörülebilirlik ne kadar öncelikli?',
      options: [
        { key: 'high', label: 'Çok öncelikli', next: 'nature', effects: { scores: { family: 3, calm: 1 } } },
        { key: 'medium', label: 'Önemli ama tek kriter değil', next: 'nature', effects: { scores: { balance: 2, family: 1 } } },
        { key: 'low', label: 'Şimdilik kariyer ve keşif daha baskın', next: 'nature', effects: { scores: { metro: 2 } } },
      ],
    },
    {
      id: 'nature',
      text: 'Doğaya yakınlık ve günlük dinginlik senin için ne kadar değerli?',
      options: [
        { key: 'high', label: 'Çok değerli', next: 'bureaucracy', effects: { scores: { calm: 3, family: 1 } } },
        { key: 'medium', label: 'Dengeli olsa yeter', next: 'bureaucracy', effects: { scores: { balance: 2, family: 1 } } },
        { key: 'low', label: 'Şehir enerjisi daha önemli', next: 'bureaucracy', effects: { scores: { metro: 2 } } },
      ],
    },
    {
      id: 'bureaucracy',
      text: 'Bürokrasi, sıra ve yavaş ilerleyen süreçlere karşı toleransın nasıl?',
      options: [
        { key: 'high', label: 'Sabırlıyım, yönetebilirim', next: 'RESULT:LIFESTYLE', effects: { scores: { balance: 1, family: 1 } } },
        { key: 'medium', label: 'Yorulurum ama idare ederim', next: 'RESULT:LIFESTYLE', effects: { scores: { balance: 2 } } },
        { key: 'low', label: 'Beni çok yıpratır, düzen isterim', next: 'RESULT:LIFESTYLE', effects: { scores: { calm: 2, family: 1 } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const best = pickHighestScore(state, ['metro', 'balance', 'family', 'calm']).key;

    return {
      id: 'LIFESTYLE',
      title: PROFILE_TITLES[best] ?? PROFILE_TITLES.balance,
      matchLabel: 'Yaşam uyumu',
      tone: best === 'metro' ? 'blue' : best === 'family' ? 'green' : best === 'calm' ? 'yellow' : 'orange',
      summary:
        'Bu sonuç Almanya\'da hangi yaşam ritminin sana daha doğal gelebileceğini gösterir. Hangi şehirde yaşayacağından bağımsız olarak günlük tercihlerin bu profile yaklaşıyor.',
      why: [
        best === 'metro'
          ? 'Sosyal tempo, seçenek ve hareketlilik arıyorsun.'
          : best === 'family'
            ? 'Öngörülebilirlik, aile düzeni ve günlük rahatlık senin için ağır basıyor.'
            : best === 'calm'
              ? 'Sakinlik ve zihinsel alan ihtiyacı öne çıkıyor.'
              : 'Denge arayan, ne çok hızlı ne çok yavaş bir günlük ritim istiyorsun.',
        'Bu profil, şehir seçimi ve günlük rutin kararlarında sana filtre görevi görebilir.',
        'Uyum sorunu çoğu zaman ülkeden değil, yanlış yaşam ritmi beklentisinden doğar.',
      ],
      steps: [
        'Şehir ve iş seçimini bu profil ile çapraz kontrol et.',
        'Günlük hayatında seni tüketen ve besleyen şeyleri yazılı hale getir.',
        'İlk yerleşim kararında bu profile ters düşen kalemleri özellikle not al.',
      ],
      caution:
        'Araç yaşam tarzı uyumu üretir; oturum, maaş veya hukuki uygunluk değerlendirmesi yapmaz.',
      officialSources: [OFFICIAL_SOURCES.handbookGermany, OFFICIAL_SOURCES.makeItInGermany],
      relatedTools: ['hangi-sehir-sana-uygun', 'ilk-90-gun-planlayici'],
    };
  },
};

