import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { getPublishedCornerAuthorBySlug } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

interface AuthorPublicPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: AuthorPublicPageProps) {
  const { authorSlug } = await params;
  const author = await getPublishedCornerAuthorBySlug(authorSlug);
  if (!author) {
    return createMetadata({
      title: 'Köşe bulunamadı',
      description: 'Aradığınız köşe bulunamadı.',
      path: `/${authorSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: author.displayName,
    description: author.shortBio || `${author.displayName} köşesi`,
    path: author.href,
    image: author.avatarImageUrl,
  });
}

export default async function AuthorPublicPage({ params }: AuthorPublicPageProps) {
  const { authorSlug } = await params;
  const author = await getPublishedCornerAuthorBySlug(authorSlug);

  if (!author) notFound();

  const posts = author.posts || [];
  const pageUrl = new URL(author.href, SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title={author.displayName}
        description={author.shortBio || `${author.displayName} köşesi`}
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: new URL('/yazi-dizisi', SITE_URL).toString() },
          { name: author.displayName, url: pageUrl },
        ]}
      />

      <div className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.16),_transparent_35%)]" />
          <div className="container relative py-16 md:py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <Image src={author.avatarImageUrl} alt={author.displayName} fill unoptimized sizes="112px" className="object-cover" />
              </div>
              <div>
                <div className="text-sm text-white/55">/{author.slug}</div>
                <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">{author.displayName}</h1>
                {author.shortBio ? <p className="mt-5 max-w-3xl text-lg leading-8 text-white/76">{author.shortBio}</p> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-14 md:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Yazılar</h2>
              <p className="mt-2 text-sm text-white/60">Bu köşedeki yayınlanmış yazılar eskiden yeniye sıralanır.</p>
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
                    <Image src={post.coverImageUrl} alt={post.title} fill unoptimized sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-white/55">{post.dateLabel} · {post.readingMinutes} dk okuma</div>
                    <h3 className="mt-3 text-2xl font-bold leading-snug line-clamp-2">{post.title}</h3>
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
