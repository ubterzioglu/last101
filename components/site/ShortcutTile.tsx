import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ShortcutTileTone = 'brand' | 'band';

export interface ShortcutTileProps {
  href: string;
  icon: LucideIcon;
  label: ReactNode;
  /** brand = filled CTA tile, band = quiet tinted tile. */
  tone: ShortcutTileTone;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
  className?: string;
}

const EXTERNAL_HREF = /^https?:\/\//i;
/** U+2060 keeps the arrow on the line of the label's last word. */
const WORD_JOINER = '⁠';

const TONE_CLASSES: Record<ShortcutTileTone, string> = {
  brand: 'bg-brand-700 text-white hover:bg-brand-800',
  band: 'bg-band text-ink hover:bg-brand-100',
};

/** Corteqs hero shortcut: icon left, short label with a trailing arrow. */
export function ShortcutTile({ href, icon: Icon, label, tone, external, className }: ShortcutTileProps) {
  const classes = cn(
    'flex min-h-[84px] items-center gap-3 rounded-tile px-4 py-4 transition-colors sm:gap-4 sm:px-5',
    TONE_CLASSES[tone],
    className
  );

  const content = (
    <>
      <Icon aria-hidden="true" className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" strokeWidth={1.5} />
      <span className="min-w-0 break-words text-sm font-semibold leading-snug">
        {label}
        <span className="whitespace-nowrap">
          {WORD_JOINER}
          <ArrowUpRight aria-hidden="true" className="ml-1 inline-block h-3.5 w-3.5 align-[-0.15em]" />
        </span>
      </span>
    </>
  );

  if (external ?? EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
