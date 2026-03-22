import type { Metadata } from 'next';
import { DuClient } from './DuClient';

export const metadata: Metadata = {
  title: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
  description: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'almanya101',
    title: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
    description: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
    url: 'https://almanya101.de/devuser/du',
    images: [
      {
        url: 'https://almanya101.de/devuser/du-share.svg',
        type: 'image/svg+xml',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
    description: 'SW DE TR Kayıt - almanya101 - hep destek! tam destek!',
    images: ['https://almanya101.de/devuser/du-share.svg'],
  },
};

export default function DuPage() {
  return <DuClient />;
}
