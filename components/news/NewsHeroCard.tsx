import Image from 'next/image';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { realCoverUrl } from '@/components/news/cover';
import { newsCategoryTone } from '@/components/news/news-tones';
import { cn } from '@/lib/utils/cn';
import type { PublicNewsArticle } from '@/types/news';

/** Lead story: featured split card, photo right on desktop and on top on mobile. */
export function NewsHeroCard({ article }: { article: PublicNewsArticle }) {
  const cover = realCoverUrl(article.coverImageUrl);
  const tone = newsCategoryTone(article.category);
  const href = `/haberler/${article.slug}`;

  return (
    <article className="overflow-hidden rounded-card border border-line bg-white shadow-float">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[16/10] bg-band lg:order-2 lg:aspect-auto lg:min-h-[420px]">
          {cover ? (
            <Image
              src={cover}
              alt={article.coverImageAlt}
              fill
              priority
              sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div aria-hidden="true" className={cn('flex h-full w-full items-center justify-center', TONE_STYLES[tone].tint)}>
              <Newspaper className={cn('h-16 w-16', TONE_STYLES[tone].text)} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <Chip tone={tone}>{article.categoryLabel}</Chip>
            <span>{article.publishedLabel}</span>
            <span>{article.readingMinutes} dk okuma</span>
          </div>

          <h2 className="mt-5 break-words text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink">
            <Link href={href} className="transition-colors hover:text-brand-700">
              {article.title}
            </Link>
          </h2>

          {article.summary ? (
            <p className="mt-4 text-base leading-relaxed text-muted md:text-[17px]">{article.summary}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Kaynak: {article.sourceName || 'Almanya101'}</span>
            {article.sourcePublishedLabel ? <span>{article.sourcePublishedLabel}</span> : null}
          </div>

          <div className="mt-8">
            <Button href={href} arrow>
              Haberi oku
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
