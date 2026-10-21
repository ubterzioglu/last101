import type { ToolConfig, ToolState } from '@/lib/tools/types';

type ToolConfigOption = ToolConfig['questions'][number]['options'][number];

export function createInitialState(): ToolState {
  return {
    scores: {},
    facts: {},
    tags: [],
    answers: [],
  };
}

export function mergeState(base: ToolState, option: ToolConfigOption, questionId: string): ToolState {
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
