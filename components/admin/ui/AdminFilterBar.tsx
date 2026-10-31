import type { ReactNode } from 'react';
import { FilterPanel } from '@/components/site/FilterPanel';
import { cn } from '@/lib/utils/cn';

export interface AdminFilterBarProps {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
}

/** Arama kutulari ve filtreler icin bant renkli panel; ogeler satir satir sarilir. */
export function AdminFilterBar({ children, title, className }: AdminFilterBarProps) {
  return (
    <FilterPanel title={title} titleAs="h3" className={cn('p-4 md:p-4', className)}>
      <div className="flex flex-wrap items-end gap-3">{children}</div>
    </FilterPanel>
  );
}
