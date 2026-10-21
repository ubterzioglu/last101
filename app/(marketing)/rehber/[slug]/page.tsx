import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { AsideCommunityCard, AsideLinkList, AsideShareCard } from '@/components/news/ArticleAside';
import { ArticleShell } from '@/components/news/ArticleShell';
import { realCoverUrl } from '@/components/news/cover';
import { buildArticleShareText } from '@/components/news/share-text';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getPublishedRehberArticleBySlug } from '@/lib/rehber-articles';
import { SITE_URL } from '@/lib/utils/constants';

interface RehberArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: RehberArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedRehberArticleBySlug(slug);

  if (!article) {
    return createArticleMetadata({
      title: 'Rehber bulunamadı',
      description: 'Aradığınız yayınlanmış rehber bulunamadı.',
      publishedTime: new Date().toISOString(),
      path: `/rehber/${slug}`,
    });
  }

  return createArticleMetadata({
    title: article.title,
    description: article.summary || article.title,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt || undefined,
    tags: ['Rehber', 'Almanya', article.category],
    path: article.href,
    image: article.coverImageUrl,
  });
}

export default async function RehberArticleDetailPage({ params }: RehberArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedRehberArticleBySlug(slug);

  if (!article) notFound();

  const pageUrl = new URL(article.href, SITE_URL).toString();
  const cover = realCoverUrl(article.coverImageUrl);

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.summary || article.title}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt || undefined}
        url={pageUrl}
        image={article.coverImageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Rehber', url: new URL('/rehber', SITE_URL).toString() },
          { name: article.title, url: pageUrl },
        ]}
      />

      <ArticleShell
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Rehber', href: '/rehber' },
          { label: article.title },
        ]}
        eyebrow={article.category}
        title={article.title}
        summary={article.summary}
        dateLabel={article.dateLabel}
        readingMinutes={article.readingMinutes}
        cover={cover ? { src: cover, alt: article.title } : null}
        aside={
          <>
            <AsideShareCard
              shareText={buildArticleShareText({ title: article.title, summary: article.summary, url: pageUrl })}
            />
            <AsideLinkList links={[{ href: '/rehber', label: 'Tüm rehberlere dön' }]} />
            <AsideCommunityCard />
          </>
        }
      >
        {article.content ? <MarkdownPreview content={article.content} tone="light" /> : null}
      </ArticleShell>
    </>
  );
}
