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

    // 2026-07-05 anket sürümü: 20 soru, eşit ağırlık (0.05) → 8/20 olumlu = 40.
    expect(result.toolScore).toBe(40);
    expect(result.dimensionScores.fit).toBe(100);
    expect(result.dimensionScores.readiness).toBe(0);
    expect(result.category).toBe('Yüksek risk / önce hazırlık');
  });

  it('weights questions by their weight, not by count', () => {
    // 1 ağır (0.81) + 19 hafif (0.01) soru; yalnızca ağır olan olumlu → 81 (sayıya göre olsaydı 5).
    const config = createToolQuestionnaireConfig('weighted-tool', [
      createBooleanQuestion('heavy', 'Ağır soru', 0.81, 'fit', 'Demo soru'),
      ...Array.from({ length: 19 }, (_, index) =>
        createBooleanQuestion(`light_${index + 1}`, `Hafif soru ${index + 1}`, 0.01, 'readiness', 'Demo soru')
      ),
    ]);

    const answers = scoreAnswers(
      config,
      config.questions.map((question) => ({ questionId: question.id, value: question.id === 'heavy' }))
    );

    const result = computeToolScore(config, answers);

    expect(result.toolScore).toBe(81);
    expect(result.dimensionScores).toEqual({ fit: 100, readiness: 0 });
    expect(result.category).toBe('Güçlü uyum');
  });
});
