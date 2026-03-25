import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createArticleMetadata } from '@/lib/seo/metadata';
import {
  getAllNewsArticles,
  getNewsArticleBySlug,
  getRelatedNewsArticles,
} from '@/lib/content/news';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllNewsArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    return createArticleMetadata({
      title: 'Haber bulunamadı',
      description: 'Aradığınız haber bulunamadı.',
      publishedTime: new Date().toISOString(),
      path: `/haberler/${slug}`,
    });
  }

  return createArticleMetadata({
    title: article.title,
    description: article.excerpt,
    publishedTime: article.publishedAt,
    path: `/haberler/${article.slug}`,
    image: article.image,
    tags: [article.category, 'Haberler', 'Almanya'],
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = getRelatedNewsArticles(article.slug);

  return (
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

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
                {article.excerpt}
              </p>

              {article.sourceName ? (
                <div className="mt-6 text-sm text-white/55">
                  Kaynak: {article.sourceName}
                </div>
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
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[#01A1F1]/12 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7fd5ff]">
              Haber Yönetimi İçin Hazır Alan
            </div>
            <h2 className="mt-3 text-2xl font-bold">Bu detay sayfası artık canlı bir temel sunuyor.</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Bir sonraki adımda aynı şablonu admin üzerinden oluşturulan haber kayıtlarına bağlayabiliriz.
              Böylece ana sayfa kartı, haber listesi ve detay sayfası tek kaynaktan beslenecek.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Diğer Haberler</h2>
            <div className="mt-5 space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/haberler/${related.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                    {related.category}
                  </div>
                  <div className="mt-2 font-semibold leading-6">{related.title}</div>
                  <div className="mt-2 text-sm text-white/60">{related.dateLabel}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
