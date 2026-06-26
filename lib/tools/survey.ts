import type {
  QuestionnaireAnswerPayload,
  QuestionnaireAnswerValue,
  QuestionnaireOption,
  QuestionnaireQuestion,
  ToolQuestionnaireConfig,
} from '@/lib/tools/types';

export const QUESTIONNAIRE_WEIGHTS = [
  0.1,
  0.09,
  0.08,
  0.08,
  0.07,
  0.07,
  0.07,
  0.07,
  0.06,
  0.06,
  0.06,
  0.05,
  0.05,
  0.05,
  0.04,
] as const;

export const QUESTIONNAIRE_VERSION = '2026-06-26';

export const QUESTIONNAIRE_CATEGORY_LABELS = {
  strong: 'Güçlü uyum',
  usable: 'Kullanılabilir',
  unclear: 'Belirsiz / geliştirmeli',
  risky: 'Yüksek risk / önce hazırlık',
} as const;

const DIMENSION_LABELS: Record<string, string> = {
  competition: 'Rekabet gücü',
  execution: 'Uygulama gücü',
  feasibility: 'Uygulanabilirlik',
  fit: 'Uyum',
  lifestyle: 'Yaşam uyumu',
  market: 'Piyasa uyumu',
  planning: 'Plan netliği',
  priority: 'Öncelik netliği',
  readiness: 'Hazırlık',
  stability: 'İstikrar',
  support: 'Destek uyumu',
};

export function getQuestionnaireDimensionLabel(key: string) {
  return DIMENSION_LABELS[key] ?? key.replace(/[_-]/g, ' ');
}

export function normalizeLikert(value: number, reverse = false): number {
  const clamped = Math.max(1, Math.min(5, value));
  const direct = ((clamped - 1) / 4) * 100;
  return reverse ? 100 - direct : direct;
}

export function normalizeBoolean(value: boolean, reverse = false): number {
  const direct = value ? 100 : 0;
  return reverse ? 100 - direct : direct;
}

export function normalizeNumeric(value: number, question: QuestionnaireQuestion): number {
  const bands = question.numericRange?.bands ?? [];
  const band = bands.find((item) => value >= item.min && value <= item.max);
  const direct = band?.score ?? 0;
  return question.reverse ? 100 - direct : direct;
}

export function scoreQuestion(
  question: QuestionnaireQuestion,
  rawValue: QuestionnaireAnswerValue
) {
  switch (question.answerType) {
    case 'likert_1_5':
      return normalizeLikert(Number(rawValue), question.reverse);
    case 'boolean':
      return normalizeBoolean(Boolean(rawValue), question.reverse);
    case 'single_choice': {
      const option = question.options?.find((item) => item.key === rawValue);
      if (!option) {
        return 0;
      }

      return question.reverse ? 100 - option.score : option.score;
    }
    case 'numeric':
      return normalizeNumeric(Number(rawValue), question);
    default:
      return 0;
  }
}

export function scoreAnswers(
  config: ToolQuestionnaireConfig,
  rawAnswers: Array<{ questionId: string; value: QuestionnaireAnswerValue }>
): QuestionnaireAnswerPayload[] {
  const answerMap = new Map(rawAnswers.map((item) => [item.questionId, item.value]));

  return config.questions.map((question) => {
    const value = answerMap.get(question.id);

    return {
      questionId: question.id,
      value: value ?? '',
      score: scoreQuestion(question, value ?? ''),
    };
  });
}

export function getQuestionnaireCategory(toolScore: number) {
  if (toolScore >= 80) {
    return QUESTIONNAIRE_CATEGORY_LABELS.strong;
  }
  if (toolScore >= 65) {
    return QUESTIONNAIRE_CATEGORY_LABELS.usable;
  }
  if (toolScore >= 50) {
    return QUESTIONNAIRE_CATEGORY_LABELS.unclear;
  }

  return QUESTIONNAIRE_CATEGORY_LABELS.risky;
}

export function computeToolScore(
  config: ToolQuestionnaireConfig,
  answers: QuestionnaireAnswerPayload[]
) {
  const answerMap = new Map(answers.map((item) => [item.questionId, item.score]));
  let weightedTotal = 0;
  let weightTotal = 0;
  const dimensionBuckets: Record<string, { total: number; weight: number }> = {};

  for (const question of config.questions) {
    const score = answerMap.get(question.id) ?? 0;
    weightedTotal += score * question.weight;
    weightTotal += question.weight;

    if (!question.dimension) {
      continue;
    }

    dimensionBuckets[question.dimension] ??= { total: 0, weight: 0 };
    dimensionBuckets[question.dimension].total += score * question.weight;
    dimensionBuckets[question.dimension].weight += question.weight;
  }

  const toolScore = weightTotal === 0 ? 0 : weightedTotal / weightTotal;
  const dimensionScores = Object.fromEntries(
    Object.entries(dimensionBuckets).map(([key, bucket]) => [
      key,
      Number((bucket.weight === 0 ? 0 : bucket.total / bucket.weight).toFixed(1)),
    ])
  );

  return {
    toolScore: Number(toolScore.toFixed(1)),
    dimensionScores,
    category: getQuestionnaireCategory(toolScore),
  };
}

export function validateQuestionnaireAnswerValue(
  question: QuestionnaireQuestion,
  value: QuestionnaireAnswerValue | undefined
) {
  switch (question.answerType) {
    case 'likert_1_5':
      return typeof value === 'number' && value >= 1 && value <= 5;
    case 'boolean':
      return typeof value === 'boolean';
    case 'single_choice':
      return (
        typeof value === 'string' &&
        (question.options ?? []).some((option) => option.key === value)
      );
    case 'numeric':
      return typeof value === 'number';
    default:
      return false;
  }
}

export function validateQuestionnaireConfig(config: ToolQuestionnaireConfig) {
  if (config.completionMode !== 'post-result') {
    throw new Error(`${config.toolSlug}: unsupported completion mode`);
  }

  if (config.questions.length !== 15) {
    throw new Error(`${config.toolSlug}: questionnaire must contain exactly 15 questions`);
  }

  const ids = new Set<string>();
  let weightTotal = 0;

  for (const question of config.questions) {
    if (ids.has(question.id)) {
      throw new Error(`${config.toolSlug}: duplicate question id "${question.id}"`);
    }

    ids.add(question.id);
    weightTotal += question.weight;

    if (question.answerType === 'single_choice' && (!question.options || question.options.length === 0)) {
      throw new Error(`${config.toolSlug}: single choice question "${question.id}" needs options`);
    }
  }

  if (Math.abs(weightTotal - 1) > 0.001) {
    throw new Error(`${config.toolSlug}: questionnaire weights must add up to 1.0`);
  }

  return true;
}

function baseQuestion(
  id: string,
  text: string,
  weight: number,
  dimension: string,
  rationale: string
) {
  return {
    id,
    text,
    weight,
    dimension,
    rationale,
  };
}

export function createLikertQuestion(
  id: string,
  text: string,
  weight: number,
  dimension: string,
  rationale: string,
  reverse = false
): QuestionnaireQuestion {
  return {
    ...baseQuestion(id, text, weight, dimension, rationale),
    answerType: 'likert_1_5',
    reverse,
  };
}

export function createBooleanQuestion(
  id: string,
  text: string,
  weight: number,
  dimension: string,
  rationale: string,
  reverse = false
): QuestionnaireQuestion {
  return {
    ...baseQuestion(id, text, weight, dimension, rationale),
    answerType: 'boolean',
    reverse,
  };
}

export function createSingleChoiceQuestion(
  id: string,
  text: string,
  weight: number,
  dimension: string,
  rationale: string,
  options: QuestionnaireOption[]
): QuestionnaireQuestion {
  return {
    ...baseQuestion(id, text, weight, dimension, rationale),
    answerType: 'single_choice',
    options,
  };
}

export function createToolQuestionnaireConfig(
  toolSlug: string,
  questions: QuestionnaireQuestion[]
): ToolQuestionnaireConfig {
  const config: ToolQuestionnaireConfig = {
    toolSlug,
    version: QUESTIONNAIRE_VERSION,
    completionMode: 'post-result',
    questions,
  };

  validateQuestionnaireConfig(config);

  return config;
}
