import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/site/Eyebrow';

export interface CtaRowProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Usually a primary Button; sits right on desktop, below the text on mobile. */
  action: ReactNode;
  id?: string;
  className?: string;
}

/** Corteqs closing call-to-action row with a hairline on top. */
export function CtaRow({ eyebrow, title, description, action, id, className }: CtaRowProps) {
  return (
    <section id={id} className={className}>
      <Container>
        <div className="flex flex-col gap-6 border-t border-line py-12 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="min-w-0 max-w-2xl">
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            <h2 className="break-words text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
              {title}
            </h2>
            {description ? <p className="mt-2 text-base leading-relaxed text-muted">{description}</p> : null}
          </div>
          <div className="shrink-0">{action}</div>
        </div>
      </Container>
    </section>
  );
}
