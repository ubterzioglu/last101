import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import BankaClient from './BankaClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Banka Seçim Aracı',
  description: '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.',
  path: '/banka-secim',
});

export default function BankaSecimPage() {
  const pageUrl = new URL('/banka-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Banka Seçim Aracı"
        description="20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Banka Seçim Aracı', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <BankaClient />
      </div>
    </>
  );
}
