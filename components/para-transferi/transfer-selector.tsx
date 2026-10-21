'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { QUESTIONS } from '@/constants/para-transferi/questions';
import { Button } from '@/components/ui/Button';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { ToolOption } from '@/components/tools/ToolOption';
import { buildWhy, calculateResults, derivePrefs, type Answers, type ScoredSystem } from './scoring';
import { TransferResults } from './transfer-results';

export function TransferSelector() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
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
    return (
      <TransferResults
        results={results}
        prefs={derivePrefs(answers)}
        copied={copied}
        onReset={handleReset}
        onCopy={copyResults}
      />
    );
  }

  // ---- SORU EKRANI ----
  const options = question.type === 'yesno'
    ? [{ key: 'yes', label: 'Evet', desc: 'Bana uyuyor.' }, { key: 'no', label: 'Hayır', desc: 'Bana uymuyor.' }]
    : (question.options ?? []);

  return (
    <ToolPanel>
      <ToolProgress
        current={currentQuestion + 1}
        total={QUESTIONS.length}
        percent={progress}
        onReset={handleReset}
      />

      <ToolQuestionCard title={question.title} description={question.desc}>
        <div className="space-y-2">
          {options.map((opt) => (
            <ToolOption
              key={opt.key}
              selected={answers[question.id] === opt.key}
              onClick={() => handleAnswer(opt.key)}
              description={opt.desc}
            >
              {opt.label}
            </ToolOption>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <Button variant="outline" size="sm" onClick={handleBack} disabled={currentQuestion === 0}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Geri
          </Button>
          <span className="text-xs text-muted">Bir şık seçince otomatik ilerler.</span>
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
