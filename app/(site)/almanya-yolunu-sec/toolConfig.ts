import { DEFAULT_TOOL_LEGAL_NOTE, OFFICIAL_SOURCES } from '@/lib/tools/catalog';
import type { ToolConfig } from '@/lib/tools/types';

export const toolConfig: ToolConfig = {
  slug: 'almanya-yolunu-sec',
  path: '/almanya-yolunu-sec',
  title: 'Almanya Yolunu Seç Aracı',
  description:
    'Çalışma, Ausbildung, üniversite, aile birleşimi veya serbest çalışma gibi Almanya yolları arasında sana daha uygun başlangıç rotasını bul.',
  intro:
    'Bu araç, Almanya planında ilk büyük kararı vermene yardımcı olur: iş teklifiyle mi ilerlemelisin, iş arama kartı mı düşünmelisin, Ausbildung mu daha gerçekçi, yoksa öğrenci ya da aile birleşimi yolu mu daha uygun?',
  why:
    'Birçok kullanıcı Almanya sürecine vize adıyla değil, dağınık hedeflerle başlıyor. Bu araç hedefini, diplomanı, iş teklifini, maaş seviyeni ve dil durumunu birlikte değerlendirip ilk bakman gereken yolu daraltır.',
  whoFor: [
    'Almanya için henüz hangi ana rotadan ilerlemesi gerektiğine karar veremeyenler.',
    'İş teklifi, diploma veya deneyimi olan ama vize-adım eşleşmesini netleştirmek isteyenler.',
    'Ausbildung, üniversite ve iş arama arasında kalan kullanıcılar.',
  ],
  howItWorks: [
    'Kısa sorularla geliş amacını ve mevcut profilini ölçer.',
    'İş teklifi, diploma, maaş ve dil gibi kritik eşiklere göre seni uygun başlangıç yoluna yönlendirir.',
    'Sonuç ekranında neden bu eşleşmenin çıktığını ve hemen atman gereken adımları gösterir.',
  ],
  legalNote: DEFAULT_TOOL_LEGAL_NOTE,
  estimatedQuestionCount: 5,
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
      question: 'Diplomam yoksa hiç seçenek yok mu?',
      answer:
        'Hayır. Özellikle Ausbildung, bazı mesleki tanınma süreçleri veya belirli deneyim odaklı yollar hâlâ mümkün olabilir.',
    },
  ],
  questions: [
    {
      id: 'goal',
      text: 'Almanya\'ya gitmek istemendeki ana amaç şu an hangisi?',
      options: [
        { key: 'work', label: 'Çalışmak ve kariyer kurmak', next: 'offer' },
        { key: 'study', label: 'Üniversite veya yüksek lisans', next: 'RESULT:STUDENT' },
        { key: 'ausbildung', label: 'Ausbildung ile başlamak', next: 'RESULT:AUSBILDUNG' },
        { key: 'family', label: 'Aile birleşimi ile gitmek', next: 'RESULT:FAMILY' },
        { key: 'self', label: 'Freelance veya serbest çalışmak', next: 'RESULT:FREELANCE' },
      ],
    },
    {
      id: 'offer',
      text: 'Almanya\'dan imzalı iş sözleşmen veya net iş teklifin var mı?',
      options: [
        { key: 'yes', label: 'Evet, iş teklifim var', next: 'degree' },
        { key: 'no', label: 'Hayır, önce iş aramam gerekiyor', next: 'job-search-degree' },
      ],
    },
    {
      id: 'degree',
      text: 'Üniversite diploman tanınmış veya tanınabilir durumda mı?',
      hint: 'Resmi teyit için anabin ve Anerkennung süreçleri ayrıca kontrol edilmelidir.',
      options: [
        { key: 'yes', label: 'Evet, tanınma açısından güçlü durumdayım', next: 'salary' },
        { key: 'no', label: 'Hayır veya süreç belirsiz', next: 'it-experience' },
      ],
    },
    {
      id: 'salary',
      text: 'İş teklifindeki yıllık brüt maaşın hangi aralığa daha yakın?',
      options: [
        { key: 'blue', label: 'Mavi Kart eşiğine yakın veya üstünde', next: 'RESULT:BLUE_CARD' },
        { key: 'mid', label: 'Var ama Mavi Kart için sınırda görünüyor', next: 'RESULT:FACHKRAFTE' },
        { key: 'low', label: 'Henüz maaş seviyesi net değil veya daha düşük', next: 'RESULT:FACHKRAFTE' },
      ],
    },
    {
      id: 'it-experience',
      text: 'BT/yazılım alanında güçlü ve kanıtlanabilir deneyimin var mı?',
      options: [
        { key: 'yes', label: 'Evet, 3+ yıl güçlü BT deneyimim var', next: 'RESULT:IT_SPECIALIST' },
        { key: 'no', label: 'Hayır, o kadar güçlü değil', next: 'RESULT:LIMITED' },
      ],
    },
    {
      id: 'job-search-degree',
      text: 'İş aramaya çıkmadan önce kullanabileceğin tanınmış diploma veya mesleki temel var mı?',
      options: [
        { key: 'yes', label: 'Evet, diploma/mesleki temelim var', next: 'language' },
        { key: 'no', label: 'Hayır, bu tarafım zayıf', next: 'RESULT:LIMITED' },
      ],
    },
    {
      id: 'language',
      text: 'Dil tarafında seni en iyi anlatan seçenek hangisi?',
      options: [
        { key: 'good', label: 'Almanca A1+ veya İngilizce B2+ seviyem var', next: 'RESULT:CHANCENKARTE' },
        { key: 'weak', label: 'Dil tarafım zayıf, önce hazırlık gerekir', next: 'RESULT:LIMITED' },
      ],
    },
  ],
  results: {
    BLUE_CARD: {
      id: 'BLUE_CARD',
      title: 'EU Mavi Kart başlangıçta en güçlü aday görünüyor',
      matchLabel: 'Güçlü başlangıç yolu',
      tone: 'blue',
      summary:
        'İş teklifin, tanınabilir diploma durumun ve maaş seviyen birlikte değerlendirildiğinde ilk bakılması gereken yol EU Mavi Kart görünüyor.',
      why: [
        'İş teklifi ile geliyorsun; bu, süreci doğrudan oturum kategorileri üzerinden netleştirir.',
        'Diploma ve maaş seviyesi Mavi Kart için kritik iki eşiği oluşturur.',
        'Sonraki aşamada asıl iş, maaş eşiklerini ve denklik kanıtını resmi kaynakla doğrulamaktır.',
      ],
      steps: [
        'İş sözleşmendeki maaşın güncel Mavi Kart eşiğini karşılayıp karşılamadığını teyit et.',
        'Diploma tanınabilirliğini anabin veya gerekiyorsa ZAB süreci üzerinden doğrula.',
        'İşvereninle rol tanımı, başlangıç tarihi ve sözleşme dilini netleştir.',
        'Ulusal vize ve sonrasında oturum başvurusu için belge listesini çıkar.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
      relatedTools: ['almanyaya-hazir-misin', 'almanya-maas-beklentisi', 'ilk-90-gun-planlayici'],
    },
    FACHKRAFTE: {
      id: 'FACHKRAFTE',
      title: 'Fachkräfte yolu şu an daha gerçekçi görünüyor',
      matchLabel: 'Net rota',
      tone: 'green',
      summary:
        'İş teklifin güçlü bir avantaj. Maaş veya profilin Mavi Kart kadar net olmasa da nitelikli çalışan rotası daha mantıklı bir başlangıç noktası sunuyor.',
      why: [
        'İşveren desteği olan başvurular genelde en doğrudan yollardan biridir.',
        'Mavi Kart eşiği sınırda olsa bile nitelikli çalışan başvurusu ayrı değerlendirilir.',
        'Belge kalitesi ve meslek denklik tarafı burada belirleyici olacaktır.',
      ],
      steps: [
        'İş teklifinin rol, süre ve ücret kısmını resmi başvuru için temiz hale getir.',
        'Mesleğin düzenlenmişse denklik ihtiyacını netleştir; değilse yine tanınma kanıtlarını hazırla.',
        'Sağlık sigortası, özgeçmiş ve diploma çevirileri gibi temel dosyaları topla.',
        'Başvuru ülkesine göre randevu ve işlem süresini erkenden kontrol et.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.recognition],
      relatedTools: ['almanyaya-hazir-misin', 'kariyer-ve-egitim-rotasi'],
    },
    CHANCENKARTE: {
      id: 'CHANCENKARTE',
      title: 'Chancenkarte senin için mantıklı ilk araştırma yolu olabilir',
      matchLabel: 'Araştırma ve giriş yolu',
      tone: 'yellow',
      summary:
        'Henüz iş teklifin yok ama diploma/mesleki temel ve dil tarafında iş arama odaklı bir profile yakın görünüyorsun. Bu nedenle Chancenkarte tipi bir rota ilk bakışta mantıklı olabilir.',
      why: [
        'İş teklifi olmadan da Almanya pazarına yaklaşmak istiyorsun.',
        'Dil veya eğitim tarafında sıfırdan başlamıyorsun; bu önemli bir avantaj.',
        'Bu yol, profil güçlendirme ve sahada iş arama sürecini bir araya getirir.',
      ],
      steps: [
        'Puan sisteminde seni güçlendiren kriterleri netleştir: dil, yaş, deneyim, Almanya bağlantısı.',
        'Diploma veya mesleki temelinin resmi tanınabilirliğini kontrol et.',
        'İş arama dönemi için finansal planını ve belge dosyanı hazırla.',
        'Paralelde CV, LinkedIn ve Almanya odaklı başvuru setini güncelle.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
      relatedTools: ['almanyada-is-bulma-olasiligi', 'almanyaya-hazir-misin'],
    },
    AUSBILDUNG: {
      id: 'AUSBILDUNG',
      title: 'Ausbildung yolu başlangıç için daha uygun görünüyor',
      matchLabel: 'Pratik rota',
      tone: 'green',
      summary:
        'Özellikle kariyerini Almanya\'da sıfırdan veya daha uygulamalı bir modelle kurmak istiyorsan Ausbildung yolu daha kontrollü bir başlangıç sunabilir.',
      why: [
        'Ausbildung, hem iş dünyasına giriş hem de Almanca/pratik adaptasyon açısından güçlü bir köprü olabilir.',
        'Üniversite veya yüksek maaş eşiği gerektirmeyen daha erişilebilir bir rota olabilir.',
        'Ancak dil seviyesi ve şirketle sözleşme süreci ciddiye alınmalıdır.',
      ],
      steps: [
        'Hedeflediğin meslek alanında açık Ausbildung ilanlarını taramaya başla.',
        'En az temel-orta Almanca seviyesini güçlendirecek bir plan oluştur.',
        'Şirket, okul ve şehir üçlüsünü birlikte değerlendirerek başvurularını daralt.',
        'Sözleşme ve vize belgeleri için erken bir evrak listesi hazırla.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
      relatedTools: ['kariyer-ve-egitim-rotasi', 'almanya-yasam-tarzi-uyumu'],
    },
    STUDENT: {
      id: 'STUDENT',
      title: 'Üniversite veya yüksek lisans yolu öne çıkıyor',
      matchLabel: 'Akademik rota',
      tone: 'blue',
      summary:
        'Hedefin daha çok akademik ilerleme ve sonrasında Almanya iş pazarına geçiş ise üniversite veya yüksek lisans yolu daha doğru başlangıç olabilir.',
      why: [
        'Bu rota, Almanya\'ya giriş amacı ile kariyer hedefini daha uyumlu hale getirir.',
        'Özellikle henüz iş teklifin yoksa düzenli ve öngörülebilir bir geçiş sağlayabilir.',
        'Finansman, kabul süreci ve dil şartları bu yolun ana belirleyicileridir.',
      ],
      steps: [
        'Uygun bölüm ve üniversiteleri kısa listeye indir.',
        'Kabul koşulları, dil şartı ve başvuru takvimini çıkar.',
        'Bloke hesap ve yaşam bütçesi planını erken yap.',
        'Eğitim sonrası iş arama ve oturum geçiş yollarını da baştan incele.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
      relatedTools: ['kariyer-ve-egitim-rotasi', 'ilk-90-gun-planlayici'],
    },
    FAMILY: {
      id: 'FAMILY',
      title: 'Aile birleşimi senin için ana giriş yolu',
      matchLabel: 'Aile temelli rota',
      tone: 'green',
      summary:
        'Senin için ana yol kariyerden çok aile bağı üzerinden şekilleniyor. Bu nedenle ilk odak, eş veya aile üyesinin statüsüne göre aile birleşimi şartlarını netleştirmek olmalı.',
      why: [
        'Aile birleşiminde belirleyici olan şey çoğu zaman iş teklifi değil, Almanya\'daki kişinin statüsüdür.',
        'Dil ve belge tarafı hâlâ önemli olabilir ama başvuru mantığı farklıdır.',
        'Bu yolda en sık hata, aile durumunu netleştirmeden genel çalışma vizesi gibi düşünmektir.',
      ],
      steps: [
        'Almanya\'daki aile üyesinin oturum statüsünü ve gelir/konut durumunu netleştir.',
        'Evlilik, doğum, kayıt belgeleri ve tercümeleri için dosya çıkar.',
        'Gerekli ise A1 Almanca şartını ve muafiyet istisnalarını araştır.',
        'Başvuru ülkesindeki randevu süresini erkenden kontrol et.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.bamf],
      relatedTools: ['ilk-90-gun-planlayici', 'topluluk-ve-danismanlik'],
    },
    FREELANCE: {
      id: 'FREELANCE',
      title: 'Freelance veya serbest çalışma hattı öne çıkıyor',
      matchLabel: 'Bağımsız çalışma rotası',
      tone: 'orange',
      summary:
        'Hedefin işveren sponsorlu bir geçişten çok kendi müşteri ağın veya proje üretimin üzerinden ilerlemek gibi görünüyor. Bu nedenle serbest çalışma hattı önce araştırılması gereken rota.',
      why: [
        'Gelir modeli iş sözleşmesinden değil, müşterilerden veya iş planından besleniyor.',
        'Bu rota daha fazla hazırlık, daha net portföy ve daha güçlü finansal yastık ister.',
        'Vergi, sigorta ve faaliyet türü tarafında kararlar erken verilmelidir.',
      ],
      steps: [
        'Hizmet alanını ve müşteri tipini net bir şekilde yazılılaştır.',
        'Portföy, referans ve gelir planını başvuruya uygun dosyaya dönüştür.',
        'Freiberufler mi yoksa şirket kurulumuna yakın bir model mi daha uygun, bunu ayır.',
        'Vergi ve sağlık sigortası yükümlülüklerini baştan çalış.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
      relatedTools: ['almanya-maas-beklentisi', 'almanya-yasam-tarzi-uyumu'],
    },
    IT_SPECIALIST: {
      id: 'IT_SPECIALIST',
      title: 'BT uzmanı olarak deneyim odaklı yolun olabilir',
      matchLabel: 'Niş ama mümkün rota',
      tone: 'blue',
      summary:
        'Diploma tarafın net değilse bile güçlü ve kanıtlanabilir BT deneyimi seni ayrı bir değerlendirme hattına taşıyabilir.',
      why: [
        'BT tarafında deneyim bazı senaryolarda diplomadan daha belirleyici hale gelir.',
        'Bu yol yine de somut iş teklifi ve iyi belge kalitesi ister.',
        'Rol tanımı ile deneyiminin birebir örtüşmesi önemlidir.',
      ],
      steps: [
        'Referans mektupları, proje çıktıları ve deneyim süreni kanıtlayan belgeleri topla.',
        'İş tanımının teknik rolünle güçlü biçimde örtüştüğünden emin ol.',
        'Dil seviyen ve maaş beklentin için gerçekçi bir başvuru seti hazırla.',
        'Paralelde standart nitelikli çalışan ve freelance alternatiflerini de açık tut.',
      ],
      officialSources: [OFFICIAL_SOURCES.makeItInGermany, OFFICIAL_SOURCES.arbeitsagentur],
      relatedTools: ['almanyada-is-bulma-olasiligi', 'almanya-maas-beklentisi'],
    },
    LIMITED: {
      id: 'LIMITED',
      title: 'Önce profilini güçlendirmen gerekiyor',
      matchLabel: 'Hazırlık öncelikli',
      tone: 'red',
      summary:
        'Şu anki cevaplara göre doğrudan güçlü bir rota öne çıkmıyor. Bu, seçenek yok demek değil; önce dil, eğitim, deneyim veya belge tarafını güçlendirmek gerektiği anlamına geliyor.',
      why: [
        'İş teklifi, tanınabilir yeterlilik veya dil temeli olmadan seçenekler daralır.',
        'Yanlış başvuru yerine önce profil güçlendirmek genelde daha verimli olur.',
        'Ön hazırlık dönemi, sonraki başvuru başarısını belirgin biçimde artırır.',
      ],
      steps: [
        'Dil, evrak ve yeterlilik tarafında en zayıf halkayı belirle.',
        'Kısa vadede seni erişilebilir bir rotaya taşıyacak hedef seç: Ausbildung, dil+hazırlık veya meslek tanınması.',
        'CV ve mesleki portföyünü Almanya formatına yaklaştır.',
        'Hazırlık sürecinde destek almak için danışmanlık kanallarını kullan.',
      ],
      officialSources: [OFFICIAL_SOURCES.bamf, OFFICIAL_SOURCES.recognition, OFFICIAL_SOURCES.mbe],
      relatedTools: ['almanyaya-hazir-misin', 'once-hangi-sorunu-cozmelisin', 'topluluk-ve-danismanlik'],
    },
  },
};

