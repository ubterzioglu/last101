import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToolOptionProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  /** `data-pw` value, e.g. 'tool-option'. */
  testId?: string;
  className?: string;
}

/** Full-width answer button. Selected state uses the brand surface and aria-pressed. */
export function ToolOption({
  selected = false,
  onClick,
  children,
  description,
  disabled,
  testId,
  className,
}: ToolOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      data-pw={testId}
      className={cn(
        'block min-h-[44px] w-full rounded-btn border px-4 py-3.5 text-left font-medium text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        selected ? 'border-brand-700 bg-brand-50' : 'border-line bg-white hover:border-ink/40',
        className
      )}
    >
      <span>{children}</span>
      {description && <span className="mt-1 block text-xs font-normal text-muted">{description}</span>}
    </button>
  );
}
