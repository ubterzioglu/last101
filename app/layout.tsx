import type { Metadata, Viewport } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { CookieConsent } from '@/components/analytics/CookieConsent';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import {
  DEFAULT_KEYWORDS,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO_TITLE,
  SEO_SITE_NAME,
  SITE_URL,
} from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_META_DESCRIPTION,
  keywords: [...DEFAULT_KEYWORDS],
  authors: [{ name: SEO_SITE_NAME }],
  creator: SEO_SITE_NAME,
  publisher: SEO_SITE_NAME,
  alternates: {
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },

  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: SEO_SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: DEFAULT_SEO_TITLE,
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  manifest: '/manifest.webmanifest',

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  verification: {
    // NEXT_PUBLIC_GSC_VERIFICATION ortam değişkeni set edildiğinde Google Search Console doğrulaması aktifleşir.
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : {}),
  },

  // Google yer meta etiketlerini hedefleme sinyali olarak kullanmıyor;
  // doğrulanmamış Berlin konumu yanıltıcı olacağı için kaldırıldı
  // (bkz. docs/plans/seo-geo-2026-10-21.md P2).
  other: {
    'content-language': 'tr',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={cn(jakarta.variable, sora.variable)}>
      <head>
        {/* Structured Data */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Kart görsellerinin geldiği CDN için erken bağlantı */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Ana içeriğe atla
        </a>

        <Header />
        <main id="main-content" className="flex-grow pt-[10px] bg-black">
          {children}
        </main>
        <SiteFooter />
        {/* İzleme betikleri yalnızca açık analitik izin sonrası yüklenir. */}
        <AnalyticsScripts />
        <CookieConsent />
      </body>
    </html>
  );
}
