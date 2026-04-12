import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import MaasClient from './MaasClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Maaş Hesaplayıcı',
  description: 'Almanya\'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın.',
  path: '/maas-hesaplama',
});

export default function MaasHesaplamaPage() {
  const pageUrl = new URL('/maas-hesaplama', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Maaş Hesaplayıcı"
        description="Almanya'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Maaş Hesaplayıcı', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <MaasClient />
      </div>
    </>
  );
}
