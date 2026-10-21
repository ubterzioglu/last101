import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  FIELD_LABEL_CLASS,
  OPTION_BUTTON_CLASS,
  OPTION_IDLE_CLASS,
  OPTION_SELECTED_CLASS,
} from './field-styles';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string | number> {
  id: string;
  label: ReactNode;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 3 = stacks on mobile, three columns from `sm` */
  columns?: 2 | 3;
  className?: string;
}

/**
 * Toggle group rendered as ToolOption-like buttons (`aria-pressed`).
 * Rendered inside client components; it only receives callbacks.
 */
export function SegmentedControl<T extends string | number>({
  id,
  label,
  options,
  value,
  onChange,
  columns = 2,
  className,
}: SegmentedControlProps<T>) {
  const labelId = `${id}-label`;

  return (
    <div className={cn('min-w-0', className)}>
      <span id={labelId} className={FIELD_LABEL_CLASS}>
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn('grid gap-2', columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2')}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(OPTION_BUTTON_CLASS, selected ? OPTION_SELECTED_CLASS : OPTION_IDLE_CLASS)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
