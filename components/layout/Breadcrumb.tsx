import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const CURRENT_CLASSES = 'font-medium text-ink';

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;

          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-muted/60">
                  /
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'transition-colors hover:text-brand-700',
                    isCurrent ? CURRENT_CLASSES : 'text-muted'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(isCurrent && CURRENT_CLASSES)}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
