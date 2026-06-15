import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getPublishedNewsArticleBySlug, getRelatedPublishedNewsArticles } from '@/lib/public-news';
import { SITE_URL } from '@/lib/utils/constants';
import MarkdownPreview from '@/components/MarkdownPreview';
import { NewsListCard } from '@/components/news/NewsListCard';
import { WhatsAppShareButton } from '@/components/news/WhatsAppShareButton';

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

      <div className="bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.18),_transparent_35%)]" />
          <div className="container relative py-16 md:py-24">
            <Link
              href="/haberler"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Tüm haberlere dön
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
              <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="rounded-full bg-google-yellow px-3 py-1 font-semibold text-black">
                    {article.categoryLabel}
                  </span>
                  <span>{article.publishedLabel}</span>
                  <span>{article.readingMinutes} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                  {article.title}
                </h1>

                {article.summary ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">{article.summary}</p>
                ) : null}
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src={article.coverImageUrl}
                  alt={article.coverImageAlt}
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
            <div className="mx-auto max-w-4xl">
              <MarkdownPreview content={article.content} />
            </div>
          </section>
        ) : null}

        <section className="container pb-12">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
            <WhatsAppShareButton text={article.whatsappShareText} />
            {article.sourceUrl ? (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Kaynak bağlantısını aç
              </a>
            ) : null}
          </div>
        </section>

        {(article.sourceUrl || article.sourceName) ? (
          <section className="container py-14 md:py-20">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
              <div className="grid gap-6 text-base leading-8 text-white/84 md:grid-cols-2 md:text-lg">
                <div>
                  <div className="text-sm uppercase tracking-[0.18em] text-white/45">Kaynak</div>
                  <div className="mt-2 text-xl font-semibold">{article.sourceName || 'Almanya101'}</div>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.18em] text-white/45">Kaynak Tarihi</div>
                  <div className="mt-2 text-xl font-semibold">
                    {article.sourcePublishedLabel || article.publishedLabel}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {relatedArticles.length > 0 ? (
          <section className="container pb-20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Diğer haberler</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <NewsListCard key={relatedArticle.id} item={relatedArticle} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
