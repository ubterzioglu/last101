import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { EmptyState } from '@/components/news/EmptyState';
import { NewsArchiveClient } from '@/components/news/NewsArchiveClient';
import { NewsHeroCard } from '@/components/news/NewsHeroCard';
import { PageHead } from '@/components/site/PageHead';
import { Section } from '@/components/ui/Section';
import { getFeaturedNewsArticle, getPublishedNewsFeed } from '@/lib/public-news';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Haberler',
  description: "Almanya, Avrupa ve Dünya'dan güncel haberler ve gelişmeler.",
  path: '/haberler',
});

export const dynamic = 'force-dynamic';

export default async function HaberlerPage() {
  const heroArticle = await getFeaturedNewsArticle();
  const initialFeed = await getPublishedNewsFeed({
    limit: 12,
    excludeId: heroArticle?.id,
  });
  const pageUrl = new URL('/haberler', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Haberler"
        description="Almanya, Avrupa ve Dünya'dan güncel haberler ve gelişmeler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Haberler', url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Haberler' }]}
        eyebrow="Almanya101 Haber Merkezi"
        title="Haberler"
        description="Almanya, Avrupa ve Dünya'dan güncel haberler ve gelişmeler."
      />

      <Section>
        {!heroArticle && initialFeed.items.length === 0 ? (
          <EmptyState
            title="Henüz yayınlanmış haber bulunmuyor."
            description="`/admin/haberler` üzerinden bir haberi yayına aldığınızda burada görünür."
          />
        ) : (
          <div className="space-y-12">
            {heroArticle ? <NewsHeroCard article={heroArticle} /> : null}
            <NewsArchiveClient
              initialItems={initialFeed.items}
              initialCursor={initialFeed.nextCursor}
              heroId={heroArticle?.id}
            />
          </div>
        )}
      </Section>
    </>
  );
}
