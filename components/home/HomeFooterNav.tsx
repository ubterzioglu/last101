import Link from 'next/link';

const KURUMSAL_LINKS = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/kariyer', label: 'Kariyer' },
] as const;

const ICERIK_LINKS = [
  { href: '/almanyada-yasam', label: "Almanya'da Yaşam" },
  { href: '/haberler', label: 'Haberler' },
  { href: '/belgeler', label: 'Yararlı Belgeler' },
  { href: '/almanya-araclari', label: 'Almanya Araçları' },
  { href: '/hizmet-rehberi', label: 'Hizmet Rehberi' },
  { href: '/is-ilanlari', label: 'İş İlanları' },
] as const;

const YASAL_LINKS = [
  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/kvkk-gdpr-ccpa', label: 'KVKK / GDPR / CCPA' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
  { href: '/impressum', label: 'Impressum' },
] as const;

const LINK_CLASSES =
  'rounded-sm text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-google-yellow';

export function HomeFooterNav() {
  return (
    <nav
      aria-label="Site alt bağlantıları"
      className="border-t border-white/10 bg-black px-4 pt-12 pb-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Kurumsal
          </h2>
          <ul className="mt-4 space-y-3">
            {KURUMSAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASSES}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            İçerik ve Araçlar
          </h2>
          <ul className="mt-4 space-y-3">
            {ICERIK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASSES}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Yasal Bilgiler
          </h2>
          <ul className="mt-4 space-y-3">
            {YASAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASSES}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
