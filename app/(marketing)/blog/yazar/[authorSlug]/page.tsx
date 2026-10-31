import { cache } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CornerPostCard } from '@/components/news/CornerPostCard';
import { EmptyState } from '@/components/news/EmptyState';
import { BreadcrumbJsonLd, ProfilePageJsonLd } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { SITE_AUTHOR, SITE_AUTHOR_SHORT_BIO, SITE_AUTHOR_SLUG, resolveArticleAuthor } from '@/lib/authors';
import { getPublishedCornerAuthorBySlug } from '@/lib/corner';
import type { PublicCornerAuthor } from '@/lib/corner';
import { createMetadata } from '@/lib/seo/metadata';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';
import { SiteAuthorProfile } from './_components/SiteAuthorProfile';
import { loadSiteAuthorContent } from './_components/siteAuthorContent';

interface AuthorPublicPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const revalidate = 600;

/** One author fetch per request, shared by generateMetadata and the page. */
const loadAuthor = cache(getPublishedCornerAuthorBySlug);

function isSiteAuthorSlug(slug: string): boolean {
  return slug.trim().toLowerCase() === SITE_AUTHOR_SLUG;
}

function authorDescription(author: Pick<PublicCornerAuthor, 'shortBio' | 'displayName'>): string {
  return author.shortBio || `${author.displayName} köşe yazıları`;
}

export async function generateMetadata({ params }: AuthorPublicPageProps): Promise<Metadata> {
  const { authorSlug } = await params;

  if (isSiteAuthorSlug(authorSlug)) {
    const { profile, hasContent } = await loadSiteAuthorContent();
    const meta = createMetadata({
      title: `${SITE_AUTHOR.name} Editör Ekibi`,
      description: profile?.shortBio || SITE_AUTHOR_SHORT_BIO,
      path: SITE_AUTHOR.href,
    });
    // Henüz hiç içerik yoksa sayfa ince kalır: indekslenmez ama bağlantılar izlenir.
    return hasContent ? meta : { ...meta, robots: 'noindex, follow' };
  }

  const author = await loadAuthor(authorSlug);
  if (!author) {
    return createMetadata({
      title: 'Yazar bulunamadı',
      description: 'Aradığınız yazar bulunamadı.',
      path: `/blog/yazar/${authorSlug}`,
      noIndex: true,
    });
  }

  const meta = createMetadata({
    title: author.displayName,
    description: authorDescription(author),
    path: author.href,
    image: author.avatarImageUrl,
  });
  return (author.posts ?? []).length > 0 ? meta : { ...meta, robots: 'noindex, follow' };
}

export default async function AuthorPublicPage({ params }: AuthorPublicPageProps) {
  const { authorSlug } = await params;
  const homeUrl = new URL('/', CANONICAL_SITE_URL).toString();
  const blogUrl = new URL('/blog', CANONICAL_SITE_URL).toString();

  if (isSiteAuthorSlug(authorSlug)) {
    const content = await loadSiteAuthorContent();
    const pageUrl = new URL(SITE_AUTHOR.href, CANONICAL_SITE_URL).toString();

    return (
      <>
        <ProfilePageJsonLd
          author={SITE_AUTHOR}
          url={pageUrl}
          title={`${SITE_AUTHOR.name} Editör Ekibi`}
          description={content.profile?.shortBio || SITE_AUTHOR_SHORT_BIO}
        />
        <BreadcrumbJsonLd
          items={[
            { name: 'Ana Sayfa', url: homeUrl },
            { name: 'Blog', url: blogUrl },
            { name: SITE_AUTHOR.name, url: pageUrl },
          ]}
        />
        <SiteAuthorProfile content={content} />
      </>
    );
  }

  const author = await loadAuthor(authorSlug);
  if (!author) notFound();

  // Yeniden eskiye; veri katmanı eskiden yeniye döndürür, kopya üzerinde sıralanır.
  const posts = [...(author.posts ?? [])].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const pageUrl = new URL(author.href, CANONICAL_SITE_URL).toString();
  const authorRef = resolveArticleAuthor({
    slug: author.slug,
    displayName: author.displayName,
    avatarImageUrl: author.avatarImageUrl,
  });

  return (
    <>
      <ProfilePageJsonLd
        author={authorRef}
        url={pageUrl}
        description={author.shortBio || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: homeUrl },
          { name: 'Blog', url: blogUrl },
          { name: author.displayName, url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Blog', href: '/blog' },
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
            <div className="break-all text-sm font-semibold text-muted">@{author.slug}</div>
          </div>
        }
      />

      <Section aria-labelledby="yazar-yazilar">
        <SectionHeader
          id="yazar-yazilar"
          title="Yazılar"
          description="Bu yazarın yayınlanmış köşe yazıları en yeniden eskiye sıralanır."
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
