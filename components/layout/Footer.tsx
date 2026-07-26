import React from 'react';
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

export function Footer() {
  return (
    <footer className="bg-black py-8 text-[8px] text-white">
      <Container size="xl">
        <div className="text-center space-y-2">
          <p>yalnız değilsin! almanya101 seninle!</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-gray-400">
            {FOOTER_LEGAL_LINKS.map((item, i) => (
              <span key={item.href} className="flex items-center gap-x-2">
                {i > 0 && (
                  <span className="text-gray-600" aria-hidden="true">|</span>
                )}
                <Link href={item.href} className="hover:underline hover:text-white transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 leading-[1.6] text-gray-400">
            <span>
              <a
                href="https://www.spindorai.com"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Seo Aracı
              </a>
              {' '}ve Seo Hizmetleri Spindora
            </span>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <span>
              <a
                href="https://www.corteqs.net"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Corteqs
              </a>
              {' '}— Diasporayı Birleştiren Platform
            </span>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <a
              href="https://chatio.com.tr/"
              rel="dofollow"
              target="_blank"
              className="hover:underline"
            >
              Canlı Destek Yazılımı
            </a>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <span>
              <a
                href="https://www.spindorai.com/seo/en-iyi-seo-ajansi"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Seo Ajansı
              </a>
              {' '}Spindora Tarafından Seosu Yapılmıştır.
            </span>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <a
              href="https://tekhurdametal.com/istanbul-hurdaci/"
              rel="dofollow"
              target="_blank"
              className="hover:underline"
            >
              İstanbul Hurdacı
            </a>
            {' '}Firması Tek Hurda Metal A.Ş
            <span className="text-gray-600" aria-hidden="true">|</span>
            <span>
              <a
                href="https://lionerotik.com/urunler/fetis-urunleri"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Antalya Seks Shop
              </a>
              {' '}Lion Erotik
            </span>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <span>
              <a
                href="https://ufuksoynakliyat.com.tr"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Evden Eve Nakliyat
              </a>
              {' '}Şirketi Ufuksoy Nakliyat A.Ş
            </span>
            <span className="text-gray-600" aria-hidden="true">|</span>
            <span>
              <a
                href="https://dragomanseakayak.com"
                rel="dofollow"
                target="_blank"
                className="hover:underline"
              >
                Deniz Kayağı Turları
              </a>
              {' '}Şirketi Dragoman Sea Kayak & Outdoors
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
