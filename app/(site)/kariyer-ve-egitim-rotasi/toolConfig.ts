import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact } from '@/lib/tools/helpers';
import { kariyerVeEgitimRotasiQuestionnaire } from '@/lib/tools/surveys/kariyer-ve-egitim-rotasi';
import type { ToolConfig } from '@/lib/tools/types';

export const toolConfig: ToolConfig = {
  slug: 'kariyer-ve-egitim-rotasi',
  path: '/kariyer-ve-egitim-rotasi',
  title: 'Kariyer ve Eğitim Rotası Aracı',
  description:
    'İş, yüksek lisans, Ausbildung, denklik sonrası iş veya hazırlık rotaları arasında senin için daha mantıklı olanı seç.',
  intro:
    'Bu araç, “hangi kategoriye başvurmalıyım?” sorusundan bir adım öteye geçer ve mevcut profilinle hangi kariyer/eğitim sıralamasının daha mantıklı olabileceğini çıkarır.',
  why:
    'Aynı kullanıcı için doğru rota bazen doğrudan iş değildir; bazen önce dil, bazen denklik, bazen de eğitimle giriş daha verimli olabilir. Bu araç o sırayı netleştirir.',
  whoFor: [
    'İş, yüksek lisans, Ausbildung veya denklik hattı arasında kararsız kalanlar.',
    'Kısa vadede Almanya\'ya girmek, orta vadede kariyer kurmak isteyenler.',
    'Elindeki profil ile en mantıklı sırayı görmek isteyen kullanıcılar.',
  ],
  howItWorks: [
    'Eğitim geçmişini, deneyimini, dil seviyeni ve Almanya hedefini sorar.',
    'Bu cevaplardan daha gerçekçi bir geçiş rotası ve zaman ufku üretir.',
    'Sonuçta neden bu rota mantıklı göründüğünü ve sonraki hazırlık adımlarını özetler.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
  initialQuestionId: 'education',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.recognition,
    OFFICIAL_SOURCES.arbeitsagentur,
  ],
  relatedTools: ['almanya-yolunu-sec', 'almanyada-is-bulma-olasiligi', 'almanyaya-hazir-misin'],
  questionnaire: kariyerVeEgitimRotasiQuestionnaire,
  faqs: [
    {
      question: 'Bu araç kariyer koçluğu yerine geçer mi?',
      answer:
        'Hayır. Ama profiline göre önce neyin daha mantıklı olduğuna dair karar çerçevesi oluşturur.',
    },
    {
      question: 'Doğrudan iş sonucu çıkmazsa bu kötü haber mi?',
      answer:
        'Hayır. Bazen önce dil, denklik veya eğitimle girmek daha az riskli ve daha sürdürülebilir olur.',
    },
  ],
  questions: [
    {
      id: 'education',
      text: 'Eğitim geçmişini en iyi anlatan seçenek hangisi?',
      options: [
        { key: 'uni', label: 'Üniversite mezunuyum', next: 'experience', effects: { facts: { education: 'uni' } } },
        { key: 'voc', label: 'Mesleki eğitim / teknik geçmişim var', next: 'experience', effects: { facts: { education: 'voc' } } },
        { key: 'none', label: 'Belirgin bir yeterlilik tabanım zayıf', next: 'experience', effects: { facts: { education: 'none' } } },
      ],
    },
    {
      id: 'experience',
      text: 'Deneyim durumun hangisine yakın?',
      options: [
        { key: 'low', label: '0-2 yıl veya dağınık deneyim', next: 'language', effects: { facts: { experience: 'low' } } },
        { key: 'mid', label: '3-5 yıl istikrarlı deneyim', next: 'language', effects: { facts: { experience: 'mid' } } },
        { key: 'high', label: '6+ yıl güçlü deneyim', next: 'language', effects: { facts: { experience: 'high' } } },
      ],
    },
    {
      id: 'language',
      text: 'Dil tarafında seni en iyi anlatan seçenek hangisi?',
      options: [
        { key: 'strong', label: 'Almanca veya İngilizce tarafım güçlü', next: 'offer', effects: { facts: { language: 'strong' } } },
        { key: 'basic', label: 'Temel seviyedeyim ama geliştirebilirim', next: 'offer', effects: { facts: { language: 'basic' } } },
        { key: 'weak', label: 'Dil şu an en zayıf alanım', next: 'offer', effects: { facts: { language: 'weak' } } },
      ],
    },
    {
      id: 'offer',
      text: 'Somut iş teklifi veya kabul mektubu durumun nedir?',
      options: [
        { key: 'job', label: 'İş teklifi var', next: 'goal', effects: { facts: { offer: 'job' } } },
        { key: 'study', label: 'Eğitim/kabul tarafı daha yakın', next: 'goal', effects: { facts: { offer: 'study' } } },
        { key: 'none', label: 'Henüz somut bir teklif yok', next: 'goal', effects: { facts: { offer: 'none' } } },
      ],
    },
    {
      id: 'goal',
      text: 'Almanya için asıl hedefin kısa vadede hangisine daha yakın?',
      options: [
        { key: 'fast-job', label: 'Mümkünse hızlıca işe geçmek', next: 'RESULT:ROUTE', effects: { facts: { goal: 'fast-job' } } },
        { key: 'structured', label: 'Daha düzenli ve güvenli bir geçiş istiyorum', next: 'RESULT:ROUTE', effects: { facts: { goal: 'structured' } } },
        { key: 'long-term', label: 'Uzun vadeli kariyer zemini kurmak istiyorum', next: 'RESULT:ROUTE', effects: { facts: { goal: 'long-term' } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const education = getFact<string>(state, 'education', 'none');
    const experience = getFact<string>(state, 'experience', 'low');
    const language = getFact<string>(state, 'language', 'weak');
    const offer = getFact<string>(state, 'offer', 'none');
    const goal = getFact<string>(state, 'goal', 'structured');

    if (offer === 'job' && education !== 'none' && language !== 'weak') {
      return {
        id: 'DIRECT_JOB',
        title: 'Doğrudan iş rotası şu an en mantıklı görünüyor',
        matchLabel: 'Kısa vade',
        tone: 'blue',
        summary:
          'Elindeki iş teklifi ve mevcut altyapı, doğrudan iş odaklı bir geçişi destekliyor. Bu nedenle odağı gereksiz yere dağıtmadan iş teklifini güçlendirmek daha mantıklı olabilir.',
        why: [
          'Somut teklif, kariyer planında belirsizliği ciddi biçimde azaltır.',
          'Dil ve yeterlilik tarafın sıfır seviyesinde görünmüyor.',
          'Bu aşamada asıl iş, denklik ve evrak tarafını teklifle hizalamaktır.',
        ],
        steps: [
          'İş sözleşmesini, maaşı ve rol kapsamını netleştir.',
          'Meslek için gerekliyse denklik veya tanınma adımını paralelde başlat.',
          'Taşınma ve ilk 90 gün hazırlığını iş başlangıcına göre planla.',
        ],
        officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
        relatedTools: ['almanya-yolunu-sec', 'almanyaya-hazir-misin', 'ilk-90-gun-planlayici'],
      };
    }

    if (education === 'uni' && offer !== 'job' && goal === 'long-term') {
      return {
        id: 'MASTERS',
        title: 'Yüksek lisans veya akademik rota daha mantıklı olabilir',
        matchLabel: 'Orta vade',
        tone: 'green',
        summary:
          'Üniversite temelini uzun vadeli kariyere bağlamak istiyorsan, eğitimle giriş ve sonrasında iş piyasasına geçiş daha düzenli bir rota sunabilir.',
        why: [
          'Somut iş teklifi olmadan da Almanya\'ya güçlü bir giriş zemini yaratır.',
          'Uzun vadeli kariyer zemini ve network oluşturmak için akademik giriş işe yarayabilir.',
          'Bu rota finansman ve kabul takvimi bakımından disiplin ister.',
        ],
        steps: [
          'Program ve üniversite kısa listeni oluştur.',
          'Dil, finansman ve başvuru takvimini tek bir çalışma dosyasında topla.',
          'Eğitim sonrası iş geçişi için hedef sektörlerini şimdiden belirle.',
        ],
        officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
        relatedTools: ['almanya-yolunu-sec', 'ilk-90-gun-planlayici'],
      };
    }

    if (education === 'voc' && language !== 'strong' && goal === 'structured') {
      return {
        id: 'AUSBILDUNG',
        title: 'Ausbildung veya yapılandırılmış mesleki rota daha uygun olabilir',
        matchLabel: 'Dengeli rota',
        tone: 'yellow',
        summary:
          'Mesleki tabanın var ama dil ve doğrudan iş tarafı tam oturmamış olabilir. Bu nedenle daha yapılandırılmış bir Ausbildung/mesleki geçiş rotası gerçekçi görünüyor.',
        why: [
          'Mesleki temelini Almanya sistemine daha kontrollü bağlama şansı verir.',
          'Dil ve günlük adaptasyonu işin içine gömülü biçimde güçlendirebilir.',
          'Doğrudan iş yerine aşamalı geçiş riskleri azaltabilir.',
        ],
        steps: [
          'Meslek alanında Ausbildung veya benzeri geçiş rotalarını araştır.',
          'Dil planını başvuru takvimiyle birlikte güçlendir.',
          'Şirket ve şehir seçimini yaşam maliyeti ile birlikte değerlendir.',
        ],
        officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
        relatedTools: ['almanya-yolunu-sec', 'hangi-sehir-sana-uygun'],
      };
    }

    if (education !== 'none' && experience !== 'low' && offer === 'none') {
      return {
        id: 'RECOGNITION_THEN_JOB',
        title: 'Önce denklik/profil güçlendirme, sonra iş rotası daha mantıklı',
        matchLabel: 'Hazırlık + geçiş',
        tone: 'orange',
        summary:
          'Temel altyapın var; ancak somut teklif eksikliği ve belirsiz geçiş planı nedeniyle önce profilini Almanya piyasasına uyarlamak daha verimli olabilir.',
        why: [
          'Deneyim ve eğitim boşa gitmiyor; sadece Almanya tarafına çevrilmesi gerekiyor.',
          'Denklik, CV formatı ve hedef sektör seçimi bu aşamada çarpan etkisi yaratır.',
          'Doğrudan dağınık başvuru yerine önce profil netliği kurmak daha mantıklı.',
        ],
        steps: [
          'Denklik gereksinimini netleştir ve gerekiyorsa süreci başlat.',
          'Almanya odaklı CV, başvuru dili ve rol hedefi setini güncelle.',
          'Paralelde iş arama kanalını ve lokasyon stratejini daralt.',
        ],
        officialSources: [OFFICIAL_SOURCES.recognition, OFFICIAL_SOURCES.arbeitsagentur],
        relatedTools: ['almanyada-is-bulma-olasiligi', 'almanya-maas-beklentisi'],
      };
    }

    return {
      id: 'LANGUAGE_PREP',
      title: 'Önce dil ve temel hazırlık katmanı gerekiyor',
      matchLabel: 'Uzun vade',
      tone: 'red',
      summary:
        'Şu anki cevaplara göre en doğru adım doğrudan rota seçmekten çok, seni rota seçebilecek seviyeye taşıyacak hazırlık katmanını kurmak görünüyor.',
      why: [
        'Dil ve somut teklif eksikliği karar alanını çok daraltıyor.',
        'Hazırlık yapmadan rastgele rota denemek zaman kaybettirebilir.',
        'Önce temel güçlenirse hem eğitim hem iş yolları daha gerçekçi hale gelir.',
      ],
      steps: [
        'Dil seviyeni hedef rota için minimum kullanılabilir noktaya taşı.',
        'Eğitim/yeterlilik ve deneyim dosyanı görünür hale getir.',
        'Hazırlık sonrası hangi rotanın ağır bastığını yeniden değerlendir.',
      ],
      officialSources: [OFFICIAL_SOURCES.bamf, OFFICIAL_SOURCES.mbe],
      relatedTools: ['almanyaya-hazir-misin', 'once-hangi-sorunu-cozmelisin'],
    };
  },
};
