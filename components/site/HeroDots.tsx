import { cn } from '@/lib/utils/cn';

interface Dot {
  position: string;
  size: string;
  color: string;
}

// Static firmascope-style dots: 8/12/20px, category colours at 25% opacity.
// Literal class names so Tailwind's JIT can see them.
const DOTS: readonly Dot[] = [
  { position: 'left-[5%] top-[10%]', size: 'size-2', color: 'bg-alm-blue' },
  { position: 'left-[2%] top-[42%]', size: 'size-3', color: 'bg-alm-green' },
  { position: 'left-[13%] top-[66%]', size: 'size-2', color: 'bg-alm-blue' },
  { position: 'left-[20%] top-[90%]', size: 'size-5', color: 'bg-alm-blue' },
  { position: 'left-[37%] top-[6%]', size: 'size-3', color: 'bg-alm-orange' },
  { position: 'left-[50%] top-[84%]', size: 'size-2', color: 'bg-alm-yellow' },
  { position: 'left-[70%] top-[94%]', size: 'size-3', color: 'bg-alm-yellow' },
  { position: 'left-[86%] top-[5%]', size: 'size-3', color: 'bg-alm-yellow' },
  { position: 'left-[94%] top-[48%]', size: 'size-5', color: 'bg-alm-orange' },
  { position: 'left-[97%] top-[88%]', size: 'size-2', color: 'bg-alm-green' },
];

export interface HeroDotsProps {
  className?: string;
}

/** Decorative background dots. Place inside a `relative` parent, before the content. */
export function HeroDots({ className }: HeroDotsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {DOTS.map((dot) => (
        <span
          key={dot.position}
          className={cn('absolute rounded-full opacity-25 blur-[1px]', dot.position, dot.size, dot.color)}
        />
      ))}
    </div>
  );
}
