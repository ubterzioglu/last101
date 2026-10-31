import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { ArticleBody } from '@/components/articles/ArticleBody';
import { AuthorBox } from '@/components/articles/AuthorBox';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { AsideCommunityCard, AsideLinkList, AsideShareCard } from '@/components/news/ArticleAside';
import { ArticleShell } from '@/components/news/ArticleShell';
import { realCoverUrl } from '@/components/news/cover';
import { buildArticleShareText } from '@/components/news/share-text';
import {
  getPublishedCornerAuthorBySlug,
  getPublishedCornerPostBySlug,
  getPublishedCornerPosts,
} from '@/lib/corner';
import { SITE_URL } from '@/lib/utils/constants';

const RELATED_LIMIT = 3;
const DEFAULT_AVATAR = '/images/profil.jpg';

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
  const avatarUrl = post.authorAvatarImageUrl || DEFAULT_AVATAR;
  const cover = realCoverUrl(post.coverImageUrl);
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

      <ArticleShell
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Arkadaşın Köşesi', href: '/yazi-dizisi' },
          { label: post.title },
        ]}
        eyebrow="Arkadaşın Köşesi"
        title={post.title}
        summary={post.summary}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        readingMinutes={post.readingMinutes}
        author={{ name: authorName, avatarUrl }}
        cover={cover ? { src: cover, alt: post.title } : null}
        aside={
          <>
            <AsideShareCard
              url={pageUrl}
              title={post.title}
              shareText={buildArticleShareText({ title: post.title, summary: post.summary, url: pageUrl })}
            />
            {post.authorSlug ? (
              <AuthorBox
                name={authorName}
                href={`/${post.authorSlug}`}
                avatarImageUrl={avatarUrl}
                bio={author?.shortBio}
              />
            ) : null}
            <AsideLinkList links={[{ href: '/yazi-dizisi', label: 'Tüm yazılara dön' }]} />
            <AsideCommunityCard />
          </>
        }
      >
        {post.content ? <ArticleBody content={post.content} /> : null}
      </ArticleShell>

      <RelatedArticles heading="Diğer yazılar" items={relatedPosts} linkLabel="Yazıyı oku" />
    </>
  );
}
