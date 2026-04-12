import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { TransferSelector } from '@/components/para-transferi/transfer-selector';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: 'Almanya\'dan Türkiye\'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.',
  path: '/para-transferi',
});

export default function ParaTransferiPage() {
  const pageUrl = new URL('/para-transferi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Para Transferi Seçim Aracı"
        description="Almanya'dan Türkiye'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Para Transferi', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TransferSelector />
      </div>
    </>
  );
}
