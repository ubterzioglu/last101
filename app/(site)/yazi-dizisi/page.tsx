import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { getFeaturedCornerAuthors, getPublishedCornerPosts } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Arkadaşın Köşesi',
  description: 'almanya101 yazarlarının kişisel köşeleri, deneyimleri ve Almanya notları.',
  path: '/yazi-dizisi',
});

export const dynamic = 'force-dynamic';

export default async function YaziDizisiPage() {
  const [authors, posts] = await Promise.all([
    getFeaturedCornerAuthors(5),
    getPublishedCornerPosts(120),
  ]);
  const pageUrl = new URL('/yazi-dizisi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Arkadaşın Köşesi"
        description="almanya101 yazarlarının kişisel köşeleri, deneyimleri ve Almanya notları."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: pageUrl },
        ]}
      />

      <div className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.20),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.18),_transparent_36%)]" />
          <div className="container relative py-14 md:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/72">
                almanya101 yazı dizisi
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">Arkadaşın Köşesi</h1>
              <p className="mt-5 text-lg leading-8 text-white/76">
                almanya101 içindeki yazarların kendi sesleriyle anlattığı deneyimler, notlar ve yol arkadaşlığı.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Köşe yazarları</h2>
              <p className="mt-2 text-sm text-white/60">Öne çıkan yazarların detay sayfalarına buradan gidin.</p>
            </div>
            <div className="text-sm text-white/50">{authors.length} köşe</div>
          </div>

          {authors.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <h2 className="text-2xl font-bold">Henüz yayında köşe yok.</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">İlk yazar aktif edildiğinde burada görünecek.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {authors.map((author) => (
                <Link
                  key={author.id}
                  href={author.href}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
                >
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-white/5">
                    <Image src={author.avatarImageUrl} alt={author.displayName} fill unoptimized sizes="80px" className="object-cover" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-base font-bold">{author.displayName}</h3>
                    <div className="mt-1 text-xs text-white/50">/{author.slug}</div>
                    {author.shortBio ? <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/65">{author.shortBio}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="container pb-16 md:pb-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Tüm yazılar</h2>
              <p className="mt-2 text-sm text-white/60">Yayındaki yazılar eskiden yeniye sıralanır.</p>
            </div>
            <div className="text-sm text-white/50">{posts.length} yazı</div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <h2 className="text-2xl font-bold">Henüz yayınlanmış yazı yok.</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">İlk yazı yayına alındığında burada görünecek.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.href}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-white/55">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <Image src={post.authorAvatarImageUrl || '/images/profil.jpg'} alt={post.authorName || 'Yazar'} fill unoptimized sizes="32px" className="object-cover" />
                      </div>
                      <span>{post.authorName || 'Yazar'}</span>
                      <span>{post.dateLabel}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold leading-snug line-clamp-2">{post.title}</h3>
                    {post.summary ? <p className="mt-3 text-sm leading-6 text-white/72 line-clamp-3">{post.summary}</p> : null}
                    <div className="mt-5 text-sm font-semibold text-[#7fd5ff]">Yazıyı oku</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
