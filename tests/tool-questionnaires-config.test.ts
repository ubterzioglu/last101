import { describe, expect, it } from 'vitest';
import { TOOL_QUESTIONNAIRE_REGISTRY } from '@/lib/tools/surveys';

describe('tool questionnaire registry', () => {
  it('contains exactly the 10 public tool questionnaires', () => {
    expect(Object.keys(TOOL_QUESTIONNAIRE_REGISTRY)).toHaveLength(10);
  });

  it('keeps each questionnaire internally valid', () => {
    for (const [slug, config] of Object.entries(TOOL_QUESTIONNAIRE_REGISTRY)) {
      expect(config.toolSlug).toBe(slug);
      expect(config.questions).toHaveLength(15);
      expect(
        config.questions.reduce((sum, question) => sum + question.weight, 0)
      ).toBeCloseTo(1, 5);
      expect(new Set(config.questions.map((question) => question.id)).size).toBe(15);
    }
  });
});
