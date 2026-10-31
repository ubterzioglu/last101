import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import MarkdownPreview from '@/components/MarkdownPreview';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { ArticleBreadcrumb } from '@/components/articles/ArticleBreadcrumb';
import { ArticleDates } from '@/components/articles/ArticleDates';
import { ArticleToc } from '@/components/articles/ArticleToc';
import { AuthorBox } from '@/components/articles/AuthorBox';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { ShareBar } from '@/components/articles/ShareBar';
import {
  getPublishedCornerAuthorBySlug,
  getPublishedCornerPostBySlug,
  getPublishedCornerPosts,
} from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

const RELATED_LIMIT = 3;

interface CornerPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedCornerPostBySlug(slug);

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
    authors: [post.authorName || 'Arkadaşın Köşesi'],
    tags: ['Arkadaşın Köşesi', 'Yazı Dizisi', 'Almanya'],
    path: post.href,
    image: post.coverImageUrl,
  });
}

export default async function CornerPostDetailPage({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedCornerPostBySlug(slug);

  if (!post) notFound();

  const pageUrl = new URL(post.href, SITE_URL).toString();
  const authorName = post.authorName || 'Arkadaşın Köşesi';
  const [author, allPosts] = await Promise.all([
    post.authorSlug ? getPublishedCornerAuthorBySlug(post.authorSlug) : Promise.resolve(undefined),
    getPublishedCornerPosts(),
  ]);
  // Aynı yazarın diğer yazıları önce, ardından en yeniler; liste yeniden eskiye sıralanır.
  const others = allPosts
    .filter((item) => item.id !== post.id)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const relatedPosts = [
    ...others.filter((item) => item.authorId === post.authorId),
    ...others.filter((item) => item.authorId !== post.authorId),
  ].slice(0, RELATED_LIMIT);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.summary || post.title}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt || undefined}
        author={authorName}
        authorType={post.authorSlug ? 'Person' : 'Organization'}
        authorUrl={post.authorSlug ? new URL(`/${post.authorSlug}`, SITE_URL).toString() : undefined}
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
            <ArticleBreadcrumb
              items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Arkadaşın Köşesi', href: '/yazi-dizisi' },
                { name: post.title },
              ]}
            />

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="rounded-full bg-google-yellow px-3 py-1 font-semibold text-black">
                    Arkadaşın Köşesi
                  </span>
                  <ArticleDates publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
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
                    <Image src={post.authorAvatarImageUrl || '/images/profil.jpg'} alt={authorName} fill unoptimized sizes="40px" className="object-cover" />
                  </div>
                  <span>{authorName}</span>
                </div>

                <ShareBar url={pageUrl} title={post.title} className="mt-6" />
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
              <ArticleToc content={post.content} />
              <div className="mt-8">
                <MarkdownPreview content={post.content} demoteH1 />
              </div>
              <div className="mt-12 space-y-8 border-t border-white/10 pt-6">
                <ShareBar url={pageUrl} title={post.title} />
                {post.authorSlug ? (
                  <AuthorBox
                    name={authorName}
                    href={`/${post.authorSlug}`}
                    avatarImageUrl={post.authorAvatarImageUrl || '/images/profil.jpg'}
                    bio={author?.shortBio}
                  />
                ) : null}
              </div>
            </article>
          </section>
        ) : null}

        <RelatedArticles heading="Diğer yazılar" items={relatedPosts} />
      </div>
    </>
  );
}
