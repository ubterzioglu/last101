import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToolProgressProps {
  current: number;
  total: number;
  /** Defaults to `Soru ${current} / ${total}` (e2e tests rely on this text). */
  label?: ReactNode;
  onReset?: () => void;
  /** Defaults to 'Sıfırla'. */
  resetLabel?: string;
  /** `data-pw` value for the reset button. */
  resetTestId?: string;
  /** `data-pw` value for the bar fill. */
  barTestId?: string;
  /** Explicit fill percentage (0-100); overrides current / total. */
  percent?: number;
  className?: string;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value * 100) / 100));
}

export function ToolProgress({
  current,
  total,
  label,
  onReset,
  resetLabel = 'Sıfırla',
  resetTestId,
  barTestId,
  percent,
  className,
}: ToolProgressProps) {
  const width = clampPercent(percent ?? (total > 0 ? (current / total) * 100 : 0));

  return (
    <div className={cn('rounded-card border border-line bg-white px-4 py-3 md:px-5', className)}>
      <div className="mb-2.5 flex min-h-[28px] items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{label ?? `Soru ${current} / ${total}`}</span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="-my-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
            data-pw={resetTestId}
          >
            {resetLabel}
          </button>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${width}%` }}
          data-pw={barTestId}
        />
      </div>
    </div>
  );
}
