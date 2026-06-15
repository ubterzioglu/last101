import Image from 'next/image';
import Link from 'next/link';
import type { PublicNewsArticle } from '@/types/news';

export function NewsHeroCard({ article }: { article: PublicNewsArticle }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/68">
            <span className="rounded-full bg-google-yellow px-3 py-1 text-xs font-semibold text-black">
              {article.categoryLabel}
            </span>
            <span>{article.publishedLabel}</span>
            <span>{article.readingMinutes} dk okuma</span>
          </div>

          <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
            {article.title}
          </h2>

          {article.summary ? (
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
              {article.summary}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/65">
            <span>Kaynak: {article.sourceName || 'Almanya101'}</span>
            {article.sourcePublishedLabel ? <span>{article.sourcePublishedLabel}</span> : null}
          </div>

          <div className="mt-8">
            <Link
              href={`/haberler/${article.slug}`}
              className="inline-flex rounded-full bg-[#01A1F1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6]"
            >
              Haberi oku
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] lg:min-h-full">
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-l" />
        </div>
      </div>
    </article>
  );
}
