import { describe, expect, it } from 'vitest';
import {
  QUESTIONNAIRE_WEIGHTS,
  computeToolScore,
  createBooleanQuestion,
  createToolQuestionnaireConfig,
  normalizeBoolean,
  normalizeLikert,
  scoreAnswers,
} from '@/lib/tools/survey';

describe('survey helpers', () => {
  it('normalizes likert and reverse boolean scores correctly', () => {
    expect(normalizeLikert(5)).toBe(100);
    expect(normalizeLikert(2)).toBe(25);
    expect(normalizeBoolean(true, true)).toBe(0);
    expect(normalizeBoolean(false, true)).toBe(100);
  });

  it('computes weighted tool and dimension scores', () => {
    const config = createToolQuestionnaireConfig(
      'demo-tool',
      QUESTIONNAIRE_WEIGHTS.map((weight, index) =>
        createBooleanQuestion(
          `q_${index + 1}`,
          `Soru ${index + 1}`,
          weight,
          index < 8 ? 'fit' : 'readiness',
          'Demo soru'
        )
      )
    );

    const answers = scoreAnswers(
      config,
      config.questions.map((question, index) => ({
        questionId: question.id,
        value: index < 8,
      }))
    );

    const result = computeToolScore(config, answers);

    expect(result.toolScore).toBe(63);
    expect(result.dimensionScores.fit).toBe(100);
    expect(result.dimensionScores.readiness).toBe(0);
    expect(result.category).toBe('Belirsiz / geliştirmeli');
  });
});
