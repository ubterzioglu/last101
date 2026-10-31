import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CookieSettingsButton } from '@/components/analytics/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { SITE_NAME } from '@/lib/utils/constants';

interface FooterLink {
  href: string;
  label: string;
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {note ? <div>{note}</div> : null}
            <CookieSettingsButton />
          </div>
        </div>
      </Container>
    </footer>
  );
}
