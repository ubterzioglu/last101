import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { resolveArticleAuthor } from '@/lib/authors';
import { getPublishedNewsArticleBySlug, getRelatedPublishedNewsArticles } from '@/lib/public-news';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/utils/constants';
import { ArticleBody } from '@/components/articles/ArticleBody';
import { AuthorBox } from '@/components/articles/AuthorBox';
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
      noIndex: true,
    });
  }

  const author = resolveArticleAuthor();

  return createArticleMetadata({
    title: article.title,
    description: article.summary || article.title,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [author.href],
    path: `/haberler/${article.slug}`,
    image: realCoverUrl(article.coverImageUrl) ?? DEFAULT_OG_IMAGE,
    tags: [article.categoryLabel, 'Haberler', 'Almanya'],
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) notFound();

  const pageUrl = new URL(`/haberler/${article.slug}`, SITE_URL).toString();
  const author = resolveArticleAuthor();
  const relatedArticles = await getRelatedPublishedNewsArticles(article.id);
  const cover = realCoverUrl(article.coverImageUrl);
  const source =
    article.sourceUrl || article.sourceName
      ? {
          name: article.sourceName || 'Almanya101',
          dateLabel: article.sourcePublishedLabel || article.publishedLabel,
          url: article.sourceUrl || undefined,
        }
      : undefined;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.summary || article.title}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        author={author}
        url={pageUrl}
        image={article.coverImageUrl}
        sourceName={article.sourceName || undefined}
        sourceUrl={article.sourceUrl || undefined}
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
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        readingMinutes={article.readingMinutes}
        author={{ name: author.name, avatarUrl: author.avatarUrl, href: author.href }}
        cover={cover ? { src: cover, alt: article.coverImageAlt } : null}
        aside={
          <>
            <AsideShareCard
              url={pageUrl}
              title={article.title}
              shareText={article.whatsappShareText}
              source={source}
            />
            <AuthorBox name={author.name} href={author.href} avatarImageUrl={author.avatarUrl} kind={author.kind} />
            <AsideLinkList links={[{ href: '/haberler', label: 'Tüm haberlere dön' }]} />
            <AsideCommunityCard />
          </>
        }
      >
        {article.content ? <ArticleBody content={article.content} /> : null}
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
