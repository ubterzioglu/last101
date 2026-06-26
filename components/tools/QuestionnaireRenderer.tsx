'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  computeToolScore,
  getQuestionnaireDimensionLabel,
  scoreAnswers,
} from '@/lib/tools/survey';
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

function getCategoryTone(category: string) {
  if (category === 'Güçlü uyum') {
    return 'border-google-green bg-green-50 text-green-900';
  }
  if (category === 'Kullanılabilir') {
    return 'border-google-blue bg-blue-50 text-blue-900';
  }
  if (category === 'Belirsiz / geliştirmeli') {
    return 'border-google-yellow bg-yellow-50 text-yellow-900';
  }

  return 'border-google-red bg-red-50 text-red-900';
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

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white">
      <div className="space-y-2">
        <div className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">
          Derin değerlendirme
        </div>
        <h2 className="text-2xl font-bold">15 soruluk ikinci katman</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/75">
          Kısa araç sonucunu daha ölçülebilir hale getirmek için bu anket,
          hazırlık ve uygulanabilirlik sinyallerini tek skor altında toplar.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-white/80">
            {showSummary && isComplete
              ? 'Anket tamamlandı'
              : `Soru ${Math.min(answeredCount + 1, config.questions.length)} / ${config.questions.length}`}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Anketi sıfırla
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-google-blue transition-all duration-300"
            style={{ width: `${showSummary && isComplete ? 100 : Math.max((answeredCount / config.questions.length) * 100, 6)}%` }}
            data-pw="questionnaire-progress"
          />
        </div>
      </div>

      {!showSummary && currentQuestion && (
        <div className="rounded-2xl border-2 border-google-blue bg-white p-5 text-gray-900" data-pw="questionnaire-card">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-google-blue">
            Ölçüm sorusu
          </p>
          <h3 className="text-xl font-bold leading-tight">{currentQuestion.text}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">{currentQuestion.rationale}</p>

          <div className="mt-5 space-y-2">
            {getQuestionOptions(currentQuestion).map((option) => {
              const selected = answers[currentQuestion.id] === option.value;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full rounded-xl border-2 px-4 py-3 text-left transition-colors',
                    selected
                      ? 'border-google-blue bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-google-blue hover:bg-blue-50'
                  )}
                  data-pw="questionnaire-option"
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="mt-4 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              ← Önceki soruya dön
            </button>
          )}
        </div>
      )}

      {showSummary && scoreSummary && (
        <div className="space-y-4" data-pw="questionnaire-result">
          <div className="rounded-2xl border border-white/10 bg-white p-5 text-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Anket skoru</p>
                <h3 className="mt-1 text-3xl font-bold">%{scoreSummary.toolScore}</h3>
              </div>
              <div className={cn('rounded-full border px-3 py-1 text-sm font-semibold', getCategoryTone(scoreSummary.category))}>
                {scoreSummary.category}
              </div>
            </div>

            {Object.keys(scoreSummary.dimensionScores).length > 0 && (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {Object.entries(scoreSummary.dimensionScores).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {getQuestionnaireDimensionLabel(key)}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">%{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm leading-6 text-gray-700">
                Bu skor, mevcut araç sonucunu değiştirmez. Ama hangi alanlarda daha güçlü,
                hangi alanlarda daha kırılgan olduğunu daha ölçülebilir biçimde gösterir.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-white/80">
            {submissionState === 'submitting' && <p>Anket yanıtların kaydediliyor...</p>}
            {submissionState === 'success' && <p>Anket yanıtların başarıyla kaydedildi.</p>}
            {submissionState === 'error' && (
              <div className="space-y-3">
                <p>{submissionError || 'Anket yanıtları kaydedilemedi.'}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionState('idle');
                    setSubmissionError('');
                  }}
                  className="rounded-xl border border-white/20 px-3 py-2 font-semibold text-white transition-colors hover:border-white/40"
                >
                  Tekrar dene
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleEditLast}
              className="w-full rounded-xl border border-white/20 py-3 font-semibold text-white transition-colors hover:bg-white/5"
            >
              Son soruyu düzenle
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl border border-white/20 py-3 font-semibold text-white transition-colors hover:bg-white/5"
            >
              Anketi yeniden başlat
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
