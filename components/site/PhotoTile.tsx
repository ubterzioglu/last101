import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PhotoTileProps {
  href: string;
  src: string;
  /** Read as part of the link name; pass "" when the title already names the place. */
  alt: string;
  title: string;
  kicker?: string;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
  /** Responsive `sizes` hint; defaults to the 2 (mobile) / 3 (desktop) column grid. */
  sizes?: string;
  className?: string;
}

const EXTERNAL_HREF = /^https?:\/\//i;
const DEFAULT_SIZES = '(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 50vw';

/** Corteqs city tile: photo with a dark bottom scrim, white kicker and title, arrow. */
export function PhotoTile({
  href,
  src,
  alt,
  title,
  kicker,
  external,
  sizes = DEFAULT_SIZES,
  className,
}: PhotoTileProps) {
  const classes = cn(
    'group relative block aspect-square overflow-hidden rounded-tile bg-ink sm:aspect-[7/5]',
    className
  );

  const content = (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      {/* Legibility scrim behind the white text (contract: dark gradient bottom). */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
      />
      {/* Mobile keeps the arrow bare so ~110px stay for the title in a half-width tile. */}
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:gap-3 sm:p-5">
        <span className="min-w-0">
          {kicker ? (
            <span className="block text-xs font-medium text-white/90 sm:text-[13px]">{kicker}</span>
          ) : null}
          <span className="block break-words text-lg font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[26px]">
            {title}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center rounded-full text-white transition-colors sm:h-9 sm:w-9 sm:group-hover:bg-brand-700"
        >
          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
