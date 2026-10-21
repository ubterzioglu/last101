'use client';

import { useState } from 'react';
import { QuestionnaireRenderer } from '@/components/tools/QuestionnaireRenderer';
import { ToolFaq } from '@/components/tools/ToolFaq';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolOption } from '@/components/tools/ToolOption';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { ToolLegalNote, ToolResources } from '@/components/tools/ToolResources';
import { ToolResultCard } from '@/components/tools/ToolResultCard';
import { createInitialState, mergeState } from '@/components/tools/tool-state';
import { estimateMinutes } from '@/components/tools/tool-links';
import { Button } from '@/components/ui/Button';
import { getToolCatalogItem } from '@/lib/tools/catalog';
import type { ToolConfig, ToolState } from '@/lib/tools/types';

function buildHeroStats(questionCount: number) {
  return [
    { value: String(questionCount), label: 'soru' },
    { value: `${estimateMinutes(questionCount)} dk`, label: 'tahmini süre' },
    { value: 'Ücretsiz', label: 'üyelere açık' },
  ];
}

export function ToolExperience({ config }: { config: ToolConfig }) {
  const [currentQuestionId, setCurrentQuestionId] = useState(config.initialQuestionId);
  const [resultId, setResultId] = useState<string | null>(null);
  const [state, setState] = useState<ToolState>(createInitialState);
  const [snapshots, setSnapshots] = useState<Array<{ questionId: string; state: ToolState }>>([]);

  const currentQuestion = config.questions.find((question) => question.id === currentQuestionId) ?? null;
  const resolvedResult = resultId
    ? config.resolveResult?.({ resultId, state }) ?? config.results?.[resultId] ?? null
    : null;

  const progress = resultId
    ? 100
    : Math.min(((state.answers.length + 1) / config.estimatedQuestionCount) * 100, 95);

  const handlePick = (optionKey: string) => {
    if (!currentQuestion) {
      return;
    }

    const option = currentQuestion.options.find((item) => item.key === optionKey);
    if (!option) {
      return;
    }

    const nextState = mergeState(state, option, currentQuestion.id);

    setSnapshots((items) => [...items, { questionId: currentQuestion.id, state }]);
    setState(nextState);

    if (option.next.startsWith('RESULT:')) {
      setResultId(option.next.replace('RESULT:', ''));
      return;
    }

    setCurrentQuestionId(option.next);
  };

  const handleBack = () => {
    const previous = snapshots[snapshots.length - 1];
    if (!previous) {
      return;
    }

    setSnapshots((items) => items.slice(0, -1));
    setCurrentQuestionId(previous.questionId);
    setState(previous.state);
    setResultId(null);
  };

  const handleReset = () => {
    setCurrentQuestionId(config.initialQuestionId);
    setResultId(null);
    setState(createInitialState());
    setSnapshots([]);
  };

  return (
    <>
      <ToolHero
        eyebrow={getToolCatalogItem(config.slug)?.category ?? 'Araç'}
        title={config.title}
        intro={config.intro}
        stats={buildHeroStats(config.estimatedQuestionCount)}
        howItWorks={config.howItWorks}
      />

      <ToolPanel>
        <ToolProgress
          current={state.answers.length + 1}
          total={config.estimatedQuestionCount}
          label={resultId ? 'Sonuç hazır' : `Soru ${state.answers.length + 1}`}
          percent={progress}
          onReset={handleReset}
          resetTestId="tool-reset"
        />

        {!resolvedResult && currentQuestion && (
          <ToolQuestionCard
            title={currentQuestion.text}
            titleTestId="tool-question-title"
            description={currentQuestion.hint}
          >
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <ToolOption
                  key={option.key}
                  onClick={() => handlePick(option.key)}
                  description={option.hint}
                  testId="tool-option"
                >
                  {option.label}
                </ToolOption>
              ))}
            </div>

            {snapshots.length > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="mt-5 text-sm font-semibold text-muted transition-colors hover:text-brand-700"
              >
                ← Önceki soruya dön
              </button>
            )}
          </ToolQuestionCard>
        )}

        {resolvedResult && (
          <>
            <ToolResultCard result={resolvedResult} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                ← Son soruya dön
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="w-full">
                Yeniden başla
              </Button>
            </div>
          </>
        )}
      </ToolPanel>

      {resolvedResult && config.questionnaire && (
        <QuestionnaireRenderer config={config.questionnaire} toolSlug={config.slug} resultId={resolvedResult.id} />
      )}

      <ToolInfoBand why={config.why} whoFor={config.whoFor} />

      <ToolResources officialSources={config.officialSources} relatedTools={config.relatedTools} />

      <ToolFaq name={`${config.slug}-sss`} items={config.faqs} />

      <ToolLegalNote>{config.legalNote}</ToolLegalNote>
    </>
  );
}
