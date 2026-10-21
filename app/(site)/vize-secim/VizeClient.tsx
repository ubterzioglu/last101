'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QUESTIONS, RESULTS } from './data';
import { VizeResult } from './VizeResult';
import { Button } from '@/components/ui/Button';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { ToolOption } from '@/components/tools/ToolOption';

export default function VizeClient() {
  const [qId, setQId] = useState('Q02');
  const [history, setHistory] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  const q = QUESTIONS.find(x => x.id === qId) ?? null;
  const visaResult = resultId ? (RESULTS.find(r => r.id === resultId) ?? null) : null;
  const qNum = history.length + 1;
  const progressPct = Math.min((history.length / 5) * 100, 95);

  const pick = (next: string) => {
    if (next.startsWith('RESULT:')) {
      setResultId(next.replace('RESULT:', ''));
    } else {
      setHistory(h => [...h, qId]);
      setQId(next);
    }
  };

  const goBack = () => {
    if (resultId) { setResultId(null); return; }
    if (history.length > 0) {
      setQId(history[history.length - 1]);
      setHistory(h => h.slice(0, -1));
    }
  };

  const reset = () => { setQId('Q02'); setHistory([]); setResultId(null); };

  if (visaResult) {
    return <VizeResult result={visaResult} onReset={reset} onBack={goBack} />;
  }

  return (
    <ToolPanel>
      <ToolProgress
        current={history.length}
        total={5}
        label={`Soru ${qNum}`}
        percent={progressPct}
        onReset={reset}
      />

      {q && (
        <ToolQuestionCard title={q.text} description={q.hint}>
          <div className="space-y-2">
            {q.options.map(opt => (
              <ToolOption key={opt.key} onClick={() => pick(opt.next)}>
                {opt.label}
              </ToolOption>
            ))}
          </div>
          {history.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                onClick={goBack}
                className="-ml-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-btn px-2 text-sm font-semibold text-ink transition-colors hover:text-brand-700"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Önceki soruya dön
              </button>
            </div>
          )}
        </ToolQuestionCard>
      )}

      <div className="flex justify-end">
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </div>
    </ToolPanel>
  );
}
