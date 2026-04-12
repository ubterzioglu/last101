import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Vatandaşlık Testi Denemesi',
  description: 'Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün.',
  path: '/vatandaslik-testi',
});

export default function VatandaslikTestiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageUrl = new URL('/vatandaslik-testi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Vatandaşlık Testi Denemesi"
        description="Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Vatandaşlık Testi', url: pageUrl },
        ]}
      />
      {children}
    </>
  );
}
