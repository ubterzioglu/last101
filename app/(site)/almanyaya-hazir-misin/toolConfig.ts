import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getScore } from '@/lib/tools/helpers';
import { almanyayaHazirMisinQuestionnaire } from '@/lib/tools/surveys/almanyaya-hazir-misin';
import type { ToolConfig } from '@/lib/tools/types';

const GAP_LABELS: Record<string, string> = {
  belge: 'Belge tarafında açık var',
  dil: 'Dil hazırlığı zayıf',
  butce: 'Bütçe planı yetersiz',
  plan: 'Varış sonrası plan net değil',
  denklik: 'Denklik ihtiyacı belirsiz',
};

export const toolConfig: ToolConfig = {
  slug: 'almanyaya-hazir-misin',
  path: '/almanyaya-hazir-misin',
  title: 'Almanya\'ya Hazır Mısın? Aracı',
  description:
    'Belge, dil, bütçe, denklik ve zamanlama açısından Almanya sürecine ne kadar hazır olduğunu ölç.',
  intro:
    'Bu araç, “gidebilir miyim?” sorusundan çok “ne kadar hazırlıklıyım?” sorusuna odaklanır. Amaç, güçlü yanlarını görmekten çok gecikmeye yol açabilecek açıkları öncelik sırasına koymaktır.',
  why:
    'Almanya planları çoğu zaman tek bir eksikten değil, küçük ama kritik birkaç hazırlık boşluğundan aksar. Bu araç, en görünmez riskleri görünür hale getirmek için tasarlandı.',
  whoFor: [
    'Başvuruya veya taşınma planına başlamadan önce hazırlık seviyesini görmek isteyenler.',
    'Dil, evrak, finansman ve konaklama tarafında nerede zayıf kaldığını anlamak isteyenler.',
    'Hazırım mı yoksa biraz daha hazırlık yapmalı mıyım diye düşünen kullanıcılar.',
  ],
  howItWorks: [
    'Evrak, dil, bütçe, konaklama ve denklik alanlarında kısa sorular sorar.',
    'Cevaplarını hazır, kısmen hazır veya kritik eksik var seviyelerine çevirir.',
    'Sonuçta önce çözülmesi gereken açıkları önceliklendirir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
  initialQuestionId: 'documents',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.recognition,
    OFFICIAL_SOURCES.bamf,
  ],
  relatedTools: ['almanya-yolunu-sec', 'once-hangi-sorunu-cozmelisin', 'ilk-90-gun-planlayici'],
  questionnaire: almanyayaHazirMisinQuestionnaire,
  faqs: [
    {
      question: 'Hazır çıkarsam hemen başvuru yapmalı mıyım?',
      answer:
        'Araç seni hazır görse bile resmi belge kontrolünü ayrı yapmalısın. Sonuç yalnızca hazırlık olgunluğunu yorumlar.',
    },
    {
      question: 'Kritik eksik var sonucu seçeneklerimin bittiği anlamına mı gelir?',
      answer:
        'Hayır. Yalnızca önce kapatılması gereken boşlukların başvurudan daha öncelikli olduğunu gösterir.',
    },
  ],
  questions: [
    {
      id: 'documents',
      text: 'Pasaport, diploma/sertifika, CV ve temel çeviri dosyaların hangi durumda?',
      options: [
        { key: 'good', label: 'Büyük kısmı hazır', next: 'language', effects: { scores: { ready: 3 } } },
        { key: 'partial', label: 'Bir kısmı hazır, ama dağınık', next: 'language', effects: { scores: { ready: 1, belge: 2 } } },
        { key: 'weak', label: 'Henüz ciddi hazırlık yapmadım', next: 'language', effects: { scores: { belge: 4 } } },
      ],
    },
    {
      id: 'language',
      text: 'Dil tarafında kendini en iyi anlatan seçenek hangisi?',
      options: [
        { key: 'good', label: 'En az temel iş görecek seviyedeyim', next: 'budget', effects: { scores: { ready: 2 } } },
        { key: 'mid', label: 'Başlangıç var ama zayıf', next: 'budget', effects: { scores: { dil: 2, ready: 1 } } },
        { key: 'weak', label: 'Dil tarafı en zayıf halkam', next: 'budget', effects: { scores: { dil: 4 } } },
      ],
    },
    {
      id: 'budget',
      text: 'Taşınma, ilk aylar ve resmi süreçler için bütçe planın nasıl?',
      options: [
        { key: 'good', label: 'En az ilk aylar için planım ve yastığım var', next: 'recognition', effects: { scores: { ready: 2 } } },
        { key: 'partial', label: 'Kısmen var ama kırılgan', next: 'recognition', effects: { scores: { butce: 2, ready: 1 } } },
        { key: 'weak', label: 'Bütçe en büyük risk alanım', next: 'recognition', effects: { scores: { butce: 4 } } },
      ],
    },
    {
      id: 'recognition',
      text: 'Mesleğin veya diploman için denklik/tanınma gerekip gerekmediğini biliyor musun?',
      options: [
        { key: 'yes', label: 'Evet, ne gerektiğini biliyorum', next: 'arrival', effects: { scores: { ready: 2 } } },
        { key: 'partial', label: 'Kısmen biliyorum ama emin değilim', next: 'arrival', effects: { scores: { denklik: 2 } } },
        { key: 'no', label: 'Hayır, bu taraf tamamen belirsiz', next: 'arrival', effects: { scores: { denklik: 4 } } },
      ],
    },
    {
      id: 'arrival',
      text: 'Almanya\'ya vardığında ilk hafta ve ilk ay planın ne kadar net?',
      options: [
        { key: 'good', label: 'Anmeldung, sigorta ve konaklama sıram net', next: 'RESULT:EVALUATE', effects: { scores: { ready: 2 } } },
        { key: 'partial', label: 'Kabaca biliyorum ama sıra karışık', next: 'RESULT:EVALUATE', effects: { scores: { plan: 2 } } },
        { key: 'weak', label: 'Varış sonrası planım neredeyse yok', next: 'RESULT:EVALUATE', effects: { scores: { plan: 4 } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const ready = getScore(state, 'ready');
    const gaps = ['belge', 'dil', 'butce', 'plan', 'denklik']
      .map((key) => ({ key, score: getScore(state, key) }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score);

    const topGaps = gaps.slice(0, 3).map((item) => GAP_LABELS[item.key]);

    if (ready >= 8 && gaps.length <= 2) {
      return {
        id: 'READY',
        title: 'Genel tabloya göre iyi hazırlanmış görünüyorsun',
        matchLabel: 'Hazır',
        tone: 'green',
        summary:
          'Temel taşların önemli kısmı yerinde. Hâlâ resmi teyit gerektiren detaylar olabilir ama şu anki tablo başvuru veya taşınma hazırlığı için olgun görünüyor.',
        why: [
          'Belgeler, bütçe ve dil tarafında tamamen sıfırdan başlamıyorsun.',
          'Denklik ve ilk varış planı gibi geciktiren başlıklar büyük ölçüde görünür hale gelmiş.',
          topGaps.length > 0 ? `Yine de takip etmen gereken alanlar: ${topGaps.join(', ')}.` : 'Kritik boşluk görünmüyor.',
        ],
        steps: [
          'Resmi belge listesini başvuracağın kategoriye göre son kez kontrol et.',
          'Taşınma öncesi ve ilk ay bütçeni yazılı hâle getir.',
          'Varış sonrası yapılacakları takvime bağlayarak süreci netleştir.',
        ],
        officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
        relatedTools: ['ilk-90-gun-planlayici', 'almanya-yolunu-sec'],
      };
    }

    if (gaps.some((item) => item.score >= 4)) {
      return {
        id: 'BLOCKED',
        title: 'Kritik eksikler kapanmadan ilerlemek riskli',
        matchLabel: 'Kritik eksik var',
        tone: 'red',
        summary:
          'Şu an en az bir alanda başvuruyu veya taşınmayı ciddi biçimde geciktirebilecek boşluk var. Önce bu boşlukları kapatmak daha doğru olacaktır.',
        why: [
          topGaps[0] ? `En baskın açık: ${topGaps[0]}.` : 'Birden fazla kritik açık görünüyor.',
          topGaps[1] ? `İkinci risk alanı: ${topGaps[1]}.` : 'Yan riskler de süreci uzatabilir.',
          'Bu seviyede acele başvuru yapmak çoğu zaman zaman ve para kaybına dönüşür.',
        ],
        steps: [
          'En kritik açığı tek bir başlık olarak seç ve bu hafta için somut görev listesi çıkar.',
          'Belirsiz kalan denklik veya belge alanları için resmi kaynaklardan doğrulama yap.',
          'Dil ve bütçe tarafında minimum eşiklerini yazılı olarak belirle.',
          'Hazırlık sonrası tabloyu yeniden ölçmek için aracı tekrar kullan.',
        ],
        officialSources: [OFFICIAL_SOURCES.recognition, OFFICIAL_SOURCES.bamf, OFFICIAL_SOURCES.mbe],
        relatedTools: ['once-hangi-sorunu-cozmelisin', 'topluluk-ve-danismanlik'],
      };
    }

    return {
      id: 'PARTIAL',
      title: 'Temel var ama birkaç alanı sıkılaştırman gerekiyor',
      matchLabel: 'Kısmen hazır',
      tone: 'yellow',
      summary:
        'Hazırlığın tamamen zayıf değil; ama sürecin sorunsuz akması için birkaç kritik parçayı daha netleştirmen gerekiyor.',
      why: [
        'Bazı temel alanlar hazır olsa da tablo eşit dağılmıyor.',
        topGaps.length > 0 ? `Dikkat isteyen başlıklar: ${topGaps.join(', ')}.` : 'Dağınık ama çözülebilir açıklar var.',
        'Doğru sırayla ilerlersen bu açıklar kısa sürede kapanabilir.',
      ],
      steps: [
        'Belge, dil ve bütçe başlıklarını aynı anda değil; öncelik sırasıyla ele al.',
        'Denklik gereksinimini netleştirip gereksiz evrak hazırlığını azalt.',
        'İlk hafta planını yazarak belirsizliği azalt.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
      relatedTools: ['once-hangi-sorunu-cozmelisin', 'ilk-90-gun-planlayici'],
    };
  },
};
