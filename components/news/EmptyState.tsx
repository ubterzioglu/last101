import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Heading level that fits the surrounding outline. */
  as?: 'h2' | 'h3';
  className?: string;
}

/** Hairline box for empty listings (no content yet, no filter results). */
export function EmptyState({ title, description, as: Heading = 'h2', className }: EmptyStateProps) {
  return (
    <div className={cn('rounded-card border border-line bg-white px-6 py-14 text-center', className)}>
      <Heading className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink md:text-2xl">
        {title}
      </Heading>
      {description ? <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}
