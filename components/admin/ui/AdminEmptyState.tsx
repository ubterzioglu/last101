import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AdminEmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Liste veya tablo bos oldugunda gosterilen kesik cizgili kutu. */
export function AdminEmptyState({ title, description, action, className }: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-card border border-dashed border-line px-6 py-10 text-center',
        className
      )}
    >
      <p className="text-base font-bold text-ink">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
