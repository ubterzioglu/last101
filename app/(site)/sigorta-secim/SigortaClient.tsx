'use client';

import { useState, useMemo } from 'react';
import { INSURANCE_TYPES, QUESTIONS } from './data';
import { ClassifiedResult } from './types';
import { cn } from '@/lib/utils/cn';

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
    return lines.join('\n');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">

      {/* Info Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-google-blue">
        <div className="px-5 pt-5 pb-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sigorta Seçim Aracı</h1>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full px-5 py-4 text-left text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span>Nasıl çalışır?</span>
          <span className="text-gray-400 text-sm">{showInfo ? '▲' : '▼'}</span>
        </button>
        {showInfo && (
          <div className="px-5 pb-4 text-gray-500 text-sm border-t border-gray-100 pt-3">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Bu araç 20 soruyla sigortalarınızı önceliklendirir.</li>
              <li>Sonuçlar bilgilendirme amaçlıdır.</li>
              <li>Sözleşme öncesi kapsam ve şartları kontrol edin.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Progress Card */}
      {!showResult && (
        <div className="max-w-xl mx-auto mb-3 bg-white rounded-2xl px-5 py-4 border-t-4 border-google-green">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">
              Soru {currentQuestion + 1} / {totalQuestions}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sıfırla
            </button>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-google-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      {!showResult && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-google-blue min-h-[420px] flex flex-col">
          <h2 className="text-gray-900 font-bold text-lg leading-tight mb-1">
            {question.title}
          </h2>
          <p className="text-gray-500 text-sm mb-5">{question.desc}</p>

          <div className="space-y-3">
            {question.type === 'yesno' && (
              <>
                {(['yes', 'no'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleAnswer(key)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                      answers[question.id] === key
                        ? 'bg-blue-50 border-2 border-google-blue'
                        : 'bg-google-blue/10 border border-blue-100 hover:border-google-blue/40 hover:bg-blue-50/30'
                    )}
                  >
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        {key === 'yes' ? 'Evet' : 'Hayır'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {key === 'yes' ? 'Bu durum bende var.' : 'Bu durum bende yok.'}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {question.type === 'single' && question.options?.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                  answers[question.id] === option.key
                    ? 'bg-blue-50 border-2 border-google-blue'
                    : 'bg-google-blue/10 border border-blue-100 hover:border-google-blue/40 hover:bg-blue-50/30'
                )}
              >
                <div>
                  <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
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

      {/* Result */}
      {showResult && (
        <div className="max-w-xl mx-auto space-y-4">

          {/* Başlık kartı */}
          <div className="bg-white rounded-2xl px-5 py-4 text-center border-t-4 border-google-orange">
            <h2 className="text-gray-900 font-bold text-2xl">Sonuçların hazır!</h2>
          </div>

          {/* Yüksek Öncelikli */}
          {classified.must.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-md border-t-4 border-google-red">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-red text-white">
                  Yüksek Öncelikli
                </span>
              </div>
              <div className="space-y-3">
                {classified.must.map((item) => (
                  <div key={item.key} className="rounded-xl p-4 border border-red-100 bg-red-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-900">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
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
            <div className="bg-white rounded-2xl p-5 shadow-md border-t-4 border-google-yellow">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-yellow text-gray-800">
                  Durumuna Bağlı
                </span>
              </div>
              <div className="space-y-3">
                {classified.should.map((item) => (
                  <div key={item.key} className="rounded-xl p-4 border border-yellow-100 bg-yellow-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-900">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
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
            <div className="bg-white rounded-2xl p-5 shadow-md border-t-4 border-google-green">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-green text-white">
                  Opsiyonel
                </span>
              </div>
              <div className="space-y-3">
                {classified.nice.map((item) => (
                  <div key={item.key} className="rounded-xl p-4 border border-green-100 bg-green-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-900">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                      {item.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="w-full text-sm bg-google-blue hover:bg-google-blue/90 text-white px-4 py-2.5 rounded-xl transition-colors font-bold"
            >
              {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
            </button>
            <button
              onClick={handleReset}
              className="w-full text-sm text-white/70 border border-white/20 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              Tekrar Yap
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
