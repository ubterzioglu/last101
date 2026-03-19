/**
 * Para Transferi Seçim Aracı - 20 Soru
 * Source: .0old/paratransfer/script.js
 */

export interface Question {
  id: number;
  title: string;
  description?: string;
  answers: {
    id: string;
    label: string;
    scores?: Record<string, number>; // Sistem ID -> puan
    weights?: Record<string, number>; // Kategori -> ağırlık
    next?: number; // Sonraki soru ID
  }[];
}

// Ağırlık çarpanları
export const WEIGHTS = {
  COST: 1.3,
  SPEED: 1.0,
  ONLINE: 1.0,
  CASH: 1.2,
  MULTI: 0.9,
  OFFICIAL: 0.8,
  BUSINESS: 1.1,
  SIMPLE: 1.0,
  WEEKEND: 0.9,
  LIMITS: 0.8,
  PROMOS: 0.7,
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Tutar aralığı nedir?",
    description: "Tek seferde göndermeyi planladığınız tutar",
    answers: [
      { id: "low", label: "0 – 1.000 EUR", weights: { cost: 1.4, simple: 1.2 } },
      { id: "mid", label: "1.000 – 10.000 EUR", weights: { cost: 1.2, limits: 1.1 } },
      { id: "high", label: "10.000 – 50.000 EUR", weights: { limits: 1.4, official: 1.2 } },
      { id: "very_high", label: "50.000 EUR üzeri", weights: { limits: 1.5, official: 1.3, cost: 0.8 } },
    ],
  },
  {
    id: 2,
    title: "Hangi yöne transfer?",
    description: "Para gönderim yönü",
    answers: [
      { id: "de_to_tr", label: "Almanya → Türkiye", weights: { online: 1.1 } },
      { id: "tr_to_de", label: "Türkiye → Almanya", weights: { online: 1.1 } },
      { id: "both", label: "Her iki yöne düzenli", weights: { multi: 1.3, online: 1.1 } },
    ],
  },
  {
    id: 3,
    title: "Hangi kanalla göndermeyi tercih edersiniz?",
    description: "Transfer yöntemi",
    answers: [
      { id: "online_app", label: "Sadece online / uygulama", weights: { online: 1.4, cash: 0.3 } },
      { id: "mostly_online", label: "Öncelikle online, şube de olur", weights: { online: 1.1, cash: 0.8 } },
      { id: "branch", label: "Fiziksel şube tercihim", weights: { online: 0.6, official: 1.1 } },
      { id: "cash", label: "Nakit ödeme + teslim", weights: { online: 0.2, cash: 1.5 } },
    ],
  },
  {
    id: 4,
    title: "Alıcıya nasıl ulaşmasını istersiniz?",
    description: "Para teslim şekli",
    answers: [
      { id: "bank", label: "Banka hesabına", weights: { online: 1.1, cash: 0.2 } },
      { id: "cash_pickup", label: "Nakit teslim (şube/agent)", weights: { cash: 1.5, online: 0.5 } },
      { id: "mobile", label: "Mobil cüzdan / kart", weights: { online: 1.2, cash: 0.3 } },
      { id: "home", label: "Kapıda teslim", weights: { cash: 1.3, cost: 0.9 } },
    ],
  },
  {
    id: 5,
    title: "Ne kadar hızlı?",
    description: "Teslimat süresi",
    answers: [
      { id: "minutes", label: "Dakikalar içinde (gerçek zamanlı)", weights: { speed: 1.4, cost: 0.9 } },
      { id: "hours", label: "Birkaç saat içinde", weights: { speed: 1.2 } },
      { id: "1_2_days", label: "1-2 iş günü", weights: { speed: 1.0, cost: 1.1 } },
      { id: "3_5_days", label: "3-5 iş günü kabul", weights: { speed: 0.8, cost: 1.2, official: 1.1 } },
    ],
  },
  {
    id: 6,
    title: "Maliyet hassasiyeti?",
    description: "Ücret ve kur önceliği",
    answers: [
      { id: "very_low", label: "En düşük toplam maliyet önemli (kur + ücret)", weights: { cost: 1.5 } },
      { id: "low", label: "Düşük maliyet tercihim", weights: { cost: 1.3 } },
      { id: "balanced", label: "Maliyet/hız dengesi", weights: { cost: 1.0, speed: 1.0 } },
      { id: "speed_first", label: "Hız öncelikli, maliyet ikincil", weights: { cost: 0.7, speed: 1.3 } },
    ],
  },
  {
    id: 7,
    title: "Kimlik doğrulama (KYC)?",
    description: "Hesap açma/transfer süreci",
    answers: [
      { id: "full_kyc", label: "Tam KYC (pasaport/fatura) kabul", weights: { official: 1.2, online: 1.1 } },
      { id: "light", label: "Hafif doğrulama tercihim", weights: { online: 1.0, official: 0.9 } },
      { id: "minimal", label: "En az evrak, hızlı başlangıç", weights: { online: 1.2, official: 0.7 } },
      { id: "no_pref", label: "Fark etmez", weights: {} },
    ],
  },
  {
    id: 8,
    title: "Çoklu döviz hesabı / kart?",
    description: "Döviz yönetimi",
    answers: [
      { id: "multi_essential", label: "Evet, şart (EUR/USD/GBP/TL yönetimi)", weights: { multi: 1.5, online: 1.1 } },
      { id: "multi_nice", label: "Tercihim, ama zorunlu değil", weights: { multi: 1.2 } },
      { id: "single", label: "Hayır, tek döviz (TL veya EUR) yeterli", weights: { multi: 0.5 } },
    ],
  },
  {
    id: 9,
    title: "Hafta sonu / dışarıda aktarım?",
    description: "Transfer zamanlaması",
    answers: [
      { id: "weekend_essential", label: "Evet, hafta sonu aktarım şart", weights: { weekend: 1.4 } },
      { id: "weekend_nice", label: "Hafta sonu olursa iyi olur", weights: { weekend: 1.2 } },
      { id: "weekday_ok", label: "Hafta içi mesai saatleri yeterli", weights: { weekend: 0.8 } },
    ],
  },
  {
    id: 10,
    title: "Düzenli gönderim mi?",
    description: "Transfer sıklığı",
    answers: [
      { id: "recurring", label: "Evet, aylık/düzenli gönderim", weights: { cost: 1.2, online: 1.1 } },
      { id: "sometimes", label: "Ara sıra", weights: {} },
      { id: "once", label: "Tek seferlik", weights: { simple: 1.2 } },
    ],
  },
  {
    id: 11,
    title: "İşletme / kurumsal kullanım?",
    description: "Kullanım amacı",
    answers: [
      { id: "personal", label: "Kişisel kullanım", weights: { business: 0.3 } },
      { id: "small_business", label: "Küçük işletme / serbest meslek", weights: { business: 1.3, official: 1.1 } },
      { id: "company", label: "Şirket / kurumsal", weights: { business: 1.5, official: 1.2 } },
    ],
  },
  {
    id: 12,
    title: "Fatura / dekont / resmiyet?",
    description: "Dökümantasyon",
    answers: [
      { id: "full_doc", label: "Resmi fatura ve dekont şart", weights: { official: 1.4, business: 1.1 } },
      { id: "receipt_ok", label: "Basit dekont yeterli", weights: { official: 1.1 } },
      { id: "minimal_doc", label: "En az evrak", weights: { official: 0.7, simple: 1.2 } },
    ],
  },
  {
    id: 13,
    title: "Teknik kullanım zorluğu?",
    description: "Kullanıcı deneyimi",
    answers: [
      { id: "very_simple", label: "Çok basit olmalı (birkaç tık)", weights: { simple: 1.4, online: 1.1 } },
      { id: "simple", label: "Basit tercihim", weights: { simple: 1.2 } },
      { id: "ok_complex", label: "Detaylı adımlar sorun değil", weights: { simple: 0.9 } },
    ],
  },
  {
    id: 14,
    title: "Promosyon / ilk transfer bonusu?",
    description: "Kampanyalar",
    answers: [
      { id: "promo_yes", label: "Evet, ilk transfer indirimi önemli", weights: { promos: 1.4 } },
      { id: "promo_nice", label: "İyi olur ama şart değil", weights: { promos: 1.1 } },
      { id: "promo_no", label: "Dikkate almıyorum", weights: { promos: 0.5 } },
    ],
  },
  {
    id: 15,
    title: "Güvenilirlik / marka önceliği?",
    description: "Tercih edilen sağlayıcı tipi",
    answers: [
      { id: "trusted_bank", label: "Banka / en az 10 yıllık marka", weights: { official: 1.4, online: 0.9 } },
      { id: "trusted_fintech", label: "Lisanslı fintech (Wise, Revolut vb.)", weights: { official: 1.1, online: 1.1 } },
      { id: "any_trusted", label: "Lisanslı herhangi biri", weights: { official: 0.9 } },
      { id: "best_rate", label: "Sadece en iyi oran/ücret", weights: { cost: 1.3, official: 0.6 } },
    ],
  },
  {
    id: 16,
    title: "Alıcıda banka hesabı var mı?",
    description: "Alıcı durumu",
    answers: [
      { id: "has_account", label: "Evet, IBAN var", weights: { online: 1.1, cash: 0.5 } },
      { id: "no_account", label: "Hayır, bankası yok", weights: { cash: 1.5, online: 0.3 } },
      { id: "not_sure", label: "Emin değilim", weights: { cash: 1.1 } },
    ],
  },
  {
    id: 17,
    title: "Tutar büyüklüğüne göre limit takibi?",
    description: "Limit hassasiyeti",
    answers: [
      { id: "high_limits", label: "Yüksek limitler şart (10K+)", weights: { limits: 1.4 } },
      { id: "medium_limits", label: "Orta limitler (1-10K)", weights: { limits: 1.1 } },
      { id: "low_limits_ok", label: "Düşük limit kabul (haftalık)", weights: { limits: 0.8 } },
    ],
  },
  {
    id: 18,
    title: "Transfer takibi / müşteri hizmetleri?",
    description: "Destek",
    answers: [
      { id: "turkish_support", label: "Türkçe destek önemli", weights: { online: 1.1 } },
      { id: "chat_app", label: "Sohbet / uygulama içi yeterli", weights: { online: 1.1 } },
      { id: "no_need", label: "Çok gerekmem", weights: {} },
    ],
  },
  {
    id: 19,
    title: "Alternatif ödeme kaynağı?",
    description: "Ödeme yöntemi çeşitliliği",
    answers: [
      { id: "multi_source", label: "Kart + banka + nakit opsiyonu", weights: { cash: 1.2, online: 1.1 } },
      { id: "bank_only", label: "Sadece banka havalesi", weights: { online: 0.9 } },
    ],
  },
  {
    id: 20,
    title: "Hangi profil size daha yakın?",
    description: "Genel kullanıcı profili",
    answers: [
      { id: "expat_worker", label: "Gurbetçi işçi: Düşük maliyet + nakit", weights: { cost: 1.3, cash: 1.3 } },
      { id: "student", label: "Öğrenci: Çoklu döviz + kart", weights: { multi: 1.3, simple: 1.2 } },
      { id: "professional", label: "Profesyonel: Resmi + online", weights: { official: 1.2, online: 1.2 } },
      { id: "business", label: "İşletme: Faturalı + yüksek limit", weights: { business: 1.4, limits: 1.2 } },
      { id: "family", label: "Aile: Basit + güvenilir", weights: { simple: 1.3, official: 1.1 } },
    ],
  },
];
