import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrganizationJsonLd, WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/seo/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://almanya101.com'),
  title: {
    default: 'almanya101',
    template: '%s | almanya101',
  },
  description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
  keywords: ['Almanya', 'Türkler', 'yaşam rehberi', 'iş ilanı', 'rehber', 'topluluk'],
  authors: [{ name: 'almanya101' }],
  creator: 'almanya101',
  publisher: 'almanya101',

  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'almanya101',
    url: 'https://almanya101.com',
    title: 'almanya101',
    description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi",
    images: [
      {
        url: 'https://almanya101.com/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'almanya101',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'almanya101',
    description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi",
    images: ['https://almanya101.com/images/og-default.jpg'],
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

  verification: {
    // Add your verification codes here when deploying
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  // Geographic targeting
  other: {
    'content-language': 'tr',
    'target-country': 'DE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Structured Data */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Ana içeriğe atla
        </a>

        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
