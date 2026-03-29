'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { TRANSFER_SYSTEMS, type TransferSystem } from '@/constants/para-transferi/systems';
import { QUESTIONS } from '@/constants/para-transferi/questions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';
import { RotateCcw, ChevronLeft, Check, Copy } from 'lucide-react';

// =====================================================
// TİPLER
// =====================================================

type Answers = Record<string, string>;

interface Prefs {
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

interface ScoredSystem extends TransferSystem {
  raw: number;
  score: number;
}

// =====================================================
// SKORLAMA ALGORİTMASI
// =====================================================

function derivePrefs(a: Answers): Prefs {
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

function scoreSystem(sys: TransferSystem, prefs: Prefs): number {
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

function normalizeScores(scored: (TransferSystem & { raw: number })[]): ScoredSystem[] {
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

function pickTop3(normalized: ScoredSystem[]): ScoredSystem[] {
  return [...normalized]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (TIE_BREAK[b.name] ?? 0) - (TIE_BREAK[a.name] ?? 0);
    })
    .slice(0, 3);
}

function topDrivers(prefs: Prefs, n = 4): string[] {
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

function buildChips(sys: TransferSystem, prefs: Prefs): string[] {
  const drivers = topDrivers(prefs, 3);
  const chips: string[] = [];
  drivers.slice(0, 2).forEach(k =>
    chips.push(`${DRIVER_LABELS[k] ?? k}: ${prefs[k as keyof Prefs] >= 8 ? "Yüksek" : "Orta"}`)
  );
  sys.tags.slice(0, 3).forEach(t => chips.push(t));
  return chips.slice(0, 6);
}

function buildWhy(sys: TransferSystem, prefs: Prefs): string[] {
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

function labelForRank(idx: number): string {
  if (idx === 0) return "Ana öneri";
  if (idx === 1) return "Alternatif";
  return "Üçüncü seçenek";
}

function calculateResults(answers: Answers): ScoredSystem[] {
  const prefs = derivePrefs(answers);
  const scored = TRANSFER_SYSTEMS.map(s => ({ ...s, raw: scoreSystem(s, prefs) }));
  const normalized = normalizeScores(scored);
  return pickTop3(normalized);
}

// =====================================================
// BİLEŞEN
// =====================================================

export function TransferSelector() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [results, setResults] = useState<ScoredSystem[] | null>(null);
  const [copied, setCopied] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  const handleAnswer = useCallback((key: string) => {
    const newAnswers = { ...answers, [question.id]: key };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResults(calculateResults(newAnswers));
    }
  }, [answers, currentQuestion, question.id]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const handleReset = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  }, []);

  const copyResults = useCallback(() => {
    if (!results) return;
    const prefs = derivePrefs(answers);
    const lines = [
      "almanya101 — TR ↔ DE Para Transferi Seçim Aracı Sonuç",
      "----------------------------------------------------",
      "Önerilen 3 sistem:",
    ];
    results.forEach((s, i) => {
      lines.push(`${i + 1}) ${s.name} — skor: ${s.score}/100`);
      buildWhy(s, prefs).slice(0, 2).forEach(w => lines.push(`   - ${w}`));
    });
    lines.push("", "Not:", "- Ücret/kur/limit ve KYC koşulları sağlayıcıya göre değişir.");
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [results, answers]);

  // ---- SONUÇ EKRANI ----
  if (results) {
    const prefs = derivePrefs(answers);
    const borderColors = ["border-google-yellow", "border-google-blue", "border-google-green"];
    return (
      <Section contained className="!pt-0 pb-8">
        {/* Başlık kartı */}
        <div className="mb-2 rounded-xl border-2 border-google-red bg-white p-4">
          <h2 className="text-2xl font-bold">Sonuç</h2>
          <p className="text-gray-500 text-sm mt-0.5">Cevaplarına göre en uygun para transferi sistemi profilleri:</p>
        </div>

        {/* Her sonuç ayrı kart */}
        {results.map((sys, idx) => {
          const chips = buildChips(sys, prefs);
          const why = buildWhy(sys, prefs);
          return (
            <div
              key={sys.id}
              className={cn(
                "mb-2 rounded-xl border-2 bg-white p-5",
                borderColors[idx]
              )}
            >
              <h3 className="text-lg font-bold mb-3">
                {idx + 1} - {sys.name} - {labelForRank(idx)}
              </h3>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {chips.map((c, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-sm font-semibold text-gray-700 mb-2">
                Uygunluk Skoru: <span className="text-google-green">{sys.score}/100</span>
              </p>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Neden bu sistem?</p>
                <ul className="space-y-1">
                  {why.map((b, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400 shrink-0">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Not kartı */}
        <div className="mb-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Not:</strong> Bu araç yönlendirme amaçlıdır. Ücretler (kur farkı + sabit ücret),
            teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir.<br />
            Karar vermeden önce sağlayıcının kendi fiyat hesaplayıcısında aynı tutar için &quot;toplam maliyeti&quot; kontrol edin.
          </p>
        </div>

        {/* Sıfırla */}
        <button
          onClick={handleReset}
          className="mb-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-orange bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-4 h-4" />
          Sıfırla
        </button>

        {/* Sonucu Kopyala */}
        <button
          onClick={copyResults}
          className="mb-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-blue bg-google-blue text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Kopyalandı' : 'Sonucu Kopyala'}
        </button>

        {/* Ana Sayfaya Dön */}
        <Link
          href="/"
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          Ana Sayfaya Dön
        </Link>
      </Section>
    );
  }

  // ---- SORU EKRANI ----
  const options = question.type === 'yesno'
    ? [{ key: 'yes', label: 'Evet', desc: 'Bana uyuyor.' }, { key: 'no', label: 'Hayır', desc: 'Bana uymuyor.' }]
    : (question.options ?? []);

  return (
    <Section contained className="!pt-0 pb-8">
      <div className="mb-2 rounded-xl border-2 border-google-blue bg-white px-4 py-3">
        <h1 className="text-2xl font-bold leading-tight">{'Para Transferi Se\u00e7im Arac\u0131'}</h1>
      </div>
      {/* Başlık + Nasıl Çalışır accordion — tek kart */}
      <div
        className="mb-2 rounded-xl border-2 border-google-blue bg-white cursor-pointer select-none overflow-hidden"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">{'Nas\u0131l \u00c7al\u0131\u015f\u0131r?'}</span>
          <span className={cn("text-google-blue text-xl transition-transform duration-200", showInfo && "rotate-180")}>
            ▾
          </span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• Bu araç 20 soruyla size en uygun para transferi yöntemini önerir.</li>
              <li>• Sonuçlar yönlendirme amaçlıdır; son kararınızı vermeden önce sağlayıcının güncel şartlarını kontrol edin.</li>
              <li>• Ücretler (kur farkı + sabit ücret), teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Bu araç neden var? */}
      <div
        className="mb-2 rounded-xl border-2 border-google-green bg-white cursor-pointer select-none overflow-hidden"
        onClick={() => setShowWhy(!showWhy)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Bu araç neden var?</span>
          <span className={cn("text-google-green text-xl transition-transform duration-200", showWhy && "rotate-180")}>▾</span>
        </div>
        {showWhy && (
          <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
            <p className="text-sm text-green-900 pt-3 leading-relaxed">
              Almanya'dan Türkiye'ye ya da başka ülkelere para gönderirken banka havalesi çoğu zaman yetersiz kalır: komisyon oranları yüksek, döviz kurları banka lehine. Wise, Remitly, Western Union ve benzeri platformlar çok daha uygun koşullar sunabiliyor; ancak hangisinin senin için avantajlı olduğu transfer miktarına, sıklığına ve hedef ülkeye göre değişiyor. Bu araç, birkaç basit soruyla ihtiyacına en uygun para transfer servisini belirler ve gereksiz komisyon kaybını önlemene yardım eder.
            </p>
          </div>
        )}
      </div>

      {/* Progress — google-red border */}
      <div className="mb-2 rounded-xl border-2 border-google-red bg-white p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-google-red">Soru {currentQuestion + 1} / {QUESTIONS.length}</span>
          <button
            onClick={handleReset}
            className="text-sm text-google-red hover:opacity-75 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Sıfırla
          </button>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-google-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Soru kartı — google-yellow border */}
      <div className="rounded-xl border-2 border-google-yellow bg-white p-6">
        <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
        {question.desc && (
          <p className="text-gray-500 mb-6 text-sm">{question.desc}</p>
        )}

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleAnswer(opt.key)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                answers[question.id] === opt.key
                  ? "border-google-blue bg-blue-100"
                  : "border-google-blue/30 bg-blue-50/60 hover:bg-blue-100/80 hover:border-google-blue"
              )}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.desc && <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Geri
          </Button>
          <span className="text-sm text-gray-400 self-center">
            Bir şık seçince otomatik ilerler.
          </span>
        </div>
      </div>
      <Link href="/" className="mt-2 w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>
    </Section>
  );
}
