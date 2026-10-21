'use client';

import { startTransition, useState } from 'react';
import type { NewsCategory, NewsListItem, PublicNewsListResponse } from '@/types/news';
import { FilterPanel } from '@/components/site/FilterPanel';
import { EmptyState } from '@/components/news/EmptyState';
import { NewsCategoryFilter } from '@/components/news/NewsCategoryFilter';
import { NewsListCard } from '@/components/news/NewsListCard';
import { NewsLoadMoreButton } from '@/components/news/NewsLoadMoreButton';

interface NewsArchiveClientProps {
  initialItems: NewsListItem[];
  initialCursor: string | null;
  heroId?: string;
}

export function NewsArchiveClient({
  initialItems,
  initialCursor,
  heroId,
}: NewsArchiveClientProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all');
  const [items, setItems] = useState<NewsListItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadFeed(category: NewsCategory | 'all', cursor?: string | null, append = false) {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.set('limit', '12');
      if (category !== 'all') params.set('category', category);
      if (cursor) params.set('cursor', cursor);
      if (heroId) params.set('excludeId', heroId);

      const response = await fetch(`/api/news?${params.toString()}`, { cache: 'no-store' });
      const payload = (await response.json()) as PublicNewsListResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Haberler yüklenemedi.');

      startTransition(() => {
        setItems((current) => (append ? [...current, ...payload.items] : payload.items));
        setNextCursor(payload.nextCursor);
      });
    } catch (err) {
      setError((err as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryChange(category: NewsCategory | 'all') {
    if (category === activeCategory) return;
    setActiveCategory(category);
    void loadFeed(category, null, false);
  }

  function handleLoadMore() {
    if (!nextCursor) return;
    void loadFeed(activeCategory, nextCursor, true);
  }

  return (
    <div className="space-y-8">
      <FilterPanel>
        <NewsCategoryFilter activeCategory={activeCategory} onSelect={handleCategoryChange} />
      </FilterPanel>

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-alm-red/30 bg-white px-4 py-3 text-sm font-medium text-alm-red-ink"
        >
          {error}
        </div>
      ) : null}

      {items.length === 0 && !loading ? (
        <EmptyState
          as="h3"
          title="Bu filtre için haber bulunamadı."
          description="Başka bir kategori seçin veya daha sonra tekrar kontrol edin."
        />
      ) : (
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
          {items.map((item) => (
            <NewsListCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {nextCursor ? (
        <div className="flex justify-center">
          <NewsLoadMoreButton onClick={handleLoadMore} loading={loading} />
        </div>
      ) : null}
    </div>
  );
}
