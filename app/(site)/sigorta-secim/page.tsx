import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import SigortaClient from './SigortaClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Sigorta Seçim Aracı',
  description: '20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri.',
  path: '/sigorta-secim',
});

export default function SigortaSecimPage() {
  const pageUrl = new URL('/sigorta-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Sigorta Seçim Aracı"
        description="20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Sigorta Seçim Aracı', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SigortaClient />
      </div>
    </>
  );
}
