import { Newspaper } from 'lucide-react';
import { MediaCard } from '@/components/site/MediaCard';
import { realCoverUrl } from '@/components/news/cover';
import { newsCategoryTone } from '@/components/news/news-tones';
import type { NewsListItem } from '@/types/news';

export function NewsListCard({ item }: { item: NewsListItem }) {
  const cover = realCoverUrl(item.coverImageUrl);
  const tone = newsCategoryTone(item.category);

  return (
    <MediaCard
      href={`/haberler/${item.slug}`}
      title={item.title}
      description={item.summary || undefined}
      image={cover ? { src: cover, alt: item.coverImageAlt } : undefined}
      fallback={{ icon: Newspaper, tone }}
      tag={{ label: item.categoryLabel, tone }}
      meta={`${item.sourceName || 'Almanya101'} · ${item.publishedLabel} · ${item.readingMinutes} dk`}
      linkLabel="Haberi oku"
    />
  );
}
