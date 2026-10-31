import Image from 'next/image';
import { CalendarDays, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArticleDates } from '@/components/articles/ArticleDates';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import type { BreadcrumbItem } from '@/components/layout/Breadcrumb';
import { Eyebrow } from '@/components/site/Eyebrow';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

export interface ArticleAuthor {
  name: string;
  avatarUrl: string;
}

export interface ArticleShellProps {
  breadcrumb: BreadcrumbItem[];
  /** Category line above the title. */
  eyebrow: string;
  /** Decorative category dot before the eyebrow. */
  eyebrowTone?: SiteTone;
  title: string;
  summary?: string;
  /** ISO publish date; shown as "Yayın" with a <time> element. */
  publishedAt: string;
  /** ISO update date; shown as "Güncelleme" only when it is a meaningful update. */
  updatedAt?: string | null;
  readingMinutes: number;
  author?: ArticleAuthor;
  /** Real cover photo; pass null to show none. */
  cover?: { src: string; alt: string } | null;
  /** Sticky right column on desktop, below the body on mobile. */
  aside: ReactNode;
  /** Article body, kept to a 68ch reading measure. */
  children?: ReactNode;
}

function ArticleMeta({
  publishedAt,
  updatedAt,
  readingMinutes,
  author,
}: Pick<ArticleShellProps, 'publishedAt' | 'updatedAt' | 'readingMinutes' | 'author'>) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
      {author ? (
        <span className="inline-flex items-center gap-2.5 font-semibold text-ink">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line bg-band">
            <Image src={author.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
          </span>
          {author.name}
        </span>
      ) : null}
      <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
        <CalendarDays aria-hidden="true" size={16} className="shrink-0" />
        <ArticleDates publishedAt={publishedAt} updatedAt={updatedAt} />
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock aria-hidden="true" size={16} className="shrink-0" />
        {readingMinutes} dk okuma
      </span>
    </div>
  );
}

/**
 * Shared light article template (haberler, yazi-dizisi, rehber): breadcrumb, eyebrow, the single H1,
 * meta (author, publish/update dates, reading time), cover; body and sticky aside side by side on desktop.
 */
export function ArticleShell({
  breadcrumb,
  eyebrow,
  eyebrowTone,
  title,
  summary,
  publishedAt,
  updatedAt,
  readingMinutes,
  author,
  cover,
  aside,
  children,
}: ArticleShellProps) {
  return (
    <Container className="pb-16 pt-3 lg:pt-4">
      <Breadcrumb items={breadcrumb} className="mb-6 py-3" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 xl:gap-20">
        <article className="min-w-0">
          <header>
            <Eyebrow className="flex items-center gap-2">
              {eyebrowTone ? (
                <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', TONE_STYLES[eyebrowTone].solid)} />
              ) : null}
              {eyebrow}
            </Eyebrow>
            <h1 className="mt-5 break-words text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
              {title}
            </h1>
            {summary ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{summary}</p> : null}
            <ArticleMeta
              publishedAt={publishedAt}
              updatedAt={updatedAt}
              readingMinutes={readingMinutes}
              author={author}
            />
          </header>

          {cover ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-card bg-band">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                priority
                sizes="(min-width: 1280px) 840px, (min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {children ? <div className="mt-10 max-w-[68ch]">{children}</div> : null}
        </article>

        <aside className="min-w-0">
          <div className="space-y-6 lg:sticky lg:top-28">{aside}</div>
        </aside>
      </div>
    </Container>
  );
}
