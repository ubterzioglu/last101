'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { getToolCatalogItem, getToolHref } from '@/lib/tools/catalog';
import type { ToolConfig, ToolResult, ToolState, ToolTone } from '@/lib/tools/types';

const TONE_STYLES: Record<ToolTone, { border: string; bg: string; text: string; badge: string }> = {
  blue: {
    border: 'border-google-blue',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-800',
  },
  green: {
    border: 'border-google-green',
    bg: 'bg-green-50',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-800',
  },
  yellow: {
    border: 'border-google-yellow',
    bg: 'bg-yellow-50',
    text: 'text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  orange: {
    border: 'border-google-orange',
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    badge: 'bg-orange-100 text-orange-800',
  },
  red: {
    border: 'border-google-red',
    bg: 'bg-red-50',
    text: 'text-red-900',
    badge: 'bg-red-100 text-red-800',
  },
};

function createInitialState(): ToolState {
  return {
    scores: {},
    facts: {},
    tags: [],
    answers: [],
  };
}

function mergeState(base: ToolState, option: ToolConfig['questions'][number]['options'][number], questionId: string): ToolState {
  const nextScores = { ...base.scores };
  const nextFacts = { ...base.facts };
  const nextTags = [...base.tags];

  if (option.effects?.scores) {
    for (const [key, value] of Object.entries(option.effects.scores)) {
      nextScores[key] = (nextScores[key] ?? 0) + value;
    }
  }

  if (option.effects?.facts) {
    for (const [key, value] of Object.entries(option.effects.facts)) {
      nextFacts[key] = value;
    }
  }

  if (option.effects?.tags) {
    for (const tag of option.effects.tags) {
      if (!nextTags.includes(tag)) {
        nextTags.push(tag);
      }
    }
  }

  return {
    scores: nextScores,
    facts: nextFacts,
    tags: nextTags,
    answers: [
      ...base.answers,
      {
        questionId,
        optionKey: option.key,
        label: option.label,
      },
    ],
  };
}

function Accordion({
  title,
  tone,
  children,
}: {
  title: string;
  tone: ToolTone;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={cn('overflow-hidden rounded-xl border-2 bg-white cursor-pointer select-none', styles.border)}
      onClick={() => setOpen((value) => !value)}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className={cn('text-xl transition-transform duration-200', styles.text, open && 'rotate-180')}>▾</span>
      </div>
      {open && <div className={cn('border-t px-4 pb-4 pt-3', styles.bg, styles.text)}>{children}</div>}
    </div>
  );
}

function ResultCard({ result }: { result: ToolResult }) {
  const styles = TONE_STYLES[result.tone];

  return (
    <div className={cn('rounded-xl border-2 bg-white p-5', styles.border)} data-pw="tool-result">
      <div className="mb-4">
        <span className={cn('mb-2 inline-block rounded-full px-2 py-1 text-xs font-semibold', styles.badge)}>
          {result.matchLabel}
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-700">{result.summary}</p>
      </div>

      {result.metrics && result.metrics.length > 0 && (
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          {result.metrics.map((metric) => {
            const tone = TONE_STYLES[metric.tone ?? result.tone];
            return (
              <div key={metric.label} className={cn('rounded-xl border p-4', tone.bg, tone.border)}>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{metric.label}</p>
                <p className="mt-2 text-xl font-bold text-gray-900">{metric.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className={cn('mb-4 rounded-xl p-4', styles.bg)}>
        <h3 className={cn('mb-2 text-sm font-semibold', styles.text)}>Neden bu sonuç çıktı?</h3>
        <ul className="space-y-2">
          {result.why.map((item) => (
            <li key={item} className={cn('flex gap-2 text-sm', styles.text)}>
              <span className="mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 rounded-xl bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Sonraki adımlar</h3>
        <ol className="space-y-2">
          {result.steps.map((step, index) => (
            <li key={step} className="flex gap-2 text-sm text-gray-700">
              <span className="w-5 shrink-0 font-bold text-gray-400">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {result.caution && (
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          {result.caution}
        </div>
      )}

      {result.officialSources && result.officialSources.length > 0 && (
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Bu sonuç için resmi kaynaklar</h3>
          <div className="flex flex-wrap gap-2">
            {result.officialSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:border-google-blue hover:text-google-blue"
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {result.relatedTools && result.relatedTools.length > 0 && (
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Sonra bakabileceğin araçlar</h3>
          <div className="flex flex-wrap gap-2">
            {result.relatedTools.map((slug) => {
              const item = getToolCatalogItem(slug);
              if (!item) {
                return null;
              }

              return (
                <Link
                  key={slug}
                  href={getToolHref(slug)}
                  className="rounded-full border border-google-blue px-3 py-1 text-sm font-medium text-google-blue hover:bg-blue-50"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ToolExperience({ config }: { config: ToolConfig }) {
  const [showWhoFor, setShowWhoFor] = useState(true);
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
    <div className="space-y-4 py-6">
      <div className="rounded-xl border-2 border-google-blue bg-white px-4 py-4">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">{config.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">{config.intro}</p>
      </div>

      <Accordion title="Nasıl çalışır?" tone="blue">
        <ul className="space-y-2 text-sm leading-6">
          {config.howItWorks.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Accordion>

      <Accordion title="Bu araç neden var?" tone="green">
        <p className="text-sm leading-6">{config.why}</p>
      </Accordion>

      <div className="overflow-hidden rounded-xl border-2 border-google-yellow bg-white">
        <button
          type="button"
          onClick={() => setShowWhoFor((value) => !value)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="font-semibold text-gray-900">Bu araç kim için?</span>
          <span className={cn('text-google-yellow text-xl transition-transform duration-200', showWhoFor && 'rotate-180')}>
            ▾
          </span>
        </button>
        {showWhoFor && (
          <div className="border-t border-yellow-200 bg-yellow-50 px-4 pb-4 pt-3">
            <ul className="space-y-2 text-sm leading-6 text-yellow-900">
              {config.whoFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl border-2 border-google-red bg-white px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-google-red">
            {resultId ? 'Sonuç hazır' : `Soru ${state.answers.length + 1}`}
          </span>
          <button type="button" onClick={handleReset} className="text-sm text-google-red hover:opacity-75" data-pw="tool-reset">
            Sıfırla
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-google-red transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!resolvedResult && currentQuestion && (
        <div className="rounded-xl border-2 border-google-yellow bg-white p-5" data-pw="tool-question-card">
          <p className="mb-1 text-lg font-bold leading-tight text-gray-900" data-pw="tool-question-title">
            {currentQuestion.text}
          </p>
          {currentQuestion.hint && <p className="mb-4 text-sm text-gray-500">{currentQuestion.hint}</p>}

          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handlePick(option.key)}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-800 transition-colors hover:border-google-yellow hover:bg-yellow-50"
                data-pw="tool-option"
              >
                <span>{option.label}</span>
                {option.hint && <span className="mt-1 block text-xs font-normal text-gray-500">{option.hint}</span>}
              </button>
            ))}
          </div>

          {snapshots.length > 0 && (
            <button type="button" onClick={handleBack} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
              ← Önceki soruya dön
            </button>
          )}
        </div>
      )}

      {resolvedResult && (
        <div className="space-y-3">
          <ResultCard result={resolvedResult} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleBack}
              className="w-full rounded-xl border-2 border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              ← Son soruya dön
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Yeniden başla
            </button>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
        <h2 className="text-lg font-semibold">Resmi kaynaklar</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {config.officialSources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85 hover:border-white/40 hover:text-white"
            >
              {source.label}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-50">
        <h2 className="text-lg font-semibold">Yasal not</h2>
        <p className="mt-2 text-sm leading-6">{config.legalNote}</p>
      </section>

      {config.relatedTools && config.relatedTools.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
          <h2 className="text-lg font-semibold">Diğer araçlar</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {config.relatedTools.map((slug) => {
              const item = getToolCatalogItem(slug);
              if (!item) {
                return null;
              }

              return (
                <Link
                  key={slug}
                  href={getToolHref(slug)}
                  className="rounded-xl border border-white/15 bg-white/[0.03] p-4 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="border-t border-white/10 pt-8 text-white" aria-labelledby="sss-baslik">
        <h2 id="sss-baslik" className="text-2xl font-bold md:text-3xl">
          Sıkça Sorulan Sorular
        </h2>
        <div className="mt-6 space-y-4">
          {config.faqs.map((item) => (
            <details key={item.question} className="group rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                {item.question}
              </summary>
              <p className="mt-3 leading-7 text-white/75">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
