import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ARTICLE_TONE_CLASSES } from './articleTone';
import type { ArticleTone } from './articleTone';

export interface RelatedArticleItem {
  id: string;
  href: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  dateLabel: string;
}

interface RelatedArticlesProps {
  heading: string;
  items: ReadonlyArray<RelatedArticleItem>;
  tone?: ArticleTone;
}

export function RelatedArticles({ heading, items, tone = 'dark' }: RelatedArticlesProps) {
  if (items.length === 0) return null;
  const classes = ARTICLE_TONE_CLASSES[tone];

  return (
    <section className="container pb-20">
      <h2 className={cn('mb-6 text-2xl font-bold', classes.title)}>{heading}</h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn('group flex flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-1', classes.panel)}
          >
            <div className="relative aspect-[16/9]">
              <Image src={item.coverImageUrl} alt="" fill unoptimized sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <span className={cn('text-xs', classes.muted)}>{item.dateLabel}</span>
              <h3 className={cn('text-lg font-bold leading-snug group-hover:underline', classes.title)}>{item.title}</h3>
              {item.summary ? <p className={cn('line-clamp-3 text-sm leading-6', classes.muted)}>{item.summary}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
