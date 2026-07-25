import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const FOOTER_LEGAL_LINKS: { href: string; label: string }[] = [
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

const PARTNER_LINKS = [
  ['https://tekhurdametal.com/istanbul-hurdaci/', 'İstanbul Hurdacı'],
  ['https://tekhurdametal.com/hurda-fiyatlari/', 'Hurda Fiyatları'],
  ['https://tekhurdametal.com/hurda-demir-fiyatlari/', 'Demir Hurda Fiyatları'],
  ['https://tekhurdametal.com/beylikduzu-hurdaci/', 'Beylikdüzü Hurdacı'],
  ['https://lionerotik.com/urunler/fetis-urunleri', 'Antalya Sex Shop'],
  ['https://lionerotik.com/urunler/fetis-urunleri', 'Antalya Erotik Shop'],
  ['https://lionerotik.com/urunler/fetis-urunleri', 'Antalya Seks Shop'],
] as const;

export function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <Container size="xl">
        <div className="text-center space-y-2">
          <p className="text-sm">yalnız değilsin! almanya101 seninle!</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-400">
            {FOOTER_LEGAL_LINKS.map((item, i) => (
              <span key={item.href} className="flex items-center gap-x-2">
                {i > 0 && <span className="text-gray-600" aria-hidden="true">|</span>}
                <Link href={item.href} className="hover:underline hover:text-white transition-colors">{item.label}</Link>
              </span>
            ))}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.82rem] leading-[1.6] text-gray-700 sm:text-base sm:leading-[1.55]">
            {PARTNER_LINKS.map(([href, label], index) => (
              <span key={`${label}-${index}`} className="flex items-center gap-x-2">
                {index > 0 && <span className="text-gray-700" aria-hidden="true">|</span>}
                <a href={href} rel="dofollow" target="_blank" className="hover:underline">{label}</a>
              </span>
            ))}
          </p>
        </div>
      </Container>
    </footer>
  );
}
