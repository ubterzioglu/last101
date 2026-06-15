import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
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
            <Link
              href="/rehber"
              className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:border-google-blue hover:text-google-blue"
            >
              Tüm rehberlere dön
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="rounded-full bg-google-blue px-3 py-1 font-semibold text-white">
                    {article.category}
                  </span>
                  <span>{article.dateLabel}</span>
                  <span>{article.readingMinutes} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-gray-900 md:text-5xl">
                  {article.title}
                </h1>

                {article.summary ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{article.summary}</p>
                ) : null}
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
              <MarkdownPreview content={article.content} />
            </article>
          </section>
        ) : null}
      </div>
    </>
  );
}
