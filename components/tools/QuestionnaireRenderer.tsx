'use client';

import { useEffect, useRef, useState } from 'react';
import { QuestionnaireSummary } from '@/components/tools/QuestionnaireSummary';
import { ToolOption } from '@/components/tools/ToolOption';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { Button } from '@/components/ui/Button';
import { computeToolScore, scoreAnswers } from '@/lib/tools/survey';
import type {
  QuestionnaireAnswerValue,
  QuestionnaireOption,
  QuestionnaireQuestion,
  ToolQuestionnaireConfig,
} from '@/lib/tools/types';

const SESSION_STORAGE_KEY = 'almanya101-tool-questionnaire-session';

const LIKERT_OPTIONS: QuestionnaireOption[] = [
  { key: '1', label: 'Hiç değil', score: 0 },
  { key: '2', label: 'Biraz', score: 25 },
  { key: '3', label: 'Kısmen', score: 50 },
  { key: '4', label: 'Büyük ölçüde', score: 75 },
  { key: '5', label: 'Tamamen', score: 100 },
];

const BOOLEAN_OPTIONS: Array<{ key: string; label: string; value: boolean }> = [
  { key: 'yes', label: 'Evet', value: true },
  { key: 'no', label: 'Hayır', value: false },
];

function hasAnswer(
  answers: Record<string, QuestionnaireAnswerValue>,
  questionId: string
) {
  return Object.prototype.hasOwnProperty.call(answers, questionId);
}

function getQuestionOptions(question: QuestionnaireQuestion) {
  if (question.answerType === 'likert_1_5') {
    return LIKERT_OPTIONS.map((option) => ({
      key: option.key,
      label: option.label,
      value: Number(option.key),
    }));
  }

  if (question.answerType === 'boolean') {
    return BOOLEAN_OPTIONS;
  }

  return (question.options ?? []).map((option) => ({
    key: option.key,
    label: option.label,
    value: option.key,
  }));
}

function createSessionId() {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const nextValue =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `anon_${Date.now()}`;

  sessionStorage.setItem(SESSION_STORAGE_KEY, nextValue);
  return nextValue;
}

export function QuestionnaireRenderer({
  config,
  toolSlug,
  resultId,
}: {
  config: ToolQuestionnaireConfig;
  toolSlug: string;
  resultId?: string | null;
}) {
  const [answers, setAnswers] = useState<Record<string, QuestionnaireAnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [submittedKey, setSubmittedKey] = useState('');
  const submittingKeyRef = useRef('');

  useEffect(() => {
    setSessionId(createSessionId());
  }, []);

  const answeredCount = config.questions.filter((question) => hasAnswer(answers, question.id)).length;
  const isComplete = answeredCount === config.questions.length;
  const currentQuestion = config.questions[currentIndex] ?? config.questions[0];
  const rawAnswerList = config.questions
    .filter((question) => hasAnswer(answers, question.id))
    .map((question) => ({
      questionId: question.id,
      value: answers[question.id],
    }));
  const scoredAnswers = isComplete ? scoreAnswers(config, rawAnswerList) : [];
  const scoreSummary = isComplete ? computeToolScore(config, scoredAnswers) : null;
  const completionKey =
    isComplete && scoreSummary
      ? JSON.stringify({
          resultId,
          answers: scoredAnswers.map((answer) => [answer.questionId, answer.value]),
          score: scoreSummary.toolScore,
        })
      : '';

  useEffect(() => {
    if (!isComplete || !showSummary || !sessionId || !completionKey) {
      return;
    }

    if (submittingKeyRef.current === completionKey || submittedKey === completionKey) {
      return;
    }

    async function submit() {
      const nextScoredAnswers = scoreAnswers(config, rawAnswerList);
      const nextScoreSummary = computeToolScore(config, nextScoredAnswers);

      submittingKeyRef.current = completionKey;
      setSubmissionState('submitting');
      setSubmissionError('');

      try {
        const response = await fetch('/api/tool-questionnaires', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toolSlug,
            version: config.version,
            sessionId,
            resultId: resultId ?? null,
            answers: nextScoredAnswers,
            toolScore: nextScoreSummary.toolScore,
            dimensionScores: nextScoreSummary.dimensionScores,
            meta: {
              pathname: window.location.pathname,
              submittedAt: new Date().toISOString(),
            },
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; error?: string }
          | null;

        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.error || 'Anket kaydı sırasında beklenmeyen bir hata oluştu.');
        }

        submittingKeyRef.current = '';
        setSubmissionState('success');
        setSubmittedKey(completionKey);
      } catch (error) {
        submittingKeyRef.current = '';
        setSubmissionState('error');
        setSubmissionError(
          error instanceof Error ? error.message : 'Anket kaydı sırasında bir hata oluştu.'
        );
      }
    }

    void submit();
  }, [
    completionKey,
    config.version,
    config,
    isComplete,
    resultId,
    rawAnswerList,
    sessionId,
    showSummary,
    submittedKey,
    toolSlug,
  ]);

  const handleSelect = (value: QuestionnaireAnswerValue) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
    setSubmissionState('idle');
    setSubmissionError('');

    if (currentIndex >= config.questions.length - 1) {
      setShowSummary(true);
      return;
    }

    setCurrentIndex((valueIndex) => valueIndex + 1);
  };

  const handleBack = () => {
    setShowSummary(false);
    setCurrentIndex((value) => Math.max(0, value - 1));
  };

  const handleEditLast = () => {
    setShowSummary(false);
    setCurrentIndex(config.questions.length - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
    setSubmissionState('idle');
    setSubmissionError('');
    setSubmittedKey('');
  };

  const progressPercent =
    showSummary && isComplete ? 100 : Math.max((answeredCount / config.questions.length) * 100, 6);

  return (
    <ToolPanel>
      <div className="space-y-2">
        <div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          Derin değerlendirme
        </div>
        <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          15 soruluk ikinci katman
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          Kısa araç sonucunu daha ölçülebilir hale getirmek için bu anket,
          hazırlık ve uygulanabilirlik sinyallerini tek skor altında toplar.
        </p>
      </div>

      <ToolProgress
        current={Math.min(answeredCount + 1, config.questions.length)}
        total={config.questions.length}
        label={showSummary && isComplete ? 'Anket tamamlandı' : undefined}
        percent={progressPercent}
        onReset={handleReset}
        resetLabel="Anketi sıfırla"
        barTestId="questionnaire-progress"
      />

      {!showSummary && currentQuestion && (
        <ToolQuestionCard
          testId="questionnaire-card"
          category="Ölçüm sorusu"
          title={currentQuestion.text}
          description={currentQuestion.rationale}
        >
          <div className="space-y-2">
            {getQuestionOptions(currentQuestion).map((option) => (
              <ToolOption
                key={option.key}
                selected={answers[currentQuestion.id] === option.value}
                onClick={() => handleSelect(option.value)}
                testId="questionnaire-option"
              >
                {option.label}
              </ToolOption>
            ))}
          </div>

          {currentIndex > 0 && (
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

      {showSummary && scoreSummary && (
        <div className="space-y-4" data-pw="questionnaire-result">
          <QuestionnaireSummary
            toolScore={scoreSummary.toolScore}
            category={scoreSummary.category}
            dimensionScores={scoreSummary.dimensionScores}
          />

          {submissionState !== 'idle' && (
            <div className="rounded-card border border-line bg-white p-4 text-sm text-ink" aria-live="polite">
              {submissionState === 'submitting' && <p>Anket yanıtların kaydediliyor...</p>}
              {submissionState === 'success' && <p>Anket yanıtların başarıyla kaydedildi.</p>}
              {submissionState === 'error' && (
                <div className="space-y-3">
                  <p className="text-alm-red-ink">{submissionError || 'Anket yanıtları kaydedilemedi.'}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmissionState('idle');
                      setSubmissionError('');
                    }}
                  >
                    Tekrar dene
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleEditLast} className="w-full">
              Son soruyu düzenle
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="w-full">
              Anketi yeniden başlat
            </Button>
          </div>
        </div>
      )}
    </ToolPanel>
  );
}