import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getPublishedNewsArticleBySlug, getRelatedPublishedNewsArticles } from '@/lib/public-news';
import { SITE_URL } from '@/lib/utils/constants';

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
    description: article.excerpt || article.title,
    publishedTime: article.publishedAt,
    path: article.href,
    image: article.image,
    tags: [article.category, 'Haberler', 'Almanya'],
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) notFound();

  const pageUrl = new URL(article.href, SITE_URL).toString();
  const relatedArticles = await getRelatedPublishedNewsArticles(article.id);

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || article.title}
        datePublished={article.publishedAt}
        author="Almanya101"
        url={pageUrl}
        image={article.image}
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
                    {article.category}
                  </span>
                  <span>{article.dateLabel}</span>
                  <span>{article.readingMinutes} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                  {article.title}
                </h1>

                {article.excerpt ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">{article.excerpt}</p>
                ) : null}
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src={article.image}
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

        <section className="container grid gap-12 py-14 md:grid-cols-[minmax(0,1fr)_320px] md:py-20">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <div className="space-y-6 text-base leading-8 text-white/84 md:text-lg">
              {article.excerpt ? (
                <div>
                  <h2 className="text-2xl font-bold">Özet</h2>
                  <p className="mt-4">{article.excerpt}</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold">Özet</h2>
                  <p className="mt-4 text-white/70">Bu kayıt için ayrıca özet metni girilmemiş.</p>
                </div>
              )}

              <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:grid-cols-2">
                <div>
                  <div className="text-sm uppercase tracking-[0.16em] text-white/45">Yayın Tarihi</div>
                  <div className="mt-2 font-semibold">{article.dateLabel}</div>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.16em] text-white/45">Kategori</div>
                  <div className="mt-2 font-semibold">{article.category}</div>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.16em] text-white/45">Okuma Süresi</div>
                  <div className="mt-2 font-semibold">{article.readingMinutes} dakika</div>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.16em] text-white/45">Kaynak</div>
                  <div className="mt-2 font-semibold">{article.sourceName || 'Belirtilmedi'}</div>
                </div>
              </div>

              {article.sourceUrl ? (
                <div>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-[#01A1F1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6]"
                  >
                    Kaynak bağlantısını aç
                  </a>
                </div>
              ) : null}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold">Diğer Haberler</h2>
              <div className="mt-5 space-y-4">
                {relatedArticles.length === 0 ? (
                  <p className="text-sm leading-7 text-white/65">Şu anda başka yayınlanmış haber bulunmuyor.</p>
                ) : (
                  relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={related.href}
                      className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
                    >
                      <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                        {related.category}
                      </div>
                      <div className="mt-2 font-semibold leading-6">{related.title}</div>
                      <div className="mt-2 text-sm text-white/60">{related.dateLabel}</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
