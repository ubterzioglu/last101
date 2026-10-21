import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface HeadingAccentProps {
  children: ReactNode;
  /** Pass `text-brand-500` on the dark band; add `block` to start a new line. */
  className?: string;
}

/** The brand-coloured line of a Corteqs-style headline. */
export function HeadingAccent({ children, className }: HeadingAccentProps) {
  return <span className={cn('text-brand-600', className)}>{children}</span>;
}
