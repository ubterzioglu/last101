import { describe, expect, it } from 'vitest';
import { TONE_CYCLE, TONE_STYLES, toneAt } from '@/components/site/tones';
import { SITE_COLORS } from '@/constants/design-tokens';

describe('site tones', () => {
  it('cycles the four firmascope category colours in order', () => {
    expect([0, 1, 2, 3, 4, 5].map(toneAt)).toEqual([
      'blue',
      'green',
      'orange',
      'yellow',
      'blue',
      'green',
    ]);
  });

  it('defines classes for every category colour in the palette', () => {
    expect(Object.keys(TONE_STYLES).sort()).toEqual(Object.keys(SITE_COLORS.alm).sort());
  });

  it('uses literal Tailwind class names so the JIT compiler can see them', () => {
    for (const [tone, styles] of Object.entries(TONE_STYLES)) {
      expect(styles.text).toBe(`text-alm-${tone}-ink`);
      expect(styles.tint).toBe(`bg-alm-${tone}/10`);
      expect(styles.solid).toBe(`bg-alm-${tone}`);
    }
  });

  it('only cycles through tones that have styles', () => {
    for (const tone of TONE_CYCLE) {
      expect(TONE_STYLES[tone]).toBeDefined();
    }
  });
});
