import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact, getScore } from '@/lib/tools/helpers';
import type { ToolConfig, ToolTone } from '@/lib/tools/types';

export const toolConfig: ToolConfig = {
  slug: 'almanyada-is-bulma-olasiligi',
  path: '/almanyada-is-bulma-olasiligi',
  title: 'Almanya\'da İş Bulma Olasılığı Aracı',
  description:
    'Meslek, deneyim, dil, denklik ve lokasyon esnekliğine göre Almanya iş piyasasında konumunu yorumla.',
  intro:
    'Bu araç işe kesin girip giremeyeceğini söylemez. Onun yerine profilinin şu an iş piyasasında ne kadar hazır göründüğünü ve hangi kalemlerin seni yukarı taşıyacağını gösterir.',
  why:
    'Birçok kullanıcı iş bulma şansını yalnızca meslek üzerinden okuyor. Oysa dil, denklik, lokasyon esnekliği ve başvuru olgunluğu birlikte belirleyici oluyor.',
  whoFor: [
    'İş aramaya başlamadan önce mevcut profilini daha gerçekçi okumak isteyenler.',
    'Dil ve denklik eksiğinin iş bulma şansını ne kadar etkilediğini görmek isteyenler.',
    'Sektör, deneyim ve lokasyon esnekliği arasında bağ kurmak isteyenler.',
  ],
  howItWorks: [
    'Meslek grubu, deneyim, dil, denklik ve lokasyon esnekliğini sorar.',
    'Bu sinyallerden güçlü, geliştirilebilir veya önce profil güçlendirilmeli gibi bir sonuç üretir.',
    'Sonuçta şansını artıran faktörleri ve önce düzeltmen gereken alanları ayırır.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
  initialQuestionId: 'profession',
  officialSources: [
    OFFICIAL_SOURCES.arbeitsagentur,
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.recognition,
  ],
  relatedTools: ['almanya-maas-beklentisi', 'kariyer-ve-egitim-rotasi', 'almanya-yolunu-sec'],
  faqs: [
    {
      question: 'Güçlü sonuç çıkarsa iş garantisi var mı?',
      answer:
        'Hayır. Sonuç yalnızca profilinin piyasaya göre güçlü göründüğünü söyler; başvuru kalitesi ve zamanlama hâlâ önemlidir.',
    },
    {
      question: 'Zayıf ama mümkün sonucu ne demek?',
      answer:
        'Pencere tamamen kapalı değil demektir; ama dil, denklik veya başvuru stratejisinde belirgin iyileştirme gerekir.',
    },
  ],
  questions: [
    {
      id: 'profession',
      text: 'Meslek grubun iş piyasasında hangisine daha yakın?',
      options: [
        { key: 'tech', label: 'BT / yazılım / veri', next: 'experience', effects: { scores: { strength: 3 }, facts: { profession: 'tech' } } },
        { key: 'health', label: 'Sağlık / bakım / klinik', next: 'experience', effects: { scores: { strength: 2 }, facts: { profession: 'health' } } },
        { key: 'engineering', label: 'Mühendislik / teknik üretim', next: 'experience', effects: { scores: { strength: 2 }, facts: { profession: 'engineering' } } },
        { key: 'general', label: 'Genel ofis / satış / operasyon', next: 'experience', effects: { scores: { strength: 1 }, facts: { profession: 'general' } } },
        { key: 'entry', label: 'Giriş seviyesi / deneyim düşük', next: 'experience', effects: { facts: { profession: 'entry' } } },
      ],
    },
    {
      id: 'experience',
      text: 'Deneyim seviyen hangisine daha yakın?',
      options: [
        { key: 'low', label: '0-2 yıl', next: 'language', effects: { scores: { risk: 2 }, facts: { experience: 'low' } } },
        { key: 'mid', label: '3-5 yıl', next: 'language', effects: { scores: { strength: 2 }, facts: { experience: 'mid' } } },
        { key: 'high', label: '6+ yıl', next: 'language', effects: { scores: { strength: 3 }, facts: { experience: 'high' } } },
      ],
    },
    {
      id: 'language',
      text: 'Dil tarafında seni en iyi anlatan seçenek hangisi?',
      options: [
        { key: 'strong', label: 'Almanca veya İngilizce güçlü', next: 'recognition', effects: { scores: { strength: 2 }, facts: { language: 'strong' } } },
        { key: 'basic', label: 'Temel seviyedeyim', next: 'recognition', effects: { scores: { risk: 1 }, facts: { language: 'basic' } } },
        { key: 'weak', label: 'Dil zayıf', next: 'recognition', effects: { scores: { risk: 3 }, facts: { language: 'weak' } } },
      ],
    },
    {
      id: 'recognition',
      text: 'Mesleğin için denklik veya tanınma tarafı ne kadar net?',
      options: [
        { key: 'clear', label: 'Net ve hazır', next: 'location', effects: { scores: { strength: 2 }, facts: { recognition: 'clear' } } },
        { key: 'partial', label: 'Kısmen net', next: 'location', effects: { scores: { risk: 1 }, facts: { recognition: 'partial' } } },
        { key: 'unclear', label: 'Belirsiz veya eksik', next: 'location', effects: { scores: { risk: 3 }, facts: { recognition: 'unclear' } } },
      ],
    },
    {
      id: 'location',
      text: 'Lokasyon ve rol esnekliğin ne kadar yüksek?',
      options: [
        { key: 'high', label: 'Şehir ve rol tarafında esneğim', next: 'RESULT:JOB_CHANCE', effects: { scores: { strength: 2 }, facts: { location: 'high' } } },
        { key: 'medium', label: 'Kısmen esneğim', next: 'RESULT:JOB_CHANCE', effects: { scores: { strength: 1 }, facts: { location: 'medium' } } },
        { key: 'low', label: 'Dar şehir veya rol tercihim var', next: 'RESULT:JOB_CHANCE', effects: { scores: { risk: 2 }, facts: { location: 'low' } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const strength = getScore(state, 'strength');
    const risk = getScore(state, 'risk');
    const profession = getFact<string>(state, 'profession', 'general');
    const language = getFact<string>(state, 'language', 'basic');
    const recognition = getFact<string>(state, 'recognition', 'partial');
    const location = getFact<string>(state, 'location', 'medium');

    let title = 'İş bulma profilin geliştirilebilir görünüyor';
    let matchLabel = 'Geliştirilebilir';
    let tone: ToolTone = 'yellow';
    let summary =
      'Pencere açık görünüyor; ama şansı belirgin biçimde artırmak için birkaç kritik alanı güçlendirmen gerekiyor.';

    if (strength >= 9 && risk <= 3) {
      title = 'İş bulma profilin güçlü görünüyor';
      matchLabel = 'Güçlü';
      tone = 'green';
      summary =
        'Meslek, deneyim, dil ve esneklik kombinasyonun iş piyasasına giriş açısından avantajlı görünüyor. Hâlâ başvuru kalitesi belirleyici olacak, ama tablo olumlu.';
    } else if (risk >= 8) {
      title = 'Önce profilini güçlendirmek daha doğru';
      matchLabel = 'Önce güçlendir';
      tone = 'red';
      summary =
        'Şu an iş aramasına tamamen kapalı değilsin; ancak dil, denklik veya deneyim eksiği önce kapatılmazsa başvuruların verimsiz kalabilir.';
    } else if (risk >= 5 || strength <= 4) {
      title = 'İş bulma şansı zayıf ama mümkün';
      matchLabel = 'Zayıf ama mümkün';
      tone = 'orange';
      summary =
        'Doğru strateji ile ilerlemek hâlâ mümkün; fakat profilin bazı alanlarda seni geriye çekiyor. Önce bu alanları düzeltmek başvuru hacminden daha önemli.';
    }

    return {
      id: 'JOB_CHANCE',
      title,
      matchLabel,
      tone,
      summary,
      why: [
        profession === 'tech'
          ? 'BT tarafı pazar avantajı sağlayabilir; ancak dil ve lokasyon esnekliği yine de fark yaratır.'
          : profession === 'health'
            ? 'Sağlık alanı güçlü olabilir ama denklik netliği burada kritik hale gelir.'
            : 'Meslek grubun tek başına belirleyici değil; tamamlayıcı profil kalemleri çok etkili.',
        language === 'weak'
          ? 'Dil seviyesi iş bulma sürecinde seni belirgin biçimde yavaşlatıyor.'
          : 'Dil tarafın en azından temel engel oluşturmuyor.',
        recognition === 'unclear'
          ? 'Denklik/tanınma belirsizliği, özellikle işveren güvenini ve başvuru netliğini düşürebilir.'
          : 'Denklik tarafının netleşmesi işveren karşısında güven artırır.',
      ],
      steps: [
        'En güçlü ve en zayıf iki profil kalemini yazılı olarak ayır.',
        location === 'low'
          ? 'Lokasyon esnekliğini artırabiliyorsan bunu ilk denenecek kaldıraç olarak düşün.'
          : 'Rol ve şehir hedefini daha da daraltıp odaklı başvuru yap.',
        'Başvuru kalitesini artırmak için CV, motivasyon metni ve LinkedIn profilini Almanya odaklı güncelle.',
      ],
      caution:
        'Sonuç, iş piyasasına dair bir yorumdur; resmi çalışma hakkı, vize uygunluğu veya teklif garantisi vermez.',
      officialSources: [OFFICIAL_SOURCES.arbeitsagentur, OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
      relatedTools: ['almanya-maas-beklentisi', 'kariyer-ve-egitim-rotasi', 'almanya-yolunu-sec'],
    };
  },
};
