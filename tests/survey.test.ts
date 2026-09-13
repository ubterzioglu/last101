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
    // Senaryo: ilk FIT_COUNT soru 'fit' boyutunda ve doğru (100), geri kalanı
    // 'readiness' boyutunda ve yanlış (0).
    // toolScore = (FIT_COUNT × 100 × 0.05) / (20 × 0.05) = 40
    // 40 < 50 olduğu için kategori 'risky' eşiğine düşer.
    const FIT_COUNT = 8;

    const config = createToolQuestionnaireConfig(
      'demo-tool',
      QUESTIONNAIRE_WEIGHTS.map((weight, index) =>
        createBooleanQuestion(
          `q_${index + 1}`,
          `Soru ${index + 1}`,
          weight,
          index < FIT_COUNT ? 'fit' : 'readiness',
          'Demo soru'
        )
      )
    );

    const answers = scoreAnswers(
      config,
      config.questions.map((question, index) => ({
        questionId: question.id,
        value: index < FIT_COUNT,
      }))
    );

    const result = computeToolScore(config, answers);

    expect(result.toolScore).toBe(40);
    expect(result.dimensionScores.fit).toBe(100);
    expect(result.dimensionScores.readiness).toBe(0);
    expect(result.category).toBe('Yüksek risk / önce hazırlık');
  });
});
