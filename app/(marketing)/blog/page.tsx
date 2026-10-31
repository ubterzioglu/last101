import type { Metadata } from 'next';
import { BookOpen, MapPin, Newspaper, PenLine } from 'lucide-react';
import { AuthorCard } from '@/components/news/AuthorCard';
import { EmptyState } from '@/components/news/EmptyState';
import { realCoverUrl } from '@/components/news/cover';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';
import { CtaRow } from '@/components/site/CtaRow';
import { MediaCard } from '@/components/site/MediaCard';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { toneAt } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SITE_AUTHOR } from '@/lib/authors';
import { getFeaturedCornerAuthors, getPublishedCornerPostSummaries } from '@/lib/corner';
import { createMetadata } from '@/lib/seo/metadata';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';

const BLOG_TITLE = 'Blog: Almanya Üzerine Köşe Yazıları';
const BLOG_DESCRIPTION =
  'almanya101 topluluğunun Almanya üzerine köşe yazıları: yazarların vize, iş, günlük yaşam ve topluluk konularındaki notları ve görüşleri.';
const FEATURED_AUTHOR_LIMIT = 5;
const POST_LIMIT = 120;

export const revalidate = 600;

const blogMetadata = createMetadata({
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  path: '/blog',
});

export const metadata: Metadata = {
  ...blogMetadata,
  alternates: {
    ...blogMetadata.alternates,
    types: {
      'application/rss+xml': [{ url: `${CANONICAL_SITE_URL}/blog/feed.xml`, title: 'Almanya101 Blog' }],
    },
  },
};

export default async function BlogPage() {
  const [authors, posts] = await Promise.all([
    getFeaturedCornerAuthors(FEATURED_AUTHOR_LIMIT),
    getPublishedCornerPostSummaries(POST_LIMIT),
  ]);
  const pageUrl = new URL('/blog', CANONICAL_SITE_URL).toString();

  return (
    <>
      <CollectionPageJsonLd
        title={BLOG_TITLE}
        description={BLOG_DESCRIPTION}
        url={pageUrl}
        items={posts.map((post) => ({ url: post.href, name: post.title }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', CANONICAL_SITE_URL).toString() },
          { name: 'Blog', url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Blog' }]}
        eyebrow="Köşe yazıları"
        title={BLOG_TITLE}
        description="Almanya’da yaşayan ve Almanya’yı yakından bilen yazarların köşe yazıları. Haberler ve rehberler için aşağıdaki ilgili merkezlere göz atabilirsiniz."
        stats={[
          { value: String(authors.length), label: 'yazar' },
          { value: String(posts.length), label: 'yazı' },
        ]}
        media={
          <PhotoCard
            src="/images/site/berlin-spree.webp"
            alt="Berlin'de Spree nehri kıyısı"
            chip={{ label: 'Berlin', icon: MapPin }}
            priority
          />
        }
      />

      {authors.length > 0 ? (
        <Section aria-labelledby="blog-yazarlar">
          <SectionHeader
            id="blog-yazarlar"
            title="Köşe yazarları"
            description="Öne çıkan yazarların sayfalarına buradan ulaşabilirsiniz."
          />
          <div className="mt-10 grid grid-cols-2 gap-[22px] md:grid-cols-3 lg:grid-cols-5">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="band" aria-labelledby="blog-yazilar">
        <SectionHeader
          id="blog-yazilar"
          title="Tüm yazılar"
          description="Yayındaki köşe yazıları en yeniden eskiye doğru sıralanır."
        />
        <div className="mt-10">
          {posts.length === 0 ? (
            <EmptyState
              as="h3"
              title="Henüz yayınlanmış köşe yazısı yok."
              description="Yeni bir yazı yayınlandığında burada listelenecek. Bu sırada haberlere ve rehberlere göz atabilirsiniz."
            />
          ) : (
            <ul className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const cover = realCoverUrl(post.coverImageUrl);
                return (
                  <li key={post.id} className="flex">
                    <MediaCard
                      href={post.href}
                      title={post.title}
                      description={post.summary || undefined}
                      image={cover ? { src: cover, alt: post.title } : undefined}
                      fallback={{ icon: PenLine, tone: toneAt(index) }}
                      meta={`${post.authorName ?? SITE_AUTHOR.name} · ${post.dateLabel} · ${post.readingMinutes} dk okuma`}
                      linkLabel="Yazıyı oku"
                      className="w-full"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>

      <Section aria-labelledby="blog-ilgili-merkezler">
        <SectionHeader
          id="blog-ilgili-merkezler"
          title="İlgili merkezler"
          description="Güncel gelişmeler ve adım adım anlatımlar kendi merkezlerinde yayınlanır."
          className="mb-10"
        />
        <ul className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
          <li className="flex">
            <MediaCard
              href="/haberler"
              title="Haberler"
              description="Almanya’daki Türk topluluğunu ilgilendiren güncel haberler ve gelişmeler."
              fallback={{ icon: Newspaper, tone: 'blue' }}
              linkLabel="Haberlere git"
              className="w-full"
            />
          </li>
          <li className="flex">
            <MediaCard
              href="/rehber"
              title="Rehber"
              description="Vize, oturum, iş, sağlık ve günlük hayata dair adım adım rehber içerikleri."
              fallback={{ icon: BookOpen, tone: 'green' }}
              linkLabel="Rehbere git"
              className="w-full"
            />
          </li>
        </ul>
      </Section>

      <CtaRow
        title="Yazmak İster misin?"
        description="Almanya’ya dair söyleyecek sözün varsa köşe yazarlarımız arasında sana da yer var."
        action={
          <Button href="/ekibimize-katil" arrow>
            Ekibimize Katıl
          </Button>
        }
      />
    </>
  );
}
