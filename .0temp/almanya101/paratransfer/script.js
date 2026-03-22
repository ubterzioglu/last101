// almanya101 — TR ↔ DE Para Transferi Seçim Aracı (20 soru)
// v3: Kategori/profil değil, doğrudan "sistem" önerir (Top 3) + skorlar.
// Not: Bu araç yönlendirme amaçlıdır; ücret/kur/limit ve KYC koşulları sağlayıcıya göre değişir.

/* =====================================================
   1) SİSTEM HAVUZU (30+ gerçek sistem)
   ===================================================== */

const SYSTEMS = [
  // Fintech / Transfer services
  {
    id: "wise", name: "Wise", tags: ["Fintech", "Düşük maliyet", "Online"], color: "purple",
    a: { cost: 5, speed: 4, online: 5, cash: 1, multi: 5, official: 3, business: 4, simple: 4, weekend: 4, limits: 4, promos: 2 }
  },
  {
    id: "remitly", name: "Remitly", tags: ["Fintech", "Hızlı", "TR↔DE"], color: "",
    a: { cost: 4, speed: 4, online: 4, cash: 3, multi: 2, official: 2, business: 2, simple: 4, weekend: 4, limits: 3, promos: 3 }
  },
  {
    id: "transfergo", name: "TransferGo", tags: ["Fintech", "Hızlı", "Online"], color: "",
    a: { cost: 4, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 3 }
  },
  {
    id: "paysend", name: "Paysend", tags: ["Fintech", "Kart/IBAN", "Online"], color: "",
    a: { cost: 3, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "worldremit", name: "WorldRemit", tags: ["Fintech", "Nakit opsiyon", "Online"], color: "",
    a: { cost: 3, speed: 3, online: 4, cash: 4, multi: 1, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "ria", name: "RIA Money Transfer", tags: ["Ağ", "Nakit opsiyon", "TR"], color: "red",
    a: { cost: 3, speed: 3, online: 3, cash: 5, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "xoom", name: "Xoom (PayPal)", tags: ["PayPal", "Hızlı", "Online"], color: "",
    a: { cost: 2, speed: 4, online: 4, cash: 2, multi: 1, official: 2, business: 2, simple: 4, weekend: 4, limits: 2, promos: 1 }
  },
  {
    id: "skrill", name: "Skrill Money Transfer", tags: ["Cüzdan", "Online", "Kart"], color: "",
    a: { cost: 2, speed: 3, online: 4, cash: 1, multi: 2, official: 2, business: 1, simple: 3, weekend: 3, limits: 2, promos: 2 }
  },
  {
    id: "smallworld", name: "Small World FS", tags: ["Ağ", "Nakit opsiyon", "Online"], color: "red",
    a: { cost: 3, speed: 3, online: 3, cash: 4, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "taptap", name: "Taptap Send", tags: ["Hızlı", "Mobil", "Online"], color: "",
    a: { cost: 3, speed: 4, online: 4, cash: 1, multi: 1, official: 2, business: 1, simple: 4, weekend: 4, limits: 2, promos: 3 }
  },

  // Cash pickup networks
  {
    id: "western_union", name: "Western Union", tags: ["Nakit teslim", "Şube ağı", "Global"], color: "red",
    a: { cost: 2, speed: 4, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 4, limits: 4, promos: 1 }
  },
  {
    id: "moneygram", name: "MoneyGram", tags: ["Nakit teslim", "Şube ağı", "Global"], color: "red",
    a: { cost: 2, speed: 3, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "ptt", name: "PTT Uluslararası Para Transferi", tags: ["TR", "Nakit/hesap", "Şube"], color: "red",
    a: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 3, business: 1, simple: 2, weekend: 1, limits: 2, promos: 0 }
  },
  {
    id: "upt", name: "UPT (Ulaşım Para Transferi)", tags: ["TR", "Nakit ağ", "Hızlı"], color: "red",
    a: { cost: 2, speed: 3, online: 2, cash: 4, multi: 0, official: 2, business: 1, simple: 3, weekend: 2, limits: 2, promos: 1 }
  },
  {
    id: "euronet", name: "Euronet / Ria Network", tags: ["Nokta ağı", "Nakit", "Erişim"], color: "red",
    a: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 2, business: 1, simple: 2, weekend: 2, limits: 2, promos: 0 }
  },

  // Multi-currency / digital banks
  {
    id: "revolut", name: "Revolut", tags: ["Dijital banka", "Çoklu döviz", "Kart"], color: "purple",
    a: { cost: 4, speed: 3, online: 5, cash: 0, multi: 5, official: 3, business: 2, simple: 4, weekend: 4, limits: 3, promos: 2 }
  },
  {
    id: "n26", name: "N26", tags: ["Dijital banka", "DE IBAN", "Basit"], color: "purple",
    a: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 5, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "bunq", name: "bunq", tags: ["Dijital banka", "IBAN", "Uygulama"], color: "purple",
    a: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 4, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "vivid", name: "Vivid Money", tags: ["Dijital banka", "Kart", "Uygulama"], color: "purple",
    a: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 3, business: 1, simple: 4, weekend: 3, limits: 2, promos: 2 }
  },
  {
    id: "paysera", name: "Paysera", tags: ["Hesap", "Transfer", "Çoklu döviz"], color: "purple",
    a: { cost: 3, speed: 3, online: 4, cash: 1, multi: 4, official: 3, business: 3, simple: 3, weekend: 2, limits: 3, promos: 1 }
  },

  // Banks (TR + DE)
  {
    id: "ziraat", name: "Ziraat Bankası", tags: ["Banka", "TR/DE", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "isbank", name: "İş Bankası", tags: ["Banka", "SWIFT", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "garanti", name: "Garanti BBVA", tags: ["Banka", "SWIFT", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "akbank", name: "Akbank", tags: ["Banka", "SWIFT", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "halkbank", name: "Halkbank", tags: ["Banka", "SWIFT", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "vakif", name: "VakıfBank", tags: ["Banka", "SWIFT", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "deutsche", name: "Deutsche Bank", tags: ["Banka", "DE", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "commerz", name: "Commerzbank", tags: ["Banka", "DE", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "sparkasse", name: "Sparkasse", tags: ["Banka", "DE", "Yerel"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "volksbank", name: "Volksbank / Raiffeisenbank", tags: ["Banka", "DE", "Yerel"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },

  // Business variants (kept as distinct so "iş" senaryosunda öne çıkar)
  {
    id: "wise_business", name: "Wise Business", tags: ["Business", "Fintech", "Uyum"], color: "purple",
    a: { cost: 4, speed: 3, online: 5, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 3, limits: 4, promos: 1 }
  },
  {
    id: "paysera_business", name: "Paysera Business", tags: ["Business", "Hesap", "Uyum"], color: "purple",
    a: { cost: 3, speed: 3, online: 4, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 2, limits: 4, promos: 1 }
  },
  {
    id: "db_business", name: "Deutsche Bank Business", tags: ["Business", "Banka", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "commerz_business", name: "Commerzbank Business", tags: ["Business", "Banka", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "sparkasse_business", name: "Sparkasse Business", tags: ["Business", "Banka", "Resmi"], color: "red",
    a: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },

  // Crypto (opsiyonel — düşük öncelik)
  {
    id: "binance", name: "Binance", tags: ["Kripto", "Risk", "Hızlı"], color: "red",
    a: { cost: 3, speed: 3, online: 5, cash: 0, multi: 2, official: 0, business: 0, simple: 1, weekend: 5, limits: 4, promos: 0 }
  },
  {
    id: "coinbase", name: "Coinbase", tags: ["Kripto", "Risk", "Platform"], color: "red",
    a: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 }
  },
  {
    id: "kraken", name: "Kraken", tags: ["Kripto", "Risk", "Platform"], color: "red",
    a: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 }
  },
];

/* =====================================================
   2) SORULAR (layout bozulmasın diye aynı yapı)
   ===================================================== */

const QUESTIONS = [
  {
    id: "q1",
    title: "Gönderim yönü hangisi?",
    desc: "Yöntem seçimi iki yönde de benzer olsa da bazı servisler tek yönde daha iyi olabilir.",
    type: "single",
    options: [
      { key: "tr_to_de", label: "Türkiye → Almanya", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 1 } },
      { key: "de_to_tr", label: "Almanya → Türkiye", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 1 } },
      { key: "both", label: "İkisi de (düzenli)", add: { MULTICURRENCY: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q2",
    title: "Transfer sıklığın nasıl?",
    desc: "Sık transferlerde “kur farkı + düşük ücret” toplam maliyette daha belirleyici olur.",
    type: "single",
    options: [
      { key: "weekly", label: "Haftalık / çok sık", add: { MULTICURRENCY: 3, TRANSFER_SERVICE: 3 } },
      { key: "monthly", label: "Aylık", add: { TRANSFER_SERVICE: 3, MULTICURRENCY: 2 } },
      { key: "rare", label: "Nadiren", add: { BANK_SWIFT: 2, TRANSFER_SERVICE: 1 } },
    ]
  },
  {
    id: "q3",
    title: "Tutarlar genelde ne seviyede?",
    desc: "Yüksek tutarda bankalar/uyum süreçleri ve limitler daha kritik olabilir.",
    type: "single",
    options: [
      { key: "small", label: "Küçük (örn. < 500€)", add: { TRANSFER_SERVICE: 3, CASH_PICKUP: 1 } },
      { key: "mid", label: "Orta (örn. 500€–3.000€)", add: { TRANSFER_SERVICE: 3, BANK_SWIFT: 1 } },
      { key: "large", label: "Yüksek (örn. > 3.000€)", add: { BANK_SWIFT: 3, BUSINESS: 2 } },
    ]
  },
  {
    id: "q4",
    title: "En kritik şey hangisi?",
    desc: "Birincil hedefini seç: maliyet mi hız mı basitlik mi?",
    type: "single",
    options: [
      { key: "cost", label: "En düşük toplam maliyet", add: { TRANSFER_SERVICE: 4, MULTICURRENCY: 2 } },
      { key: "speed", label: "Hız (aynı gün/ertesi gün)", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2 } },
      { key: "simplicity", label: "En basit süreç", add: { BANK_SWIFT: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q5",
    title: "Alıcı (veya sen) bankaya gitmeden tamamen online olsun istiyor mu?",
    desc: "Tam online kullanım genelde transfer servisleri / çoklu döviz hesaplarda daha rahattır.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 3, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 2, CASH_PICKUP: 2 } }
  },
  {
    id: "q6",
    title: "Alıcının banka hesabı var mı (IBAN)?",
    desc: "IBAN yoksa nakit teslim/ağ çözümleri devreye girebilir.",
    type: "single",
    options: [
      { key: "yes_iban", label: "Evet, IBAN var", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2, MULTICURRENCY: 1 } },
      { key: "no_iban", label: "Hayır, IBAN yok / kullanmak istemiyor", add: { CASH_PICKUP: 5 } },
      { key: "sometimes", label: "Bazen var bazen yok", add: { CASH_PICKUP: 3, TRANSFER_SERVICE: 2 } },
    ]
  },
  {
    id: "q7",
    title: "Alıcı nakit çekmek/teslim almak istiyor mu?",
    desc: "Nakit teslim opsiyonu isteyenlerde transfer ağı kritik olur.",
    type: "yesno",
    weight: { yes: { CASH_PICKUP: 5 }, no: { TRANSFER_SERVICE: 2, BANK_SWIFT: 2 } }
  },
  {
    id: "q8",
    title: "Kur farkı (spread) senin için çok önemli mi?",
    desc: "Bazı yöntemlerde “gizli maliyet” kur farkında saklı olabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 4, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q9",
    title: "Belgeler/uyum (kaynak, amaç, fatura) göstermen gerekebilir mi?",
    desc: "Yüksek tutar ve iş transferlerinde bu daha sık görülür.",
    type: "yesno",
    weight: { yes: { BUSINESS: 4, BANK_SWIFT: 2 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q10",
    title: "Gönderimde açıklama/fatura/referans gibi alanlar kritik mi?",
    desc: "İş, kira, eğitim, kurumsal süreçlerde açıklama alanı önemli olabilir.",
    type: "yesno",
    weight: { yes: { BUSINESS: 3, BANK_SWIFT: 2 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q11",
    title: "Aynı gün içinde kesin teslim istiyor musun?",
    desc: "Kesin süre beklentisi varsa hızlı kanallar öne çıkar; SWIFT bazen daha değişken olabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 2, CASH_PICKUP: 1 }, no: { BANK_SWIFT: 1, MULTICURRENCY: 1 } }
  },
  {
    id: "q12",
    title: "Hafta sonu/mesai dışı gönderim yapıyor musun?",
    desc: "Bazı bankalar mesai dışı daha sınırlı çalışabilir.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 2, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q13",
    title: "Sık sık TRY ve EUR bakiyesi tutuyor musun (maaş+harcama gibi)?",
    desc: "Çoklu döviz hesapları (bakiyeli) bu senaryoda avantajlı olabilir.",
    type: "yesno",
    weight: { yes: { MULTICURRENCY: 5 }, no: { TRANSFER_SERVICE: 1 } }
  },
  {
    id: "q14",
    title: "Kullanım kolaylığı için 'tek uygulama' (hesap+karta kadar) ister misin?",
    desc: "Bazı çözümler kart+hesap+transferi tek yerde toplar.",
    type: "yesno",
    weight: { yes: { MULTICURRENCY: 3, TRANSFER_SERVICE: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q15",
    title: "Kripto kullanmayı düşünüyor musun?",
    desc: "Bu yol daha riskli/karmaşık olabilir; sadece bilinçli kullanıcılar için anlamlıdır.",
    type: "single",
    options: [
      { key: "no", label: "Hayır", add: { TRANSFER_SERVICE: 1, BANK_SWIFT: 1 } },
      { key: "maybe", label: "Belki / emin değilim", add: { CRYPTO: 1 } },
      { key: "yes", label: "Evet (riskleri biliyorum)", add: { CRYPTO: 5 } },
    ]
  },
  {
    id: "q16",
    title: "Senin için önemli olan hangisi?",
    desc: "Bazı servisler düşük ücret gösterip kurdan kazanır, bazıları tam tersi. Bu soru 'toplam maliyet' hassasiyetini ölçer.",
    type: "single",
    options: [
      { key: "total_cost", label: "Toplam maliyet (kur + ücret)", add: { TRANSFER_SERVICE: 4, MULTICURRENCY: 3 } },
      { key: "visible_fee", label: "Görünen düşük ücret", add: { BANK_SWIFT: 2 } },
      { key: "dont_know", label: "Fikrim yok / kararsızım", add: { TRANSFER_SERVICE: 1 } }
    ]
  },
  {
    id: "q17",
    title: "Transfer limitleri senin için sorun oluyor mu?",
    desc: "Günlük/aylık limitler bazı yöntemlerde kısıtlayıcı olabilir. Büyük tutar veya sık transferlerde daha belirginleşir.",
    type: "yesno",
    weight: { yes: { BANK_SWIFT: 3, BUSINESS: 2 }, no: { TRANSFER_SERVICE: 2 } }
  },
  {
    id: "q18",
    title: "Transferin resmi kayıtlarda görünmesi senin için önemli mi?",
    desc: "Kira, eğitim, iş ödemeleri gibi senaryolarda resmi kayıt ve açıklama alanları kritik olabilir.",
    type: "single",
    options: [
      { key: "important", label: "Evet, resmi olmalı", add: { BANK_SWIFT: 3, BUSINESS: 3 } },
      { key: "neutral", label: "Fark etmez", add: { TRANSFER_SERVICE: 1 } },
      { key: "not_important", label: "Çok umurumda değil", add: { CASH_PICKUP: 2, CRYPTO: 2 } }
    ]
  },
  {
    id: "q19",
    title: "Kampanya/bonus/indirim senin için önemli mi?",
    desc: "Bazı servisler dönemsel olarak sıfır ücret veya daha iyi kur kampanyaları yapabilir. Bu, seçim önceliğini etkiler.",
    type: "yesno",
    weight: { yes: { TRANSFER_SERVICE: 3, MULTICURRENCY: 2 }, no: { BANK_SWIFT: 1 } }
  },
  {
    id: "q20",
    title: "Teknoloji/dijital uygulama kullanımı konusunda nasılsın?",
    desc: "Uygulama ağırlıklı çözümler herkese uygun olmayabilir. Süreci ne kadar rahat yönettiğini ölçer.",
    type: "single",
    options: [
      { key: "advanced", label: "İyiyim, teknolojiyle aram iyi", add: { MULTICURRENCY: 3, TRANSFER_SERVICE: 2, CRYPTO: 1 } },
      { key: "normal", label: "Normal kullanıcıyım", add: { TRANSFER_SERVICE: 2, BANK_SWIFT: 1 } },
      { key: "low", label: "Basit olsun isterim", add: { BANK_SWIFT: 3 } }
    ]
  }

];

const state = { index: 0, answers: {} };

const el = {
  qTitle: document.getElementById("qTitle"),
  qDesc: document.getElementById("qDesc"),
  answers: document.getElementById("answers"),
  backBtn: document.getElementById("backBtn"),
  editBtn: document.getElementById("editBtn"),
  restartBtn: document.getElementById("restartBtn"),
  resultCard: document.getElementById("resultCard"),
  resultActionsCard: document.getElementById("resultActionsCard"),
  questionCard: document.getElementById("questionCard"),
  resultBoxes: document.getElementById("resultBoxes"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  copyBtn: document.getElementById("copyBtn"),
  hintText: document.getElementById("hintText"),
};

function init() {
  bindEvents();
  render();
  initInfoToggle();
}

function initInfoToggle() {
  const toggleBtn = document.getElementById("toggleInfo");
  const infoBody = document.getElementById("infoBody");

  if (!toggleBtn || !infoBody) return;

  function toggleSection({ btn, body, showText, hideText }) {
    const willShow = body.classList.contains("hidden");
    body.classList.toggle("hidden", !willShow);
    body.setAttribute("aria-hidden", String(!willShow));
    btn.textContent = willShow ? hideText : showText;
  }

  function setToggleUI(btn, body, showText, hideText) {
    const isHidden = body.classList.contains("hidden");
    body.setAttribute("aria-hidden", String(isHidden));
    btn.textContent = isHidden ? showText : hideText;
  }

  toggleBtn.addEventListener("click", () => toggleSection({
    btn: toggleBtn,
    body: infoBody,
    showText: "Bilgi Aç",
    hideText: "Bilgi Kapat"
  }));

  setToggleUI(toggleBtn, infoBody, "Bilgi Aç", "Bilgi Kapat");
}

function bindEvents() {
  el.backBtn.addEventListener("click", () => {
    if (state.index > 0) {
      state.index--;
      render();
    }
  });

  el.editBtn.addEventListener("click", resetAll);
  el.restartBtn.addEventListener("click", resetAll);

  el.copyBtn.addEventListener("click", async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      el.copyBtn.textContent = "Kopyalandı";
      setTimeout(() => (el.copyBtn.textContent = "Sonucu kopyala"), 1200);
    } catch {
      alert("Kopyalama başarısız. Tarayıcı izinlerini kontrol et.");
    }
  });
}

function resetAll() {
  state.index = 0;
  state.answers = {};
  el.resultCard.classList.add("hidden");
  el.resultActionsCard.classList.add("hidden");
  if (el.questionCard) el.questionCard.classList.remove("hidden");
  el.copyBtn.textContent = "Sonucu kopyala";
  render();
}

function render() {
  el.resultCard.classList.add("hidden");
  if (el.questionCard) el.questionCard.classList.remove("hidden");

  const q = QUESTIONS[state.index];
  el.qTitle.textContent = q.title;
  el.qDesc.textContent = q.desc || "";

  renderAnswers(q);
  renderNav();
  renderProgress();
}

function renderAnswers(q) {
  el.answers.innerHTML = "";
  const selected = state.answers[q.id];

  if (q.type === "yesno") {
    const opts = [
      { key: "yes", label: "Evet", desc: "Bana uyuyor." },
      { key: "no", label: "Hayır", desc: "Bana uymuyor." },
    ];
    opts.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i + 1, selected === o.key)));
    return;
  }

  if (q.type === "single") {
    q.options.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i + 1, selected === o.key)));
    return;
  }
}

function answerCard(q, option, badge, isSelected) {
  const wrap = document.createElement("div");
  wrap.className = `answer ${isSelected ? "selected" : ""}`;
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");

  wrap.innerHTML = `
    <div class="badge">${badge}</div>
    <div>
      <div class="answer-title">${option.label}</div>
      ${option.desc ? `<p class="answer-desc">${option.desc}</p>` : ``}
    </div>
  `;

  const select = () => {
    state.answers[q.id] = option.key;
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      render();
    } else {
      showResult();
    }
  };

  wrap.addEventListener("click", select);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select();
    }
  });

  return wrap;
}

function renderNav() {
  el.backBtn.disabled = state.index === 0;
  el.hintText.textContent = "Bir şık seçince otomatik ilerler.";
}

function renderProgress() {
  const current = state.index + 1;
  const total = QUESTIONS.length;
  el.progressText.textContent = `Soru ${current} / ${total}`;
  el.progressBar.style.width = `${Math.round((current / total) * 100)}%`;
}

/* =====================================================
   3) SKORLAMA — Cevaplardan “tercih vektörü” çıkar
   ===================================================== */

function derivePrefs() {
  const a = state.answers;

  const prefs = {
    cost: 0,
    speed: 0,
    simple: 0,
    online: 0,
    cash: 0,
    multi: 0,
    official: 0,
    business: 0,
    weekend: 0,
    limits: 0,
    promos: 0,
    risk_ok: 0,
  };

  // q4: primary goal
  if (a.q4 === "cost") prefs.cost += 6;
  if (a.q4 === "speed") prefs.speed += 6;
  if (a.q4 === "simplicity") prefs.simple += 6;

  // q5: online
  if (a.q5 === "yes") prefs.online += 5;
  if (a.q5 === "no") prefs.simple += 2;

  // q6 + q7: IBAN / cash pickup
  if (a.q6 === "no_iban") prefs.cash += 8;
  if (a.q6 === "sometimes") prefs.cash += 4;
  if (a.q7 === "yes") prefs.cash += 8;

  // q8: FX spread sensitivity
  if (a.q8 === "yes") prefs.cost += 4;

  // q9 + q10: compliance/docs and reference fields
  if (a.q9 === "yes") { prefs.business += 5; prefs.official += 3; }
  if (a.q10 === "yes") { prefs.business += 3; prefs.official += 3; }

  // q11: same-day desire
  if (a.q11 === "yes") prefs.speed += 3;

  // q12: weekend
  if (a.q12 === "yes") prefs.weekend += 4;

  // q13 + q14: multi-currency + one-app
  if (a.q13 === "yes") prefs.multi += 8;
  if (a.q14 === "yes") prefs.multi += 4;

  // q2: frequency
  if (a.q2 === "weekly") { prefs.cost += 2; prefs.multi += 2; prefs.online += 1; }
  if (a.q2 === "monthly") { prefs.cost += 1; prefs.online += 1; }
  if (a.q2 === "rare") { prefs.simple += 1; prefs.official += 1; }

  // q3: amount size
  if (a.q3 === "large") { prefs.official += 3; prefs.business += 2; prefs.limits += 4; }
  if (a.q3 === "mid") { prefs.limits += 2; }
  if (a.q3 === "small") { prefs.cost += 1; prefs.online += 1; }

  // q16: cost view
  if (a.q16 === "total_cost") prefs.cost += 5;
  if (a.q16 === "visible_fee") prefs.official += 1;

  // q17: limits problem
  if (a.q17 === "yes") prefs.limits += 4;

  // q18: official record importance
  if (a.q18 === "important") prefs.official += 6;
  if (a.q18 === "not_important") prefs.cash += 1;

  // q19: promotions
  if (a.q19 === "yes") prefs.promos += 4;

  // q20: tech comfort
  if (a.q20 === "advanced") { prefs.online += 2; prefs.multi += 1; }
  if (a.q20 === "low") { prefs.simple += 3; }

  // q15: crypto appetite
  if (a.q15 === "yes") prefs.risk_ok += 8;
  if (a.q15 === "maybe") prefs.risk_ok += 2;

  // Clamp to reasonable range (0..15)
  for (const k of Object.keys(prefs)) prefs[k] = Math.max(0, Math.min(15, prefs[k]));
  return prefs;
}

function scoreSystem(sys, prefs) {
  // If user doesn't want risk, softly penalize crypto systems
  const isCrypto = sys.tags.some(t => t.toLowerCase().includes("kripto"));
  const riskPenalty = (isCrypto && prefs.risk_ok < 6) ? 12 : 0;

  const w = {
    cost: prefs.cost,
    speed: prefs.speed,
    simple: prefs.simple,
    online: prefs.online,
    cash: prefs.cash,
    multi: prefs.multi,
    official: prefs.official,
    business: prefs.business,
    weekend: prefs.weekend,
    limits: prefs.limits,
    promos: prefs.promos,
  };

  let raw = 0;
  raw += w.cost * sys.a.cost;
  raw += w.speed * sys.a.speed;
  raw += w.simple * sys.a.simple;
  raw += w.online * sys.a.online;
  raw += w.cash * sys.a.cash;
  raw += w.multi * sys.a.multi;
  raw += w.official * sys.a.official;
  raw += w.business * sys.a.business;
  raw += w.weekend * sys.a.weekend;
  raw += w.limits * sys.a.limits;
  raw += w.promos * sys.a.promos;

  raw -= riskPenalty;

  // Small bias: if user strongly wants cash, and system is pure bank/digital with no cash, penalize a bit
  if (prefs.cash >= 8 && sys.a.cash === 0) raw -= 40;

  return raw;
}

function normalizeScores(scored) {
  const values = scored.map(s => s.raw);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return scored.map(s => {
    let n = 80;
    if (max !== min) {
      const t = (s.raw - min) / (max - min);
      // Map to 60..95 to feel "realistic"
      n = Math.round(60 + t * 35);
    }
    return { ...s, score: n };
  });
}

function pickTop3Systems(all) {
  // Tie-break preference: safer/common systems first
  const prio = {
    "Wise": 100, "Wise Business": 98, "Revolut": 95, "Remitly": 92, "TransferGo": 90,
    "Paysend": 88, "N26": 86, "WorldRemit": 84, "RIA Money Transfer": 82,
    "Western Union": 80, "MoneyGram": 78, "Ziraat Bankası": 76, "İş Bankası": 74
  };

  const arr = [...all].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const pa = prio[a.name] || 0;
    const pb = prio[b.name] || 0;
    return pb - pa;
  });

  return arr.slice(0, 3);
}

function topDrivers(prefs, n = 4) {
  const entries = Object.entries(prefs)
    .filter(([k, v]) => v > 0 && k !== "risk_ok")
    .sort((a, b) => b[1] - a[1]);
  return entries.slice(0, n).map(([k]) => k);
}

function driverLabel(k) {
  const map = {
    cost: "Toplam maliyet",
    speed: "Hız",
    simple: "Basitlik",
    online: "Tam online",
    cash: "Nakit/IBAN yok",
    multi: "Çoklu döviz",
    official: "Resmi kayıt",
    business: "İş/uyum",
    weekend: "Hafta sonu",
    limits: "Yüksek limit",
    promos: "Kampanya/indirim",
  };
  return map[k] || k;
}

function buildChipsForSystem(sys, prefs) {
  const chips = [];
  const d = topDrivers(prefs, 3);

  // show top 2 drivers as chips
  d.slice(0, 2).forEach(k => chips.push(`${driverLabel(k)}: ${prefs[k] >= 8 ? "Yüksek" : "Orta"}`));

  // show system tags as additional chips (max 4)
  sys.tags.slice(0, 3).forEach(t => chips.push(t));

  return chips.slice(0, 6);
}

function buildWhy(sys, prefs) {
  const d = topDrivers(prefs, 4);
  const bullets = [];

  if (d.includes("cash") && sys.a.cash >= 4) {
    bullets.push("Alıcı IBAN kullanmıyorsa veya nakit teslim gerekiyorsa güçlü seçenek.");
  }
  if (d.includes("cost") && sys.a.cost >= 4) {
    bullets.push("Toplam maliyet (kur + ücret) hassasiyetinde genelde avantajlı seçeneklerden.");
  }
  if (d.includes("multi") && sys.a.multi >= 4) {
    bullets.push("TRY ve EUR bakiyesi tutup doğru zamanda dönüştürmek isteyenlere uygun.");
  }
  if (d.includes("official") && sys.a.official >= 4) {
    bullets.push("Resmi kayıt/amaç açıklaması gereken senaryolara daha uyumlu.");
  }
  if (d.includes("business") && sys.a.business >= 4) {
    bullets.push("İş/serbest transferlerde fatura–uyum (KYC/AML) tarafı daha düzenli ilerleyebilir.");
  }
  if (d.includes("speed") && sys.a.speed >= 4) {
    bullets.push("Hız önceliğinde (aynı gün/ertesi gün) daha güçlü bir seçenek olabilir.");
  }
  if (d.includes("simple") && sys.a.simple >= 4) {
    bullets.push("Basit kullanım (az adım, net süreç) tarafında öne çıkar.");
  }

  // Fallbacks
  if (bullets.length < 2) bullets.push("Cevaplarına göre bu sistem senin önceliklerine genel olarak daha iyi uyuyor.");
  if (bullets.length < 3) bullets.push("Son karar öncesi aynı tutarı farklı sistemlerde ‘toplam maliyet’ ile kıyasla.");

  // Gentle caution
  const isCrypto = sys.tags.some(t => t.toLowerCase().includes("kripto"));
  if (isCrypto) bullets.push("Kripto; volatilite, platform riski ve vergi/uyum nedeniyle daha yüksek risk içerir.");

  return bullets.slice(0, 4);
}

function labelForRank(idx) {
  if (idx === 0) return "Ana öneri";
  if (idx === 1) return "Alternatif";
  return "Üçüncü seçenek";
}

/* =====================================================
   4) RESULT RENDER
   ===================================================== */

function showResult() {
  const prefs = derivePrefs();

  const scored = SYSTEMS.map(s => ({ ...s, raw: scoreSystem(s, prefs) }));
  const normalized = normalizeScores(scored);

  const top3 = pickTop3Systems(normalized);

  el.resultBoxes.innerHTML = "";

  top3.forEach((sys, idx) => {
    const box = document.createElement("div");
    box.className = "result-box";

    const tagClass = sys.color ? `tag ${sys.color}` : "tag";
    const chips = buildChipsForSystem(sys, prefs);
    const why = buildWhy(sys, prefs);

    box.innerHTML = `
      <div class="${tagClass}">
        <span class="dot"></span>
        <span>${labelForRank(idx)} • ${escapeHtml(sys.name)}</span>
      </div>

      <div class="chips">
        ${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join("")}
      </div>

      <h3>Uygunluk Skoru: ${sys.score}/100</h3>

      <div class="provider-block">
        <div class="provider-title">Neden bu sistem?</div>
        <ul class="provider-list">
          ${why.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      </div>

      <div class="provider-block">
        <div class="provider-title">Hızlı not</div>
        <div class="provider-why">Aynı tutar için “toplam maliyet”i (kur + ücret) sağlayıcıların kendi hesaplayıcılarında karşılaştır.</div>
      </div>
    `;

    el.resultBoxes.appendChild(box);
  });

  if (el.questionCard) el.questionCard.classList.add("hidden");
  el.resultCard.classList.remove("hidden");
  el.resultActionsCard.classList.remove("hidden");
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildCopyText() {
  const prefs = derivePrefs();
  const scored = SYSTEMS.map(s => ({ ...s, raw: scoreSystem(s, prefs) }));
  const normalized = normalizeScores(scored);
  const top3 = pickTop3Systems(normalized);

  const lines = [];
  lines.push("almanya101 — TR ↔ DE Para Transferi Seçim Aracı Sonuç");
  lines.push("----------------------------------------------------");
  lines.push("Önerilen 3 sistem:");
  top3.forEach((s, i) => {
    const why = buildWhy(s, prefs).slice(0, 2);
    lines.push(`${i + 1}) ${s.name} — skor: ${s.score}/100`);
    why.forEach(w => lines.push(`   - ${w}`));
  });

  lines.push("");
  lines.push("Not:");
  lines.push("- Ücret/kur/limit ve KYC koşulları sağlayıcıya göre değişir. Son karar öncesi güncel şartları kontrol et.");
  lines.push("");
  lines.push("Cevaplar:");
  for (const q of QUESTIONS) {
    const ans = state.answers[q.id];
    if (typeof ans === "undefined") continue;
    let label = ans;
    if (q.type === "yesno") label = (ans === "yes" ? "Evet" : "Hayır");
    if (q.type === "single") label = q.options.find(o => o.key === ans)?.label || ans;
    lines.push(`- ${q.title} → ${label}`);
  }
  return lines.join("\n");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
