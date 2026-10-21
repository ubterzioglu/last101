import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type PhotoCardAspect = 'hero' | 'wide' | 'tall';

export interface PhotoCardChip {
  label: string;
  /** Turns the chip into a link (with arrow); plain label when omitted. */
  href?: string;
  /** Optional icon before the label, e.g. MapPin. */
  icon?: LucideIcon;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
}

export interface PhotoCardProps {
  src: string;
  alt: string;
  /** White pill on the top left. */
  chip?: PhotoCardChip;
  /** Content of the white inset bar along the bottom (laid out as a spaced row). */
  footer?: ReactNode;
  priority?: boolean;
  aspect?: PhotoCardAspect;
  /** Responsive `sizes` hint; defaults to the hero media column. */
  sizes?: string;
  /** Featured soft shadow (default true); pass false for an in-flow photo. */
  elevated?: boolean;
  className?: string;
}

const ASPECT_CLASSES: Record<PhotoCardAspect, string> = {
  hero: 'aspect-[3/2]',
  wide: 'aspect-[16/9]',
  tall: 'aspect-[4/5]',
};

const EXTERNAL_HREF = /^https?:\/\//i;
const DEFAULT_SIZES = '(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw';

const CHIP_CLASSES =
  'absolute left-3 top-3 inline-flex min-h-[32px] max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-ink sm:left-4 sm:top-4 sm:max-w-[calc(100%-2rem)]';

// The pill stays 32px tall; the ::after pad grows the tap target to 44px.
const CHIP_LINK_CLASSES = cn(
  CHIP_CLASSES,
  'transition-colors hover:text-brand-700 after:absolute after:inset-x-0 after:-inset-y-1.5'
);

function PhotoChip({ label, href, icon: Icon, external }: PhotoCardChip) {
  const content = (
    <>
      {Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
      <span className="min-w-0 truncate">{label}</span>
      {href ? <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
    </>
  );

  if (!href) {
    return <span className={CHIP_CLASSES}>{content}</span>;
  }

  if (external ?? EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={CHIP_LINK_CLASSES}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={CHIP_LINK_CLASSES}>
      {content}
    </Link>
  );
}

/** Corteqs hero photo card: rounded photo, optional pill chip and white inset footer bar. */
export function PhotoCard({
  src,
  alt,
  chip,
  footer,
  priority = false,
  aspect = 'hero',
  sizes = DEFAULT_SIZES,
  elevated = true,
  className,
}: PhotoCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card bg-band',
        ASPECT_CLASSES[aspect],
        elevated && 'shadow-float',
        className
      )}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {chip ? <PhotoChip {...chip} /> : null}
      {footer ? (
        <div className="absolute inset-x-3 bottom-3 flex min-h-[52px] flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-tile bg-white px-4 py-2.5 text-sm font-semibold text-ink sm:inset-x-4 sm:bottom-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
