import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Brütten Nete Maaş Hesaplama',
  description: 'Almanya brütten nete maaş hesaplama aracı. Vergi, sigorta ve kesintileri detaylı görün. 2026 güncel vergi tabloları.',
  path: '/maas-hesaplama',
});

export default function MaasHesaplamaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
