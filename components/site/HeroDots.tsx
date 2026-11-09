import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

interface Dot {
  position: string;
  size: string;
  color: string;
  /** Float cycle length in seconds; varied so the dots never move in unison. */
  duration: number;
  /** Negative delay starts each dot mid-cycle. */
  delay: number;
}

// firmascope-style dots: 8/12/20px, category colours at 30% opacity, slow float.
// Literal class names so Tailwind's JIT can see them.
const DOTS: readonly Dot[] = [
  { position: 'left-[5%] top-[10%]', size: 'size-2', color: 'bg-alm-blue', duration: 6, delay: 0 },
  { position: 'left-[2%] top-[42%]', size: 'size-3', color: 'bg-alm-green', duration: 8, delay: -2 },
  { position: 'left-[13%] top-[66%]', size: 'size-2', color: 'bg-alm-blue', duration: 7, delay: -4 },
  { position: 'left-[20%] top-[90%]', size: 'size-5', color: 'bg-alm-blue', duration: 9, delay: -1 },
  { position: 'left-[37%] top-[6%]', size: 'size-3', color: 'bg-alm-orange', duration: 7, delay: -3 },
  { position: 'left-[50%] top-[84%]', size: 'size-2', color: 'bg-alm-yellow', duration: 6, delay: -5 },
  { position: 'left-[70%] top-[94%]', size: 'size-3', color: 'bg-alm-yellow', duration: 8, delay: -2 },
  { position: 'left-[86%] top-[5%]', size: 'size-3', color: 'bg-alm-yellow', duration: 9, delay: -6 },
  { position: 'left-[94%] top-[48%]', size: 'size-5', color: 'bg-alm-orange', duration: 10, delay: -3 },
  { position: 'left-[97%] top-[88%]', size: 'size-2', color: 'bg-alm-green', duration: 7, delay: -1 },
  { position: 'left-[9%] top-[24%]', size: 'size-3', color: 'bg-alm-teal', duration: 8, delay: -4 },
  { position: 'left-[16%] top-[48%]', size: 'size-2', color: 'bg-alm-yellow', duration: 6, delay: -2 },
  { position: 'left-[7%] top-[80%]', size: 'size-3', color: 'bg-alm-orange', duration: 9, delay: -5 },
  { position: 'left-[28%] top-[20%]', size: 'size-2', color: 'bg-alm-green', duration: 7, delay: -3 },
  { position: 'left-[31%] top-[74%]', size: 'size-3', color: 'bg-alm-teal', duration: 10, delay: -7 },
  { position: 'left-[44%] top-[30%]', size: 'size-2', color: 'bg-alm-blue', duration: 6, delay: -1 },
  { position: 'left-[46%] top-[62%]', size: 'size-5', color: 'bg-alm-green', duration: 9, delay: -4 },
  { position: 'left-[58%] top-[12%]', size: 'size-2', color: 'bg-alm-orange', duration: 8, delay: -6 },
  { position: 'left-[62%] top-[56%]', size: 'size-3', color: 'bg-alm-blue', duration: 7, delay: -2 },
  { position: 'left-[75%] top-[22%]', size: 'size-5', color: 'bg-alm-teal', duration: 10, delay: -5 },
  { position: 'left-[78%] top-[68%]', size: 'size-2', color: 'bg-alm-red', duration: 6, delay: -3 },
  { position: 'left-[84%] top-[38%]', size: 'size-3', color: 'bg-alm-green', duration: 8, delay: -1 },
  { position: 'left-[90%] top-[22%]', size: 'size-2', color: 'bg-alm-blue', duration: 7, delay: -6 },
  { position: 'left-[91%] top-[70%]', size: 'size-3', color: 'bg-alm-yellow', duration: 9, delay: -4 },
  { position: 'left-[66%] top-[82%]', size: 'size-2', color: 'bg-alm-teal', duration: 6, delay: -2 },
  { position: 'left-[24%] top-[56%]', size: 'size-2', color: 'bg-alm-red', duration: 8, delay: -7 },
];

export interface HeroDotsProps {
  className?: string;
}

function dotStyle({ duration, delay }: Dot): CSSProperties {
  return { animationDuration: `${duration}s`, animationDelay: `${delay}s` };
}

/** Decorative floating background dots. Place inside a `relative` parent, before the content. */
export function HeroDots({ className }: HeroDotsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {DOTS.map((dot) => (
        <span
          key={dot.position}
          style={dotStyle(dot)}
          className={cn(
            'animate-hero-dot absolute rounded-full opacity-30 blur-[1px]',
            dot.position,
            dot.size,
            dot.color
          )}
        />
      ))}
    </div>
  );
}
