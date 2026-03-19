import { Profile, Bank, Question } from './types';

export const PROFILES: Record<string, Profile> = {
  DIGITAL: { key: 'DIGITAL', title: 'Dijital (app-first)' },
  DIRECT: { key: 'DIRECT', title: 'Direkt/Online (şubesiz ama klasik)' },
  LOCAL: { key: 'LOCAL', title: 'Yerel/Klasik (şube + danışman)' },
  EXPAT: { key: 'EXPAT', title: 'Expat/Dil-dostu' },
  INVEST: { key: 'INVEST', title: 'Borsa/ETF odaklı' },
  CRYPTO: { key: 'CRYPTO', title: 'Kripto odaklı' },
  LOW_COST: { key: 'LOW_COST', title: 'Masraf hassasiyeti' },
  BRANCH: { key: 'BRANCH', title: 'Şube ihtiyacı' },
};

export const BANKS: Bank[] = [
  {
    id: 'n26',
    name: 'N26',
    type: 'Mobil banka',
    weights: { DIGITAL: 5, DIRECT: 2, EXPAT: 3, INVEST: 3, CRYPTO: 3, LOW_COST: 3, BRANCH: -4, LOCAL: -3 }
  },
  {
    id: 'revolut',
    name: 'Revolut',
    type: 'Fintech (banka/EMI)',
    weights: { DIGITAL: 5, EXPAT: 4, CRYPTO: 4, INVEST: 2, LOW_COST: 2, DIRECT: 1, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: 'ing',
    name: 'ING',
    type: 'Direkt banka',
    weights: { DIRECT: 5, INVEST: 4, LOW_COST: 4, DIGITAL: 2, EXPAT: 1, BRANCH: -3, LOCAL: -2, CRYPTO: 0 }
  },
  {
    id: 'dkb',
    name: 'DKB',
    type: 'Direkt banka',
    weights: { DIRECT: 4, INVEST: 4, LOW_COST: 3, DIGITAL: 2, EXPAT: 1, BRANCH: -3, LOCAL: -2, CRYPTO: 0 }
  },
  {
    id: 'sparkasse',
    name: 'Sparkasse',
    type: 'Yerel banka (şubeli)',
    weights: { LOCAL: 5, BRANCH: 5, INVEST: 2, DIGITAL: 1, DIRECT: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 1 }
  },
  {
    id: 'volksbank',
    name: 'Volksbank / Raiffeisenbank',
    type: 'Yerel banka (şubeli)',
    weights: { LOCAL: 5, BRANCH: 5, INVEST: 2, DIGITAL: 1, DIRECT: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 1 }
  },
  {
    id: 'commerzbank',
    name: 'Commerzbank',
    type: 'Geleneksel banka',
    weights: { LOCAL: 3, BRANCH: 3, DIRECT: 2, INVEST: 3, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'deutschebank',
    name: 'Deutsche Bank',
    type: 'Geleneksel banka',
    weights: { LOCAL: 3, BRANCH: 2, DIRECT: 1, INVEST: 3, DIGITAL: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'traderepublic',
    name: 'Trade Republic',
    type: 'Yatırım uygulaması (broker)',
    weights: { INVEST: 6, LOW_COST: 3, DIGITAL: 3, CRYPTO: 2, DIRECT: 1, EXPAT: 0, BRANCH: -6, LOCAL: -4 }
  },
  {
    id: 'c24',
    name: 'C24 Bank',
    type: 'Direkt banka (app ağırlıklı)',
    weights: { DIGITAL: 4, DIRECT: 4, LOW_COST: 4, EXPAT: 1, INVEST: 1, CRYPTO: 0, BRANCH: -4, LOCAL: -3 }
  },
  {
    id: 'comdirect',
    name: 'comdirect',
    type: 'Direkt banka (Commerzbank grubu)',
    weights: { DIRECT: 4, INVEST: 5, LOW_COST: 2, DIGITAL: 2, EXPAT: 0, CRYPTO: 0, BRANCH: -2, LOCAL: -1 }
  },
  {
    id: 'consorsbank',
    name: 'Consorsbank',
    type: 'Direkt banka / broker (BNP Paribas)',
    weights: { DIRECT: 3, INVEST: 5, LOW_COST: 2, DIGITAL: 2, EXPAT: 0, CRYPTO: 0, BRANCH: -3, LOCAL: -2 }
  },
  {
    id: 'targobank',
    name: 'Targobank',
    type: 'Geleneksel banka (şubeli)',
    weights: { LOCAL: 3, BRANCH: 4, DIRECT: 1, INVEST: 2, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'postbank',
    name: 'Postbank',
    type: 'Geleneksel banka (şubeli)',
    weights: { LOCAL: 3, BRANCH: 4, DIRECT: 1, INVEST: 2, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'hvb',
    name: 'HypoVereinsbank (UniCredit)',
    type: 'Geleneksel banka',
    weights: { LOCAL: 3, BRANCH: 3, DIRECT: 1, INVEST: 3, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'santander',
    name: 'Santander',
    type: 'Banka (şubeli/karma)',
    weights: { LOCAL: 2, BRANCH: 2, DIRECT: 2, INVEST: 1, DIGITAL: 1, LOW_COST: 0, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: 'bunq',
    name: 'bunq',
    type: 'Mobil banka (AB fintech)',
    weights: { DIGITAL: 5, EXPAT: 4, DIRECT: 2, LOW_COST: 1, INVEST: 0, CRYPTO: 0, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: 'tomorrow',
    name: 'Tomorrow',
    type: 'Mobil banka (sürdürülebilir odak)',
    weights: { DIGITAL: 4, DIRECT: 2, LOW_COST: 1, EXPAT: 1, INVEST: 0, CRYPTO: 0, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: 'wise',
    name: 'Wise',
    type: 'Fintech (çoklu para / transfer)',
    weights: { DIGITAL: 4, EXPAT: 5, LOW_COST: 4, DIRECT: 1, INVEST: 0, CRYPTO: 0, BRANCH: -6, LOCAL: -5 }
  },
  {
    id: 'vivid',
    name: 'Vivid Money',
    type: 'Fintech (hesap & kart)',
    weights: { DIGITAL: 4, EXPAT: 3, LOW_COST: 2, DIRECT: 1, INVEST: 1, CRYPTO: 1, BRANCH: -5, LOCAL: -4 }
  },
];

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Profil',
    title: 'Almanya\'da ne zamandır yaşıyorsun?',
    desc: 'Yeni gelenler için dil/kurulum kolaylığı; yerleşik olanlar için şube/danışmanlık ihtiyaçları değişir.',
    type: 'single',
    options: [
      { key: 'new', label: 'Yeni geldim (0–1 yıl)', desc: 'Kurulum hızlı olsun.', add: { EXPAT: 3, DIGITAL: 2, DIRECT: 1 } },
      { key: 'mid', label: '1–5 yıl', desc: 'Dijital + sağlam denge.', add: { DIRECT: 2, DIGITAL: 1 } },
      { key: 'old', label: '5+ yıl', desc: 'Yerel işler de önemli.', add: { LOCAL: 2 } },
    ]
  },
  {
    id: 'q2',
    category: 'Profil',
    title: 'Almanca seviyen nasıl?',
    desc: 'Dil bariyeri varsa expat/dil-dostu ve güçlü uygulama desteği kritik olur.',
    type: 'single',
    options: [
      { key: 'low', label: 'Zayıf / İngilizce tercih', desc: 'Support & UI önemli.', add: { EXPAT: 3, DIGITAL: 2 } },
      { key: 'mid', label: 'Orta', desc: 'Denge.', add: { DIRECT: 2 } },
      { key: 'high', label: 'İyi / çok iyi', desc: 'Klasik bankalar da rahat.', add: { LOCAL: 2 } },
    ]
  },
  {
    id: 'q3',
    category: 'Profil',
    title: 'Yaşadığın yer daha çok…',
    desc: 'Şube/ATM ihtiyacı, yaşadığın lokasyona göre değişir.',
    type: 'single',
    options: [
      { key: 'city', label: 'Büyük şehir merkezi', desc: 'Mobil/dijital çok rahat.', add: { DIGITAL: 2 } },
      { key: 'suburb', label: 'Banliyö', desc: 'Direkt bankalar iyi denge.', add: { DIRECT: 2 } },
      { key: 'town', label: 'Küçük şehir/kasaba', desc: 'Şube yakınlığı önemli olabilir.', add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
  {
    id: 'q4',
    category: 'Şube & Nakit',
    title: 'Şubeye gitme ihtiyacın olur mu?',
    desc: 'Nakit yatırma, danışmanlık, özel işlemler…',
    type: 'single',
    options: [
      { key: 'never', label: 'Asla', desc: 'Tam dijital.', add: { DIGITAL: 3, DIRECT: 1 } },
      { key: 'rare', label: 'Nadiren', desc: 'Arada bir.', add: { DIRECT: 2 } },
      { key: 'often', label: 'Evet, önemli', desc: 'Şube şart.', add: { BRANCH: 4, LOCAL: 3 } },
    ]
  },
  {
    id: 'q5',
    category: 'Masraf & Ücretler',
    title: 'En çok hangisi canını sıkar?',
    desc: 'Birincil ağrı noktanı seç: buna göre öneri keskinleşir.',
    type: 'single',
    options: [
      { key: 'fees', label: 'Yüksek ücretler', desc: 'Masraf hassasiyeti.', add: { LOW_COST: 4 } },
      { key: 'app', label: 'Kötü mobil uygulama', desc: 'App-first.', add: { DIGITAL: 4 } },
      { key: 'support', label: 'Ulaşılamayan destek', desc: 'Şube/telefon önemli.', add: { BRANCH: 3, LOCAL: 1 } },
    ]
  },
  {
    id: 'q6',
    category: 'Masraf & Ücretler',
    title: 'Aylık hesap ücreti konusunda yaklaşımın?',
    desc: 'Ücret toleransı, banka tipini direkt etkiler.',
    type: 'single',
    options: [
      { key: 'nope', label: 'Asla', desc: '0€ hedef.', add: { LOW_COST: 4, DIGITAL: 1, DIRECT: 1 } },
      { key: 'maybe', label: 'Makul olursa', desc: 'Denge.', add: { DIRECT: 2 } },
      { key: 'ok', label: 'Sorun değil', desc: 'Şube/danışmanlık için ödeyebilirim.', add: { LOCAL: 2, BRANCH: 1 } },
    ]
  },
  {
    id: 'q7',
    category: 'Masraf & Ücretler',
    title: 'SEPA havale/transfer sıklığın?',
    desc: 'Sık transfer yapanlar için masraf + hız önemli.',
    type: 'single',
    options: [
      { key: 'often', label: 'Çok sık', desc: 'Masrafsız/hızlı olsun.', add: { LOW_COST: 2, DIGITAL: 2 } },
      { key: 'sometimes', label: 'Ara sıra', desc: 'Denge.', add: { DIRECT: 1 } },
      { key: 'rare', label: 'Nadiren', desc: 'Öncelik başka.', add: { LOCAL: 1 } },
    ]
  },
  {
    id: 'q8',
    category: 'Şube & Nakit',
    title: 'Nakit kullanımı senin için…',
    desc: 'Almanya\'da hâlâ nakit seven çok kişi var 🙂',
    type: 'single',
    options: [
      { key: 'none', label: 'Neredeyse hiç', desc: 'Tam kart.', add: { DIGITAL: 2 } },
      { key: 'some', label: 'Bazen', desc: 'Ara ara.', add: { DIRECT: 1 } },
      { key: 'often', label: 'Sık sık', desc: 'Nakit yatırma/çekme kolay olsun.', add: { BRANCH: 3, LOCAL: 2 } },
    ]
  },
  {
    id: 'q9',
    category: 'Şube & Nakit',
    title: 'ATM yakınlığı/erişimi önemli mi?',
    desc: 'Banliyöde/taşrada ATM ve şube fark yaratır.',
    type: 'single',
    options: [
      { key: 'no', label: 'Değil', desc: 'Dijital yaşam.', add: { DIGITAL: 1 } },
      { key: 'any', label: 'Evet ama fark etmez', desc: 'Genel erişim yeter.', add: { DIRECT: 2 } },
      { key: 'near', label: 'Evet, yakın olsun', desc: 'Yerel ağ avantaj.', add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
  {
    id: 'q10',
    category: 'Kart Tercihi',
    title: 'Kart tercihinde hangisi ağır basıyor?',
    desc: 'Debit vs kredi vs klasik Girocard.',
    type: 'single',
    options: [
      { key: 'debit', label: 'Sadece debit', desc: 'Basit.', add: { DIGITAL: 1 } },
      { key: 'both', label: 'Debit + kredi', desc: 'Esneklik.', add: { DIRECT: 2 } },
      { key: 'giro', label: 'Klasik (Girocard vs.)', desc: 'Yerel uyum.', add: { LOCAL: 2 } },
    ]
  },
  {
    id: 'q11',
    category: 'Yatırım',
    title: 'Borsa/ETF yatırımı yapıyor musun?',
    desc: 'Yatırım odaklı bankalar/brokerlar farklı.',
    type: 'single',
    options: [
      { key: 'active', label: 'Evet, aktif', desc: 'Sık al-sat / düzenli yatırım.', add: { INVEST: 4, LOW_COST: 2 } },
      { key: 'sometimes', label: 'Ara sıra', desc: 'Kolay olsun.', add: { INVEST: 2 } },
      { key: 'no', label: 'Hayır', desc: 'Şimdilik yok.', add: {} },
    ]
  },
  {
    id: 'q12',
    category: 'Yatırım',
    title: 'Yatırımda senin için en önemli şey?',
    desc: 'Komisyon mu, güven mi, kullanım kolaylığı mı?',
    type: 'single',
    options: [
      { key: 'fees', label: 'Düşük komisyon', desc: 'Masraf kritik.', add: { INVEST: 2, LOW_COST: 3 } },
      { key: 'trust', label: 'Banka güvencesi', desc: 'Klasik güven.', add: { LOCAL: 2 } },
      { key: 'easy', label: 'Mobil kolaylık', desc: 'Tek app.', add: { DIGITAL: 2, INVEST: 1 } },
    ]
  },
  {
    id: 'q13',
    category: 'Kripto',
    title: 'Kripto ile ilişkin nedir?',
    desc: 'Kripto aktifse doğru kanal seçimi çok fark eder.',
    type: 'single',
    options: [
      { key: 'active', label: 'Aktif alım-satım', desc: 'Kripto şart.', add: { CRYPTO: 4, DIGITAL: 2 } },
      { key: 'curious', label: 'Merak ediyorum', desc: 'Denemelik.', add: { CRYPTO: 2 } },
      { key: 'none', label: 'Hiç ilgim yok', desc: 'Gerek yok.', add: {} },
    ]
  },
  {
    id: 'q14',
    category: 'Kripto',
    title: 'Kripto nerede dursun istersin?',
    desc: 'Bankada mı, ayrı platformda mı?',
    type: 'single',
    options: [
      { key: 'inbank', label: 'Bankada/uygulamada olsun', desc: 'Tek yer.', add: { CRYPTO: 3, DIGITAL: 1 } },
      { key: 'separate', label: 'Ayrı platform olur', desc: 'Önemli değil.', add: { INVEST: 1 } },
      { key: 'no', label: 'Hiç gerek yok', desc: 'Kapat gitsin.', add: { LOCAL: 1 } },
    ]
  },
  {
    id: 'q15',
    category: 'Kullanım Tercihi',
    title: 'Finansı tek uygulamada mı yönetmek istersin?',
    desc: 'Bankacılık + yatırım + kripto gibi.',
    type: 'single',
    options: [
      { key: 'one', label: 'Evet, tek uygulama', desc: 'Basit.', add: { DIGITAL: 3 } },
      { key: 'any', label: 'Fark etmez', desc: 'Denge.', add: { DIRECT: 1 } },
      { key: 'separate', label: 'Ayrı olsun', desc: 'Daha kontrollü.', add: { LOCAL: 1 } },
    ]
  },
  {
    id: 'q16',
    category: 'Kullanım Tercihi',
    title: 'Banka seçerken en önemli kriter hangisi?',
    desc: 'Tek bir şey seç: algoritma bunu \'weight\' gibi kullanır.',
    type: 'single',
    options: [
      { key: 'trust', label: 'Güven & köklülük', desc: 'Klasik.', add: { LOCAL: 3, BRANCH: 1 } },
      { key: 'speed', label: 'Hız & teknoloji', desc: 'Modern.', add: { DIGITAL: 3 } },
      { key: 'balance', label: 'Dengeli olsun', desc: 'Direkt bankalar.', add: { DIRECT: 3 } },
    ]
  },
  {
    id: 'q17',
    category: 'Güven & Destek',
    title: 'Müşteri hizmetlerine erişim beklentin?',
    desc: 'Telefon/şube/online chat farkı.',
    type: 'single',
    options: [
      { key: 'high', label: 'Çok önemli', desc: 'Ulaşayım.', add: { BRANCH: 3, LOCAL: 1 } },
      { key: 'mid', label: 'Orta', desc: 'Ara sıra.', add: { DIRECT: 2 } },
      { key: 'low', label: 'Hiç önemli değil', desc: 'Self-serve.', add: { DIGITAL: 2 } },
    ]
  },
  {
    id: 'q18',
    category: 'Güven & Destek',
    title: 'Hesabın bloke/kapanma riski seni ne kadar gerer?',
    desc: 'KYC/AML süreçleri bazı fintechlerde daha sert hissedilebilir.',
    type: 'single',
    options: [
      { key: 'yes', label: 'Evet, çok gerer', desc: 'Daha klasik isterim.', add: { LOCAL: 2, DIRECT: 1 } },
      { key: 'some', label: 'Biraz', desc: 'Denge.', add: { DIRECT: 1 } },
      { key: 'no', label: 'Hayır', desc: 'Sorun değil.', add: { DIGITAL: 1 } },
    ]
  },
  {
    id: 'q19',
    category: 'Güven & Destek',
    title: 'Banka değiştirmeye ne kadar açıksın?',
    desc: 'Esneklik yüksekse fintech/dijital daha mantıklı olur.',
    type: 'single',
    options: [
      { key: 'open', label: 'Çok açık', desc: 'Deneyeyim.', add: { DIGITAL: 2 } },
      { key: 'maybe', label: 'Gerekirse', desc: 'Denge.', add: { DIRECT: 1 } },
      { key: 'hard', label: 'Zor', desc: 'Kök saldım.', add: { LOCAL: 2 } },
    ]
  },
  {
    id: 'q20',
    category: 'Genel Tercih',
    title: 'İdeal banka senin için hangisi?',
    desc: 'Son soru: içgüdüsel tercihin.',
    type: 'single',
    options: [
      { key: 'free', label: 'Masrafsız & mobil', desc: '0€ + iyi app.', add: { DIGITAL: 2, LOW_COST: 2 } },
      { key: 'balanced', label: 'Dengeli & güvenli', desc: 'Online ama sağlam.', add: { DIRECT: 2 } },
      { key: 'branch', label: 'Şubeli & klasik', desc: 'Yüz yüze.', add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
];
