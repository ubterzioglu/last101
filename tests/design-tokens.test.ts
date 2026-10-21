import { describe, expect, it } from 'vitest';
import { SITE_COLORS } from '@/constants/design-tokens';

const WHITE = '#FFFFFF';
const AA_TEXT = 4.5;
const AA_LARGE_TEXT = 3;

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const normalized = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(normalized.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function mix(foreground: string, background: string, alpha: number): string {
  const parse = (hex: string) => [0, 2, 4].map((i) => parseInt(hex.replace('#', '').slice(i, i + 2), 16));
  const [f, b] = [parse(foreground), parse(background)];
  return `#${f
    .map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, '0'))
    .join('')}`;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe('site design tokens', () => {
  const { page, ink, muted, brand, alm } = SITE_COLORS;

  it('keeps body and secondary text readable on page and card surfaces', () => {
    expect(contrast(ink.DEFAULT, page)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(muted, page)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(muted, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('keeps white CTA labels readable on the brand fills', () => {
    expect(contrast(WHITE, brand[700])).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(WHITE, brand[800])).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('keeps brand links readable on page and card surfaces', () => {
    expect(contrast(brand[700], page)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(brand[700], WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('allows the headline accent tone only at large-text contrast', () => {
    expect(contrast(brand[600], page)).toBeGreaterThanOrEqual(AA_LARGE_TEXT);
  });

  it('keeps the dark band readable for white text and the bright brand accent', () => {
    expect(contrast(WHITE, ink.DEFAULT)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(brand[500], ink.DEFAULT)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('gives every category colour a text tone that passes AA on page and white', () => {
    for (const [name, tone] of Object.entries(alm)) {
      expect(contrast(tone.ink, page), `${name} ink on page`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(tone.ink, WHITE), `${name} ink on white`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it('keeps category text readable on its own 10% tint (chips, tags, icon tiles)', () => {
    for (const [name, tone] of Object.entries(alm)) {
      const tintOnPage = mix(tone.DEFAULT, page, 0.1);
      expect(contrast(tone.ink, tintOnPage), `${name} ink on its tint`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it('exposes the four firmascope category colours plus teal and red', () => {
    expect(Object.keys(alm).sort()).toEqual(['blue', 'green', 'orange', 'red', 'teal', 'yellow']);
  });
});
