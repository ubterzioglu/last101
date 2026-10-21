import { Globe, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import type { Category, Provider } from '@/lib/rehber/types';
import { getMonogram, providerIcon, providerTone } from './provider-display';

interface ProviderCardProps {
  provider: Provider;
  category?: Category;
}

interface ContactAction {
  href?: string;
  icon: LucideIcon;
  label: string;
  missingLabel: string;
  external?: boolean;
}

function ContactButton({ href, icon: Icon, label, missingLabel, external }: ContactAction) {
  if (!href) {
    return (
      <span
        title={missingLabel}
        aria-label={missingLabel}
        className="flex h-11 w-11 items-center justify-center rounded-btn border border-line text-muted opacity-40"
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
    );
  }

  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex h-11 w-11 items-center justify-center rounded-btn border border-line bg-white text-ink transition-colors hover:border-brand-700 hover:text-brand-700"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

/** Corteqs directory card: tinted top with monogram and city chip, body, contact row. */
export function ProviderCard({ provider, category }: ProviderCardProps) {
  const tone = TONE_STYLES[providerTone(provider.type)];
  const Icon = providerIcon(provider.type);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-ink/30">
      <div className={cn('relative flex h-[120px] items-center justify-center', tone.tint)}>
        <span
          aria-hidden="true"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-card bg-white/90 text-[28px] font-semibold tracking-[-0.03em] text-ink"
        >
          {getMonogram(provider.name)}
        </span>
        <Icon aria-hidden="true" strokeWidth={1.25} className={cn('absolute -right-2 bottom-2 h-20 w-20 opacity-25', tone.text)} />
        <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-tile bg-white px-2.5 py-1 text-[13px] font-semibold text-ink">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{provider.city}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {category ? (
          <Chip tone={providerTone(provider.type)} className="mb-3 w-fit">
            {category.label}
          </Chip>
        ) : null}
        <h3 className="break-words text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          {provider.name}
        </h3>
        {provider.address ? (
          <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted">
            <MapPin aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{provider.address}</span>
          </p>
        ) : null}
        {provider.description ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{provider.description}</p>
        ) : null}
        <div className="mt-auto pt-5">
          <div className="flex gap-2 border-t border-line pt-4">
            <ContactButton
              href={provider.phone ? `tel:${provider.phone}` : undefined}
              icon={Phone}
              label="Ara"
              missingLabel="Telefon yok"
            />
            <ContactButton
              href={provider.email ? `mailto:${provider.email}` : undefined}
              icon={Mail}
              label="E-posta gönder"
              missingLabel="E-posta yok"
            />
            <ContactButton
              href={provider.website}
              icon={Globe}
              label="Websiteye git"
              missingLabel="Website yok"
              external
            />
          </div>
        </div>
      </div>
    </article>
  );
}
