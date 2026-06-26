import type { ReactNode } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated?: string;
  showDisclaimer?: boolean;
  children: ReactNode;
}

/**
 * Shared layout for legal / informational pages (privacy, terms, cookies, KVKK).
 * Matches the almanya101 dark theme: black background, HeroSection + Section.
 */
export function LegalPage({
  title,
  description,
  lastUpdated,
  showDisclaimer = true,
  children,
}: LegalPageProps) {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection
        title={title}
        description={description}
        centered={false}
        density="compact"
        className="border-b border-white/10 bg-black"
        contentClassName="max-w-2xl"
        titleClassName="mb-4 text-3xl md:text-4xl lg:text-5xl"
        descriptionClassName="mb-0 text-base text-white/70 md:text-lg"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="bg-aurora absolute inset-0 opacity-35" />
          <div className="bg-grid bg-grid-animated absolute inset-0 opacity-20" />
          <div className="bg-noise absolute inset-0 opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />
        </div>
      </HeroSection>

      <Section contained size="md" className="py-12 md:py-14">
        {lastUpdated && (
          <p className="mb-8 text-sm text-white/50">
            Son güncelleme: {lastUpdated}
          </p>
        )}

        <div className="space-y-8 text-white/80 leading-relaxed">
          {children}
        </div>

        {showDisclaimer && (
          <div className="mt-12 rounded-2xl border border-google-yellow/20 bg-google-yellow/5 p-6">
            <p className="text-sm text-white/70">
              Bu metin yalnızca bilgilendirme amaçlıdır ve hukuki danışmanlık
              yerine geçmez. Kesin yükümlülükleriniz için bir hukuk uzmanına
              danışmanızı öneririz. Sorularınız için{' '}
              <a
                href="mailto:info@almanya101.de"
                className="text-google-yellow hover:underline"
              >
                info@almanya101.de
              </a>{' '}
              adresinden bize ulaşabilirsiniz.
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}

interface LegalSectionProps {
  heading: string;
  children: ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-white">{heading}</h2>
      <div className="space-y-3 text-white/75">{children}</div>
    </section>
  );
}
