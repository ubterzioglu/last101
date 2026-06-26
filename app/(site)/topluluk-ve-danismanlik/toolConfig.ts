import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact } from '@/lib/tools/helpers';
import type { ToolConfig, ToolSource } from '@/lib/tools/types';

export const toolConfig: ToolConfig = {
  slug: 'topluluk-ve-danismanlik',
  path: '/topluluk-ve-danismanlik',
  title: 'Topluluk ve Danışmanlık Eşleştirici',
  description:
    'İhtiyacına göre resmi danışmanlık, topluluk, kariyer veya entegrasyon desteğine hangi kanaldan başlaman gerektiğini öğren.',
  intro:
    'Bu araç kişisel danışman atamaz; ama hangi tip desteğin senin için önce gelmesi gerektiğini, hangi kurumdan başlamanın daha mantıklı olduğunu gösterir.',
  why:
    'Almanya sürecinde bilgi eksikliği kadar yanlış kapıya gitmek de vakit kaybettirir. Bu araç, ihtiyacını resmî danışmanlık, topluluk desteği ve entegrasyon kanalları arasında daha doğru konumlandırır.',
  whoFor: [
    'Sorunu var ama önce hangi kurum veya destek hattına gitmesi gerektiğini bilmeyenler.',
    'Aile, iş, denklik veya günlük yaşam desteğini karıştıran kullanıcılar.',
    'Anonim, ücretsiz veya çok dilli destek arayan yeni gelenler.',
  ],
  howItWorks: [
    'Sorununun ana tipini, statünü ve dil tercihini sorar.',
    'Seni tek bir kuruma değil; önce bakılacak birincil kanal ve yedek destek hattına yönlendirir.',
    'Sonuçta neden bu yönlendirmeyi aldığını ve nasıl hazırlanman gerektiğini açıklar.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 4,
  initialQuestionId: 'need',
  officialSources: [
    OFFICIAL_SOURCES.mbe,
    OFFICIAL_SOURCES.bamf,
    OFFICIAL_SOURCES.recognition,
    OFFICIAL_SOURCES.handbookGermany,
  ],
  relatedTools: ['almanyaya-hazir-misin', 'once-hangi-sorunu-cozmelisin', 'ilk-90-gun-planlayici'],
  faqs: [
    {
      question: 'Bu araç bana avukat veya özel danışman önerir mi?',
      answer:
        'Hayır. İlk sürüm yalnızca kamusal, topluluk veya güvenilir bilgi kanallarına yönlendirme yapar.',
    },
    {
      question: 'Topluluk desteği resmi danışmanlığın yerini tutar mı?',
      answer:
        'Hayır. Topluluk desteği pratik yön bulmayı kolaylaştırır; resmi başvurularda kurum doğrulaması yine gerekir.',
    },
  ],
  questions: [
    {
      id: 'need',
      text: 'Şu an en acil destek ihtiyacın hangi başlıkta?',
      options: [
        { key: 'recognition', label: 'Denklik / diploma / meslek tanınması', next: 'status', effects: { facts: { need: 'recognition' } } },
        { key: 'job', label: 'İş arama / CV / başvuru yönü', next: 'status', effects: { facts: { need: 'job' } } },
        { key: 'family', label: 'Aile, çocuk, günlük yaşam, okul', next: 'status', effects: { facts: { need: 'family' } } },
        { key: 'integration', label: 'Dil, entegrasyon, yeni hayata uyum', next: 'status', effects: { facts: { need: 'integration' } } },
        { key: 'rights', label: 'Statü, haklar veya resmi süreç yönü', next: 'status', effects: { facts: { need: 'rights' } } },
      ],
    },
    {
      id: 'status',
      text: 'Sana en yakın durum hangisi?',
      options: [
        { key: 'abroad', label: 'Henüz Almanya dışında planlama aşamasındayım', next: 'language', effects: { facts: { status: 'abroad' } } },
        { key: 'new', label: 'Yeni geldim veya yakında geleceğim', next: 'language', effects: { facts: { status: 'new' } } },
        { key: 'resident', label: 'Almanya\'dayım ve içeriden çözüm arıyorum', next: 'language', effects: { facts: { status: 'resident' } } },
      ],
    },
    {
      id: 'language',
      text: 'Destek kanalında dil tarafında neye ihtiyacın var?',
      options: [
        { key: 'tr', label: 'Türkçe veya çok dilli destek önemli', next: 'location', effects: { facts: { language: 'tr' } } },
        { key: 'de', label: 'Almanca yürüyebilirim', next: 'location', effects: { facts: { language: 'de' } } },
        { key: 'en', label: 'İngilizce ile yürüyebilirim', next: 'location', effects: { facts: { language: 'en' } } },
      ],
    },
    {
      id: 'location',
      text: 'Destek ararken hangisi sana daha uygun?',
      options: [
        { key: 'local', label: 'Şehrimde yüz yüze veya yerel kanal olsun', next: 'RESULT:SUPPORT_MATCH', effects: { facts: { locationNeed: 'local' } } },
        { key: 'online', label: 'Önce online bilgi ve yönlendirme yeterli', next: 'RESULT:SUPPORT_MATCH', effects: { facts: { locationNeed: 'online' } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const need = getFact<string>(state, 'need', 'integration');
    const status = getFact<string>(state, 'status', 'abroad');
    const language = getFact<string>(state, 'language', 'tr');
    const locationNeed = getFact<string>(state, 'locationNeed', 'online');

    let primary: ToolSource = OFFICIAL_SOURCES.mbe;
    let secondary: ToolSource = OFFICIAL_SOURCES.handbookGermany;
    let title = 'MBE ve çok dilli destek hatları ile başlamak mantıklı görünüyor';
    let why = [
      'İhtiyacın hem yön bulma hem de pratik destek içeriyor.',
      'Çok dilli danışmanlık, özellikle sürecin başında sürtünmeyi azaltır.',
    ];

    if (need === 'recognition') {
      primary = OFFICIAL_SOURCES.recognition;
      secondary = OFFICIAL_SOURCES.mbe;
      title = 'Önce denklik odaklı resmi kanala gitmelisin';
      why = [
        'Denklik konusu topluluk tavsiyesiyle değil, resmi tanıma hattıyla netleşir.',
        'Yanlış kuruma gitmek hem süre hem belge yükü yaratır.',
      ];
    } else if (need === 'job') {
      primary = OFFICIAL_SOURCES.arbeitsagentur;
      secondary = OFFICIAL_SOURCES.handbookGermany;
      title = 'Önce iş piyasası ve kariyer desteği hattına yönelmelisin';
      why = [
        'İş arama desteğinde resmî iş piyasası yönlendirmesi, ilan ve profil bilgisini daha doğru çerçeveler.',
        'Topluluk rehberleri iyi destek verir ama ilk kapı olarak resmî kariyer yönlendirmesi daha güçlüdür.',
      ];
    } else if (need === 'integration') {
      primary = OFFICIAL_SOURCES.bamf;
      secondary = OFFICIAL_SOURCES.mbe;
      title = 'Dil ve uyum sürecinde BAMF odaklı başlamak mantıklı';
      why = [
        'Entegrasyon kursları ve yerel yönlendirmeler için BAMF ağı ana referanstır.',
        'Yeni gelenler için MBE bu hattı pratik destekle tamamlar.',
      ];
    } else if (need === 'rights') {
      primary = OFFICIAL_SOURCES.mbe;
      secondary = OFFICIAL_SOURCES.handbookGermany;
      title = 'Haklar ve resmi süreçler için önce danışmanlık hattı daha doğru';
      why = [
        'Statü ve haklar başlığında genel internet bilgisi yerine doğrulanmış yönlendirme daha güvenlidir.',
        'Topluluk rehberleri destekleyici olabilir ama ilk yorum için resmi/yarı resmi danışmanlık daha uygundur.',
      ];
    }

    return {
      id: 'SUPPORT_MATCH',
      title,
      matchLabel: 'Destek yönlendirmesi',
      tone: need === 'job' ? 'blue' : need === 'recognition' ? 'yellow' : 'green',
      summary:
        'Araç, sana tek bir “doğru kurum” değil; ilk temas için daha uygun bir kanal ve ikinci destek hattı önerir. Böylece doğrudan sorununun çekirdeğine inebilirsin.',
      metrics: [
        { label: 'İlk başvurulacak kanal', value: primary.label, tone: 'blue' },
        { label: 'İkinci destek hattı', value: secondary.label, tone: 'green' },
        { label: 'Destek biçimi', value: locationNeed === 'local' ? 'Yerel/yüz yüze arayış' : 'Online yön bulma ile başlangıç', tone: 'yellow' },
        { label: 'Dil ihtiyacı', value: language === 'tr' ? 'Türkçe / çok dilli destek önemli' : language === 'de' ? 'Almanca ile ilerleyebilirsin' : 'İngilizce ile başlayabilirsin', tone: 'orange' },
      ],
      why: [
        ...why,
        status === 'abroad'
          ? 'Henüz Almanya dışında olduğun için online ve merkezi kaynaklardan başlamak daha verimli olabilir.'
          : 'Almanya içinde olduğun için yerel danışmanlık noktaları süreci hızlandırabilir.',
      ],
      steps: [
        `${primary.label} üzerinde sorununla ilgili ilk giriş noktasını bul ve temel bilgi notlarını çıkar.`,
        'Gitmeden önce durumunu 3-4 cümlede özetleyen kısa bir başvuru notu hazırla.',
        `${secondary.label} tarafını yedek kaynak olarak kullan ve yerel destek gerekiyorsa şehir bazlı aramayı derinleştir.`,
      ],
      caution:
        'Araç kişisel eşleştirme iddiası taşımaz. Özellikle hukuki veya oturum statüsü konularında son sözü resmi kurum veya yetkili danışman verir.',
      officialSources: [primary, secondary],
      relatedTools: ['once-hangi-sorunu-cozmelisin', 'almanyaya-hazir-misin', 'ilk-90-gun-planlayici'],
    };
  },
};
