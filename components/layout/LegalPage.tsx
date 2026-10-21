import type { ReactNode } from 'react';
import { PageHead } from '@/components/site/PageHead';
import { TONE_STYLES } from '@/components/site/tones';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated?: string;
  showDisclaimer?: boolean;
  children: ReactNode;
}

/** Inline text link inside legal copy: brand-700, underlined. */
const LEGAL_LINK_CLASS =
  'font-semibold text-brand-700 underline decoration-brand-700/30 underline-offset-4 transition-colors hover:text-brand-800 hover:decoration-brand-800';

/**
 * Light reading styles for the section body. Pages pass plain <p>, <ul>, <strong>,
 * <address>, <a> and <Link>; the colours and link look come from here.
 */
const LEGAL_PROSE_CLASS = cn(
  'space-y-4 text-base leading-relaxed text-ink',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_address]:not-italic',
  '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
  '[&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_a]:decoration-brand-700/30 [&_a]:underline-offset-4 [&_a]:transition-colors',
  '[&_a:hover]:text-brand-800 [&_a:hover]:decoration-brand-800'
);

/**
 * Shared layout for legal / informational pages (privacy, terms, cookies, KVKK,
 * Impressum): compact PageHead, then a single reading column of at most 68ch.
 */
export function LegalPage({
  title,
  description,
  lastUpdated,
  showDisclaimer = true,
  children,
}: LegalPageProps) {
  return (
    <>
      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: title }]}
        eyebrow="Yasal bilgiler"
        title={title}
        description={description}
      />

      <Container>
        <article className="max-w-[68ch] py-12 md:py-16">
          {lastUpdated && (
            <p className="mb-10 text-sm text-muted">
              Son güncelleme: {lastUpdated}
            </p>
          )}

          <div className="space-y-10">{children}</div>

          {showDisclaimer && (
            <div
              role="note"
              className={cn('mt-14 rounded-card border p-6', TONE_STYLES.yellow.border, TONE_STYLES.yellow.wash)}
            >
              <p className="text-sm leading-relaxed text-ink">
                Bu metin yalnızca bilgilendirme amaçlıdır ve hukuki danışmanlık
                yerine geçmez. Kesin yükümlülükleriniz için bir hukuk uzmanına
                danışmanızı öneririz. Sorularınız için{' '}
                <a href="mailto:info@almanya101.de" className={LEGAL_LINK_CLASS}>
                  info@almanya101.de
                </a>{' '}
                adresinden bize ulaşabilirsiniz.
              </p>
            </div>
          )}
        </article>
      </Container>
    </>
  );
}

interface LegalSectionProps {
  heading: string;
  children: ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-[22px] font-extrabold leading-snug tracking-[-0.02em] text-ink md:text-2xl">
        {heading}
      </h2>
      <div className={LEGAL_PROSE_CLASS}>{children}</div>
    </section>
  );
}
