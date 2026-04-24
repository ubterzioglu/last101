import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { getCornerAuthorProfile, getPublishedCornerPosts } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Arkadaşın Köşesi',
  description: 'Almanya yolculuğuna dair kişisel yazılar, notlar ve deneyimler.',
  path: '/yazi-dizisi',
});

export const dynamic = 'force-dynamic';

export default async function YaziDizisiPage() {
  const [profile, posts] = await Promise.all([
    getCornerAuthorProfile(),
    getPublishedCornerPosts(48),
  ]);
  const pageUrl = new URL('/yazi-dizisi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Arkadaşın Köşesi"
        description="Almanya yolculuğuna dair kişisel yazılar, notlar ve deneyimler."
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
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/72">
                  almanya101 özel yazı dizisi
                </div>
                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                  Arkadaşın Köşesi
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
                  {profile.shortBio}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    <Image
                      src={profile.avatarImageUrl}
                      alt={profile.displayName}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-google-yellow">
                      Ben kimim?
                    </div>
                    <h2 className="mt-2 text-2xl font-bold">{profile.displayName}</h2>
                  </div>
                </div>
                {profile.bioContent ? (
                  <div className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-white/76">
                    <MarkdownPreview content={profile.bioContent} className="prose-sm" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Yazılar</h2>
              <p className="mt-2 text-sm text-white/60">Yayındaki köşe yazıları tarih sırasıyla burada.</p>
            </div>
            <div className="text-sm text-white/50">{posts.length} yazı</div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <h2 className="text-2xl font-bold">Henüz yayınlanmış yazı yok.</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                İlk yazı yayına alındığında bu alanda görünecek.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={post.href}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-white/55">
                      {post.dateLabel} · {post.readingMinutes} dk
                    </div>
                    <h3 className="mt-3 text-2xl font-bold leading-snug line-clamp-2">{post.title}</h3>
                    {post.summary ? (
                      <p className="mt-3 text-sm leading-6 text-white/72 line-clamp-3">{post.summary}</p>
                    ) : null}
                    <div className="mt-5 inline-flex text-sm font-semibold text-[#7fd5ff]">
                      Yazıyı oku
                    </div>
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
