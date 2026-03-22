'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { INSURANCE_TYPES, QUESTIONS } from './data';
import { ClassifiedResult } from './types';
import { cn } from '@/lib/utils/cn';

export default function SigortaClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

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
    <div className="space-y-2">

      {/* Başlık + Nasıl Çalışır accordion */}
      <div
        className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Sigorta Seçim Aracı</h1>
            <div className="flex items-center gap-1 mt-0.5 text-google-blue font-medium text-sm">
              Nasıl Çalışır?
            </div>
          </div>
          <span className={cn("text-google-blue text-xl transition-transform duration-200", showInfo && "rotate-180")}>▾</span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• Bu araç 20 soruyla sigortalarınızı önceliklendirir.</li>
              <li>• Sonuçlar bilgilendirme amaçlıdır.</li>
              <li>• Sözleşme öncesi kapsam ve şartları kontrol edin.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Bu araç neden var? */}
      <div
        className="bg-white rounded-xl border-2 border-google-green overflow-hidden cursor-pointer select-none"
        onClick={() => setShowWhy(!showWhy)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Bu araç neden var?</span>
          <span className={cn("text-google-green text-xl transition-transform duration-200", showWhy && "rotate-180")}>▾</span>
        </div>
        {showWhy && (
          <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
            <p className="text-sm text-green-900 pt-3 leading-relaxed">
              Almanya'da yaşamak, doğru sigortaları seçmeyi neredeyse zorunlu kılar. Sağlık sigortası yasal olarak zorunlu, ancak bunun yanı sıra kira sigortası, kişisel sorumluluk sigortası (Haftpflicht), araç sigortası, iş göremezlik sigortası ve daha pek çok seçenek var. Hangilerini almanın şart, hangilerinin tavsiye edilebilir, hangilerinin opsiyonel olduğu ise yaşam durumuna ve önceliklerine göre değişir. Bu araç, birkaç soruyla senin için önemli olan sigortaları öncelik sırasıyla listeler.
            </p>
          </div>
        )}
      </div>

      {/* Progress */}
      {!showResult && (
        <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-google-red">Soru {currentQuestion + 1} / {totalQuestions}</span>
            <button onClick={handleReset} className="text-sm text-google-red hover:opacity-75">Sıfırla</button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-google-red transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Question Card */}
      {!showResult && (
        <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
          <h2 className="text-gray-900 font-bold text-lg leading-tight mb-1">{question.title}</h2>
          <p className="text-gray-500 text-sm mb-4">{question.desc}</p>

          <div className="space-y-2">
            {question.type === 'yesno' && (['yes', 'no'] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={cn(
                  'w-full p-4 rounded-lg border-2 text-left transition-all',
                  answers[question.id] === key
                    ? 'border-google-blue bg-blue-100'
                    : 'border-google-blue/30 bg-blue-50/60 hover:bg-blue-100/80 hover:border-google-blue'
                )}
              >
                <div className="font-semibold text-sm text-gray-900">{key === 'yes' ? 'Evet' : 'Hayır'}</div>
                <div className="text-xs text-gray-500 mt-0.5">{key === 'yes' ? 'Bu durum bende var.' : 'Bu durum bende yok.'}</div>
              </button>
            ))}

            {question.type === 'single' && question.options?.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={cn(
                  'w-full p-4 rounded-lg border-2 text-left transition-all',
                  answers[question.id] === option.key
                    ? 'border-google-blue bg-blue-100'
                    : 'border-google-blue/30 bg-blue-50/60 hover:bg-blue-100/80 hover:border-google-blue'
                )}
              >
                <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
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
        <>
          <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
            <h2 className="text-gray-900 font-bold text-2xl mb-0.5">Sonuç</h2>
            <p className="text-gray-500 text-sm">Cevaplarına göre sigorta önceliklendirmen</p>
          </div>

          {classified.must.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-google-red p-5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-red text-white">Yüksek Öncelikli</span>
              <div className="space-y-2 mt-3">
                {classified.must.map((item) => (
                  <div key={item.key} className="rounded-lg p-3 border border-red-100 bg-red-50">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-500">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-0.5">
                      {item.reasons.map((r, i) => (
                        <li key={i} className="flex gap-2"><span className="text-gray-400 shrink-0">•</span>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {classified.should.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-yellow text-gray-800">Durumuna Bağlı</span>
              <div className="space-y-2 mt-3">
                {classified.should.map((item) => (
                  <div key={item.key} className="rounded-lg p-3 border border-yellow-100 bg-yellow-50">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-500">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-0.5">
                      {item.reasons.map((r, i) => (
                        <li key={i} className="flex gap-2"><span className="text-gray-400 shrink-0">•</span>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {classified.nice.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-google-green p-5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-google-green text-white">Opsiyonel</span>
              <div className="space-y-2 mt-3">
                {classified.nice.map((item) => (
                  <div key={item.key} className="rounded-lg p-3 border border-green-100 bg-green-50">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm font-bold text-gray-500">Skor: {item.score}</span>
                    </div>
                    <ul className="text-gray-600 text-sm space-y-0.5">
                      {item.reasons.map((r, i) => (
                        <li key={i} className="flex gap-2"><span className="text-gray-400 shrink-0">•</span>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleReset} className="w-full flex items-center justify-center rounded-xl border-2 border-google-orange bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Sıfırla
          </button>
          <button onClick={handleCopy} className="w-full flex items-center justify-center rounded-xl border-2 border-google-blue bg-google-blue text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
          </button>
          <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Ana Sayfaya Dön
          </Link>
        </>
      )}
      <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
