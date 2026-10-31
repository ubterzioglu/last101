import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { CornerPostCard } from '@/components/news/CornerPostCard';
import { EmptyState } from '@/components/news/EmptyState';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { getPublishedCornerAuthorBySlug } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

interface AuthorPublicPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: AuthorPublicPageProps) {
  const { authorSlug } = await params;
  const author = await getPublishedCornerAuthorBySlug(authorSlug);
  if (!author) {
    return createMetadata({
      title: 'Köşe bulunamadı',
      description: 'Aradığınız köşe bulunamadı.',
      path: `/${authorSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: author.displayName,
    description: author.shortBio || `${author.displayName} köşesi`,
    path: author.href,
    image: author.avatarImageUrl,
  });
}

export default async function AuthorPublicPage({ params }: AuthorPublicPageProps) {
  const { authorSlug } = await params;
  const author = await getPublishedCornerAuthorBySlug(authorSlug);

  if (!author) notFound();

  const posts = author.posts || [];
  const pageUrl = new URL(author.href, SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title={author.displayName}
        description={author.shortBio || `${author.displayName} köşesi`}
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: new URL('/yazi-dizisi', SITE_URL).toString() },
          { name: author.displayName, url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Arkadaşın Köşesi', href: '/yazi-dizisi' },
          { label: author.displayName },
        ]}
        title={author.displayName}
        description={author.shortBio || undefined}
        stats={[{ value: String(posts.length), label: 'yazı' }]}
        media={
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-band px-6 py-10">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white">
              <Image
                src={author.avatarImageUrl}
                alt={author.displayName}
                fill
                priority
                sizes="144px"
                className="object-cover"
              />
            </div>
            <div className="break-all text-sm font-semibold text-muted">/{author.slug}</div>
          </div>
        }
      />

      <Section>
        <SectionHeader
          title="Yazılar"
          description="Bu köşedeki yayınlanmış yazılar eskiden yeniye sıralanır."
        />
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
                <CornerPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
