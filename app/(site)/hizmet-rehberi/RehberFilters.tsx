import { Filter, MapPin, Search, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FilterPanel } from '@/components/site/FilterPanel';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import { PROVIDER_CATEGORIES, type ProviderType, type Tag } from '@/lib/rehber/types';
import { providerIcon, providerTone } from './provider-display';

const FIELD_CLASSES =
  'min-h-[48px] w-full rounded-btn border border-line bg-white px-4 text-sm text-ink transition-colors placeholder:text-muted focus:border-brand-700';

interface RehberFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  cities: string[];
  tags: Tag[];
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

/** Corteqs search box: keyword, city and (per category) speciality tags. */
export function RehberFilters({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  tags,
  selectedTags,
  onToggleTag,
  hasActiveFilters,
  onClear,
}: RehberFiltersProps) {
  return (
    <FilterPanel>
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor="rehber-ara" className="mb-2 block text-sm font-semibold text-ink">
            Ara
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="rehber-ara"
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="İsim, şehir, açıklama..."
              className={cn(FIELD_CLASSES, 'pl-10')}
            />
          </div>
        </div>
        <div>
          <label htmlFor="rehber-sehir" className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Şehir
          </label>
          <select
            id="rehber-sehir"
            value={selectedCity}
            onChange={(event) => onCityChange(event.target.value)}
            className={FIELD_CLASSES}
          >
            <option value="">Tüm şehirler</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tags.length > 0 ? (
        <fieldset className="mt-5">
          <legend className="mb-3 text-sm font-semibold text-ink">Uzmanlık</legend>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggleTag(tag.id)}
                  className={cn(
                    'min-h-[36px] rounded-full border px-3 text-xs font-semibold transition-colors',
                    selected
                      ? 'border-brand-700 bg-brand-50 text-brand-800'
                      : 'border-line bg-white text-ink hover:border-ink'
                  )}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {hasActiveFilters ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="min-h-[44px] text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : null}
    </FilterPanel>
  );
}

interface CategoryButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  count: number;
  selected: boolean;
  iconClassName: string;
  onClick: () => void;
}

function CategoryButton({ icon: Icon, label, description, count, selected, iconClassName, onClick }: CategoryButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'relative flex h-full w-full items-start gap-3 px-[18px] py-5 text-left transition-colors focus-visible:z-10',
        selected ? 'bg-brand-50' : 'hover:bg-white'
      )}
    >
      <span aria-hidden="true" className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-tile', iconClassName)}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block font-bold leading-snug', selected ? 'text-brand-800' : 'text-ink')}>{label}</span>
        <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
      </span>
      <span className="shrink-0 rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-semibold text-ink">
        {count}
      </span>
    </button>
  );
}

interface CategoryGridProps {
  selectedCategory: ProviderType | 'all';
  onSelect: (category: ProviderType | 'all') => void;
  counts: Record<string, number>;
  totalFallback: number;
}

/** Corteqs "Nerede desteğe ihtiyacın var?" hairline grid, used as the category filter. */
export function CategoryGrid({ selectedCategory, onSelect, counts, totalFallback }: CategoryGridProps) {
  const cellClasses = 'border-b border-r border-line';

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Filter aria-hidden="true" className="h-4 w-4" />
        Kategori
      </p>
      <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        <li className={cellClasses}>
          <CategoryButton
            icon={Store}
            label="Tüm Türkler"
            description="Hizmet ve gastronomi kayıtlarını birlikte göster"
            count={counts.total || totalFallback || 0}
            selected={selectedCategory === 'all'}
            iconClassName="bg-brand-50 text-brand-700"
            onClick={() => onSelect('all')}
          />
        </li>
        {PROVIDER_CATEGORIES.map((category) => {
          const tone = TONE_STYLES[providerTone(category.id)];
          return (
            <li key={category.id} className={cellClasses}>
              <CategoryButton
                icon={providerIcon(category.id)}
                label={category.label}
                description={category.description}
                count={counts[category.id] || 0}
                selected={selectedCategory === category.id}
                iconClassName={cn(tone.tint, tone.text)}
                onClick={() => onSelect(category.id)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
