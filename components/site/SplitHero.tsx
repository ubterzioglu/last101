import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/site/Eyebrow';
import { HeroDots } from '@/components/site/HeroDots';
import { cn } from '@/lib/utils/cn';

export interface SplitHeroProps {
  id?: string;
  eyebrow?: ReactNode;
  /** h1 content. Compose lines with `<span className="block">` and `HeadingAccent`. */
  title: ReactNode;
  description?: ReactNode;
  /** Buttons and text links under the description. */
  actions?: ReactNode;
  /** Right column, e.g. a PhotoCard. */
  media?: ReactNode;
  /** Rendered under the media, e.g. ShortcutTiles. */
  aside?: ReactNode;
  /** Adds the static firmascope dots behind the hero. */
  decorated?: boolean;
  className?: string;
}

/** Corteqs home hero: text left, media right (stacks text-first on mobile). */
export function SplitHero({
  id,
  eyebrow,
  title,
  description,
  actions,
  media,
  aside,
  decorated = false,
  className,
}: SplitHeroProps) {
  const hasMediaColumn = Boolean(media || aside);

  return (
    <section id={id} className={cn('relative pb-12 pt-10', className)}>
      {decorated ? <HeroDots /> : null}
      <Container className="relative">
        <div
          className={cn(
            'grid gap-12',
            hasMediaColumn && 'lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-[38px]'
          )}
        >
          <div className="min-w-0">
            {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
            <h1 className="break-words text-[clamp(2.5rem,5vw,4.125rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink">
              {title}
            </h1>
            {description ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-[17px]">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">{actions}</div>
            ) : null}
          </div>
          {hasMediaColumn ? (
            <div className="min-w-0">
              {media}
              {aside ? <div className={cn(media ? 'mt-3' : undefined)}>{aside}</div> : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
