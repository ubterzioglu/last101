/**
 * Para Transferi Sistem Havuzu (30+ gerçek sistem)
 * Source: .0old/paratransfer/script.js
 */

export interface TransferSystem {
  id: string;
  name: string;
  tags: string[];
  color: 'purple' | 'red' | '';
  scores: {
    cost: number;        // Maliyet (5=en iyi)
    speed: number;       // Hız
    online: number;      // Online kullanım kolaylığı
    cash: number;        // Nakit seçeneği
    multi: number;       // Çoklu döviz desteği
    official: number;    // Resmiyet/güvenilirlik
    business: number;    // İşletme kullanımı
    simple: number;      // Basitlik
    weekend: number;     // Hafta sonu çalışma
    limits: number;      // Limitler
    promos: number;      // Promosyonlar
  };
}

export const TRANSFER_SYSTEMS: TransferSystem[] = [
  // Fintech / Transfer services
  {
    id: "wise",
    name: "Wise",
    tags: ["Fintech", "Düşük maliyet", "Online"],
    color: "purple",
    scores: { cost: 5, speed: 4, online: 5, cash: 1, multi: 5, official: 3, business: 4, simple: 4, weekend: 4, limits: 4, promos: 2 }
  },
  {
    id: "remitly",
    name: "Remitly",
    tags: ["Fintech", "Hızlı", "TR↔DE"],
    color: "",
    scores: { cost: 4, speed: 4, online: 4, cash: 3, multi: 2, official: 2, business: 2, simple: 4, weekend: 4, limits: 3, promos: 3 }
  },
  {
    id: "transfergo",
    name: "TransferGo",
    tags: ["Fintech", "Hızlı", "Online"],
    color: "",
    scores: { cost: 4, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 3 }
  },
  {
    id: "paysend",
    name: "Paysend",
    tags: ["Fintech", "Kart/IBAN", "Online"],
    color: "",
    scores: { cost: 3, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "worldremit",
    name: "WorldRemit",
    tags: ["Fintech", "Nakit opsiyon", "Online"],
    color: "",
    scores: { cost: 3, speed: 3, online: 4, cash: 4, multi: 1, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "ria",
    name: "RIA Money Transfer",
    tags: ["Ağ", "Nakit opsiyon", "TR"],
    color: "red",
    scores: { cost: 3, speed: 3, online: 3, cash: 5, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "xoom",
    name: "Xoom (PayPal)",
    tags: ["PayPal", "Hızlı", "Online"],
    color: "",
    scores: { cost: 2, speed: 4, online: 4, cash: 2, multi: 1, official: 2, business: 2, simple: 4, weekend: 4, limits: 2, promos: 1 }
  },
  {
    id: "skrill",
    name: "Skrill Money Transfer",
    tags: ["Cüzdan", "Online", "Kart"],
    color: "",
    scores: { cost: 2, speed: 3, online: 4, cash: 1, multi: 2, official: 2, business: 1, simple: 3, weekend: 3, limits: 2, promos: 2 }
  },
  {
    id: "smallworld",
    name: "Small World FS",
    tags: ["Ağ", "Nakit opsiyon", "Online"],
    color: "red",
    scores: { cost: 3, speed: 3, online: 3, cash: 4, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 }
  },
  {
    id: "taptap",
    name: "Taptap Send",
    tags: ["Hızlı", "Mobil", "Online"],
    color: "",
    scores: { cost: 3, speed: 4, online: 4, cash: 1, multi: 1, official: 2, business: 1, simple: 4, weekend: 4, limits: 2, promos: 3 }
  },

  // Cash pickup networks
  {
    id: "western_union",
    name: "Western Union",
    tags: ["Nakit teslim", "Şube ağı", "Global"],
    color: "red",
    scores: { cost: 2, speed: 4, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 4, limits: 4, promos: 1 }
  },
  {
    id: "moneygram",
    name: "MoneyGram",
    tags: ["Nakit teslim", "Şube ağı", "Global"],
    color: "red",
    scores: { cost: 2, speed: 3, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "ptt",
    name: "PTT Uluslararası Para Transferi",
    tags: ["TR", "Nakit/hesap", "Şube"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 3, business: 1, simple: 2, weekend: 1, limits: 2, promos: 0 }
  },
  {
    id: "upt",
    name: "UPT (Ulaşım Para Transferi)",
    tags: ["TR", "Nakit ağ", "Hızlı"],
    color: "red",
    scores: { cost: 2, speed: 3, online: 2, cash: 4, multi: 0, official: 2, business: 1, simple: 3, weekend: 2, limits: 2, promos: 1 }
  },
  {
    id: "euronet",
    name: "Euronet / Ria Network",
    tags: ["Nokta ağı", "Nakit", "Erişim"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 2, business: 1, simple: 2, weekend: 2, limits: 2, promos: 0 }
  },

  // Multi-currency / digital banks
  {
    id: "revolut",
    name: "Revolut",
    tags: ["Dijital banka", "Çoklu döviz", "Kart"],
    color: "purple",
    scores: { cost: 4, speed: 3, online: 5, cash: 0, multi: 5, official: 3, business: 2, simple: 4, weekend: 4, limits: 3, promos: 2 }
  },
  {
    id: "n26",
    name: "N26",
    tags: ["Dijital banka", "DE IBAN", "Basit"],
    color: "purple",
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 5, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "bunq",
    name: "bunq",
    tags: ["Dijital banka", "IBAN", "Uygulama"],
    color: "purple",
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 4, weekend: 3, limits: 3, promos: 1 }
  },
  {
    id: "vivid",
    name: "Vivid Money",
    tags: ["Dijital banka", "Kart", "Uygulama"],
    color: "purple",
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 3, business: 1, simple: 4, weekend: 3, limits: 2, promos: 2 }
  },
  {
    id: "paysera",
    name: "Paysera",
    tags: ["Hesap", "Transfer", "Çoklu döviz"],
    color: "purple",
    scores: { cost: 3, speed: 3, online: 4, cash: 1, multi: 4, official: 3, business: 3, simple: 3, weekend: 2, limits: 3, promos: 1 }
  },

  // Banks (TR + DE)
  {
    id: "ziraat",
    name: "Ziraat Bankası",
    tags: ["Banka", "TR/DE", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "isbank",
    name: "İş Bankası",
    tags: ["Banka", "SWIFT", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "garanti",
    name: "Garanti BBVA",
    tags: ["Banka", "SWIFT", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "akbank",
    name: "Akbank",
    tags: ["Banka", "SWIFT", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "halkbank",
    name: "Halkbank",
    tags: ["Banka", "SWIFT", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "vakif",
    name: "VakıfBank",
    tags: ["Banka", "SWIFT", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "deutsche",
    name: "Deutsche Bank",
    tags: ["Banka", "DE", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "commerz",
    name: "Commerzbank",
    tags: ["Banka", "DE", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "sparkasse",
    name: "Sparkasse",
    tags: ["Banka", "DE", "Yerel"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "volksbank",
    name: "Volksbank / Raiffeisenbank",
    tags: ["Banka", "DE", "Yerel"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },

  // Business variants
  {
    id: "wise_business",
    name: "Wise Business",
    tags: ["Business", "Fintech", "Uyum"],
    color: "purple",
    scores: { cost: 4, speed: 3, online: 5, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 3, limits: 4, promos: 1 }
  },
  {
    id: "paysera_business",
    name: "Paysera Business",
    tags: ["Business", "Hesap", "Uyum"],
    color: "purple",
    scores: { cost: 3, speed: 3, online: 4, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 2, limits: 4, promos: 1 }
  },
  {
    id: "db_business",
    name: "Deutsche Bank Business",
    tags: ["Business", "Banka", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "commerz_business",
    name: "Commerzbank Business",
    tags: ["Business", "Banka", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },
  {
    id: "sparkasse_business",
    name: "Sparkasse Business",
    tags: ["Business", "Banka", "Resmi"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 }
  },

  // Crypto (opsiyonel — düşük öncelik)
  {
    id: "binance",
    name: "Binance",
    tags: ["Kripto", "Risk", "Hızlı"],
    color: "red",
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 2, official: 0, business: 0, simple: 1, weekend: 5, limits: 4, promos: 0 }
  },
  {
    id: "coinbase",
    name: "Coinbase",
    tags: ["Kripto", "Risk", "Platform"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 }
  },
  {
    id: "kraken",
    name: "Kraken",
    tags: ["Kripto", "Risk", "Platform"],
    color: "red",
    scores: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 }
  },
];

// Hızlı erişim için Map
export const SYSTEMS_MAP = new Map(TRANSFER_SYSTEMS.map(s => [s.id, s]));
