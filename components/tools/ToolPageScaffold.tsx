import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';
import type { ToolConfig } from '@/lib/tools/types';

export function ToolPageScaffold({
  config,
  children,
}: {
  config: ToolConfig;
  children: React.ReactNode;
}) {
  const pageUrl = new URL(config.path, SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd title={config.title} description={config.description} url={pageUrl} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: config.title, url: pageUrl },
        ]}
      />
      <FaqJsonLd items={config.faqs} />
      <div className="bg-page text-ink">{children}</div>
    </>
  );
}

