import type { ReactNode } from 'react';
import Script from 'next/script';
import { getTrackingScripts } from './_lib/tracking';
import './globals.css';

const trackingScripts = getTrackingScripts();

export const metadata = {
  title: 'almanya101 - Almanya Türk Expat Rehberi: Banka, Sigorta ve Doktor',
  description: 'Almanya\'daki Türk expatlar için kapsamlı rehber. Türk doktor, banka seçimi, sigorta ve vize işlemleri hakkında net ve doğru bilgilere hemen ulaşın.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
        {trackingScripts.map((script) => (
          <Script
            key={script.id}
            id={script.id}
            src={script.src}
            strategy="afterInteractive"
          />
        ))}
      </body>
    </html>
  );
}
