import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import VizeClient from './VizeClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Almanya Vize Seçim Aracı',
  description: 'Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası.',
  path: '/vize-secim',
});

export default function VizeSecimPage() {
  const pageUrl = new URL('/vize-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Almanya Vize Seçim Aracı"
        description="Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Vize Seçim Aracı', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <VizeClient />
      </div>
    </>
  );
}
