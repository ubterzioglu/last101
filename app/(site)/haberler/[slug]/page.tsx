import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getPublishedNewsArticleBySlug, getRelatedPublishedNewsArticles } from '@/lib/public-news';
import { SITE_URL } from '@/lib/utils/constants';
import MarkdownPreview from '@/components/MarkdownPreview';
import { AsideCommunityCard, AsideLinkList, AsideShareCard } from '@/components/news/ArticleAside';
import { ArticleShell } from '@/components/news/ArticleShell';
import { realCoverUrl } from '@/components/news/cover';
import { newsCategoryTone } from '@/components/news/news-tones';
import { NewsListCard } from '@/components/news/NewsListCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) {
    return createArticleMetadata({
      title: 'Haber bulunamadı',
      description: 'Aradığınız yayınlanmış haber bulunamadı.',
      publishedTime: new Date().toISOString(),
      path: `/haberler/${slug}`,
    });
  }

  return createArticleMetadata({
    title: article.title,
    description: article.summary || article.title,
    publishedTime: article.publishedAt,
    path: `/haberler/${article.slug}`,
    image: article.coverImageUrl,
    tags: [article.categoryLabel, 'Haberler', 'Almanya'],
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) notFound();

  const pageUrl = new URL(`/haberler/${article.slug}`, SITE_URL).toString();
  const relatedArticles = await getRelatedPublishedNewsArticles(article.id);
  const cover = realCoverUrl(article.coverImageUrl);
  const source =
    article.sourceUrl || article.sourceName
      ? {
          name: article.sourceName || 'Almanya101',
          dateLabel: article.sourcePublishedLabel || article.publishedLabel,
          url: article.sourceUrl,
        }
      : undefined;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.summary || article.title}
        datePublished={article.publishedAt}
        dateModified={article.publishedAt}
        author="Almanya101"
        url={pageUrl}
        image={article.coverImageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Haberler', url: new URL('/haberler', SITE_URL).toString() },
          { name: article.title, url: pageUrl },
        ]}
      />

      <ArticleShell
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Haberler', href: '/haberler' },
          { label: article.title },
        ]}
        eyebrow={article.categoryLabel}
        eyebrowTone={newsCategoryTone(article.category)}
        title={article.title}
        summary={article.summary}
        dateLabel={article.publishedLabel}
        readingMinutes={article.readingMinutes}
        cover={cover ? { src: cover, alt: article.coverImageAlt } : null}
        aside={
          <>
            <AsideShareCard shareText={article.whatsappShareText} source={source} />
            <AsideLinkList links={[{ href: '/haberler', label: 'Tüm haberlere dön' }]} />
            <AsideCommunityCard />
          </>
        }
      >
        {article.content ? <MarkdownPreview content={article.content} tone="light" /> : null}
      </ArticleShell>

      {relatedArticles.length > 0 ? (
        <Section tone="band">
          <SectionHeader title="Diğer haberler" />
          <div className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <NewsListCard key={relatedArticle.id} item={relatedArticle} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
