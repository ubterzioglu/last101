import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { NewsArchiveClient } from '@/components/news/NewsArchiveClient';
import { NewsHeroCard } from '@/components/news/NewsHeroCard';
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

      <div className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.2),_transparent_35%)]" />
          <div className="container relative py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/72">
                Almanya101 Haber Merkezi
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
                Haberler
              </h1>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          {!heroArticle && initialFeed.items.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <h2 className="text-2xl font-bold">Henüz yayınlanmış haber bulunmuyor.</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                `/admin/haberler` üzerinden bir haberi yayına aldığınızda burada görünür.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {heroArticle ? <NewsHeroCard article={heroArticle} /> : null}
              <NewsArchiveClient
                initialItems={initialFeed.items}
                initialCursor={initialFeed.nextCursor}
                heroId={heroArticle?.id}
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
