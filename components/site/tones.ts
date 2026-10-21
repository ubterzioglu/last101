import type { AlmTone } from '@/constants/design-tokens';

export type SiteTone = AlmTone;

interface ToneClasses {
  /** 10% tinted surface (icon chips, colour tiles) */
  tint: string;
  /** 5% tinted surface (firmascope info boxes) */
  wash: string;
  /** 20% tinted border */
  border: string;
  /** AA-safe text tone */
  text: string;
  /** Solid fill: decoration only, never behind text */
  solid: string;
}

// Literal class names on purpose: Tailwind's JIT only sees complete strings.
export const TONE_STYLES: Record<SiteTone, ToneClasses> = {
  blue: {
    tint: 'bg-alm-blue/10',
    wash: 'bg-alm-blue/5',
    border: 'border-alm-blue/20',
    text: 'text-alm-blue-ink',
    solid: 'bg-alm-blue',
  },
  green: {
    tint: 'bg-alm-green/10',
    wash: 'bg-alm-green/5',
    border: 'border-alm-green/20',
    text: 'text-alm-green-ink',
    solid: 'bg-alm-green',
  },
  orange: {
    tint: 'bg-alm-orange/10',
    wash: 'bg-alm-orange/5',
    border: 'border-alm-orange/20',
    text: 'text-alm-orange-ink',
    solid: 'bg-alm-orange',
  },
  yellow: {
    tint: 'bg-alm-yellow/10',
    wash: 'bg-alm-yellow/5',
    border: 'border-alm-yellow/20',
    text: 'text-alm-yellow-ink',
    solid: 'bg-alm-yellow',
  },
  teal: {
    tint: 'bg-alm-teal/10',
    wash: 'bg-alm-teal/5',
    border: 'border-alm-teal/20',
    text: 'text-alm-teal-ink',
    solid: 'bg-alm-teal',
  },
  red: {
    tint: 'bg-alm-red/10',
    wash: 'bg-alm-red/5',
    border: 'border-alm-red/20',
    text: 'text-alm-red-ink',
    solid: 'bg-alm-red',
  },
};

/** firmascope rotates these four colours through lists (FAQ, info boxes). */
export const TONE_CYCLE: readonly SiteTone[] = ['blue', 'green', 'orange', 'yellow'];

export function toneAt(index: number): SiteTone {
  return TONE_CYCLE[index % TONE_CYCLE.length];
}
