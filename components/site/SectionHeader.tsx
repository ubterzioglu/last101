import type { ReactNode } from 'react';
import { ArrowLink } from '@/components/site/ArrowLink';
import { Eyebrow } from '@/components/site/Eyebrow';
import { HeadingAccent } from '@/components/site/HeadingAccent';
import { cn } from '@/lib/utils/cn';

export interface SectionHeaderLink {
  href: string;
  label: string;
}

export interface SectionHeaderProps {
  eyebrow?: ReactNode;
  /** First headline line. */
  title: ReactNode;
  /** Optional second line in the brand colour. */
  accent?: ReactNode;
  description?: ReactNode;
  /** Text link shown right-aligned on desktop and below the text on mobile. */
  link?: SectionHeaderLink;
  as?: 'h1' | 'h2';
  /** Id for the heading element (e.g. for `aria-labelledby`). */
  id?: string;
  align?: 'left' | 'center';
  /** `ink` on light surfaces, `light` on the dark band. */
  tone?: 'ink' | 'light';
  className?: string;
  /** Extra classes for the heading, e.g. a smaller size in a narrow column. */
  titleClassName?: string;
}

/** Section headline type scale (H2). */
export const SECTION_TITLE_CLASS =
  'text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em]';

/** Corteqs section head: eyebrow, 2-line headline, description and a text link. */
export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  link,
  as: Heading = 'h2',
  id,
  align = 'left',
  tone = 'ink',
  className,
  titleClassName,
}: SectionHeaderProps) {
  const centered = align === 'center';
  const light = tone === 'light';

  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between md:gap-10',
        className
      )}
    >
      <div className={cn('min-w-0 max-w-3xl', centered && 'mx-auto')}>
        {eyebrow ? (
          <Eyebrow tone={tone} className="mb-4">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Heading
          id={id}
          className={cn(SECTION_TITLE_CLASS, 'break-words', light ? 'text-white' : 'text-ink', titleClassName)}
        >
          <span className="block">{title}</span>
          {accent ? (
            <>
              {' '}
              <HeadingAccent className={cn('block', light && 'text-brand-500')}>{accent}</HeadingAccent>
            </>
          ) : null}
        </Heading>
        {description ? (
          <p className={cn('mt-4 text-base leading-relaxed', light ? 'text-white/80' : 'text-muted')}>
            {description}
          </p>
        ) : null}
      </div>
      {link ? (
        <ArrowLink
          href={link.href}
          tone={light ? 'light' : 'ink'}
          className={cn('shrink-0', centered ? 'self-center' : 'self-start md:self-auto')}
        >
          {link.label}
        </ArrowLink>
      ) : null}
    </div>
  );
}
