import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export interface MediaCardImage {
  src: string;
  alt: string;
}

export interface MediaCardFallback {
  icon: LucideIcon;
  tone: SiteTone;
}

export interface MediaCardTag {
  label: string;
  /** Tinted chip in this tone; neutral chip when omitted. */
  tone?: SiteTone;
}

export interface MediaCardProps {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  /** Photo on top (16/10). Takes precedence over `fallback`. */
  image?: MediaCardImage;
  /** Toned icon tile on top when there is no image; nothing on top when both are missing. */
  fallback?: MediaCardFallback;
  tag?: MediaCardTag;
  /** Non-interactive line under the description (date, source). */
  meta?: ReactNode;
  linkLabel?: string;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
  /** Responsive `sizes` hint for the photo. */
  sizes?: string;
  className?: string;
}

const EXTERNAL_HREF = /^https?:\/\//i;
const DEFAULT_SIZES = '(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw';

// The ::after overlay stretches the title link over the whole card (no nested anchors).
const TITLE_LINK_CLASSES =
  'transition-colors after:absolute after:inset-0 after:rounded-card group-hover:text-brand-700';

function CardMedia({
  image,
  fallback,
  sizes,
}: Pick<MediaCardProps, 'image' | 'fallback'> & { sizes: string }) {
  if (image) {
    return (
      <div className="relative aspect-[16/10] w-full bg-band">
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  if (!fallback) {
    return null;
  }

  const { icon: Icon, tone } = fallback;

  return (
    <div
      aria-hidden="true"
      className={cn('flex aspect-[16/10] w-full items-center justify-center', TONE_STYLES[tone].tint)}
    >
      <Icon className={cn('h-12 w-12', TONE_STYLES[tone].text)} strokeWidth={1.5} />
    </div>
  );
}

/** Corteqs photo-top card; the whole card is clickable through the title link. */
export function MediaCard({
  href,
  title,
  description,
  image,
  fallback,
  tag,
  meta,
  linkLabel = 'Devamını oku',
  external,
  sizes = DEFAULT_SIZES,
  className,
}: MediaCardProps) {
  const isExternal = external ?? EXTERNAL_HREF.test(href);

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-ink/30',
        className
      )}
    >
      <CardMedia image={image} fallback={fallback} sizes={sizes} />
      <div className="flex flex-1 flex-col p-5">
        {tag ? (
          <span
            className={cn(
              'mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
              tag.tone
                ? [TONE_STYLES[tag.tone].tint, TONE_STYLES[tag.tone].text]
                : 'border border-line bg-white text-ink'
            )}
          >
            {tag.label}
          </span>
        ) : null}
        <h3 className="break-words text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          {isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={TITLE_LINK_CLASSES}>
              {title}
            </a>
          ) : (
            <Link href={href} className={TITLE_LINK_CLASSES}>
              {title}
            </Link>
          )}
        </h3>
        {description ? (
          <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{description}</p>
        ) : null}
        {meta ? <div className="mt-3 text-sm text-muted">{meta}</div> : null}
        {/* Visual cue only: the stretched title link already covers the card. */}
        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1 self-start pt-4 text-sm font-semibold text-brand-700 underline decoration-brand-700/30 underline-offset-4 transition-colors group-hover:decoration-brand-700"
        >
          {linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
