import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { cn } from '@/lib/utils/cn';

export interface DarkBandProps {
  /** Section id; the heading gets `${id}-title` and labels the section. */
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Extras under the text in the left column (steps, buttons, logo). */
  children?: ReactNode;
  /** Rendered inside a white floating card in the right column. */
  aside?: ReactNode;
  className?: string;
}

/**
 * The one full-bleed ink band per page (Corteqs profile banner). Two columns on
 * desktop when an aside is given; otherwise a single full-width column.
 */
export function DarkBand({ id, eyebrow, title, description, children, aside, className }: DarkBandProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={cn('bg-ink py-16 text-white', className)}>
      <Container>
        <div className={cn('grid gap-10', aside ? 'lg:grid-cols-2 lg:items-center lg:gap-16' : undefined)}>
          <div className="min-w-0">
            <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} tone="light" />
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
          {aside ? (
            <div className="min-w-0 rounded-card bg-white p-6 text-ink shadow-float sm:p-7">{aside}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
