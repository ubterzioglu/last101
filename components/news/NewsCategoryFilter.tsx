'use client';

import { NEWS_CATEGORIES, getNewsCategoryLabel } from '@/lib/news/shared';
import type { NewsCategory } from '@/types/news';

export function NewsCategoryFilter({
  activeCategory,
  onSelect,
}: {
  activeCategory: NewsCategory | 'all';
  onSelect: (category: NewsCategory | 'all') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeCategory === 'all'
            ? 'bg-google-blue text-white'
            : 'border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]'
        }`}
      >
        Tümü
      </button>
      {NEWS_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === category
              ? 'bg-google-yellow text-black'
              : 'border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]'
          }`}
        >
          {getNewsCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
