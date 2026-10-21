import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { AsideCommunityCard, AsideLinkList, AsideShareCard } from '@/components/news/ArticleAside';
import type { AsideLink } from '@/components/news/ArticleAside';
import { ArticleShell } from '@/components/news/ArticleShell';
import { realCoverUrl } from '@/components/news/cover';
import { buildArticleShareText } from '@/components/news/share-text';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getPublishedCornerPostBySlug } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

interface CornerPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedCornerPostBySlug(slug);

  if (!post) {
    return createArticleMetadata({
      title: 'Yazı bulunamadı',
      description: 'Aradığınız yayınlanmış köşe yazısı bulunamadı.',
      publishedTime: new Date().toISOString(),
      path: `/yazi-dizisi/${slug}`,
    });
  }

  return createArticleMetadata({
    title: post.title,
    description: post.summary || post.title,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || undefined,
    authors: [post.authorName || 'Arkadaşın Köşesi'],
    tags: ['Arkadaşın Köşesi', 'Yazı Dizisi', 'Almanya'],
    path: post.href,
    image: post.coverImageUrl,
  });
}

export default async function CornerPostDetailPage({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedCornerPostBySlug(slug);

  if (!post) notFound();

  const pageUrl = new URL(post.href, SITE_URL).toString();
  const authorName = post.authorName || 'Arkadaşın Köşesi';
  const cover = realCoverUrl(post.coverImageUrl);
  const links: AsideLink[] = [
    ...(post.authorSlug ? [{ href: `/${post.authorSlug}`, label: `${authorName} köşesi` }] : []),
    { href: '/yazi-dizisi', label: 'Tüm yazılara dön' },
  ];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.summary || post.title}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt || undefined}
        author={post.authorName || 'Arkadaşın Köşesi'}
        url={pageUrl}
        image={post.coverImageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: new URL('/yazi-dizisi', SITE_URL).toString() },
          { name: post.title, url: pageUrl },
        ]}
      />

      <ArticleShell
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Arkadaşın Köşesi', href: '/yazi-dizisi' },
          { label: post.title },
        ]}
        eyebrow="Arkadaşın Köşesi"
        title={post.title}
        summary={post.summary}
        dateLabel={post.dateLabel}
        readingMinutes={post.readingMinutes}
        author={{ name: authorName, avatarUrl: post.authorAvatarImageUrl || '/images/profil.jpg' }}
        cover={cover ? { src: cover, alt: post.title } : null}
        aside={
          <>
            <AsideShareCard
              shareText={buildArticleShareText({ title: post.title, summary: post.summary, url: pageUrl })}
            />
            <AsideLinkList links={links} />
            <AsideCommunityCard />
          </>
        }
      >
        {post.content ? <MarkdownPreview content={post.content} tone="light" /> : null}
      </ArticleShell>
    </>
  );
}
