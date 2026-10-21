import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface EyebrowProps {
  children: ReactNode;
  /** `ink` on light surfaces, `light` on the dark band. */
  tone?: 'ink' | 'light';
  className?: string;
}

const EYEBROW_TONES: Record<NonNullable<EyebrowProps['tone']>, string> = {
  ink: 'text-ink',
  light: 'text-white',
};

/** Corteqs `.eyebrow`: small uppercase kicker above a heading. Use at most 3 per page. */
export function Eyebrow({ children, tone = 'ink', className }: EyebrowProps) {
  return (
    <div
      className={cn(
        'text-[13px] font-bold uppercase leading-snug tracking-[0.13em]',
        EYEBROW_TONES[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
