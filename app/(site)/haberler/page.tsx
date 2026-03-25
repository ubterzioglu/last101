import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { getAllNewsArticles } from '@/lib/content/news';

export const metadata = createMetadata({
  title: 'Haberler',
  description: "Almanya, Avrupa ve Dünya'dan güncel haberler ve gelişmeler.",
  path: '/haberler',
});

export default function HaberlerPage() {
  const articles = getAllNewsArticles();

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.2),_transparent_35%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/72">
              Almanya101 Haber Merkezi
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
              Almanya, Avrupa ve topluluk gündemini tek yerde toplayalım.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Bu alan artık hazırlık ekranı değil. Ana sayfadaki haber kartları buraya ve her haberin kendi detay
              sayfasına bağlanıyor.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/haberler/${article.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-google-yellow px-3 py-1 text-xs font-semibold text-black">
                  {article.category}
                </span>
              </div>

              <div className="p-6">
                <div className="text-sm text-white/55">
                  {article.dateLabel} · {article.readingMinutes} dk
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-snug">{article.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">{article.excerpt}</p>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#7fd5ff]">
                  Haberi aç
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
