import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import { getFact } from '@/lib/tools/helpers';
import type { ToolConfig } from '@/lib/tools/types';

export const toolConfig: ToolConfig = {
  slug: 'ilk-90-gun-planlayici',
  path: '/ilk-90-gun-planlayici',
  title: 'İlk 90 Gün Planlayıcı',
  description:
    'Almanya\'daki ilk hafta, ilk ay ve ilk üç ay için Anmeldung, sigorta, banka, oturum ve günlük kurulum adımlarını sırala.',
  intro:
    'Bu araç, “önce ne yapacağım?” karmaşasını azaltmak için ilk 90 gününü zaman bloklarına böler ve hangi adımın diğerine bağlı olduğunu görünür hale getirir.',
  why:
    'Almanya\'ya yeni gelenlerin en sık zorlandığı noktalardan biri tek tek işler değil, işlerin doğru sırada yapılmasıdır. Bu araç o sıralamayı oluşturur.',
  whoFor: [
    'Yeni gelenler veya yakında gelecek olanlar.',
    'Çalışan, öğrenci veya aile birleşimiyle gelenler için ilk günlerdeki adımları sıralamak isteyenler.',
    'Anmeldung, sigorta, banka hesabı ve oturum ilişkisini karıştıran kullanıcılar.',
  ],
  howItWorks: [
    'Geliş nedenini, konaklama durumunu ve aile senaryosunu sorar.',
    'Bu profile göre ilk hafta, ilk ay ve 60-90 gün aksiyon sırası üretir.',
    'Sonuçta belge bağımlılıklarını ve öncelik sırasını sade biçimde listeler.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 4,
  initialQuestionId: 'reason',
  officialSources: [
    OFFICIAL_SOURCES.makeItInGermany,
    OFFICIAL_SOURCES.bamf,
    OFFICIAL_SOURCES.handbookGermany,
  ],
  relatedTools: ['almanyaya-hazir-misin', 'topluluk-ve-danismanlik', 'hangi-sehir-sana-uygun'],
  faqs: [
    {
      question: 'Bu araç resmi randevu tarihlerini hesaplar mı?',
      answer:
        'Hayır. Araç sadece doğru sırayı kurar; randevu yoğunluğu şehir ve kuruma göre değişir.',
    },
    {
      question: 'Anmeldung olmadan hiçbir şey yapılamaz mı?',
      answer:
        'Bazı adımlar paralel yürüyebilir; ama birçok günlük işlem için Anmeldung önemli bir merkez noktadır.',
    },
  ],
  questions: [
    {
      id: 'reason',
      text: 'Almanya\'ya geliş nedenin hangisine daha yakın?',
      options: [
        { key: 'work', label: 'İş için geliyorum', next: 'housing', effects: { facts: { reason: 'work' } } },
        { key: 'study', label: 'Öğrenci olarak geliyorum', next: 'housing', effects: { facts: { reason: 'study' } } },
        { key: 'family', label: 'Aile birleşimi veya aile ile geliyorum', next: 'housing', effects: { facts: { reason: 'family' } } },
      ],
    },
    {
      id: 'housing',
      text: 'Konaklama tarafında başlangıç noktan hangisi?',
      options: [
        { key: 'stable', label: 'Sabit adresim veya uzun süreli konaklamam hazır', next: 'insurance', effects: { facts: { housing: 'stable' } } },
        { key: 'temporary', label: 'Geçici konaklama ile başlayacağım', next: 'insurance', effects: { facts: { housing: 'temporary' } } },
      ],
    },
    {
      id: 'insurance',
      text: 'Sağlık sigortası durumun ne kadar net?',
      options: [
        { key: 'ready', label: 'Başlangıç planım net', next: 'family', effects: { facts: { insurance: 'ready' } } },
        { key: 'partial', label: 'Kısmen biliyorum ama eksik var', next: 'family', effects: { facts: { insurance: 'partial' } } },
        { key: 'none', label: 'Henüz net değil', next: 'family', effects: { facts: { insurance: 'none' } } },
      ],
    },
    {
      id: 'family',
      text: 'Günlük kurulum planında aile/çocuk tarafı ne kadar baskın?',
      options: [
        { key: 'high', label: 'Çocuk, okul veya aile düzeni önemli', next: 'RESULT:PLAN', effects: { facts: { familyNeed: 'high' } } },
        { key: 'medium', label: 'Bazı aile işleri var ama ana konu değil', next: 'RESULT:PLAN', effects: { facts: { familyNeed: 'medium' } } },
        { key: 'low', label: 'Daha çok bireysel kurulum odaklıyım', next: 'RESULT:PLAN', effects: { facts: { familyNeed: 'low' } } },
      ],
    },
  ],
  resolveResult: ({ state }) => {
    const reason = getFact<string>(state, 'reason', 'work');
    const housing = getFact<string>(state, 'housing', 'temporary');
    const insurance = getFact<string>(state, 'insurance', 'partial');
    const familyNeed = getFact<string>(state, 'familyNeed', 'low');

    const steps = [
      `İlk hafta: ${housing === 'stable' ? 'Adres kaydı için gerekli evrakları topla ve Anmeldung randevunu hedefle.' : 'Geçici konaklama ile başlayacaksan kalıcı adres stratejini ilk günden netleştir.'}`,
      `İlk hafta: ${reason === 'work' ? 'İşveren belgelerini, vergi numarası ve sigorta başlangıcı için hazır tut.' : reason === 'study' ? 'Üniversite kayıt ve sağlık sigortası belgelerini tek dosyada topla.' : 'Aile statüsü belgelerini ve kayıt evraklarını birlikte düzenle.'}`,
      `İlk 30 gün: ${insurance === 'ready' ? 'Sağlık sigortası kaydını aktif hale getir ve banka hesabı açılışını buna göre tamamla.' : 'Sağlık sigortası kararını geciktirmeden netleştir; birçok işlem bunu bekler.'}`,
      'İlk 30 gün: Banka hesabı, telefon hattı ve temel sözleşmeleri yerleşik düzene geçir.',
      `30-60 gün: ${reason === 'work' ? 'Vergi sınıfı, bordro ve oturum kartı sürecini takip et.' : reason === 'study' ? 'Öğrenci oturumu, ders kaydı ve şehir içi yaşam kurulumunu oturt.' : 'Aile birleşimi sonrası oturum ve günlük yaşam kayıtlarını tamamla.'}`,
      `60-90 gün: ${familyNeed === 'high' ? 'Okul, kreş, aile doktoru ve mahalle düzenini stabilize etmeye odaklan.' : 'Günlük rutinini, ulaşım kartını ve yerel destek ağını oturt.'}`,
    ];

    return {
      id: 'PLAN',
      title: 'İlk 90 gün aksiyon sıran hazır',
      matchLabel: 'Zaman bazlı plan',
      tone: 'blue',
      summary:
        'Bu plan, aynı anda her şeyi yapmak yerine en bağımlı adımları öne çekmek için oluşturuldu. Önce adres ve sigorta ekseni, sonra banka/oturum, ardından günlük düzen kurulumu gelir.',
      why: [
        'Almanya\'da birçok işlem birbirine belge bağıyla bağlıdır.',
        'İlk günlerde yapılan sıralama hatası, sonraki haftalarda gereksiz gecikme yaratabilir.',
        housing === 'temporary'
          ? 'Geçici konaklama ile başlamak, adres ve kayıt işlerini daha dikkatli planlamanı gerektirir.'
          : 'Sabit adres avantajı ilk haftadaki sürtünmeyi azaltır.',
      ],
      steps,
      caution:
        'Şehirden şehre randevu yoğunluğu değişir. Planı tarih değil, öncelik sırası olarak okumak daha doğrudur.',
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.handbookGermany, OFFICIAL_SOURCES.bamf],
      relatedTools: ['almanyaya-hazir-misin', 'topluluk-ve-danismanlik'],
    };
  },
};
