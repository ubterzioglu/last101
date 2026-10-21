import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { TONE_STYLES, type SiteTone } from '@/components/site/tones';

interface MetricGridProps {
  children: ReactNode;
  className?: string;
}

/** Hairline metric grid: 1px `line` gaps, no shadow (Corteqs). */
export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div className={cn('grid gap-px overflow-hidden rounded-card border border-line bg-line', className)}>
      {children}
    </div>
  );
}

interface MetricCellProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: SiteTone;
  icon?: LucideIcon;
  /** Render the label as a heading (e2e selects some labels by role). */
  labelAs?: 'h3' | 'p';
  /** `data-pw` hook on the value container. */
  valueTestId?: string;
  className?: string;
}

export function MetricCell({
  label,
  value,
  hint,
  tone,
  icon: Icon,
  labelAs: Label = 'p',
  valueTestId,
  className,
}: MetricCellProps) {
  const toneStyle = tone ? TONE_STYLES[tone] : null;

  return (
    <div className={cn('min-w-0 bg-white p-4 md:p-5', className)}>
      <div className="flex items-center gap-2.5">
        {Icon && toneStyle ? (
          <span
            aria-hidden="true"
            className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-tile', toneStyle.tint, toneStyle.text)}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : toneStyle ? (
          <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', toneStyle.solid)} />
        ) : null}
        <Label className="text-sm font-medium text-muted">{label}</Label>
      </div>
      <div
        data-pw={valueTestId}
        className="mt-2 break-words text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-ink tabular-nums"
      >
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
