'use client';

import { useState, useCallback, useMemo } from 'react';
import { PROFILES, BANKS, QUESTIONS } from './data';
import { BankRecommendation } from './types';
import { cn } from '@/lib/utils/cn';

export default function BankaClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Skorları hesapla
  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    Object.keys(PROFILES).forEach(k => (s[k] = 0));

    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;

      const opt = q.options.find(o => o.key === a);
      if (opt?.add) {
        for (const k of Object.keys(opt.add)) {
          s[k] = (s[k] || 0) + opt.add[k];
        }
      }
    }
    return s;
  }, [answers]);

  // Banka skorunu hesapla
  const calculateBankScore = useCallback((bankId: string) => {
    const bank = BANKS.find(b => b.id === bankId);
    if (!bank) return 0;

    let total = 0;
    for (const k of Object.keys(PROFILES)) {
      const s = scores[k] || 0;
      const w = bank.weights[k] || 0;
      total += s * w;
    }
    return total;
  }, [scores]);

  // İhtiyaçları belirle
  const needs = useMemo(() => ({
    wantsLowCost: (scores.LOW_COST || 0) >= 4,
    wantsBranch: (scores.BRANCH || 0) >= 4 || (scores.LOCAL || 0) >= 5,
    wantsCrypto: (scores.CRYPTO || 0) >= 4,
    wantsInvest: (scores.INVEST || 0) >= 4,
    wantsExpat: (scores.EXPAT || 0) >= 4,
    wantsDigital: (scores.DIGITAL || 0) >= 5,
    wantsDirect: (scores.DIRECT || 0) >= 5,
  }), [scores]);

  // Top sinyaller
  const topSignals = useMemo(() => {
    return Object.keys(scores)
      .map(k => ({ key: k, score: scores[k] || 0 }))
      .sort((a, b) => b.score - a.score)
      .filter(x => x.score > 0)
      .slice(0, 3);
  }, [scores]);

  // Banka önerilerini oluştur
  const recommendations: BankRecommendation[] = useMemo(() => {
    const ranked = BANKS
      .map(b => ({ ...b, score: calculateBankScore(b.id) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return ranked.map((b, idx) => {
      const bullets: string[] = [];

      if (needs.wantsLowCost) {
        if ((b.weights.LOW_COST || 0) >= 2) bullets.push('Masraf hassasiyetin yüksek: daha düşük/şeffaf ücret yapısına yakın.');
        else bullets.push('Masraf hassasiyetin yüksek: bu seçenekte ücret/koşulları özellikle kontrol et.');
      }
      if (needs.wantsBranch) {
        if ((b.weights.BRANCH || 0) >= 2) bullets.push('Şube ihtiyacın var: yerel/şubeli yapı daha uygun.');
        else bullets.push('Şube ihtiyacın var: bu seçenek şubesiz/az şubeli olabilir.');
      }
      if (needs.wantsCrypto) {
        if ((b.weights.CRYPTO || 0) >= 2) bullets.push('Kripto ilgine daha uygun bir seçenek.');
        else bullets.push('Kripto istiyorsun: bu seçenekte kripto genelde harici platformla olur.');
      }
      if (needs.wantsInvest) {
        if ((b.weights.INVEST || 0) >= 3) bullets.push('Borsa/ETF tarafında güçlü bir aday.');
        else bullets.push('Borsa/ETF istiyorsun: bu seçenekte yatırım tarafını ayrıca doğrula.');
      }
      if (needs.wantsExpat) {
        if ((b.weights.EXPAT || 0) >= 2) bullets.push('Dil/kurulum açısından expat dostu tarafa daha yakın.');
        else bullets.push('Expat ihtiyaçların var: dil/kurulum süreçlerini kontrol et.');
      }

      if (b.id === 'sparkasse' || b.id === 'volksbank') {
        bullets.push('Yerel şube/ATM erişimi genelde güçlü olur; şehir/kasaba fark etmeksizin rahat eder.');
      }
      if (b.id === 'n26') {
        bullets.push('Tam mobil deneyim: hızlı kurulum + uygulama odaklı kullanım.');
      }
      if (b.id === 'ing' || b.id === 'dkb') {
        bullets.push('Direkt banka çizgisi: dijital kullanım + daha \'klasik banka\' hissi dengesi.');
      }
      if (b.id === 'traderepublic') {
        bullets.push('Bu bir banka hesabından ziyade yatırım odaklı uygulamadır; ana banka yanında kullanmak mantıklı olabilir.');
      }

      const tags = topSignals
        .map(s => PROFILES[s.key]?.title)
        .filter(Boolean);

      return { bank: b, rank: idx + 1, tags, bullets };
    });
  }, [calculateBankScore, needs, topSignals]);

  const handleAnswer = (optionKey: string) => {
    const newAnswers = { ...answers, [question.id]: optionKey };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Kopyalama başarısız. Tarayıcı izinlerini kontrol et.');
    }
  };

  const buildCopyText = () => {
    let out = 'almanya101.de • Banka Seçimi Sonucu\n\n';
    recommendations.forEach(r => {
      out += `#${r.rank} ${r.bank.name} (${r.bank.type}) — Skor: ${Math.round(r.bank.score)}\n`;
      r.bullets.slice(0, 3).forEach(b => (out += `- ${b}\n`));
      out += '\n';
    });
    out += 'Not: Ücretler/koşullar değişebilir. Son karardan önce bankanın güncel şartlarını kontrol et.\n';
    return out;
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {!showResult && (
        <div className="max-w-xl mx-auto mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/50 text-sm">
              Soru {currentQuestion + 1} / {totalQuestions}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Sıfırla
            </button>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full px-5 py-4 text-left text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span>Nasıl çalışır?</span>
          <span className="text-gray-400 text-sm">{showInfo ? '▲' : '▼'}</span>
        </button>
        {showInfo && (
          <div className="px-5 pb-4 text-gray-500 text-sm border-t border-gray-100">
            <ul className="list-disc list-inside space-y-1 pt-3">
              <li>Bu araç 20 soruyla size en uygun bankacılık profilini önerir.</li>
              <li>Sonuçlar yönlendirme amaçlıdır; son kararınızı vermeden önce bankanın güncel şartlarını kontrol edin.</li>
              <li>Ücretler, kart koşulları, şube erişimi ve müşteri hizmetleri bankaya göre değişebilir.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Question Card */}
      {!showResult && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          {/* Kategori etiketi */}
          <div className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-2">
            {question.category}
          </div>

          {/* Soru */}
          <h2 className="text-gray-900 font-bold text-lg leading-tight mb-1">
            {question.title}
          </h2>
          <p className="text-gray-500 text-sm mb-5">{question.desc}</p>

          {/* Seçenekler */}
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                  answers[question.id] === option.key
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                )}
              >
                <span className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
                  answers[question.id] === option.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                )}>
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Alt bar */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ← Geri
            </button>
            <span className="text-xs text-gray-400">Seçince otomatik ilerler</span>
          </div>
        </div>
      )}

      {/* Result Card */}
      {showResult && (
        <div className="bg-gradient-to-br from-[#8F03B7] to-[#6B02A3] rounded-2xl p-5 text-white">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">Sonuç</h2>
            <p className="text-sm text-white/85">Cevaplarına göre en uygun bankacılık profilleri:</p>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.bank.id} className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBB00]" />
                  <span className="font-bold text-lg">#{rec.rank} • {rec.bank.name}</span>
                  <span className="text-sm text-white/70">({rec.bank.type})</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {rec.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-sm font-semibold mb-2">
                  Uygunluk Skoru: {Math.round(rec.bank.score)}
                </div>

                <ul className="text-xs text-white/85 space-y-1 list-disc list-inside">
                  {rec.bullets.slice(0, 5).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/20 my-4" />

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 text-sm bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              Sıfırla
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 text-sm bg-[#FFBB00] hover:bg-[#ffcc33] text-gray-900 px-4 py-2.5 rounded-lg transition-colors font-bold"
            >
              {copied ? 'Kopyalandı!' : 'Sonucu kopyala'}
            </button>
          </div>

          <p className="text-xs text-white/60 mt-4 leading-relaxed">
            Not: Bu araç yönlendirme amaçlıdır. Son seçimde ücretler, kart koşulları, şube erişimi, müşteri hizmetleri ve kimlik doğrulama seçeneklerini bankanın kendi sayfasından kontrol et.
          </p>
        </div>
      )}
    </div>
  );
}
