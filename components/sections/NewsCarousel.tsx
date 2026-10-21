import { Newspaper } from 'lucide-react';
import { NewsScroller } from '@/components/home/NewsScroller';
import { MediaCard } from '@/components/site/MediaCard';

export interface NewsCarouselItem {
  id: string;
  slug?: string;
  href?: string;
  title: string;
  excerpt?: string;
  image: string;
  date: string;
  category?: string;
}

interface NewsCarouselProps {
  items: NewsCarouselItem[];
}

/** Light news row: MediaCards in a scroll-snap list (3 per view on desktop). */
export function NewsCarousel({ items }: NewsCarouselProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-line bg-white px-6 py-10 text-center">
        <h3 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          Henüz yayında haber bulunmuyor.
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Admin panelinden yayınlanan haberler burada otomatik olarak görünecek.
        </p>
      </div>
    );
  }

  return (
    <NewsScroller label="Güncel haberler">
      {items.map((item) => (
        <li
          key={item.id}
          className="w-[85%] shrink-0 snap-start sm:w-[calc((100%_-_22px)/2)] lg:w-[calc((100%_-_44px)/3)]"
        >
          <MediaCard
            href={item.href || '/haberler'}
            title={item.title}
            description={item.excerpt || undefined}
            image={item.image ? { src: item.image, alt: item.title } : undefined}
            fallback={{ icon: Newspaper, tone: 'blue' }}
            tag={item.category ? { label: item.category } : undefined}
            meta={item.date}
            linkLabel="Devamını Oku"
            className="h-full"
          />
        </li>
      ))}
    </NewsScroller>
  );
}
