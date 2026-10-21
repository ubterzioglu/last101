import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { AuthorCard } from '@/components/news/AuthorCard';
import { CornerPostCard } from '@/components/news/CornerPostCard';
import { EmptyState } from '@/components/news/EmptyState';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { getFeaturedCornerAuthors, getPublishedCornerPosts } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Arkadaşın Köşesi',
  description: 'almanya101 yazarlarının kişisel köşeleri, deneyimleri ve Almanya notları.',
  path: '/yazi-dizisi',
});

export const dynamic = 'force-dynamic';

export default async function YaziDizisiPage() {
  const [authors, posts] = await Promise.all([
    getFeaturedCornerAuthors(5),
    getPublishedCornerPosts(120),
  ]);
  const pageUrl = new URL('/yazi-dizisi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Arkadaşın Köşesi"
        description="almanya101 yazarlarının kişisel köşeleri, deneyimleri ve Almanya notları."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Arkadaşın Köşesi' }]}
        eyebrow="almanya101 yazı dizisi"
        title="Arkadaşın Köşesi"
        description="almanya101 içindeki yazarların kendi sesleriyle anlattığı deneyimler, notlar ve yol arkadaşlığı."
        stats={[
          { value: String(authors.length), label: 'köşe' },
          { value: String(posts.length), label: 'yazı' },
        ]}
      />

      <Section>
        <SectionHeader title="Köşe yazarları" description="Öne çıkan yazarların detay sayfalarına buradan gidin." />
        <div className="mt-10">
          {authors.length === 0 ? (
            <EmptyState
              as="h3"
              title="Henüz yayında köşe yok."
              description="İlk yazar aktif edildiğinde burada görünecek."
            />
          ) : (
            <div className="grid grid-cols-2 gap-[22px] md:grid-cols-3 lg:grid-cols-5">
              {authors.map((author) => (
                <AuthorCard key={author.id} author={author} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section tone="band">
        <SectionHeader title="Tüm yazılar" description="Yayındaki yazılar eskiden yeniye sıralanır." />
        <div className="mt-10">
          {posts.length === 0 ? (
            <EmptyState
              as="h3"
              title="Henüz yayınlanmış yazı yok."
              description="İlk yazı yayına alındığında burada görünecek."
            />
          ) : (
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <CornerPostCard key={post.id} post={post} index={index} showAuthor />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
