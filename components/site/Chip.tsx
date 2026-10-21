import type { ReactNode } from 'react';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export type ChipTone = SiteTone | 'neutral' | 'brand';

export interface ChipProps {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}

const NEUTRAL_CLASSES = 'border border-line bg-white text-ink';
// brand-800 keeps small text above AA on the brand-50 fill (5.6:1).
const BRAND_CLASSES = 'bg-brand-50 text-brand-800';

function toneClasses(tone: ChipTone): string {
  if (tone === 'neutral') return NEUTRAL_CLASSES;
  if (tone === 'brand') return BRAND_CLASSES;
  return cn(TONE_STYLES[tone].tint, TONE_STYLES[tone].text);
}

/** Pill label for tags, categories and filter values. Not interactive on its own. */
export function Chip({ children, tone = 'neutral', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        toneClasses(tone),
        className
      )}
    >
      {children}
    </span>
  );
}
