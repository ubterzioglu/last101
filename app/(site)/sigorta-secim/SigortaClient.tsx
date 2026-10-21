'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { INSURANCE_TYPES, QUESTIONS } from './data';
import { ClassifiedResult } from './types';
import { SigortaResults } from './SigortaResults';
import { Button } from '@/components/ui/Button';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { ToolOption } from '@/components/tools/ToolOption';

export default function SigortaClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const totalQuestions = QUESTIONS.length;

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

  if (showResult) {
    return <SigortaResults classified={classified} copied={copied} onReset={handleReset} onCopy={handleCopy} />;
  }

  return (
    <ToolPanel>
      <ToolProgress current={currentQuestion + 1} total={totalQuestions} onReset={handleReset} />

      <ToolQuestionCard title={question.title} description={question.desc}>
        <div className="space-y-2">
          {question.type === 'yesno' && (['yes', 'no'] as const).map((key) => (
            <ToolOption
              key={key}
              selected={answers[question.id] === key}
              onClick={() => handleAnswer(key)}
              description={key === 'yes' ? 'Bu durum bende var.' : 'Bu durum bende yok.'}
            >
              {key === 'yes' ? 'Evet' : 'Hayır'}
            </ToolOption>
          ))}

          {question.type === 'single' && question.options?.map((option) => (
            <ToolOption
              key={option.key}
              selected={answers[question.id] === option.key}
              onClick={() => handleAnswer(option.key)}
              description={option.desc}
            >
              {option.label}
            </ToolOption>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="-ml-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-btn px-2 text-sm font-semibold text-ink transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Geri
          </button>
          <span className="text-xs text-muted">Seçince otomatik ilerler</span>
        </div>
      </ToolQuestionCard>

      <div className="flex justify-end">
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </div>
    </ToolPanel>
  );
}
