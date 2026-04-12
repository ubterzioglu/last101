import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';
import { BelgelerClient } from './BelgelerClient';

export const metadata = createMetadata({
  title: 'Yararlı Belgeler',
  description: 'Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi.',
  path: '/belgeler',
});

export default function BelgelerPage() {
  const pageUrl = new URL('/belgeler', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Yararlı Belgeler"
        description="Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Yararlı Belgeler', url: pageUrl },
        ]}
      />

      <div className="min-h-screen bg-black">
        <BelgelerClient />
      </div>
    </>
  );
}