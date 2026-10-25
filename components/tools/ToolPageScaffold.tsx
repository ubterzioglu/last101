import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolIntroPanel } from '@/components/tools/ToolIntroPanel';
import { getToolUser } from '@/lib/tools/access';
import { SITE_URL } from '@/lib/utils/constants';
import type { ToolConfig } from '@/lib/tools/types';

export async function ToolPageScaffold({
  config,
  children,
}: {
  config: ToolConfig;
  children: React.ReactNode;
}) {
  const pageUrl = new URL(config.path, SITE_URL).toString();
  const user = await getToolUser();

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
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {user ? children : <ToolIntroPanel config={config} />}
      </div>
    </>
  );
}
