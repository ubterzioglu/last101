'use client';

import { NEWS_CATEGORIES, getNewsCategoryLabel } from '@/lib/news/shared';
import type { NewsCategory } from '@/types/news';
import { TONE_STYLES } from '@/components/site/tones';
import { newsCategoryTone } from '@/components/news/news-tones';
import { cn } from '@/lib/utils/cn';

type FilterValue = NewsCategory | 'all';

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  ...NEWS_CATEGORIES.map((category) => ({ value: category, label: getNewsCategoryLabel(category) })),
];

const CHIP_BASE =
  'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none';
const CHIP_IDLE = 'border-line bg-white text-ink hover:border-ink/40';
const CHIP_ACTIVE = 'border-brand-700 bg-brand-50 text-brand-800';

export function NewsCategoryFilter({
  activeCategory,
  onSelect,
}: {
  activeCategory: FilterValue;
  onSelect: (category: FilterValue) => void;
}) {
  return (
    <div role="group" aria-label="Haber kategorileri" className="flex flex-wrap gap-2">
      {OPTIONS.map(({ value, label }) => {
        const active = activeCategory === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={active}
            className={cn(CHIP_BASE, active ? CHIP_ACTIVE : CHIP_IDLE)}
          >
            {value === 'all' ? null : (
              <span
                aria-hidden="true"
                className={cn('h-2 w-2 shrink-0 rounded-full', TONE_STYLES[newsCategoryTone(value)].solid)}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
