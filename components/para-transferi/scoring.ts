/**
 * Para Transferi Seçim Aracı: skorlama yardımcıları (saf fonksiyonlar).
 * transfer-selector.tsx bu dosyayı kullanır; mantık değiştirilmeden buraya taşındı.
 */

import { TRANSFER_SYSTEMS, type TransferSystem } from '@/constants/para-transferi/systems';

// =====================================================
// TİPLER
// =====================================================

export type Answers = Record<string, string>;

export interface Prefs {
  cost: number;
  speed: number;
  simple: number;
  online: number;
  cash: number;
  multi: number;
  official: number;
  business: number;
  weekend: number;
  limits: number;
  promos: number;
  risk_ok: number;
}

export interface ScoredSystem extends TransferSystem {
  raw: number;
  score: number;
}

// =====================================================
// SKORLAMA ALGORİTMASI
// =====================================================

export function derivePrefs(a: Answers): Prefs {
  const prefs: Prefs = {
    cost: 0, speed: 0, simple: 0, online: 0, cash: 0,
    multi: 0, official: 0, business: 0, weekend: 0, limits: 0,
    promos: 0, risk_ok: 0,
  };

  // q4: birincil hedef
  if (a.q4 === "cost") prefs.cost += 6;
  if (a.q4 === "speed") prefs.speed += 6;
  if (a.q4 === "simplicity") prefs.simple += 6;

  // q5: tam online
  if (a.q5 === "yes") prefs.online += 5;
  if (a.q5 === "no") prefs.simple += 2;

  // q6 + q7: IBAN / nakit
  if (a.q6 === "no_iban") prefs.cash += 8;
  if (a.q6 === "sometimes") prefs.cash += 4;
  if (a.q7 === "yes") prefs.cash += 8;

  // q8: kur farkı hassasiyeti
  if (a.q8 === "yes") prefs.cost += 4;

  // q9 + q10: uyum/belgeler
  if (a.q9 === "yes") { prefs.business += 5; prefs.official += 3; }
  if (a.q10 === "yes") { prefs.business += 3; prefs.official += 3; }

  // q11: aynı gün teslim
  if (a.q11 === "yes") prefs.speed += 3;

  // q12: hafta sonu
  if (a.q12 === "yes") prefs.weekend += 4;

  // q13 + q14: çoklu döviz + tek uygulama
  if (a.q13 === "yes") prefs.multi += 8;
  if (a.q14 === "yes") prefs.multi += 4;

  // q2: sıklık
  if (a.q2 === "weekly") { prefs.cost += 2; prefs.multi += 2; prefs.online += 1; }
  if (a.q2 === "monthly") { prefs.cost += 1; prefs.online += 1; }
  if (a.q2 === "rare") { prefs.simple += 1; prefs.official += 1; }

  // q3: tutar büyüklüğü
  if (a.q3 === "large") { prefs.official += 3; prefs.business += 2; prefs.limits += 4; }
  if (a.q3 === "mid") { prefs.limits += 2; }
  if (a.q3 === "small") { prefs.cost += 1; prefs.online += 1; }

  // q16: maliyet görüşü
  if (a.q16 === "total_cost") prefs.cost += 5;
  if (a.q16 === "visible_fee") prefs.official += 1;

  // q17: limit sorunu
  if (a.q17 === "yes") prefs.limits += 4;

  // q18: resmi kayıt
  if (a.q18 === "important") prefs.official += 6;
  if (a.q18 === "not_important") prefs.cash += 1;

  // q19: kampanya/bonus
  if (a.q19 === "yes") prefs.promos += 4;

  // q20: teknoloji rahatlığı
  if (a.q20 === "advanced") { prefs.online += 2; prefs.multi += 1; }
  if (a.q20 === "low") { prefs.simple += 3; }

  // q15: kripto iştahı
  if (a.q15 === "yes") prefs.risk_ok += 8;
  if (a.q15 === "maybe") prefs.risk_ok += 2;

  // 0..15 aralığına sıkıştır
  for (const k of Object.keys(prefs) as (keyof Prefs)[]) {
    prefs[k] = Math.max(0, Math.min(15, prefs[k]));
  }

  return prefs;
}

export function scoreSystem(sys: TransferSystem, prefs: Prefs): number {
  const isCrypto = sys.tags.some(t => t.toLowerCase().includes("kripto"));
  const riskPenalty = isCrypto && prefs.risk_ok < 6 ? 12 : 0;

  let raw = 0;
  raw += prefs.cost    * sys.scores.cost;
  raw += prefs.speed   * sys.scores.speed;
  raw += prefs.simple  * sys.scores.simple;
  raw += prefs.online  * sys.scores.online;
  raw += prefs.cash    * sys.scores.cash;
  raw += prefs.multi   * sys.scores.multi;
  raw += prefs.official  * sys.scores.official;
  raw += prefs.business  * sys.scores.business;
  raw += prefs.weekend   * sys.scores.weekend;
  raw += prefs.limits    * sys.scores.limits;
  raw += prefs.promos    * sys.scores.promos;
  raw -= riskPenalty;

  // Nakit istiyor ama sistem hiç nakit desteklemiyor → ceza
  if (prefs.cash >= 8 && sys.scores.cash === 0) raw -= 40;

  return raw;
}

export function normalizeScores(scored: (TransferSystem & { raw: number })[]): ScoredSystem[] {
  const values = scored.map(s => s.raw);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return scored.map(s => {
    let score = 80;
    if (max !== min) {
      const t = (s.raw - min) / (max - min);
      score = Math.round(60 + t * 35); // 60..95 arası
    }
    return { ...s, score };
  });
}

const TIE_BREAK: Record<string, number> = {
  "Wise": 100, "Wise Business": 98, "Revolut": 95, "Remitly": 92,
  "TransferGo": 90, "Paysend": 88, "N26": 86, "WorldRemit": 84,
  "RIA Money Transfer": 82, "Western Union": 80, "MoneyGram": 78,
  "Ziraat Bankası": 76, "İş Bankası": 74,
};

export function pickTop3(normalized: ScoredSystem[]): ScoredSystem[] {
  return [...normalized]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (TIE_BREAK[b.name] ?? 0) - (TIE_BREAK[a.name] ?? 0);
    })
    .slice(0, 3);
}

export function topDrivers(prefs: Prefs, n = 4): string[] {
  return Object.entries(prefs)
    .filter(([k, v]) => v > 0 && k !== "risk_ok")
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

const DRIVER_LABELS: Record<string, string> = {
  cost: "Toplam maliyet", speed: "Hız", simple: "Basitlik",
  online: "Tam online", cash: "Nakit/IBAN yok", multi: "Çoklu döviz",
  official: "Resmi kayıt", business: "İş/uyum", weekend: "Hafta sonu",
  limits: "Yüksek limit", promos: "Kampanya/indirim",
};

export function buildChips(sys: TransferSystem, prefs: Prefs): string[] {
  const drivers = topDrivers(prefs, 3);
  const chips: string[] = [];
  drivers.slice(0, 2).forEach(k =>
    chips.push(`${DRIVER_LABELS[k] ?? k}: ${prefs[k as keyof Prefs] >= 8 ? "Yüksek" : "Orta"}`)
  );
  sys.tags.slice(0, 3).forEach(t => chips.push(t));
  return chips.slice(0, 6);
}

export function buildWhy(sys: TransferSystem, prefs: Prefs): string[] {
  const d = topDrivers(prefs, 4);
  const bullets: string[] = [];

  if (d.includes("cash") && sys.scores.cash >= 4)
    bullets.push("Alıcı IBAN kullanmıyorsa veya nakit teslim gerekiyorsa güçlü seçenek.");
  if (d.includes("cost") && sys.scores.cost >= 4)
    bullets.push("Toplam maliyet (kur + ücret) hassasiyetinde genelde avantajlı seçeneklerden.");
  if (d.includes("multi") && sys.scores.multi >= 4)
    bullets.push("TRY ve EUR bakiyesi tutup doğru zamanda dönüştürmek isteyenlere uygun.");
  if (d.includes("official") && sys.scores.official >= 4)
    bullets.push("Resmi kayıt/amaç açıklaması gereken senaryolara daha uyumlu.");
  if (d.includes("business") && sys.scores.business >= 4)
    bullets.push("İş/serbest transferlerde fatura–uyum (KYC/AML) tarafı daha düzenli ilerleyebilir.");
  if (d.includes("speed") && sys.scores.speed >= 4)
    bullets.push("Hız önceliğinde (aynı gün/ertesi gün) daha güçlü bir seçenek olabilir.");
  if (d.includes("simple") && sys.scores.simple >= 4)
    bullets.push("Basit kullanım (az adım, net süreç) tarafında öne çıkar.");

  if (bullets.length < 2)
    bullets.push("Cevaplarına göre bu sistem senin önceliklerine genel olarak daha iyi uyuyor.");
  if (bullets.length < 3)
    bullets.push("Son karar öncesi aynı tutarı farklı sistemlerde 'toplam maliyet' ile kıyasla.");

  const isCrypto = sys.tags.some(t => t.toLowerCase().includes("kripto"));
  if (isCrypto)
    bullets.push("Kripto; volatilite, platform riski ve vergi/uyum nedeniyle daha yüksek risk içerir.");

  return bullets.slice(0, 4);
}

export function labelForRank(idx: number): string {
  if (idx === 0) return "Ana öneri";
  if (idx === 1) return "Alternatif";
  return "Üçüncü seçenek";
}

export function calculateResults(answers: Answers): ScoredSystem[] {
  const prefs = derivePrefs(answers);
  const scored = TRANSFER_SYSTEMS.map(s => ({ ...s, raw: scoreSystem(s, prefs) }));
  const normalized = normalizeScores(scored);
  return pickTop3(normalized);
}
