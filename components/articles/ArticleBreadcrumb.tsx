import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ARTICLE_TONE_CLASSES } from './articleTone';
import type { ArticleTone } from './articleTone';

interface ArticleBreadcrumbProps {
  items: ReadonlyArray<{ name: string; href?: string }>;
  tone?: ArticleTone;
}

export function ArticleBreadcrumb({ items, tone = 'dark' }: ArticleBreadcrumbProps) {
  const classes = ARTICLE_TONE_CLASSES[tone];

  return (
    <nav aria-label="Sayfa konumu" className={cn('text-sm', classes.muted)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className={cn('transition', classes.link)}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="line-clamp-1 max-w-[18rem]">
                  {item.name}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
