import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { OPTION_BUTTON_CLASS, OPTION_IDLE_CLASS, OPTION_SELECTED_CLASS } from './field-styles';

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

/** Checkbox styled as a 44px option row (selected = brand surface). */
export function CheckboxField({ id, label, checked, onChange, className }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        OPTION_BUTTON_CLASS,
        'flex w-full cursor-pointer items-center gap-3',
        checked ? OPTION_SELECTED_CLASS : OPTION_IDLE_CLASS,
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-brand-700"
      />
      <span>{label}</span>
    </label>
  );
}
