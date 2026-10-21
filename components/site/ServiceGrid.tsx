import { ServiceTile } from '@/components/site/ServiceTile';
import type { ServiceItem } from '@/components/site/ServiceTile';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export interface ServiceGroup {
  title: string;
  /** Group dot colour; also tints every tile in the group that has no own tone. */
  tone: SiteTone;
  items: ServiceItem[];
}

export interface ServiceGridProps {
  items?: ServiceItem[];
  /** When given (non-empty), renders one titled grid per group instead of `items`. */
  groups?: ServiceGroup[];
  /** Desktop columns from `lg`; mobile always shows 2. */
  columns?: 3 | 4;
  className?: string;
}

const MOBILE_COLUMNS = 2;

/**
 * Corteqs hairlines: a cell draws its top line only when a tile sits above it
 * and its left line only when a tile sits beside it. No outer frame, and
 * incomplete last rows stay clean. Literal class names for the Tailwind JIT.
 */
function hairlineClasses(index: number, columns: 3 | 4): string {
  return cn(
    'border-line',
    index >= MOBILE_COLUMNS && 'border-t',
    index % MOBILE_COLUMNS !== 0 && 'border-l',
    index >= columns ? 'lg:border-t' : 'lg:border-t-0',
    index % columns !== 0 ? 'lg:border-l' : 'lg:border-l-0'
  );
}

interface TileListProps {
  items: ServiceItem[];
  columns: 3 | 4;
  groupTone?: SiteTone;
  headingLevel?: 3 | 4;
  className?: string;
}

function TileList({ items, columns, groupTone, headingLevel, className }: TileListProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2',
        columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
        className
      )}
    >
      {items.map((item, index) => (
        <li key={`${index}-${item.href}`} className={hairlineClasses(index, columns)}>
          <ServiceTile
            {...item}
            tone={item.tone ?? groupTone ?? toneAt(index)}
            headingLevel={headingLevel}
            // 3 columns leave room for the icon beside the title from lg.
            className={columns === 3 ? 'lg:flex-row lg:gap-3.5' : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

/** 2-column (mobile) / 3 or 4-column (desktop) hairline grid of ServiceTiles, optionally grouped. */
export function ServiceGrid({ items = [], groups, columns = 4, className }: ServiceGridProps) {
  if (!groups || groups.length === 0) {
    return <TileList items={items} columns={columns} className={className} />;
  }

  return (
    <div className={cn('space-y-10', className)}>
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-3 flex items-center gap-2.5 text-[15px] font-bold leading-snug text-ink">
            <span
              aria-hidden="true"
              className={cn('h-2.5 w-2.5 shrink-0 rounded-full', TONE_STYLES[group.tone].solid)}
            />
            {group.title}
          </h3>
          <TileList items={group.items} columns={columns} groupTone={group.tone} headingLevel={4} />
        </div>
      ))}
    </div>
  );
}
