import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToolStepsProps {
  steps: ReactNode[];
  tone?: 'ink' | 'light';
  className?: string;
}

/** Numbered step list used by the tool shell (hero card and dark info band). */
export function ToolSteps({ steps, tone = 'ink', className }: ToolStepsProps) {
  const light = tone === 'light';

  return (
    <ol className={cn('space-y-4', className)}>
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold',
              light ? 'text-brand-500' : 'text-brand-700'
            )}
          >
            {index + 1}
          </span>
          <span className={cn('pt-0.5 leading-relaxed', light ? 'text-white/80' : 'text-ink')}>{step}</span>
        </li>
      ))}
    </ol>
  );
}
