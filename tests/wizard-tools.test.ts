import { describe, expect, it } from 'vitest';

import {
  buildChips,
  buildWhy,
  calculateResults,
  derivePrefs,
  labelForRank,
  normalizeScores,
  pickTop3,
} from '@/components/para-transferi/scoring';
import { TRANSFER_SYSTEMS } from '@/constants/para-transferi/systems';
import { QUESTIONS as VISA_QUESTIONS, RESULTS as VISA_RESULTS } from '@/app/(site)/vize-secim/data';

const wise = TRANSFER_SYSTEMS.find((s) => s.name === 'Wise');

describe('para-transferi scoring', () => {
  it('derives preferences from answers and clamps them to 0..15', () => {
    const prefs = derivePrefs({ q4: 'cost', q8: 'yes', q16: 'total_cost', q2: 'weekly', q3: 'small' });
    // 6 + 4 + 5 + 2 + 1 = 18 -> clamped to 15
    expect(prefs.cost).toBe(15);
    expect(prefs.speed).toBe(0);
    expect(Object.values(prefs).every((v) => v >= 0 && v <= 15)).toBe(true);
  });

  it('normalizes raw scores to 60..95 and falls back to 80 when all are equal', () => {
    const [a, b] = TRANSFER_SYSTEMS;
    const spread = normalizeScores([
      { ...a, raw: 10 },
      { ...b, raw: 30 },
    ]);
    expect(spread.map((s) => s.score)).toEqual([60, 95]);

    const flat = normalizeScores([
      { ...a, raw: 5 },
      { ...b, raw: 5 },
    ]);
    expect(flat.map((s) => s.score)).toEqual([80, 80]);
  });

  it('breaks score ties with the fixed provider order', () => {
    const remitly = TRANSFER_SYSTEMS.find((s) => s.name === 'Remitly');
    expect(wise && remitly).toBeTruthy();
    const top = pickTop3([
      { ...remitly!, raw: 0, score: 90 },
      { ...wise!, raw: 0, score: 90 },
    ]);
    expect(top.map((s) => s.name)).toEqual(['Wise', 'Remitly']);
  });

  it('returns three results ordered by score', () => {
    const results = calculateResults({ q4: 'speed', q5: 'yes', q11: 'yes' });
    expect(results).toHaveLength(3);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
  });

  it('builds at most six chips and two to four reasons', () => {
    expect(wise).toBeTruthy();
    const prefs = derivePrefs({ q4: 'cost', q13: 'yes' });
    expect(buildChips(wise!, prefs).length).toBeLessThanOrEqual(6);
    const why = buildWhy(wise!, prefs);
    expect(why.length).toBeGreaterThanOrEqual(2);
    expect(why.length).toBeLessThanOrEqual(4);
  });

  it('labels the three ranks', () => {
    expect([0, 1, 2].map(labelForRank)).toEqual(['Ana öneri', 'Alternatif', 'Üçüncü seçenek']);
  });
});

describe('vize-secim decision tree', () => {
  const questionIds = new Set(VISA_QUESTIONS.map((q) => q.id));
  const resultIds = new Set(VISA_RESULTS.map((r) => r.id));

  it('starts at Q02 and has unique ids', () => {
    expect(questionIds.has('Q02')).toBe(true);
    expect(questionIds.size).toBe(VISA_QUESTIONS.length);
    expect(resultIds.size).toBe(VISA_RESULTS.length);
  });

  it('points every option at an existing question or result', () => {
    for (const q of VISA_QUESTIONS) {
      for (const opt of q.options) {
        if (opt.next.startsWith('RESULT:')) {
          expect(resultIds.has(opt.next.replace('RESULT:', '')), `${q.id}/${opt.key}`).toBe(true);
        } else {
          expect(questionIds.has(opt.next), `${q.id}/${opt.key}`).toBe(true);
        }
      }
    }
  });

  it('gives every result requirements and next steps', () => {
    for (const r of VISA_RESULTS) {
      expect(r.requirements.length, r.id).toBeGreaterThan(0);
      expect(r.steps.length, r.id).toBeGreaterThan(0);
    }
  });
});
