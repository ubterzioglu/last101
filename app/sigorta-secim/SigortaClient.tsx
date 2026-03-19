'use client';

import { useState, useMemo } from 'react';
import { INSURANCE_TYPES, PROVIDERS, QUESTIONS } from './data';
import { ClassifiedResult } from './types';

export default function SigortaClient() {
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
    Object.keys(INSURANCE_TYPES).forEach(k => (s[k] = INSURANCE_TYPES[k].base || 0));

    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;

      if (q.type === 'yesno') {
        const add = q.weight?.[a] || {};
        for (const k of Object.keys(add)) {
          s[k] = (s[k] || 0) + add[k];
        }
      }

      if (q.type === 'single' && q.options) {
        const opt = q.options.find(o => o.key === a);
        const add = opt?.add || {};
        for (const k of Object.keys(add)) {
          s[k] = (s[k] || 0) + add[k];
        }
      }
    }
    return s;
  }, [answers]);

  // Sonuçları sınıflandır
  const classified: ClassifiedResult = useMemo(() => {
    const must: Array<ReturnType<typeof getInsuranceWithScore>> = [];
    const should: Array<ReturnType<typeof getInsuranceWithScore>> = [];
    const nice: Array<ReturnType<typeof getInsuranceWithScore>> = [];

    function getInsuranceWithScore(key: string) {
      return { ...INSURANCE_TYPES[key], score: scores[key] || 0 };
    }

    for (const key of Object.keys(INSURANCE_TYPES)) {
      const item = getInsuranceWithScore(key);

      // Sağlık sigortası zorunlu gibi ele alındı
      if (key === 'HEALTH') {
        must.push(item);
        continue;
      }

      if (item.score >= item.mustAt) must.push(item);
      else if (item.score >= item.shouldAt) should.push(item);
      else nice.push(item);
    }

    const sortDesc = (a: { score: number }, b: { score: number }) => b.score - a.score;
    must.sort(sortDesc);
    should.sort(sortDesc);
    nice.sort(sortDesc);

    return { must, should, nice };
  }, [scores]);

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
    const lines: string[] = [];
    lines.push('almanya101 — Sigorta Prioritizer Sonuç');
    lines.push('--------------------------------------');
    lines.push('YÜKSEK ÖNCELİKLİ:');
    classified.must.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
    lines.push('');
    lines.push('DURUMUNA BAĞLI:');
    classified.should.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
    lines.push('');
    lines.push('OPSİYONEL:');
    classified.nice.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
    lines.push('');
    lines.push('Cevaplar:');
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;

      let label = a;
      if (q.type === 'yesno') label = a === 'yes' ? 'Evet' : 'Hayır';
      if (q.type === 'single') {
        label = q.options?.find(o => o.key === a)?.label || a;
      }
      lines.push(`- ${q.title} → ${label}`);
    }
    lines.push('');
    lines.push('Not: Bu çıktı bilgilendirme amaçlıdır; sözleşme öncesi kapsam/şartları kontrol et.');

    return lines.join('\n');
  };

  const escapeHtml = (str: string) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Progress Card */}
      {!showResult && (
        <div className="bg-[#F65314] rounded-2xl p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">
              Soru {currentQuestion + 1} / {totalQuestions}
            </span>
            <button
              onClick={handleReset}
              className="text-xs bg-white/25 hover:bg-white/40 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Sıfırla
            </button>
          </div>
          <div className="h-2 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-[#FFBB00] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full p-4 text-left text-gray-900 font-medium flex justify-between items-center"
        >
          <span>Bilgi</span>
          <span className="text-sm">{showInfo ? '▲' : '▼'}</span>
        </button>
        {showInfo && (
          <div className="px-4 pb-4 text-gray-800 text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Bu araç 20 soruyla sigortalarınızı önceliklendirir: Önce Al, Güçlü Öneri, Opsiyonel.</li>
              <li>Sonuçlar bilgilendirme amaçlıdır; sözleşme öncesi kapsam ve şartları kontrol edin.</li>
              <li>Sağlık sigortası türü (GKV/PKV), iş durumu, aile durumu ve araç/konut gibi faktörler kişisel duruma göre değişebilir.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Question Card */}
      {!showResult && (
        <div className="bg-[#F65314] rounded-2xl p-5 text-white min-h-[400px] flex flex-col">
          <div className="mb-4">
            <h1 className="text-lg font-bold mb-2 leading-tight">{question.title}</h1>
            <p className="text-sm text-white/90">{question.desc}</p>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto">
            {question.type === 'yesno' && (
              <>
                <button
                  onClick={() => handleAnswer('yes')}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border transition-all text-left
                    ${answers[question.id] === 'yes'
                      ? 'bg-white/25 border-white'
                      : 'bg-white/10 border-white/25 hover:bg-white/20'
                    }`}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <div className="font-semibold text-sm">Evet</div>
                    <div className="text-xs text-white/80">Bu durum bende var.</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border transition-all text-left
                    ${answers[question.id] === 'no'
                      ? 'bg-white/25 border-white'
                      : 'bg-white/10 border-white/25 hover:bg-white/20'
                    }`}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <div className="font-semibold text-sm">Hayır</div>
                    <div className="text-xs text-white/80">Bu durum bende yok.</div>
                  </div>
                </button>
              </>
            )}

            {question.type === 'single' && question.options?.map((option, idx) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border transition-all text-left
                  ${answers[question.id] === option.key
                    ? 'bg-white/25 border-white'
                    : 'bg-white/10 border-white/25 hover:bg-white/20'
                  }`}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-white/80">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-sm bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Geri
            </button>
            <span className="text-xs text-white/75">Bir şık seçince otomatik ilerler</span>
          </div>
        </div>
      )}

      {/* Result Card */}
      {showResult && (
        <div className="space-y-4">
          {/* Özet */}
          <div className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-2xl p-5 text-white">
            <h2 className="text-2xl font-bold mb-1">Önceliklendirme Sonucu</h2>
            <p className="text-sm text-white/85">Cevaplarına göre sigortaları 3 katmanda sıraladım.</p>
          </div>

          {/* Yüksek Öncelikli */}
          {classified.must.length > 0 && (
            <div className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBB00]" />
                <span className="text-xl font-bold">Yüksek Öncelikli</span>
              </div>
              <div className="space-y-3">
                {classified.must.map((item) => (
                  <div key={item.key} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-white/70 mb-2">Skor: {item.score}</p>
                    <ul className="text-xs text-white/85 space-y-1 list-disc list-inside">
                      {item.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Durumuna Bağlı */}
          {classified.should.length > 0 && (
            <div className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F03B7]" />
                <span className="text-xl font-bold">Durumuna Bağlı</span>
              </div>
              <div className="space-y-3">
                {classified.should.map((item) => (
                  <div key={item.key} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-white/70 mb-2">Skor: {item.score}</p>
                    <ul className="text-xs text-white/85 space-y-1 list-disc list-inside">
                      {item.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opsiyonel */}
          {classified.nice.length > 0 && (
            <div className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BF0000]" />
                <span className="text-xl font-bold">Opsiyonel</span>
              </div>
              <div className="space-y-3">
                {classified.nice.map((item) => (
                  <div key={item.key} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-white/70 mb-2">Skor: {item.score}</p>
                    <ul className="text-xs text-white/85 space-y-1 list-disc list-inside">
                      {item.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gradient-to-br from-[#F65314] to-[#D84315] rounded-2xl p-5 text-white">
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
              Not: Bu çıktı bilgilendirme amaçlıdır; sözleşme öncesi kapsam/şartları kontrol et.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
