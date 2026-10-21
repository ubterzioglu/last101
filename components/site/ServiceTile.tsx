import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export interface ServiceItem {
  href: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Category colour of the icon chip (default blue). */
  tone?: SiteTone;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
}

export type ServiceTileProps = ServiceItem & {
  className?: string;
  /** Title heading level: 3 by default, 4 under a ServiceGrid group title. */
  headingLevel?: 3 | 4;
};

const EXTERNAL_HREF = /^https?:\/\//i;

/**
 * Corteqs service tile: tone-tinted icon chip, bold title, short muted
 * description. The arrow fades in (colour only) on hover and keyboard focus.
 * Icon sits above the title until `xl`, beside it from `xl` (4 columns).
 */
export function ServiceTile({
  href,
  icon: Icon,
  title,
  description,
  tone = 'blue',
  external,
  className,
  headingLevel = 3,
}: ServiceTileProps) {
  const toneStyles = TONE_STYLES[tone];
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  const classes = cn(
    // focus-visible:z-10 keeps the focus outline above neighbouring tile hairlines.
    'group relative flex h-full flex-col gap-3 px-[18px] py-6 transition-colors hover:bg-white focus-visible:z-10 xl:flex-row xl:gap-3.5',
    className
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-tile',
          toneStyles.tint,
          toneStyles.text
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 lg:pr-5">
        <Heading className="break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          {title}
        </Heading>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="absolute right-4 top-4 h-4 w-4 text-transparent transition-colors group-hover:text-brand-700 group-focus-visible:text-brand-700"
      />
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
