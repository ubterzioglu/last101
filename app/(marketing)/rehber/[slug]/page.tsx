import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { ArticleBreadcrumb } from '@/components/articles/ArticleBreadcrumb';
import { ArticleDates } from '@/components/articles/ArticleDates';
import { ArticleToc } from '@/components/articles/ArticleToc';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { ShareBar } from '@/components/articles/ShareBar';
import { getPublishedRehberArticleBySlug, getPublishedRehberArticles } from '@/lib/rehber-articles';
import { SITE_URL } from '@/lib/utils/constants';

const RELATED_LIMIT = 3;

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
  const candidates = (await getPublishedRehberArticles(24)).filter((item) => item.id !== article.id);
  // Aynı kategoridekiler önce gelir; yeterli değilse en yeni rehberlerle tamamlanır.
  const relatedArticles = [
    ...candidates.filter((item) => item.category === article.category),
    ...candidates.filter((item) => item.category !== article.category),
  ].slice(0, RELATED_LIMIT);

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

      <div className="bg-white text-gray-900">
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="container py-12 md:py-16">
            <ArticleBreadcrumb
              tone="light"
              items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Rehber', href: '/rehber' },
                { name: article.title },
              ]}
            />

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="rounded-full bg-google-blue px-3 py-1 font-semibold text-white">
                    {article.category}
                  </span>
                  <ArticleDates publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
                  <span>{article.readingMinutes} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-gray-900 md:text-5xl">
                  {article.title}
                </h1>

                {article.summary ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{article.summary}</p>
                ) : null}

                <ShareBar tone="light" url={pageUrl} title={article.title} className="mt-6" />
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {article.content ? (
          <section className="container py-14 md:py-20">
            <article className="mx-auto max-w-4xl">
              <ArticleToc content={article.content} tone="light" />
              <div className="mt-8">
                <MarkdownPreview content={article.content} demoteH1 />
              </div>
              <div className="mt-12 border-t border-gray-200 pt-6">
                <ShareBar tone="light" url={pageUrl} title={article.title} />
              </div>
            </article>
          </section>
        ) : null}

        <RelatedArticles heading="Diğer rehberler" tone="light" items={relatedArticles} />
      </div>
    </>
  );
}
