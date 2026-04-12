import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Tüm Türkler',
  description: 'Almanya\'da Türkçe hizmet veren doktor, avukat, restoran, market ve diğer uzmanları bulun. Şehir ve uzmanlık alanına göre filtreleyin.',
  path: '/hizmet-rehberi',
});

export default function HizmetRehberiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageUrl = new URL('/hizmet-rehberi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Tüm Türkler"
        description="Almanya'da Türkçe hizmet veren doktor, avukat, restoran, market ve diğer uzmanları bulun. Şehir ve uzmanlık alanına göre filtreleyin."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Hizmet Rehberi', url: pageUrl },
        ]}
      />
      {children}
    </>
  );
}
