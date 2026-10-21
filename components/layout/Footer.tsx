import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { SITE_NAME } from '@/lib/utils/constants';

interface FooterLink {
  href: string;
  label: string;
}

interface PartnerLink extends FooterLink {
  /** Plain text after the anchor. */
  description?: string;
}

const FOOTER_LEGAL_LINKS: readonly FooterLink[] = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/kariyer', label: 'Kariyer' },
  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/kvkk-gdpr-ccpa', label: 'KVKK / GDPR / CCPA' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
  { href: '/impressum', label: 'Impressum' },
];

// SEO partner links: hrefs and anchor texts are a content decision and stay as they are.
// rel="noopener" (the old "dofollow" is not a valid value) keeps them followed.
const FOOTER_PARTNER_LINKS: readonly PartnerLink[] = [
  { href: 'https://www.spindorai.com', label: 'Seo Aracı', description: 've Seo Hizmetleri Spindora' },
  { href: 'https://www.corteqs.net', label: 'Corteqs', description: '- Diasporayı Birleştiren Platform' },
  { href: 'https://chatio.com.tr/', label: 'Canlı Destek Yazılımı' },
  {
    href: 'https://www.spindorai.com/seo/en-iyi-seo-ajansi',
    label: 'Seo Ajansı',
    description: 'Spindora Tarafından Seosu Yapılmıştır.',
  },
  {
    href: 'https://tekhurdametal.com/istanbul-hurdaci/',
    label: 'İstanbul Hurdacı',
    description: 'Firması Tek Hurda Metal A.Ş',
  },
  {
    href: 'https://lionerotik.com/urunler/fetis-urunleri',
    label: 'Antalya Seks Shop',
    description: 'Lion Erotik',
  },
  {
    href: 'https://ufuksoynakliyat.com.tr',
    label: 'Evden Eve Nakliyat',
    description: 'Şirketi Ufuksoy Nakliyat A.Ş',
  },
  {
    href: 'https://dragomanseakayak.com',
    label: 'Deniz Kayağı Turları',
    description: 'Şirketi Dragoman Sea Kayak & Outdoors',
  },
];

interface FooterProps {
  /** Optional right-hand note on the copyright row, e.g. a last-updated line. */
  note?: ReactNode;
}

export function Footer({ note }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-page">
      <Container>
        <div className="flex flex-col gap-6 py-10 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4 xl:flex-col xl:items-start xl:gap-2">
            <Link href="/" className="shrink-0">
              <Image
                src="/almanya101header.png"
                alt={SITE_NAME}
                width={1500}
                height={350}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-sm text-muted">yalnız değilsin! almanya101 seninle!</p>
          </div>

          <nav aria-label="Kurumsal bağlantılar">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 xl:justify-end">
              {FOOTER_LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}
          </p>
          {note ? <div>{note}</div> : null}
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line py-6 text-xs leading-relaxed text-muted">
          {FOOTER_PARTNER_LINKS.map(({ href, label, description }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="underline decoration-muted/40 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink"
              >
                {label}
              </a>
              {description ? ` ${description}` : null}
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
