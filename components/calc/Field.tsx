import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { FIELD_LABEL_CLASS } from './field-styles';

interface FieldProps {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

/** Label above a single input/select. */
export function Field({ label, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={htmlFor} className={FIELD_LABEL_CLASS}>
        {label}
      </label>
      {children}
    </div>
  );
}
