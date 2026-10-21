import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/site/Eyebrow';
import { HeadingAccent } from '@/components/site/HeadingAccent';
import { StatRow } from '@/components/site/StatRow';
import type { StatItem } from '@/components/site/StatRow';
import { cn } from '@/lib/utils/cn';

export interface PageHeadCrumb {
  label: string;
  /** Omit for the current page (always the last item). */
  href?: string;
}

export interface PageHeadProps {
  breadcrumb?: PageHeadCrumb[];
  eyebrow?: ReactNode;
  /** h1 content (first line when `accent` is given). */
  title: ReactNode;
  /** Optional second h1 line in the brand colour. */
  accent?: ReactNode;
  description?: ReactNode;
  stats?: StatItem[];
  actions?: ReactNode;
  /** Right column, e.g. a PhotoCard or ColorTile; stacks under the text on mobile. */
  media?: ReactNode;
  id?: string;
  className?: string;
}

const CRUMB_CLASS = 'inline-flex min-h-[44px] items-center';

function PageBreadcrumb({ items }: { items: PageHeadCrumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight aria-hidden="true" size={14} className="shrink-0" /> : null}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className={cn(CRUMB_CLASS, 'transition-colors hover:text-brand-700 motion-reduce:transition-none')}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(CRUMB_CLASS, isCurrent && 'font-medium text-ink')}
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

/** Inner-page head (Corteqs listing top): text and stats left, media right, hairline below. */
export function PageHead({
  breadcrumb,
  eyebrow,
  title,
  accent,
  description,
  stats,
  actions,
  media,
  id,
  className,
}: PageHeadProps) {
  const hasBreadcrumb = Boolean(breadcrumb && breadcrumb.length > 0);

  return (
    <section id={id} className={cn('border-b border-line', className)}>
      <Container className={cn('pb-12', hasBreadcrumb ? 'pt-3 lg:pt-4' : 'pt-8 lg:pt-10')}>
        {breadcrumb && hasBreadcrumb ? <PageBreadcrumb items={breadcrumb} /> : null}
        <div className={cn('grid gap-10', media ? 'lg:grid-cols-[1.13fr_1fr] lg:items-center lg:gap-[38px]' : undefined)}>
          <div className="min-w-0">
            {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
            <h1 className="break-words text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-ink">
              {accent ? (
                <>
                  <span className="block">{title}</span>
                  <HeadingAccent className="block">{accent}</HeadingAccent>
                </>
              ) : (
                title
              )}
            </h1>
            {description ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-[17px]">{description}</p>
            ) : null}
            {stats ? <StatRow stats={stats} className="mt-8" /> : null}
            {actions ? <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{actions}</div> : null}
          </div>
          {media ? <div className="min-w-0">{media}</div> : null}
        </div>
      </Container>
    </section>
  );
}
