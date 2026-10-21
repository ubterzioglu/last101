import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface FilterPanelProps {
  children: ReactNode;
  title?: ReactNode;
  /** Heading level for the title. Defaults to h2. */
  titleAs?: 'h2' | 'h3';
  className?: string;
}

/** Band-coloured panel for filters and tool controls (Corteqs search box). */
export function FilterPanel({ children, title, titleAs: Title = 'h2', className }: FilterPanelProps) {
  return (
    <div className={cn('rounded-card bg-band p-5 md:p-6', className)}>
      {title ? (
        <Title className="mb-4 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          {title}
        </Title>
      ) : null}
      {children}
    </div>
  );
}
