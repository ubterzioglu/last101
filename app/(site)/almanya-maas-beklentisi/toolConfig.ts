import { calculateSalary, formatCurrency } from '@/lib/salary/calculator';
import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact, getScore } from '@/lib/tools/helpers';
import { almanyaMaasBeklentisiQuestionnaire } from '@/lib/tools/surveys/almanya-maas-beklentisi';
import type { SalaryInput } from '@/lib/salary/types';
import type { ToolConfig, ToolResult, ToolTone } from '@/lib/tools/types';

const PROFESSION_BASES: Record<string, number> = {
  yazilim: 6200,
  muhendislik: 5600,
  saglik: 4700,
  operasyon: 4200,
  hizmet: 3400,
};

const SPECIALIZATION_MULTIPLIERS: Record<string, number> = {
  destek: 0.92,
  uzman: 1,
  regule: 1.08,
  nis: 1.12,
};

const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  junior: 0.88,
  mid: 1,
  senior: 1.14,
  lead: 1.26,
};

const EDUCATION_MULTIPLIERS: Record<string, number> = {
  degree: 1.04,
  vocational: 1,
  portfolio: 0.98,
  newgrad: 0.93,
};

const RECOGNITION_MULTIPLIERS: Record<string, number> = {
  clear: 1.03,
  partial: 1,
  unclear: 0.96,
  notNeeded: 1.01,
};

const GERMAN_MULTIPLIERS: Record<string, number> = {
  good: 1.05,
  basic: 1,
  weak: 0.95,
};

const LOCATION_MULTIPLIERS: Record<string, number> = {
  pahali: 1.15,
  buyuk: 1.08,
  nrw: 1,
  orta: 0.95,
  dogu: 0.89,
};

const COMPANY_SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.95,
  medium: 1,
  large: 1.07,
  corporate: 1.11,
};

const EMPLOYER_TYPE_MULTIPLIERS: Record<string, number> = {
  startup: 0.96,
  private: 1,
  international: 1.05,
  tarif: 1.04,
};

const HOURS_MULTIPLIERS: Record<string, number> = {
  part: 0.58,
  reduced: 0.8,
  full: 1,
  extended: 1.07,
};

const RESPONSIBILITY_MULTIPLIERS: Record<string, number> = {
  individual: 1,
  coordination: 1.04,
  lead: 1.12,
  critical: 1.09,
};

const OFFER_MULTIPLIERS: Record<string, number> = {
  none: 0.95,
  early: 0.98,
  process: 1,
  signed: 1.03,
};

const OFFER_RANGE: Record<string, number> = {
  none: 0.14,
  early: 0.12,
  process: 0.09,
  signed: 0.06,
};

const LOCATION_META: Record<
  string,
  { state: SalaryInput['state']; pressure: string; pressureTone: ToolTone }
> = {
  pahali: {
    state: 'BY',
    pressure: 'Cok yuksek kira baskisi',
    pressureTone: 'red',
  },
  buyuk: {
    state: 'BE',
    pressure: 'Yuksek kira baskisi',
    pressureTone: 'orange',
  },
  nrw: {
    state: 'NRW',
    pressure: 'Dengeli maliyet baskisi',
    pressureTone: 'yellow',
  },
  orta: {
    state: 'NI',
    pressure: 'Daha yonetilebilir maliyet baskisi',
    pressureTone: 'green',
  },
  dogu: {
    state: 'SN',
    pressure: 'Gorece dusuk kira baskisi',
    pressureTone: 'green',
  },
};

const TAX_PROFILE_META: Record<
  string,
  { taxClass: SalaryInput['taxClass']; label: string }
> = {
  class1: { taxClass: '1', label: 'Bekar / Steuerklasse 1' },
  class4: { taxClass: '4', label: 'Evli, gelirler dengeli / Steuerklasse 4' },
  class3: { taxClass: '3', label: 'Evli, tek gelir baskin / Steuerklasse 3' },
  class2: { taxClass: '2', label: 'Tek ebeveyn / Steuerklasse 2' },
  class5: { taxClass: '5', label: 'Evli, dusuk ikinci gelir / Steuerklasse 5' },
};

const CHILD_META: Record<
  string,
  { hasChildren: boolean; childrenCount: number; childrenUnder25Count: number; label: string }
> = {
  none: { hasChildren: false, childrenCount: 0, childrenUnder25Count: 0, label: 'Cocuk yok' },
  one: { hasChildren: true, childrenCount: 1, childrenUnder25Count: 1, label: 'Bir cocuk' },
  two: { hasChildren: true, childrenCount: 2, childrenUnder25Count: 2, label: 'Iki cocuk' },
  three: { hasChildren: true, childrenCount: 3, childrenUnder25Count: 3, label: 'Uc veya daha fazla cocuk' },
};

const INSURANCE_META: Record<
  string,
  {
    insuranceType: SalaryInput['insuranceType'];
    kvBase: number;
    kvZusatz: number;
    pkvPremium: number;
    ppvPremium: number;
    churchTax: boolean;
    label: string;
  }
> = {
  standard: {
    insuranceType: 'gkv',
    kvBase: 14.6,
    kvZusatz: 2.5,
    pkvPremium: 0,
    ppvPremium: 0,
    churchTax: false,
    label: 'Standart GKV, kilise vergisi yok',
  },
  church: {
    insuranceType: 'gkv',
    kvBase: 14.6,
    kvZusatz: 2.5,
    pkvPremium: 0,
    ppvPremium: 0,
    churchTax: true,
    label: 'Standart GKV, kilise vergisi var',
  },
  pkv: {
    insuranceType: 'pkv',
    kvBase: 14.6,
    kvZusatz: 2.5,
    pkvPremium: 420,
    ppvPremium: 90,
    churchTax: false,
    label: 'PKV benzeri beyaz yaka varsayimi',
  },
};

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function confidenceLabel(score: number): { value: string; tone: ToolTone } {
  if (score >= 12) {
    return { value: 'Yuksek', tone: 'green' };
  }
  if (score >= 8) {
    return { value: 'Orta', tone: 'yellow' };
  }
  if (score >= 5) {
    return { value: 'Genis aralik', tone: 'orange' };
  }

  return { value: 'Dusuk', tone: 'red' };
}

function bandTone(centerGross: number): ToolTone {
  if (centerGross >= 6500) {
    return 'green';
  }
  if (centerGross >= 4500) {
    return 'blue';
  }
  if (centerGross >= 3300) {
    return 'yellow';
  }

  return 'orange';
}

function bandLabel(centerGross: number) {
  if (centerGross >= 6500) {
    return 'Yuksek bant';
  }
  if (centerGross >= 4500) {
    return 'Dengeli bant';
  }
  if (centerGross >= 3300) {
    return 'Giris-orta bant';
  }

  return 'Siki butce bandi';
}

function createSalaryInput(
  grossMonthly: number,
  location: string,
  taxProfile: string,
  childProfile: string,
  insuranceProfile: string
): SalaryInput {
  const locationMeta = LOCATION_META[location] ?? LOCATION_META.nrw;
  const taxMeta = TAX_PROFILE_META[taxProfile] ?? TAX_PROFILE_META.class1;
  const childMeta = CHILD_META[childProfile] ?? CHILD_META.none;
  const insuranceMeta = INSURANCE_META[insuranceProfile] ?? INSURANCE_META.standard;

  return {
    amount: grossMonthly,
    period: 'monthly',
    type: 'gross',
    taxClass: taxMeta.taxClass,
    state: locationMeta.state,
    hasChildren: childMeta.hasChildren,
    childrenCount: childMeta.childrenCount,
    childrenUnder25Count: childMeta.childrenUnder25Count,
    age23Plus: true,
    churchTax: insuranceMeta.churchTax,
    childAllowance: childMeta.childrenCount * 0.5,
    insuranceType: insuranceMeta.insuranceType,
    kvBase: insuranceMeta.kvBase,
    kvZusatz: insuranceMeta.kvZusatz,
    pkvPremium: insuranceMeta.pkvPremium,
    ppvPremium: insuranceMeta.ppvPremium,
    companyCar: {
      enabled: false,
      listPrice: 0,
      rate: 0,
      commuteEnabled: false,
      commuteKm: 0,
      commuteMode: 'monthly',
      commuteDays: 0,
    },
  };
}

function parseRoleWhy({
  profession,
  location,
  hours,
}: {
  profession: string;
  location: string;
  hours: string;
}) {
  const professionLine =
    profession === 'yazilim'
      ? 'Yazilim ve BT grubu, Almanya piyasasinda genelde daha yuksek taban bantla acilir.'
      : profession === 'muhendislik'
        ? 'Muhendislik ve teknik uretim rolleri, ozellikle sanayi yogun bolgelerde saglam taban verir.'
        : profession === 'saglik'
          ? 'Saglik ve bakim alanlari duzenli talep uretir; ancak net kazanci vardiya ve denklik seviyesi de etkiler.'
          : profession === 'hizmet'
            ? 'Hizmet ve perakende benzeri roller daha dar marjla ilerledigi icin aralik daha dikkatli okunmali.'
            : 'Operasyon ve ofis rolleri icin bandi en cok sektor, sehir ve sorumluluk seviyesi oynatir.';

  const locationLine =
    location === 'pahali'
      ? 'Pahali merkezler daha yuksek brut isteyebilir; ama kira baskisi nedeniyle net satin alma gucu ayni oranda artmayabilir.'
      : location === 'dogu'
        ? 'Dogu ve ikincil sehirlerde brut biraz daha asagi gelebilir; buna karsin maliyet baskisi daha yonetilebilir olabilir.'
        : 'Sehir profili, ayni rolde alabilecegin brut ve o bruttun gercek etkisini birlikte degistirir.';

  const hoursLine =
    hours === 'part' || hours === 'reduced'
      ? 'Secilen saat modeli aylik brut beklentiyi dogrudan asagi ceker; bu nedenle yillik karsilastirmayi full-time esdegerle de dusunmek gerekir.'
      : 'Full-time veya yuksek tempolu saat modeli, bandin merkezini daha dogrudan temsil eder.';

  return [professionLine, locationLine, hoursLine];
}

function buildSteps({
  offer,
  location,
  confidence,
}: {
  offer: string;
  location: string;
  confidence: number;
}) {
  const steps = [
    'Gorusmeye girmeden once hedef araligini yillik brut ve aylik net olarak ayri not et.',
    location === 'pahali' || location === 'buyuk'
      ? 'Karar verirken kira, depozito ve ilk tasinma giderlerini ayrica butcele.'
      : 'Karar verirken net rakami tek basina degil, yasam maliyeti ile birlikte yorumla.',
    offer === 'signed' || offer === 'process'
      ? 'Eline gelen teklifi bu aralikla caprazlayip bonus, tasinma destegi ve uzaktan calisma kalemlerini ayrica pazarlik et.'
      : 'Teklif gelmeden once bu araligi CV ve basvuru setinde hedef band olarak kullan; kesin veri gibi davranma.',
  ];

  steps.push(
    confidence >= 8
      ? 'Teklif netlestiginde kesin bordro etkisini maas hesaplayici ile ikinci kez kontrol et.'
      : 'Aralik genisse, Entgeltatlas veya benzeri resmi kaynaklarla ayni rolun sehir bazli karsiligini ayrica dogrula.'
  );

  return steps;
}

function createSalaryResult(): ToolResult {
  return {
    id: 'ESTIMATE',
    title: 'Almanya maas cerceven hazir',
    matchLabel: 'Tahmini aralik',
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
    'Meslek, deneyim, lokasyon, saat modeli ve hane varsayımına göre Almanya için daha ayrıntılı brüt-net maaş çerçeveni yorumla.',
  intro:
    'Bu araç sana kesin bir teklif vermez; ama Almanya\'da hangi brut aralikta dusunmen gerektigini, nete ne kadar yansiyabilecegini ve hangi degiskenlerin maasi en cok oynattigini daha sistemli sekilde gosterir.',
  why:
    'Almanya\'da ayni is unvani herkes icin ayni maasi uretmez. Sehir, sirket buyuklugu, calisma saati, vergi sinifi, cocuk durumu ve sigorta varsayimi net sonucu ciddi bicimde degistirir. Bu arac o tabloyu tek bir brut tahminin otesine tasir.',
  whoFor: [
    'Gorusmeye girmeden once hangi brut bandi hedeflemesi gerektigini gormek isteyenler.',
    'Brut rakamin sehir, vergi ve sigorta farkiyla nette nasil degisecegini kabaca anlamak isteyenler.',
    'Part-time, buyuk sehir veya aile profili gibi degiskenlerin maas beklentisini nasil oynattigini gormek isteyenler.',
  ],
  howItWorks: [
    '15 soruluk sabit akisla rolunu, piyasa gucunu, lokasyonunu ve net varsayimini olcer.',
    'Brut merkezi; meslek, deneyim, sorumluluk, sirket yapisi ve saat modeliyle ayarlanir.',
    'Net tahmin, vergi sinifi, cocuk, eyalet ve sigorta varsayimiyla mevcut maas motoru uzerinden hesaplanir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 15,
  initialQuestionId: 'profession',
  officialSources: [OFFICIAL_SOURCES.arbeitsagentur, OFFICIAL_SOURCES.makeItInGermany],
  relatedTools: ['almanya-yolunu-sec', 'almanyada-is-bulma-olasiligi', 'hangi-sehir-sana-uygun'],
  questionnaire: almanyaMaasBeklentisiQuestionnaire,
  faqs: [
    {
      question: 'Bu araç net maaşı kesin hesaplıyor mu?',
      answer:
        'Hayır. Bu araç kesin bordro değil; resmi kurallara dayanan ama varsayımlarla çalışan tahmini karar çerçevesi üretir.',
    },
    {
      question: 'Neden 15 soru var?',
      answer:
        'Çünkü maaşı yalnızca meslek değil; saat modeli, şirket yapısı, dil, lokasyon ve vergi profili de değiştirir. Kısa modeller bunu fazla basitleştirir.',
    },
    {
      question: 'Bu aralık pazarlıkta nasıl kullanılmalı?',
      answer:
        'Bunu sabit gerçek gibi değil, teklif pazarlığı için başlangıç referansı gibi kullan. Elindeki somut rol ve şehir bilgisiyle ayrıca çapraz kontrol yap.',
    },
  ],
  questions: [
    {
      id: 'profession',
      text: 'Seni en iyi anlatan meslek grubu hangisi?',
      options: [
        {
          key: 'yazilim',
          label: 'Yazılım / veri / ürün / BT',
          next: 'specialization',
          effects: { facts: { profession: 'yazilim' }, scores: { confidence: 1 } },
        },
        {
          key: 'muhendislik',
          label: 'Mühendislik / teknik üretim',
          next: 'specialization',
          effects: { facts: { profession: 'muhendislik' }, scores: { confidence: 1 } },
        },
        {
          key: 'saglik',
          label: 'Sağlık / bakım / klinik alanlar',
          next: 'specialization',
          effects: { facts: { profession: 'saglik' }, scores: { confidence: 1 } },
        },
        {
          key: 'operasyon',
          label: 'Operasyon / satış / ofis / lojistik',
          next: 'specialization',
          effects: { facts: { profession: 'operasyon' }, scores: { confidence: 1 } },
        },
        {
          key: 'hizmet',
          label: 'Hizmet / perakende / başlangıç rolleri',
          next: 'specialization',
          effects: { facts: { profession: 'hizmet' } },
        },
      ],
    },
    {
      id: 'specialization',
      text: 'Rolünün piyasa değeri açısından seni en iyi hangisi anlatıyor?',
      options: [
        {
          key: 'destek',
          label: 'Daha çok destek, operasyon veya standart uygulama rolüyüm',
          next: 'experience',
          effects: { facts: { specialization: 'destek' } },
        },
        {
          key: 'uzman',
          label: 'Temiz uzmanlık rolüyüm, standart piyasa seviyesindeyim',
          next: 'experience',
          effects: { facts: { specialization: 'uzman' }, scores: { confidence: 1 } },
        },
        {
          key: 'regule',
          label: 'Regüle, sertifika isteyen veya zor doldurulan bir alandayım',
          next: 'experience',
          effects: { facts: { specialization: 'regule' }, scores: { confidence: 2 } },
        },
        {
          key: 'nis',
          label: 'Niş uzmanlık, kritik teknoloji veya kıt beceri taşıyorum',
          next: 'experience',
          effects: { facts: { specialization: 'nis' }, scores: { confidence: 2 } },
        },
      ],
    },
    {
      id: 'experience',
      text: 'Deneyim seviyen hangi banda daha yakın?',
      options: [
        {
          key: 'junior',
          label: '0-2 yıl',
          next: 'education',
          effects: { facts: { experience: 'junior' } },
        },
        {
          key: 'mid',
          label: '3-5 yıl',
          next: 'education',
          effects: { facts: { experience: 'mid' }, scores: { confidence: 1 } },
        },
        {
          key: 'senior',
          label: '6-9 yıl',
          next: 'education',
          effects: { facts: { experience: 'senior' }, scores: { confidence: 2 } },
        },
        {
          key: 'lead',
          label: '10+ yıl veya belirgin uzman/lead seviye',
          next: 'education',
          effects: { facts: { experience: 'lead' }, scores: { confidence: 3 } },
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
          effects: { facts: { education: 'degree' }, scores: { confidence: 1 } },
        },
        {
          key: 'vocational',
          label: 'Mesleki diploma, önlisans veya ustalık temelim var',
          next: 'recognition',
          effects: { facts: { education: 'vocational' }, scores: { confidence: 1 } },
        },
        {
          key: 'portfolio',
          label: 'Portföyüm güçlü, resmî eğitimim ikinci planda',
          next: 'recognition',
          effects: { facts: { education: 'portfolio' } },
        },
        {
          key: 'newgrad',
          label: 'Yeni mezun veya eğitimden işe geçiş aşamasındayım',
          next: 'recognition',
          effects: { facts: { education: 'newgrad' } },
        },
      ],
    },
    {
      id: 'recognition',
      text: 'Denklik veya tanınma tarafı ne kadar net?',
      options: [
        {
          key: 'clear',
          label: 'Net ve dosyam güçlü',
          next: 'german',
          effects: { facts: { recognition: 'clear' }, scores: { confidence: 2 } },
        },
        {
          key: 'partial',
          label: 'Kısmen net ama teyit gerekiyor',
          next: 'german',
          effects: { facts: { recognition: 'partial' }, scores: { confidence: 1 } },
        },
        {
          key: 'unclear',
          label: 'Belirsiz, bu yüzden pazarlık gücüm düşebilir',
          next: 'german',
          effects: { facts: { recognition: 'unclear' } },
        },
        {
          key: 'notNeeded',
          label: 'Benim rolümde denklik ana belirleyici değil',
          next: 'german',
          effects: { facts: { recognition: 'notNeeded' }, scores: { confidence: 1 } },
        },
      ],
    },
    {
      id: 'german',
      text: 'Almanca seviyeni en iyi hangisi anlatıyor?',
      options: [
        {
          key: 'good',
          label: 'İş ve resmi süreçleri rahat yürütebilirim',
          next: 'location',
          effects: { facts: { german: 'good' }, scores: { confidence: 2 } },
        },
        {
          key: 'basic',
          label: 'Temelim var ama akıcı değilim',
          next: 'location',
          effects: { facts: { german: 'basic' }, scores: { confidence: 1 } },
        },
        {
          key: 'weak',
          label: 'Çok zayıfım veya neredeyse yok',
          next: 'location',
          effects: { facts: { german: 'weak' } },
        },
      ],
    },
    {
      id: 'location',
      text: 'En çok baktığın şehir/lokasyon profili hangisi?',
      options: [
        {
          key: 'pahali',
          label: 'Münih / Frankfurt benzeri pahalı merkezler',
          next: 'company-size',
          effects: { facts: { location: 'pahali' }, scores: { costPressure: 3 } },
        },
        {
          key: 'buyuk',
          label: 'Berlin / Hamburg gibi büyük şehirler',
          next: 'company-size',
          effects: { facts: { location: 'buyuk' }, scores: { costPressure: 2 } },
        },
        {
          key: 'nrw',
          label: 'NRW hattı ve dengeli büyük pazarlar',
          next: 'company-size',
          effects: { facts: { location: 'nrw' }, scores: { costPressure: 1 } },
        },
        {
          key: 'orta',
          label: 'Orta ölçekli şehirler',
          next: 'company-size',
          effects: { facts: { location: 'orta' } },
        },
        {
          key: 'dogu',
          label: 'Daha düşük maliyetli doğu/ikincil şehirler',
          next: 'company-size',
          effects: { facts: { location: 'dogu' } },
        },
      ],
    },
    {
      id: 'company-size',
      text: 'Hedeflediğin şirket büyüklüğü hangisine daha yakın?',
      options: [
        {
          key: 'small',
          label: 'Küçük ekip veya küçük şirket',
          next: 'employer-type',
          effects: { facts: { companySize: 'small' } },
        },
        {
          key: 'medium',
          label: 'Orta ölçekli şirket',
          next: 'employer-type',
          effects: { facts: { companySize: 'medium' }, scores: { confidence: 1 } },
        },
        {
          key: 'large',
          label: 'Büyük şirket veya tanınmış marka',
          next: 'employer-type',
          effects: { facts: { companySize: 'large' }, scores: { confidence: 2 } },
        },
        {
          key: 'corporate',
          label: 'Kurumsal / global yapı / büyük grup',
          next: 'employer-type',
          effects: { facts: { companySize: 'corporate' }, scores: { confidence: 2 } },
        },
      ],
    },
    {
      id: 'employer-type',
      text: 'İşveren yapısı hangisine daha yakın?',
      options: [
        {
          key: 'startup',
          label: 'Startup veya çok erken aşama yapı',
          next: 'hours',
          effects: { facts: { employerType: 'startup' } },
        },
        {
          key: 'private',
          label: 'Klasik özel sektör',
          next: 'hours',
          effects: { facts: { employerType: 'private' }, scores: { confidence: 1 } },
        },
        {
          key: 'international',
          label: 'Uluslararası veya ihracat odaklı şirket',
          next: 'hours',
          effects: { facts: { employerType: 'international' }, scores: { confidence: 2 } },
        },
        {
          key: 'tarif',
          label: 'Tarif bağlı, kamuya yakın veya çok düzenli yapı',
          next: 'hours',
          effects: { facts: { employerType: 'tarif' }, scores: { confidence: 2 } },
        },
      ],
    },
    {
      id: 'hours',
      text: 'Haftalık saat modelin hangisine daha yakın?',
      options: [
        {
          key: 'part',
          label: '20-25 saat part-time',
          next: 'responsibility',
          effects: { facts: { hours: 'part' } },
        },
        {
          key: 'reduced',
          label: '30-32 saat azaltılmış tam zamanlı',
          next: 'responsibility',
          effects: { facts: { hours: 'reduced' } },
        },
        {
          key: 'full',
          label: '37-40 saat tam zamanlı',
          next: 'responsibility',
          effects: { facts: { hours: 'full' }, scores: { confidence: 1 } },
        },
        {
          key: 'extended',
          label: '40+ saat, yüksek tempolu veya yoğun model',
          next: 'responsibility',
          effects: { facts: { hours: 'extended' }, scores: { confidence: 1 } },
        },
      ],
    },
    {
      id: 'responsibility',
      text: 'Sorumluluk seviyen hangisine daha yakın?',
      options: [
        {
          key: 'individual',
          label: 'Bireysel katkıcıyım',
          next: 'offer',
          effects: { facts: { responsibility: 'individual' } },
        },
        {
          key: 'coordination',
          label: 'Süreç, müşteri veya küçük koordinasyon sorumluluğum var',
          next: 'offer',
          effects: { facts: { responsibility: 'coordination' }, scores: { confidence: 1 } },
        },
        {
          key: 'lead',
          label: 'Takım yönetimi veya açık lead rolüm var',
          next: 'offer',
          effects: { facts: { responsibility: 'lead' }, scores: { confidence: 2 } },
        },
        {
          key: 'critical',
          label: 'Nöbet, regüle sorumluluk veya kritik üretim etkisi taşıyorum',
          next: 'offer',
          effects: { facts: { responsibility: 'critical' }, scores: { confidence: 1 } },
        },
      ],
    },
    {
      id: 'offer',
      text: 'Teklif veya pazarlık durumu hangi aşamada?',
      options: [
        {
          key: 'none',
          label: 'Henüz somut teklif yok',
          next: 'tax-profile',
          effects: { facts: { offer: 'none' } },
        },
        {
          key: 'early',
          label: 'İlk görüşmeler var ama aralık belirsiz',
          next: 'tax-profile',
          effects: { facts: { offer: 'early' }, scores: { confidence: 1 } },
        },
        {
          key: 'process',
          label: 'İleri görüşme veya son turdayım',
          next: 'tax-profile',
          effects: { facts: { offer: 'process' }, scores: { confidence: 2 } },
        },
        {
          key: 'signed',
          label: 'Somut teklifim var veya sayı konuşuluyor',
          next: 'tax-profile',
          effects: { facts: { offer: 'signed' }, scores: { confidence: 3 } },
        },
      ],
    },
    {
      id: 'tax-profile',
      text: 'Net varsayımında seni en iyi anlatan vergi/hane profili hangisi?',
      options: [
        {
          key: 'class1',
          label: 'Bekar / tek gelir / Steuerklasse 1',
          next: 'children',
          effects: { facts: { taxProfile: 'class1' }, scores: { costPressure: 1 } },
        },
        {
          key: 'class4',
          label: 'Evli, gelirler dengeli / Steuerklasse 4',
          next: 'children',
          effects: { facts: { taxProfile: 'class4' } },
        },
        {
          key: 'class3',
          label: 'Evli, tek gelir baskın / Steuerklasse 3',
          next: 'children',
          effects: { facts: { taxProfile: 'class3' } },
        },
        {
          key: 'class2',
          label: 'Tek ebeveyn / Steuerklasse 2',
          next: 'children',
          effects: { facts: { taxProfile: 'class2' }, scores: { costPressure: 1 } },
        },
        {
          key: 'class5',
          label: 'Evli, ikinci düşük gelir / Steuerklasse 5',
          next: 'children',
          effects: { facts: { taxProfile: 'class5' }, scores: { costPressure: 2 } },
        },
      ],
    },
    {
      id: 'children',
      text: 'Çocuk durumu açısından sana en yakın seçenek hangisi?',
      options: [
        {
          key: 'none',
          label: 'Çocuk yok',
          next: 'insurance',
          effects: { facts: { childProfile: 'none' }, scores: { costPressure: 1 } },
        },
        {
          key: 'one',
          label: 'Bir çocuk var',
          next: 'insurance',
          effects: { facts: { childProfile: 'one' }, scores: { costPressure: 2 } },
        },
        {
          key: 'two',
          label: 'İki çocuk var',
          next: 'insurance',
          effects: { facts: { childProfile: 'two' }, scores: { costPressure: 2 } },
        },
        {
          key: 'three',
          label: 'Üç veya daha fazla çocuk var',
          next: 'insurance',
          effects: { facts: { childProfile: 'three' }, scores: { costPressure: 3 } },
        },
      ],
    },
    {
      id: 'insurance',
      text: 'Net tahmini için hangi sigorta/vergi varsayımı sana daha yakın?',
      options: [
        {
          key: 'standard',
          label: 'Standart GKV, kilise vergisi yok',
          next: 'RESULT:ESTIMATE',
          effects: { facts: { insuranceProfile: 'standard' }, scores: { confidence: 1 } },
        },
        {
          key: 'church',
          label: 'Standart GKV, kilise vergisi var',
          next: 'RESULT:ESTIMATE',
          effects: { facts: { insuranceProfile: 'church' }, scores: { costPressure: 1, confidence: 1 } },
        },
        {
          key: 'pkv',
          label: 'PKV benzeri beyaz yaka profiline daha yakınım',
          next: 'RESULT:ESTIMATE',
          effects: { facts: { insuranceProfile: 'pkv' }, scores: { confidence: 1 } },
        },
      ],
    },
  ],
  resolveResult: ({ resultId, state }) => {
    if (resultId !== 'ESTIMATE') {
      return createSalaryResult();
    }

    const profession = getFact<string>(state, 'profession', 'operasyon');
    const specialization = getFact<string>(state, 'specialization', 'uzman');
    const experience = getFact<string>(state, 'experience', 'mid');
    const education = getFact<string>(state, 'education', 'vocational');
    const recognition = getFact<string>(state, 'recognition', 'partial');
    const german = getFact<string>(state, 'german', 'basic');
    const location = getFact<string>(state, 'location', 'nrw');
    const companySize = getFact<string>(state, 'companySize', 'medium');
    const employerType = getFact<string>(state, 'employerType', 'private');
    const hours = getFact<string>(state, 'hours', 'full');
    const responsibility = getFact<string>(state, 'responsibility', 'individual');
    const offer = getFact<string>(state, 'offer', 'none');
    const taxProfile = getFact<string>(state, 'taxProfile', 'class1');
    const childProfile = getFact<string>(state, 'childProfile', 'none');
    const insuranceProfile = getFact<string>(state, 'insuranceProfile', 'standard');

    const confidenceScore = getScore(state, 'confidence');
    const costPressureScore = getScore(state, 'costPressure');

    const base = PROFESSION_BASES[profession] ?? PROFESSION_BASES.operasyon;
    const centerGrossRaw =
      base *
      (SPECIALIZATION_MULTIPLIERS[specialization] ?? 1) *
      (EXPERIENCE_MULTIPLIERS[experience] ?? 1) *
      (EDUCATION_MULTIPLIERS[education] ?? 1) *
      (RECOGNITION_MULTIPLIERS[recognition] ?? 1) *
      (GERMAN_MULTIPLIERS[german] ?? 1) *
      (LOCATION_MULTIPLIERS[location] ?? 1) *
      (COMPANY_SIZE_MULTIPLIERS[companySize] ?? 1) *
      (EMPLOYER_TYPE_MULTIPLIERS[employerType] ?? 1) *
      (HOURS_MULTIPLIERS[hours] ?? 1) *
      (RESPONSIBILITY_MULTIPLIERS[responsibility] ?? 1) *
      (OFFER_MULTIPLIERS[offer] ?? 1);

    const centerGross = clamp(roundToStep(centerGrossRaw, 50), 2200, 13500);
    const rangeFactor = clamp((OFFER_RANGE[offer] ?? 0.1) - confidenceScore * 0.004, 0.05, 0.16);
    const lowerGross = roundToStep(centerGross * (1 - rangeFactor), 50);
    const upperGross = roundToStep(centerGross * (1 + rangeFactor), 50);

    const lowerResult = calculateSalary(
      createSalaryInput(lowerGross, location, taxProfile, childProfile, insuranceProfile)
    );
    const upperResult = calculateSalary(
      createSalaryInput(upperGross, location, taxProfile, childProfile, insuranceProfile)
    );

    const avgGross = (lowerGross + upperGross) / 2;
    const avgNet = (lowerResult.netMonthly + upperResult.netMonthly) / 2;
    const avgDeductionRate = ((avgGross - avgNet) / avgGross) * 100;
    const confidence = confidenceLabel(confidenceScore);
    const locationMeta = LOCATION_META[location] ?? LOCATION_META.nrw;
    const taxMeta = TAX_PROFILE_META[taxProfile] ?? TAX_PROFILE_META.class1;
    const childMeta = CHILD_META[childProfile] ?? CHILD_META.none;
    const insuranceMeta = INSURANCE_META[insuranceProfile] ?? INSURANCE_META.standard;

    return {
      id: 'ESTIMATE',
      title:
        centerGross >= 6500
          ? 'Yuksek bantli maas beklentin'
          : centerGross >= 4500
            ? 'Dengeli maas beklentin'
            : 'Daha dikkatli butce isteyen maas beklentin',
      matchLabel: bandLabel(centerGross),
      tone: bandTone(centerGross),
      summary:
        'Bu aralik; rol, deneyim, sehir, sirket yapisi, saat modeli ve net varsayimlarin birlikte okunmasiyla olusturuldu. Resmi kaynaklar da Almanya\'da brut-net farkinin vergi, sosyal sigorta ve eyalet baglaminda degistigini gosteriyor; bu nedenle sonucu tek sayi gibi degil karar cercevesi gibi okumalisin.',
      metrics: [
        {
          label: 'Aylik brut beklenti',
          value: `${formatCurrency(lowerGross)} - ${formatCurrency(upperGross)}`,
          tone: bandTone(centerGross),
        },
        {
          label: 'Aylik net tahmin',
          value: `${formatCurrency(lowerResult.netMonthly)} - ${formatCurrency(upperResult.netMonthly)}`,
          tone: 'green',
        },
        {
          label: 'Yillik brut cerceve',
          value: `${formatCurrency(lowerGross * 12)} - ${formatCurrency(upperGross * 12)}`,
          tone: 'blue',
        },
        {
          label: 'Kesinti seviyesi',
          value: `%${avgDeductionRate.toFixed(1)} civari`,
          tone: avgDeductionRate >= 38 ? 'orange' : avgDeductionRate >= 32 ? 'yellow' : 'green',
        },
        {
          label: 'Kira baskisi',
          value: locationMeta.pressure,
          tone: locationMeta.pressureTone,
        },
        {
          label: 'Tahmin guveni',
          value: confidence.value,
          tone: confidence.tone,
        },
      ],
      why: [
        ...parseRoleWhy({ profession, location, hours }),
        `Net varsayimi ${taxMeta.label.toLowerCase()} + ${childMeta.label.toLowerCase()} + ${insuranceMeta.label.toLowerCase()} profiline gore uretildi.`,
      ],
      steps: buildSteps({ offer, location, confidence: confidenceScore }),
      caution:
        confidenceScore <= 5
          ? 'Bu tahminin araligi bilerek daha genis tutuldu. Somut sirket, sehir ve teklif bilgisi gelmeden bunu kesin veri gibi kullanma.'
          : costPressureScore >= 6
            ? 'Brut bant guclu gorunse bile hane ve sehir baskisi nette daha sert hissedilebilir; karari net ve yasam maliyeti birlikte ver.'
            : 'Son kararda bonus, tasinma destegi, ikramiye ve uzaktan calisma gunleri gibi yan haklari da mutlaka ayri fiyatla.'
      ,
      officialSources: [OFFICIAL_SOURCES.arbeitsagentur, OFFICIAL_SOURCES.makeItInGermany],
      relatedTools: ['almanyada-is-bulma-olasiligi', 'hangi-sehir-sana-uygun'],
    };
  },
};
