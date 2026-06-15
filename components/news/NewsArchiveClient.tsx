'use client';

import { startTransition, useState } from 'react';
import type { NewsCategory, NewsListItem, PublicNewsListResponse } from '@/types/news';
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
    <div className="space-y-6">
      <NewsCategoryFilter activeCategory={activeCategory} onSelect={handleCategoryChange} />

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {items.length === 0 && !loading ? (
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <h3 className="text-2xl font-bold">Bu filtre için haber bulunamadı.</h3>
          <p className="mt-3 text-sm leading-7 text-white/62">
            Başka bir kategori seçin veya daha sonra tekrar kontrol edin.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
