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
        className="bg-black border-b border-white/10"
      />

      <Section contained size="md" className="py-16">
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
