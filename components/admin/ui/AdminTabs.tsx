import { cn } from '@/lib/utils/cn';

export interface AdminTabItem {
  key: string;
  label: string;
}

export interface AdminTabsProps {
  tabs: readonly AdminTabItem[];
  active: string;
  onChange: (key: string) => void;
  /** Sekme listesi icin erisilebilir ad. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Kontrollu sekme cubugu; aktif sekme alt cizgi ile isaretlenir. Cagiranlar
 * icerigi `tabpanel` ile sarmadigi icin ARIA tab deseni yerine duz dugme grubu
 * (`aria-pressed`) kullanilir: her dugme Tab ile erisilebilir.
 */
export function AdminTabs({ tabs, active, onChange, ariaLabel, className }: AdminTabsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap gap-x-6 border-b border-line', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.key)}
            className={cn(
              '-mb-px min-h-[44px] border-b-2 px-1 text-sm font-semibold transition-colors',
              selected
                ? 'border-brand-700 text-brand-800'
                : 'border-transparent text-muted hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
