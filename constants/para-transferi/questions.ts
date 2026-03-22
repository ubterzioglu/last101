/**
 * Para Transferi Seçim Aracı — 20 Soru
 * Scoring: derivePrefs() in transfer-selector uses question IDs + answer keys directly.
 */

export interface QuestionOption {
  key: string;
  label: string;
  desc?: string;
}

export interface Question {
  id: string;
  title: string;
  desc?: string;
  type: 'single' | 'yesno';
  options?: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Gönderim yönü hangisi?",
    desc: "Yöntem seçimi iki yönde de benzer olsa da bazı servisler tek yönde daha iyi olabilir.",
    type: "single",
    options: [
      { key: "tr_to_de", label: "Türkiye → Almanya" },
      { key: "de_to_tr", label: "Almanya → Türkiye" },
      { key: "both", label: "İkisi de (düzenli)" },
    ],
  },
  {
    id: "q2",
    title: "Transfer sıklığın nasıl?",
    desc: "Sık transferlerde \"kur farkı + düşük ücret\" toplam maliyette daha belirleyici olur.",
    type: "single",
    options: [
      { key: "weekly", label: "Haftalık / çok sık" },
      { key: "monthly", label: "Aylık" },
      { key: "rare", label: "Nadiren" },
    ],
  },
  {
    id: "q3",
    title: "Tutarlar genelde ne seviyede?",
    desc: "Yüksek tutarda bankalar/uyum süreçleri ve limitler daha kritik olabilir.",
    type: "single",
    options: [
      { key: "small", label: "Küçük (örn. < 500€)" },
      { key: "mid", label: "Orta (örn. 500€–3.000€)" },
      { key: "large", label: "Yüksek (örn. > 3.000€)" },
    ],
  },
  {
    id: "q4",
    title: "En kritik şey hangisi?",
    desc: "Birincil hedefini seç: maliyet mi hız mı basitlik mi?",
    type: "single",
    options: [
      { key: "cost", label: "En düşük toplam maliyet" },
      { key: "speed", label: "Hız (aynı gün/ertesi gün)" },
      { key: "simplicity", label: "En basit süreç" },
    ],
  },
  {
    id: "q5",
    title: "Alıcı (veya sen) bankaya gitmeden tamamen online olsun istiyor mu?",
    desc: "Tam online kullanım genelde transfer servisleri / çoklu döviz hesaplarda daha rahattır.",
    type: "yesno",
  },
  {
    id: "q6",
    title: "Alıcının banka hesabı var mı (IBAN)?",
    desc: "IBAN yoksa nakit teslim/ağ çözümleri devreye girebilir.",
    type: "single",
    options: [
      { key: "yes_iban", label: "Evet, IBAN var" },
      { key: "no_iban", label: "Hayır, IBAN yok / kullanmak istemiyor" },
      { key: "sometimes", label: "Bazen var bazen yok" },
    ],
  },
  {
    id: "q7",
    title: "Alıcı nakit çekmek/teslim almak istiyor mu?",
    desc: "Nakit teslim opsiyonu isteyenlerde transfer ağı kritik olur.",
    type: "yesno",
  },
  {
    id: "q8",
    title: "Kur farkı (spread) senin için çok önemli mi?",
    desc: "Bazı yöntemlerde \"gizli maliyet\" kur farkında saklı olabilir.",
    type: "yesno",
  },
  {
    id: "q9",
    title: "Belgeler/uyum (kaynak, amaç, fatura) göstermen gerekebilir mi?",
    desc: "Yüksek tutar ve iş transferlerinde bu daha sık görülür.",
    type: "yesno",
  },
  {
    id: "q10",
    title: "Gönderimde açıklama/fatura/referans gibi alanlar kritik mi?",
    desc: "İş, kira, eğitim, kurumsal süreçlerde açıklama alanı önemli olabilir.",
    type: "yesno",
  },
  {
    id: "q11",
    title: "Aynı gün içinde kesin teslim istiyor musun?",
    desc: "Kesin süre beklentisi varsa hızlı kanallar öne çıkar; SWIFT bazen daha değişken olabilir.",
    type: "yesno",
  },
  {
    id: "q12",
    title: "Hafta sonu/mesai dışı gönderim yapıyor musun?",
    desc: "Bazı bankalar mesai dışı daha sınırlı çalışabilir.",
    type: "yesno",
  },
  {
    id: "q13",
    title: "Sık sık TRY ve EUR bakiyesi tutuyor musun (maaş+harcama gibi)?",
    desc: "Çoklu döviz hesapları (bakiyeli) bu senaryoda avantajlı olabilir.",
    type: "yesno",
  },
  {
    id: "q14",
    title: "Kullanım kolaylığı için 'tek uygulama' (hesap+karta kadar) ister misin?",
    desc: "Bazı çözümler kart+hesap+transferi tek yerde toplar.",
    type: "yesno",
  },
  {
    id: "q15",
    title: "Kripto kullanmayı düşünüyor musun?",
    desc: "Bu yol daha riskli/karmaşık olabilir; sadece bilinçli kullanıcılar için anlamlıdır.",
    type: "single",
    options: [
      { key: "no", label: "Hayır" },
      { key: "maybe", label: "Belki / emin değilim" },
      { key: "yes", label: "Evet (riskleri biliyorum)" },
    ],
  },
  {
    id: "q16",
    title: "Senin için önemli olan hangisi?",
    desc: "Bazı servisler düşük ücret gösterip kurdan kazanır, bazıları tam tersi. Bu soru 'toplam maliyet' hassasiyetini ölçer.",
    type: "single",
    options: [
      { key: "total_cost", label: "Toplam maliyet (kur + ücret)" },
      { key: "visible_fee", label: "Görünen düşük ücret" },
      { key: "dont_know", label: "Fikrim yok / kararsızım" },
    ],
  },
  {
    id: "q17",
    title: "Transfer limitleri senin için sorun oluyor mu?",
    desc: "Günlük/aylık limitler bazı yöntemlerde kısıtlayıcı olabilir. Büyük tutar veya sık transferlerde daha belirginleşir.",
    type: "yesno",
  },
  {
    id: "q18",
    title: "Transferin resmi kayıtlarda görünmesi senin için önemli mi?",
    desc: "Kira, eğitim, iş ödemeleri gibi senaryolarda resmi kayıt ve açıklama alanları kritik olabilir.",
    type: "single",
    options: [
      { key: "important", label: "Evet, resmi olmalı" },
      { key: "neutral", label: "Fark etmez" },
      { key: "not_important", label: "Çok umurumda değil" },
    ],
  },
  {
    id: "q19",
    title: "Kampanya/bonus/indirim senin için önemli mi?",
    desc: "Bazı servisler dönemsel olarak sıfır ücret veya daha iyi kur kampanyaları yapabilir.",
    type: "yesno",
  },
  {
    id: "q20",
    title: "Teknoloji/dijital uygulama kullanımı konusunda nasılsın?",
    desc: "Uygulama ağırlıklı çözümler herkese uygun olmayabilir. Süreci ne kadar rahat yönettiğini ölçer.",
    type: "single",
    options: [
      { key: "advanced", label: "İyiyim, teknolojiyle aram iyi" },
      { key: "normal", label: "Normal kullanıcıyım" },
      { key: "low", label: "Basit olsun isterim" },
    ],
  },
];
