import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { getCornerAuthorProfile, getPublishedCornerPostBySlug } from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

interface CornerPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPublishedCornerPostBySlug(slug),
    getCornerAuthorProfile(),
  ]);

  if (!post) {
    return createArticleMetadata({
      title: 'Yazı bulunamadı',
      description: 'Aradığınız yayınlanmış köşe yazısı bulunamadı.',
      publishedTime: new Date().toISOString(),
      path: `/yazi-dizisi/${slug}`,
    });
  }

  return createArticleMetadata({
    title: post.title,
    description: post.summary || post.title,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || undefined,
    authors: [profile.displayName],
    tags: ['Arkadaşın Köşesi', 'Yazı Dizisi', 'Almanya'],
    path: post.href,
    image: post.coverImageUrl,
  });
}

export default async function CornerPostDetailPage({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPublishedCornerPostBySlug(slug),
    getCornerAuthorProfile(),
  ]);

  if (!post) notFound();

  const pageUrl = new URL(post.href, SITE_URL).toString();

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.summary || post.title}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt || undefined}
        author={profile.displayName}
        url={pageUrl}
        image={post.coverImageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Arkadaşın Köşesi', url: new URL('/yazi-dizisi', SITE_URL).toString() },
          { name: post.title, url: pageUrl },
        ]}
      />

      <div className="bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.16),_transparent_35%)]" />
          <div className="container relative py-16 md:py-24">
            <Link
              href="/yazi-dizisi"
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Tüm yazılara dön
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="rounded-full bg-google-yellow px-3 py-1 font-semibold text-black">
                    Arkadaşın Köşesi
                  </span>
                  <span>{post.dateLabel}</span>
                  <span>{post.readingMinutes} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                  {post.title}
                </h1>

                {post.summary ? (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">{post.summary}</p>
                ) : null}

                <div className="mt-6 flex items-center gap-3 text-sm text-white/64">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={profile.avatarImageUrl}
                      alt={profile.displayName}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span>{profile.displayName}</span>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {post.content ? (
          <section className="container py-14 md:py-20">
            <article className="mx-auto max-w-4xl">
              <MarkdownPreview content={post.content} />
            </article>
          </section>
        ) : null}
      </div>
    </>
  );
}
