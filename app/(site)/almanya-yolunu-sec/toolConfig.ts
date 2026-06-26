import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact, getScore } from '@/lib/tools/helpers';
import type { ToolConfig, ToolResult, ToolTone } from '@/lib/tools/types';

type RouteKey =
  | 'blueCard'
  | 'fachkraefte'
  | 'chancenkarte'
  | 'ausbildung'
  | 'student'
  | 'family'
  | 'freelance'
  | 'itSpecialist';

type ResultId =
  | 'BLUE_CARD'
  | 'FACHKRAFTE'
  | 'CHANCENKARTE'
  | 'AUSBILDUNG'
  | 'STUDENT'
  | 'FAMILY'
  | 'FREELANCE'
  | 'IT_SPECIALIST'
  | 'LIMITED';

const ROUTE_TO_RESULT: Record<RouteKey, ResultId> = {
  blueCard: 'BLUE_CARD',
  fachkraefte: 'FACHKRAFTE',
  chancenkarte: 'CHANCENKARTE',
  ausbildung: 'AUSBILDUNG',
  student: 'STUDENT',
  family: 'FAMILY',
  freelance: 'FREELANCE',
  itSpecialist: 'IT_SPECIALIST',
};

const GAP_KEYS = ['languageGap', 'budgetGap', 'recognitionGap', 'flexibilityGap'] as const;

const GAP_LABELS: Record<(typeof GAP_KEYS)[number], string> = {
  languageGap: 'dil ve iletişim hazırlığı',
  budgetGap: 'maddi tampon',
  recognitionGap: 'denklik ve evrak netliği',
  flexibilityGap: 'şehir/rol esnekliği',
};

const RESULT_META: Record<
  ResultId,
  {
    title: string;
    matchLabel: string;
    tone: ToolTone;
    summaryLead: string;
    officialSources: ToolResult['officialSources'];
    relatedTools: ToolResult['relatedTools'];
    steps: string[];
  }
> = {
  BLUE_CARD: {
    title: 'EU Mavi Kart başlangıçta en güçlü aday görünüyor',
    matchLabel: 'Güçlü başlangıç yolu',
    tone: 'blue',
    summaryLead:
      'İş teklifin, maaş sinyalin ve tanınabilir yeterlilik profilin birlikte okunduğunda ilk bakılması gereken rota EU Mavi Kart görünüyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
    relatedTools: ['almanyaya-hazir-misin', 'almanya-maas-beklentisi', 'ilk-90-gun-planlayici'],
    steps: [
      'İş sözleşmendeki maaşın güncel Mavi Kart eşiğine yakınlığını resmi kaynaktan teyit et.',
      'Diploma veya yeterlilik kanıtını anabin, ZAB veya ilgili tanıma hattı üzerinden netleştir.',
      'İşvereninle pozisyon tanımı, başlangıç tarihi ve sözleşme detaylarını yazılı olarak sabitle.',
      'Vize ve sonrasındaki oturum dosyası için evrak listesini erkenden çıkar.',
    ],
  },
  FACHKRAFTE: {
    title: 'Fachkräfte yolu şu an daha gerçekçi görünüyor',
    matchLabel: 'Net rota',
    tone: 'green',
    summaryLead:
      'İş teklifin ve yeterlilik profilin güçlü; ancak tablo Mavi Karttan çok nitelikli çalışan başvurusu tarafında daha doğal bir eşleşme veriyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
    relatedTools: ['almanyaya-hazir-misin', 'kariyer-ve-egitim-rotasi'],
    steps: [
      'İş teklifindeki rol, süre ve ücret detaylarını başvuru dosyası açısından temiz hale getir.',
      'Mesleğin için denklik veya tanıma gerekip gerekmediğini son kez netleştir.',
      'CV, diploma çevirileri, sigorta ve temel başvuru evraklarını tek dosyada toparla.',
      'Başvuru yapacağın ülke veya şehirdeki randevu ve işlem sürelerini erkenden kontrol et.',
    ],
  },
  CHANCENKARTE: {
    title: 'Chancenkarte senin için mantıklı ilk araştırma yolu olabilir',
    matchLabel: 'Araştırma ve giriş yolu',
    tone: 'yellow',
    summaryLead:
      'Henüz iş teklifin yok; ama eğitim, deneyim, dil veya bütçe tarafında Almanya pazarına kontrollü biçimde girmeni destekleyen bir profil oluşuyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
    relatedTools: ['almanyada-is-bulma-olasiligi', 'almanyaya-hazir-misin'],
    steps: [
      'Puan sisteminde seni öne çıkaran başlıkları yazılı hale getir: dil, deneyim, yaş ve Almanya bağlantısı.',
      'Diploma veya mesleki temelinin tanınabilirliğini resmi kanaldan kontrol et.',
      'İş arama dönemi için bütçe, konaklama ve evrak planını birlikte çıkar.',
      'CV, LinkedIn ve başvuru setini Almanya piyasasına göre güncelle.',
    ],
  },
  AUSBILDUNG: {
    title: 'Ausbildung yolu başlangıç için daha uygun görünüyor',
    matchLabel: 'Pratik rota',
    tone: 'green',
    summaryLead:
      'Pratik eğitim odaklı bir başlangıç, şu anki profilinle Almanya\'ya kontrollü giriş yapmak için daha makul bir zemin sunuyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
    relatedTools: ['kariyer-ve-egitim-rotasi', 'almanya-yasam-tarzi-uyumu'],
    steps: [
      'Hedeflediğin meslek alanında aktif Ausbildung ilanlarını ve şehirleri kısa listeye indir.',
      'En az temel-orta Almanca seviyesini güçlendirecek bir çalışma planı oluştur.',
      'Şirket, okul ve konaklama üçlüsünü birlikte düşünerek başvurularını daralt.',
      'Sözleşme ve vize evraklarını erken hazırlayarak süreci hızlandır.',
    ],
  },
  STUDENT: {
    title: 'Üniversite veya yüksek lisans yolu öne çıkıyor',
    matchLabel: 'Akademik rota',
    tone: 'blue',
    summaryLead:
      'Akademik giriş niyetin ve finansal hazırlık sinyalin birlikte bakıldığında üniversite veya yüksek lisans hattı daha tutarlı bir başlangıç sunuyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
    relatedTools: ['kariyer-ve-egitim-rotasi', 'ilk-90-gun-planlayici'],
    steps: [
      'Uygun bölüm ve üniversiteleri kısa listeye indir.',
      'Dil şartı, kabul takvimi ve belge listesini tek tabloda topla.',
      'Bloke hesap, burs veya yaşam bütçesi planını erken netleştir.',
      'Eğitim sonrası iş arama ve oturum geçiş yollarını da baştan incele.',
    ],
  },
  FAMILY: {
    title: 'Aile birleşimi senin için ana giriş yolu',
    matchLabel: 'Aile temelli rota',
    tone: 'green',
    summaryLead:
      'Senin için belirleyici kaldıraç kariyerden çok aile bağı. Bu yüzden ilk odak, Almanya\'daki yakın kişinin statüsü ve aile birleşimi şartları olmalı.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
    relatedTools: ['ilk-90-gun-planlayici', 'topluluk-ve-danismanlik'],
    steps: [
      'Almanya\'daki eş veya aile üyesinin oturum statüsünü, gelirini ve konut durumunu netleştir.',
      'Evlilik, doğum, kayıt ve tercüme evraklarını eksiksiz dosyala.',
      'Gerekliyse A1 Almanca şartını ve muafiyet istisnalarını ayrıca kontrol et.',
      'Başvuru ülkesindeki randevu sürelerini erkenden takip et.',
    ],
  },
  FREELANCE: {
    title: 'Freelance veya serbest çalışma hattı öne çıkıyor',
    matchLabel: 'Bağımsız çalışma rotası',
    tone: 'orange',
    summaryLead:
      'Profilin işveren sponsorlu girişten çok kendi müşteri ağına, portföyüne ve gelir planına dayalı bir başlangıç ihtimalini güçlendiriyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
    relatedTools: ['almanya-maas-beklentisi', 'almanya-yasam-tarzi-uyumu'],
    steps: [
      'Hangi hizmeti kime satacağını ve gelir modelini yazılı hale getir.',
      'Portföy, referans ve müşteri örneklerini başvuru dosyasına dönüştür.',
      'Freiberufler hattı mı yoksa şirket kurulumuna yakın bir model mi daha uygun, bunu ayır.',
      'Vergi ve sağlık sigortası yükümlülüklerini baştan çalış.',
    ],
  },
  IT_SPECIALIST: {
    title: 'BT uzmanı olarak deneyim odaklı yolun olabilir',
    matchLabel: 'Niş ama mümkün rota',
    tone: 'blue',
    summaryLead:
      'BT alanındaki deneyim gücün ve iş bağlantın, seni standart diploma odaklı değerlendirmeden biraz daha farklı bir hatta taşıyabiliyor.',
    officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
    relatedTools: ['almanyada-is-bulma-olasiligi', 'almanya-maas-beklentisi'],
    steps: [
      'Referans mektupları, proje çıktıları ve deneyim süreni kanıtlayan belgeleri topla.',
      'Teknik rol tanımının deneyiminle güçlü biçimde örtüştüğünden emin ol.',
      'Maaş beklentini ve dil seviyeni rol gerçekliğine göre kalibre et.',
      'Paralelde standart nitelikli çalışan ve freelance alternatiflerini de açık tut.',
    ],
  },
  LIMITED: {
    title: 'Önce profilini güçlendirmen gerekiyor',
    matchLabel: 'Hazırlık öncelikli',
    tone: 'red',
    summaryLead:
      'Şu anki sinyallerle tek bir rota güvenle öne çıkmıyor. Bu, seçenek yok demek değil; önce profilin bazı temel parçalarını güçlendirmek gerektiği anlamına geliyor.',
    officialSources: [OFFICIAL_SOURCES.bamf, OFFICIAL_SOURCES.recognition, OFFICIAL_SOURCES.mbe],
    relatedTools: ['almanyaya-hazir-misin', 'once-hangi-sorunu-cozmelisin', 'topluluk-ve-danismanlik'],
    steps: [
      'Dil, bütçe, evrak ve yeterlilik tarafında en zayıf halkayı tek başlık olarak seç.',
      'Seni erişilebilir bir rotaya yaklaştıracak kısa vadeli hedef belirle: dil, denklik, iş teklifi veya eğitim hazırlığı.',
      'CV ve mesleki dosyanı Almanya formatına yaklaştır.',
      'Hazırlık sonrası tabloyu yeniden ölçmek için aracı tekrar kullan.',
    ],
  },
};

function suitabilityMetric(score: number): { value: string; tone: ToolTone } {
  if (score >= 32) {
    return { value: 'Cok yuksek', tone: 'green' };
  }
  if (score >= 24) {
    return { value: 'Yuksek', tone: 'green' };
  }
  if (score >= 16) {
    return { value: 'Orta', tone: 'yellow' };
  }
  if (score >= 10) {
    return { value: 'Sinirda', tone: 'orange' };
  }

  return { value: 'Dusuk', tone: 'red' };
}

function readinessMetric(score: number): { value: string; tone: ToolTone } {
  if (score >= 11) {
    return { value: 'Yuksek', tone: 'green' };
  }
  if (score >= 7) {
    return { value: 'Orta', tone: 'yellow' };
  }
  if (score >= 4) {
    return { value: 'Gelistirilmeli', tone: 'orange' };
  }

  return { value: 'Dusuk', tone: 'red' };
}

function blockerMetric(score: number): { value: string; tone: ToolTone } {
  if (score >= 8) {
    return { value: 'Yuksek', tone: 'red' };
  }
  if (score >= 5) {
    return { value: 'Orta', tone: 'yellow' };
  }

  return { value: 'Dusuk', tone: 'green' };
}

function getTopGapKey(state: Parameters<NonNullable<ToolConfig['resolveResult']>>[0]['state']) {
  return GAP_KEYS.reduce<(typeof GAP_KEYS)[number] | null>((best, key) => {
    if (!best) {
      return getScore(state, key) > 0 ? key : null;
    }

    return getScore(state, key) > getScore(state, best) ? key : best;
  }, null);
}

function buildDynamicWhy(
  resultId: ResultId,
  facts: Record<string, string>,
  topGapLabel: string | null
) {
  const reasons: Record<Exclude<ResultId, 'LIMITED'>, string[]> = {
    BLUE_CARD: [
      'İş teklifin ve maaş sinyalin sponsorlu uzmanlık hattını doğrudan öne taşıyor.',
      'Tanınabilir diploma veya mesleki temel, Mavi Kart değerlendirmesinde kritik avantaj sağlıyor.',
    ],
    FACHKRAFTE: [
      'İşveren desteği ve yeterlilik profilin, nitelikli çalışan başvurusu için güçlü taban oluşturuyor.',
      'Maaş profili seni Mavi Karttan çok standart uzman/çalışan hattına yaklaştırıyor.',
    ],
    CHANCENKARTE: [
      'Henüz imzalı teklifin olmaması, ama taşınabilir eğitim veya deneyim gücün bu rotayı anlamlı kılıyor.',
      'Dil, bütçe ve esneklik kombinasyonu sahada iş arama sürecini daha gerçekçi hale getiriyor.',
    ],
    AUSBILDUNG: [
      'Pratik öğrenme eğilimin ve yaş/kariyer evren Ausbildung başlangıcıyla uyumlu görünüyor.',
      'Temel Almanca ve esnek başlangıç yaklaşımı bu yolu daha erişilebilir kılıyor.',
    ],
    STUDENT: [
      'Akademik giriş niyetin ile finansal hazırlık sinyalin aynı yöne bakıyor.',
      'Eğitim üzerinden giriş, şu anki tabloda daha düzenli ve öngörülebilir bir geçiş sunuyor.',
    ],
    FAMILY: [
      'Almanya\'daki aile bağı, kariyer odaklı yollardan daha doğrudan bir giriş kapısı oluşturuyor.',
      'Bu rotada belirleyici unsur iş piyasası değil, karşı taraftaki statü ve evrak seti oluyor.',
    ],
    FREELANCE: [
      'Bağımsız çalışma isteğin ile portföy/gelir mantığın işveren sponsorlu modele göre daha baskın.',
      'Bu rota, müşteri ağı ve finansal tampon olduğunda daha tutarlı hale geliyor.',
    ],
    IT_SPECIALIST: [
      'BT alanı ve deneyim derinliği, seni genel çalışan profilinden ayrıştırıyor.',
      'Somut teknik iş bağlantısı bu niş hattın çalışabilmesi için önemli bir kaldıraç sağlıyor.',
    ],
  };

  if (resultId === 'LIMITED') {
    const weakPoints = topGapLabel
      ? `En baskin zayif halka su an ${topGapLabel}.`
      : 'Birden fazla temel zayif halka ayni anda baski uretiyor.';

    return [
      'Dogrudan guclu bir rota secmek yerine once profilin temel taslarini tamamlaman daha dogru olur.',
      weakPoints,
      'Hazirlik gucu artmadan acele basvuru yapmak zaman ve para kaybina donebilir.',
    ];
  }

  const profileNote =
    facts.goal === 'family' || facts.mode === 'family'
      ? 'Baslangic mantigin aile bagiyla uyumlu.'
      : facts.goal === 'study' || facts.mode === 'study'
        ? 'Akademik hedefin de bu sonucu destekliyor.'
        : facts.field === 'tech' && facts.experience === 'high'
          ? 'Alan ve deneyim kombinasyonun sonucu daha da guclendiriyor.'
          : 'Genel profil sinyallerin bu rotayla tutarli gorunuyor.';

  return [
    ...reasons[resultId],
    topGapLabel
      ? `Yine de en cok dikkat isteyen konu ${topGapLabel}; bunu guclendirmen sureci daha guvenli hale getirir.`
      : profileNote,
  ];
}

function buildSummary(summaryLead: string, readiness: number, blocker: number) {
  if (readiness >= 10 && blocker <= 3) {
    return `${summaryLead} Hazirlik tarafinda da gorece dengeli bir profil veriyorsun.`;
  }
  if (blocker >= 8) {
    return `${summaryLead} Ancak basvuru oncesi birkac kritik eksigi kapatman gerekir.`;
  }
  if (readiness <= 4) {
    return `${summaryLead} Rota uygun gorunse bile pratik hazirlik tarafini biraz daha toplaman faydali olur.`;
  }

  return `${summaryLead} Uygunluk tarafi onde, ama hazirlik seviyeni bir ust banda cikarman sureci kolaylastirir.`;
}

export const toolConfig: ToolConfig = {
  slug: 'almanya-yolunu-sec',
  path: '/almanya-yolunu-sec',
  title: 'Almanya Yolunu Seç Aracı',
  description:
    'Çalışma, Ausbildung, üniversite, aile birleşimi veya serbest çalışma gibi Almanya yolları arasında sana daha uygun başlangıç rotasını bul.',
  intro:
    'Bu araç, Almanya planındaki ana rotanı daha sistemli seçmen için tasarlandı. İş teklifi, eğitim, denklik, maaş, dil, bütçe ve esneklik sinyallerini birlikte okuyup ilk bakman gereken yolu daraltır.',
  why:
    'Birçok kullanıcı Almanya sürecine yalnızca bir vize adı arayarak başlıyor. Oysa doğru başlangıç rotası; hedef, teklif, yeterlilik, dil, bütçe ve hazır oluş seviyesinin birlikte okunmasıyla netleşir. Bu araç dağınık sinyalleri tek bir çerçevede toplar.',
  whoFor: [
    'Almanya için henüz hangi ana rotadan ilerlemesi gerektiğine karar veremeyenler.',
    'İş teklifi, diploma veya deneyimi olan ama hangi yolun daha mantıklı olduğunu netleştirmek isteyenler.',
    'Ausbildung, üniversite, iş arama ve aile birleşimi arasında kalan kullanıcılar.',
  ],
  howItWorks: [
    '15 soruluk sabit akışla hedefini, yeterliliklerini, dilini ve hazırlık seviyeni ölçer.',
    'Her cevap rota uygunluğu, hazırlık gücü ve blokaj riskine ayrı katkı yapar.',
    'Sonuçta tek bir ana rota önerir; neden bu eşleşmenin çıktığını ve ilk adımları gösterir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 15,
  initialQuestionId: 'goal',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.recognition,
    OFFICIAL_SOURCES.bamf,
  ],
  relatedTools: [
    'almanyaya-hazir-misin',
    'kariyer-ve-egitim-rotasi',
    'ilk-90-gun-planlayici',
  ],
  faqs: [
    {
      question: 'Bu araç bana kesin vize türü söyler mi?',
      answer:
        'Hayır. Araç, ilk bakılması gereken ana rotayı önerir. Kesin başvuru tipi için güncel resmi koşulları ayrıca kontrol etmelisin.',
    },
    {
      question: 'İş teklifim yoksa Almanya yolu tamamen kapanır mı?',
      answer:
        'Hayır. Chancenkarte, üniversite, Ausbildung veya aile birleşimi gibi alternatif yollar profilinize göre mantıklı olabilir.',
    },
    {
      question: 'Tek sonuç göstermesi diğer yolların tamamen yanlış olduğu anlamına mı gelir?',
      answer:
        'Hayır. Sonuç, bugünkü cevaplara göre en mantıklı başlangıç rotasını öne çıkarır; zamanla profilin değişirse başka yollar da öne geçebilir.',
    },
  ],
  questions: [
    {
      id: 'goal',
      text: 'Almanya\'ya gitmek istemendeki ana amaç şu an hangisi?',
      options: [
        {
          key: 'work',
          label: 'Çalışmak ve kariyer kurmak',
          next: 'connection',
          effects: {
            scores: { blueCard: 4, fachkraefte: 4, chancenkarte: 3, itSpecialist: 4, readiness: 1 },
            facts: { goal: 'work' },
          },
        },
        {
          key: 'study',
          label: 'Üniversite veya yüksek lisans',
          next: 'connection',
          effects: { scores: { student: 6, readiness: 1 }, facts: { goal: 'study' } },
        },
        {
          key: 'ausbildung',
          label: 'Ausbildung ile başlamak',
          next: 'connection',
          effects: { scores: { ausbildung: 6, readiness: 1 }, facts: { goal: 'ausbildung' } },
        },
        {
          key: 'family',
          label: 'Aile birleşimi ile gitmek',
          next: 'connection',
          effects: { scores: { family: 6, readiness: 1 }, facts: { goal: 'family' } },
        },
        {
          key: 'self',
          label: 'Freelance veya serbest çalışmak',
          next: 'connection',
          effects: { scores: { freelance: 6, readiness: 1 }, facts: { goal: 'self' } },
        },
      ],
    },
    {
      id: 'connection',
      text: 'Almanya planında seni en çok güçlendiren bağlantı hangisi?',
      options: [
        {
          key: 'spouse',
          label: 'Almanya\'da eşim veya çekirdek ailem var',
          next: 'timeline',
          effects: { scores: { family: 6, readiness: 2 }, facts: { connection: 'spouse' } },
        },
        {
          key: 'employer',
          label: 'Almanya\'da bana kapı açan bir işveren veya ekip var',
          next: 'timeline',
          effects: {
            scores: { blueCard: 2, fachkraefte: 2, itSpecialist: 2, readiness: 2 },
            facts: { connection: 'employer' },
          },
        },
        {
          key: 'university',
          label: 'Üniversite veya eğitim tarafında somut bağlantım var',
          next: 'timeline',
          effects: { scores: { student: 3, readiness: 1 }, facts: { connection: 'university' } },
        },
        {
          key: 'network',
          label: 'Yakın çevre, referans veya network desteğim var',
          next: 'timeline',
          effects: { scores: { chancenkarte: 2, freelance: 1, readiness: 1 }, facts: { connection: 'network' } },
        },
        {
          key: 'none',
          label: 'Henüz ciddi bir bağlantım yok',
          next: 'timeline',
          effects: { scores: { blocker: 1 }, facts: { connection: 'none' } },
        },
      ],
    },
    {
      id: 'timeline',
      text: 'Bu planı hangi zaman ufkunda ciddiye alıyorsun?',
      options: [
        {
          key: 'soon',
          label: 'Önümüzdeki 6 ay içinde',
          next: 'offer',
          effects: { scores: { readiness: 2 }, facts: { timeline: 'soon' } },
        },
        {
          key: 'year',
          label: 'Bu yıl içinde ama biraz hazırlıkla',
          next: 'offer',
          effects: { scores: { readiness: 1 }, facts: { timeline: 'year' } },
        },
        {
          key: 'later',
          label: '1 yıldan uzun vadede',
          next: 'offer',
          effects: { scores: { blocker: 1 }, facts: { timeline: 'later' } },
        },
      ],
    },
    {
      id: 'offer',
      text: 'Almanya\'dan imzalı iş sözleşmen veya net iş teklifin var mı?',
      options: [
        {
          key: 'signed',
          label: 'Evet, imzalı veya çok net teklifim var',
          next: 'mode',
          effects: {
            scores: { blueCard: 6, fachkraefte: 6, itSpecialist: 4, readiness: 2 },
            facts: { offer: 'signed' },
          },
        },
        {
          key: 'process',
          label: 'Görüşmeler var ama kesinleşmedi',
          next: 'mode',
          effects: {
            scores: { blueCard: 1, fachkraefte: 2, chancenkarte: 1, itSpecialist: 1, readiness: 1, blocker: 1 },
            facts: { offer: 'process' },
          },
        },
        {
          key: 'none',
          label: 'Hayır, önce yolumu ve pazarı kurmam gerekiyor',
          next: 'mode',
          effects: {
            scores: { chancenkarte: 5, student: 1, ausbildung: 1, freelance: 1 },
            facts: { offer: 'none' },
          },
        },
      ],
    },
    {
      id: 'mode',
      text: 'Tercih ettiğin ilerleme biçimi hangisi?',
      options: [
        {
          key: 'sponsored',
          label: 'İşveren sponsorlu tam zamanlı bir rol',
          next: 'field',
          effects: {
            scores: { blueCard: 4, fachkraefte: 4, itSpecialist: 3 },
            facts: { mode: 'sponsored' },
          },
        },
        {
          key: 'jobsearch',
          label: 'Önce Almanya\'da iş arama zemini kurmak',
          next: 'field',
          effects: { scores: { chancenkarte: 5 }, facts: { mode: 'jobsearch' } },
        },
        {
          key: 'study',
          label: 'Üniversite veya yüksek lisans ile başlamak',
          next: 'field',
          effects: { scores: { student: 5 }, facts: { mode: 'study' } },
        },
        {
          key: 'practical',
          label: 'Uygulamalı eğitim ve meslek öğrenmek',
          next: 'field',
          effects: { scores: { ausbildung: 5 }, facts: { mode: 'practical' } },
        },
        {
          key: 'family',
          label: 'Aile bağı üzerinden taşınmak',
          next: 'field',
          effects: { scores: { family: 5 }, facts: { mode: 'family' } },
        },
        {
          key: 'independent',
          label: 'Kendi müşteri ağım veya projelerimle ilerlemek',
          next: 'field',
          effects: { scores: { freelance: 5 }, facts: { mode: 'independent' } },
        },
      ],
    },
    {
      id: 'field',
      text: 'Meslek veya odak alanın hangisine daha yakın?',
      options: [
        {
          key: 'tech',
          label: 'BT / yazılım / veri',
          next: 'experience',
          effects: {
            scores: { itSpecialist: 4, blueCard: 2, fachkraefte: 2, chancenkarte: 2, freelance: 2 },
            facts: { field: 'tech' },
          },
        },
        {
          key: 'health',
          label: 'Sağlık / bakım / klinik',
          next: 'experience',
          effects: { scores: { fachkraefte: 3, chancenkarte: 1, ausbildung: 1 }, facts: { field: 'health' } },
        },
        {
          key: 'engineering',
          label: 'Mühendislik / teknik üretim',
          next: 'experience',
          effects: { scores: { blueCard: 2, fachkraefte: 3, chancenkarte: 1 }, facts: { field: 'engineering' } },
        },
        {
          key: 'business',
          label: 'Ofis / operasyon / satış / yönetim',
          next: 'experience',
          effects: { scores: { fachkraefte: 2, chancenkarte: 2, student: 1, freelance: 1 }, facts: { field: 'business' } },
        },
        {
          key: 'creative',
          label: 'Tasarım / medya / yaratıcı hizmetler',
          next: 'experience',
          effects: { scores: { freelance: 3, student: 1, chancenkarte: 1 }, facts: { field: 'creative' } },
        },
      ],
    },
    {
      id: 'experience',
      text: 'Deneyim seviyen hangisine daha yakın?',
      options: [
        {
          key: 'low',
          label: '0-1 yıl',
          next: 'education',
          effects: { scores: { student: 1, ausbildung: 2, blocker: 1 }, facts: { experience: 'low' } },
        },
        {
          key: 'mid',
          label: '2-4 yıl',
          next: 'education',
          effects: {
            scores: { fachkraefte: 2, chancenkarte: 2, freelance: 1, itSpecialist: 2, readiness: 1 },
            facts: { experience: 'mid' },
          },
        },
        {
          key: 'high',
          label: '5+ yıl',
          next: 'education',
          effects: {
            scores: { blueCard: 2, fachkraefte: 3, itSpecialist: 3, freelance: 2, readiness: 2 },
            facts: { experience: 'high' },
          },
        },
      ],
    },
    {
      id: 'education',
      text: 'Eğitim veya mesleki temelini en iyi hangisi anlatıyor?',
      options: [
        {
          key: 'degree',
          label: 'Tanınabilir üniversite diplomam var',
          next: 'recognition',
          effects: {
            scores: { blueCard: 4, fachkraefte: 3, chancenkarte: 2, student: 1, readiness: 2 },
            facts: { education: 'degree' },
          },
        },
        {
          key: 'vocational',
          label: 'Mesleki diploma, ustalık veya önlisans temelim var',
          next: 'recognition',
          effects: {
            scores: { fachkraefte: 4, chancenkarte: 2, ausbildung: 1, readiness: 2 },
            facts: { education: 'vocational' },
          },
        },
        {
          key: 'portfolio',
          label: 'Resmi diplomam güçlü değil ama portföyüm veya çıktım var',
          next: 'recognition',
          effects: {
            scores: { itSpecialist: 2, freelance: 3, chancenkarte: 1 },
            facts: { education: 'portfolio' },
          },
        },
        {
          key: 'student',
          label: 'Öğrenci kabulü veya akademik hazırlığım daha güçlü',
          next: 'recognition',
          effects: { scores: { student: 4, readiness: 1 }, facts: { education: 'student' } },
        },
        {
          key: 'weak',
          label: 'Şu an bu taraf oldukça zayıf',
          next: 'recognition',
          effects: { scores: { blocker: 2 }, facts: { education: 'weak' } },
        },
      ],
    },
    {
      id: 'recognition',
      text: 'Denklik veya tanınma tarafı ne kadar net?',
      hint: 'Resmi teyit için anabin, ZAB veya Anerkennung süreçleri ayrıca kontrol edilmelidir.',
      options: [
        {
          key: 'clear',
          label: 'Ne gerektiğini biliyorum ve dosyam güçlü',
          next: 'salary',
          effects: {
            scores: { blueCard: 3, fachkraefte: 3, chancenkarte: 2, readiness: 2 },
            facts: { recognition: 'clear' },
          },
        },
        {
          key: 'partial',
          label: 'Kabaca biliyorum ama teyit etmem gerek',
          next: 'salary',
          effects: {
            scores: { blueCard: 1, fachkraefte: 2, chancenkarte: 1, readiness: 1, recognitionGap: 1 },
            facts: { recognition: 'partial' },
          },
        },
        {
          key: 'unclear',
          label: 'Bu taraf belirsiz ve beni yavaşlatıyor',
          next: 'salary',
          effects: {
            scores: { blocker: 3, recognitionGap: 3 },
            facts: { recognition: 'unclear' },
          },
        },
        {
          key: 'early',
          label: 'Şimdilik bu başlık bende erken aşamada',
          next: 'salary',
          effects: {
            scores: { student: 1, freelance: 1, blocker: 1, recognitionGap: 1 },
            facts: { recognition: 'early' },
          },
        },
      ],
    },
    {
      id: 'salary',
      text: 'İş teklifindeki maaş seviyesi hangi aralığa daha yakın?',
      options: [
        {
          key: 'high',
          label: 'Mavi Kart eşiğine yakın veya üstünde',
          next: 'german',
          effects: {
            scores: { blueCard: 6, fachkraefte: 2, readiness: 1 },
            facts: { salary: 'high' },
          },
        },
        {
          key: 'border',
          label: 'Var ama daha çok standart uzman maaşı gibi',
          next: 'german',
          effects: {
            scores: { fachkraefte: 4, blueCard: 2, itSpecialist: 1 },
            facts: { salary: 'border' },
          },
        },
        {
          key: 'low',
          label: 'Daha düşük veya henüz pazarlık aşamasında',
          next: 'german',
          effects: {
            scores: { fachkraefte: 2, itSpecialist: 1 },
            facts: { salary: 'low' },
          },
        },
        {
          key: 'none',
          label: 'Henüz teklif olmadığı için bilmiyorum',
          next: 'german',
          effects: {
            scores: { chancenkarte: 1, student: 1 },
            facts: { salary: 'none' },
          },
        },
      ],
    },
    {
      id: 'german',
      text: 'Almanca seviyeni en iyi hangisi anlatır?',
      options: [
        {
          key: 'good',
          label: 'Günlük ve resmi işlerde kullanabilecek seviyedeyim',
          next: 'english',
          effects: {
            scores: { fachkraefte: 2, blueCard: 1, chancenkarte: 2, ausbildung: 3, family: 2, readiness: 2 },
            facts: { german: 'good' },
          },
        },
        {
          key: 'basic',
          label: 'Temelim var ama akıcı değilim',
          next: 'english',
          effects: {
            scores: { chancenkarte: 1, ausbildung: 2, family: 1, readiness: 1, languageGap: 1 },
            facts: { german: 'basic' },
          },
        },
        {
          key: 'weak',
          label: 'Çok zayıfım veya yok denecek kadar az',
          next: 'english',
          effects: {
            scores: { student: 1, freelance: 1, blocker: 2, languageGap: 3 },
            facts: { german: 'weak' },
          },
        },
      ],
    },
    {
      id: 'english',
      text: 'İngilizce seviyen hangisine daha yakın?',
      options: [
        {
          key: 'strong',
          label: 'B2+ seviyesinde rahat kullanıyorum',
          next: 'budget',
          effects: {
            scores: { blueCard: 1, itSpecialist: 2, chancenkarte: 2, student: 2, freelance: 2, readiness: 1 },
            facts: { english: 'strong' },
          },
        },
        {
          key: 'basic',
          label: 'İş görecek temel seviyedeyim',
          next: 'budget',
          effects: {
            scores: { itSpecialist: 1, chancenkarte: 1, student: 1 },
            facts: { english: 'basic' },
          },
        },
        {
          key: 'weak',
          label: 'Çok sınırlı',
          next: 'budget',
          effects: { scores: { blocker: 1, languageGap: 2 }, facts: { english: 'weak' } },
        },
      ],
    },
    {
      id: 'budget',
      text: 'Taşınma ve ilk aylar için maddi tamponun nasıl?',
      options: [
        {
          key: 'good',
          label: 'İlk ayları çevirecek sağlam planım var',
          next: 'age',
          effects: {
            scores: { student: 3, chancenkarte: 3, freelance: 3, readiness: 2 },
            facts: { budget: 'good' },
          },
        },
        {
          key: 'partial',
          label: 'Kısmen var ama dikkatli olmam gerekir',
          next: 'age',
          effects: {
            scores: { chancenkarte: 1, student: 1, freelance: 1, readiness: 1, budgetGap: 1 },
            facts: { budget: 'partial' },
          },
        },
        {
          key: 'weak',
          label: 'Bu taraf en büyük risk alanım',
          next: 'age',
          effects: { scores: { blocker: 3, budgetGap: 3 }, facts: { budget: 'weak' } },
        },
      ],
    },
    {
      id: 'age',
      text: 'Yaş veya kariyer evren seni hangisine daha yakın kılıyor?',
      options: [
        {
          key: 'young',
          label: '18-24 ve daha esneğim',
          next: 'flexibility',
          effects: {
            scores: { ausbildung: 3, student: 2, chancenkarte: 2, readiness: 1 },
            facts: { age: 'young' },
          },
        },
        {
          key: 'early',
          label: '25-34 arası, büyüme dönemindeyim',
          next: 'flexibility',
          effects: {
            scores: { blueCard: 1, fachkraefte: 2, student: 1, chancenkarte: 2, freelance: 1, readiness: 1 },
            facts: { age: 'early' },
          },
        },
        {
          key: 'mid',
          label: '35-44 arası, deneyimim daha belirleyici',
          next: 'flexibility',
          effects: {
            scores: { blueCard: 2, fachkraefte: 2, freelance: 2, itSpecialist: 1, chancenkarte: 1 },
            facts: { age: 'mid' },
          },
        },
        {
          key: 'senior',
          label: '45+ ve daha seçiciyim',
          next: 'flexibility',
          effects: {
            scores: { blueCard: 1, fachkraefte: 1, freelance: 2, itSpecialist: 1, blocker: 1 },
            facts: { age: 'senior' },
          },
        },
      ],
    },
    {
      id: 'flexibility',
      text: 'Şehir, rol ve başlangıç modeli konusunda ne kadar esneksin?',
      options: [
        {
          key: 'high',
          label: 'Şehir ve rol tarafında oldukça esneğim',
          next: 'RESULT:EVALUATE',
          effects: {
            scores: { chancenkarte: 2, ausbildung: 1, freelance: 1, fachkraefte: 1, readiness: 1 },
            facts: { flexibility: 'high' },
          },
        },
        {
          key: 'medium',
          label: 'Kısmen esneğim ama sınırlarım var',
          next: 'RESULT:EVALUATE',
          effects: { scores: { readiness: 1 }, facts: { flexibility: 'medium' } },
        },
        {
          key: 'low',
          label: 'Dar bir şehir veya rol çerçevem var',
          next: 'RESULT:EVALUATE',
          effects: {
            scores: { blocker: 2, flexibilityGap: 2 },
            facts: { flexibility: 'low' },
          },
        },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const goal = getFact<string>(state, 'goal', 'work');
    const connection = getFact<string>(state, 'connection', 'none');
    const offer = getFact<string>(state, 'offer', 'none');
    const mode = getFact<string>(state, 'mode', 'jobsearch');
    const field = getFact<string>(state, 'field', 'business');
    const experience = getFact<string>(state, 'experience', 'low');
    const education = getFact<string>(state, 'education', 'weak');
    const recognition = getFact<string>(state, 'recognition', 'early');
    const salary = getFact<string>(state, 'salary', 'none');
    const german = getFact<string>(state, 'german', 'weak');
    const english = getFact<string>(state, 'english', 'weak');
    const budget = getFact<string>(state, 'budget', 'weak');
    const age = getFact<string>(state, 'age', 'early');
    const flexibility = getFact<string>(state, 'flexibility', 'medium');
    const readiness = getScore(state, 'readiness');
    const blocker = getScore(state, 'blocker');

    const qualificationStrong = education === 'degree' || education === 'vocational';
    const hasSignedOffer = offer === 'signed';
    const practicalIntent = goal === 'ausbildung' || mode === 'practical';
    const academicIntent = goal === 'study' || mode === 'study' || education === 'student' || connection === 'university';
    const familyIntent = goal === 'family' || mode === 'family' || connection === 'spouse';
    const independentIntent = goal === 'self' || mode === 'independent';
    const expAtLeastMid = experience === 'mid' || experience === 'high';
    const highSalary = salary === 'high';
    const borderlineSalary = salary === 'border';
    const usableGerman = german === 'basic' || german === 'good';
    const usableLanguage = usableGerman || english === 'strong' || (english === 'basic' && german === 'good');
    const budgetOkay = budget === 'good' || budget === 'partial';
    const recognitionHelpful = recognition === 'clear' || recognition === 'partial';
    const canUsePortfolio = education === 'portfolio' || field === 'creative' || field === 'tech';

    const routeScores: Record<RouteKey, number> = {
      blueCard: getScore(state, 'blueCard'),
      fachkraefte: getScore(state, 'fachkraefte'),
      chancenkarte: getScore(state, 'chancenkarte'),
      ausbildung: getScore(state, 'ausbildung'),
      student: getScore(state, 'student'),
      family: getScore(state, 'family'),
      freelance: getScore(state, 'freelance'),
      itSpecialist: getScore(state, 'itSpecialist'),
    };

    const gates: Record<RouteKey, boolean> = {
      blueCard: hasSignedOffer && qualificationStrong && highSalary && recognitionHelpful,
      fachkraefte: hasSignedOffer && (qualificationStrong || recognitionHelpful),
      chancenkarte:
        offer !== 'signed' && (qualificationStrong || expAtLeastMid || canUsePortfolio) && usableLanguage && budgetOkay,
      ausbildung: practicalIntent && usableGerman,
      student: academicIntent && budgetOkay,
      family: familyIntent,
      freelance: independentIntent && budgetOkay && (canUsePortfolio || expAtLeastMid),
      itSpecialist: hasSignedOffer && field === 'tech' && expAtLeastMid,
    };

    const synergyBonuses: Record<RouteKey, number> = {
      blueCard: hasSignedOffer && highSalary && qualificationStrong && recognitionHelpful ? 8 : 0,
      fachkraefte: hasSignedOffer && qualificationStrong && (borderlineSalary || salary === 'low') ? 6 : 0,
      chancenkarte: offer === 'none' && (qualificationStrong || expAtLeastMid) && usableLanguage && budgetOkay ? 7 : 0,
      ausbildung: age === 'young' && practicalIntent && usableGerman ? 6 : 0,
      student: academicIntent && budget === 'good' && (connection === 'university' || english === 'strong') ? 4 : 0,
      family: connection === 'spouse' ? 4 : 0,
      freelance: independentIntent && budget === 'good' && (education === 'portfolio' || experience === 'high') ? 5 : 0,
      itSpecialist: field === 'tech' && experience === 'high' && hasSignedOffer && !qualificationStrong ? 7 : 0,
    };

    const blockerAdjustments: Record<RouteKey, number> = {
      blueCard: blocker * 2,
      fachkraefte: blocker * 2,
      chancenkarte: Math.round(blocker * 1.5),
      ausbildung: blocker,
      student: Math.round(blocker * 1.5),
      family: blocker,
      freelance: Math.round(blocker * 1.5),
      itSpecialist: blocker * 2,
    };

    const rankedRoutes = (Object.keys(ROUTE_TO_RESULT) as RouteKey[])
      .map((route) => {
        const gatePenalty = gates[route] ? 0 : 100;
        const finalScore = routeScores[route] + synergyBonuses[route] - gatePenalty - blockerAdjustments[route];

        return {
          route,
          resultId: ROUTE_TO_RESULT[route],
          rawScore: routeScores[route],
          finalScore,
        };
      })
      .sort((left, right) => right.finalScore - left.finalScore);

    const topRoute = rankedRoutes[0];
    const topGapKey = getTopGapKey(state);
    const topGapLabel = topGapKey ? GAP_LABELS[topGapKey] : null;

    let resolvedResultId: ResultId = topRoute?.resultId ?? 'LIMITED';

    if (!topRoute || topRoute.finalScore < 12 || (blocker >= 8 && readiness <= 5)) {
      resolvedResultId = 'LIMITED';
    }

    const meta = RESULT_META[resolvedResultId];
    const suitability = suitabilityMetric(topRoute?.finalScore ?? 0);
    const readinessBand = readinessMetric(readiness);
    const blockerBand = blockerMetric(blocker);

    return {
      id: resolvedResultId,
      title: meta.title,
      matchLabel: meta.matchLabel,
      tone: meta.tone,
      summary: buildSummary(meta.summaryLead, readiness, blocker),
      why: buildDynamicWhy(
        resolvedResultId,
        {
          goal,
          connection,
          offer,
          mode,
          field,
          experience,
          education,
          recognition,
          salary,
          german,
          english,
          budget,
          age,
          flexibility,
        },
        topGapLabel
      ),
      steps: meta.steps,
      caution:
        resolvedResultId !== 'LIMITED' && topGapLabel && blocker >= 5
          ? `Bu rota uygun görünse de önce ${topGapLabel} tarafını sıkılaştırman başvuruyu daha güvenli hale getirir.`
          : undefined,
      metrics: [
        { label: 'Uygunluk', value: suitability.value, tone: suitability.tone },
        { label: 'Hazırlık', value: readinessBand.value, tone: readinessBand.tone },
        { label: 'Blokaj riski', value: blockerBand.value, tone: blockerBand.tone },
      ],
      officialSources: meta.officialSources,
      relatedTools: meta.relatedTools,
    };
  },
};
