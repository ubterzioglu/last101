import Image from 'next/image';
import Link from 'next/link';
import type { NewsListItem } from '@/types/news';

export function NewsListCard({ item }: { item: NewsListItem }) {
  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
      <Link href={`/haberler/${item.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={item.coverImageUrl}
            alt={item.coverImageAlt}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-google-yellow px-3 py-1 text-xs font-semibold text-black">
            {item.categoryLabel}
          </span>
        </div>

        <div className="p-5 md:p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-white/48">
            {item.sourceName || 'Almanya101'}
          </div>
          <h3 className="mt-3 text-xl font-bold leading-snug line-clamp-2">{item.title}</h3>
          {item.summary ? (
            <p className="mt-3 text-sm leading-7 text-white/72 line-clamp-3">{item.summary}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/56">
            <span>{item.publishedLabel}</span>
            <span>{item.readingMinutes} dk</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
