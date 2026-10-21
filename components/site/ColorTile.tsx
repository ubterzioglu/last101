import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export type ColorTileAspect = 'tile' | 'hero' | 'wide';

export interface ColorTileProps {
  /** Makes the tile a link with an arrow; static tile when omitted. */
  href?: string;
  icon: LucideIcon;
  title: string;
  kicker?: string;
  tone: SiteTone;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
  /** tile = city-tile proportions (default), hero = 3/2 like PhotoCard, wide = 16/9. */
  aspect?: ColorTileAspect;
  className?: string;
}

const EXTERNAL_HREF = /^https?:\/\//i;

const ASPECT_CLASSES: Record<ColorTileAspect, string> = {
  tile: 'aspect-square sm:aspect-[7/5]',
  hero: 'aspect-[3/2]',
  wide: 'aspect-[16/9]',
};

/**
 * Photo-free stand-in for a PhotoTile: tone tint, large tone icon, kicker and
 * title bottom-left. Text stays ink because tone text on its own tint can
 * fall below AA for small type; the icon carries the colour.
 */
export function ColorTile({
  href,
  icon: Icon,
  title,
  kicker,
  tone,
  external,
  aspect = 'tile',
  className,
}: ColorTileProps) {
  const toneStyles = TONE_STYLES[tone];
  const classes = cn(
    'relative flex flex-col justify-between overflow-hidden rounded-tile p-3.5 sm:p-5',
    ASPECT_CLASSES[aspect],
    toneStyles.tint,
    href && 'group',
    className
  );

  const content = (
    <>
      <Icon aria-hidden="true" strokeWidth={1.5} className={cn('h-10 w-10 sm:h-12 sm:w-12', toneStyles.text)} />
      <span className="flex items-end justify-between gap-2 sm:gap-3">
        <span className="min-w-0">
          {kicker ? (
            <span className="block text-xs font-semibold text-ink sm:text-[13px]">{kicker}</span>
          ) : null}
          <span className="mt-0.5 block break-words text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-700 sm:text-[26px]">
            {title}
          </span>
        </span>
        {href ? (
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-brand-700 sm:h-5 sm:w-5"
          />
        ) : null}
      </span>
    </>
  );

  if (!href) {
    return <div className={classes}>{content}</div>;
  }

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
