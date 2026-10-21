import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToolQuestionCardProps {
  category?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** `data-pw` on the root; defaults to 'tool-question-card'. */
  testId?: string;
  /** `data-pw` on the title. */
  titleTestId?: string;
  className?: string;
}

/** White featured card for the current question; options and navigation go in children. */
export function ToolQuestionCard({
  category,
  title,
  description,
  children,
  testId = 'tool-question-card',
  titleTestId,
  className,
}: ToolQuestionCardProps) {
  return (
    <div
      data-pw={testId}
      className={cn('rounded-card border border-line bg-white p-5 shadow-float md:p-7', className)}
    >
      {category && (
        <span className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {category}
        </span>
      )}
      <h2
        className="text-[clamp(1.25rem,2vw,1.5rem)] font-extrabold leading-snug tracking-[-0.02em] text-ink"
        data-pw={titleTestId}
      >
        {title}
      </h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
