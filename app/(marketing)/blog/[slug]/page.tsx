import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { createArticleMetadata, createMetadata } from '@/lib/seo/metadata';
import { ArticleBody } from '@/components/articles/ArticleBody';
import { AuthorBox } from '@/components/articles/AuthorBox';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { AsideCommunityCard, AsideLinkList, AsideShareCard } from '@/components/news/ArticleAside';
import { ArticleShell } from '@/components/news/ArticleShell';
import { realCoverUrl } from '@/components/news/cover';
import { buildArticleShareText } from '@/components/news/share-text';
import { resolveArticleAuthor } from '@/lib/authors';
import type { ArticleAuthorRef } from '@/lib/authors';
import {
  getPublishedCornerAuthorProfileBySlug,
  getPublishedCornerPostBySlug,
  getPublishedCornerPostSummaries,
} from '@/lib/corner';
import type { PublicCornerPost } from '@/lib/corner';
import { CANONICAL_SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/utils/constants';

const RELATED_LIMIT = 3;
const RELATED_CANDIDATE_LIMIT = 24;
const ARTICLE_SECTION = 'Köşe Yazıları';

interface CornerPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

/** One fetch per request, shared by generateMetadata and the page. */
const loadPost = cache(getPublishedCornerPostBySlug);

function authorOfPost(post: PublicCornerPost): ArticleAuthorRef {
  return resolveArticleAuthor(
    post.authorSlug
      ? {
          slug: post.authorSlug,
          displayName: post.authorName ?? '',
          avatarImageUrl: post.authorAvatarImageUrl,
        }
      : null,
  );
}

function countWords(content: string | null): number | undefined {
  const text = content?.trim();
  if (!text) return undefined;
  return text.split(/\s+/).length;
}

export async function generateMetadata({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    // No canonical from user input and no invented publish date for a page that does not exist.
    return createMetadata({
      title: 'Yazı bulunamadı',
      description: 'Aradığınız yayınlanmış köşe yazısı bulunamadı.',
      path: '/blog',
      noIndex: true,
    });
  }

  const author = authorOfPost(post);

  return createArticleMetadata({
    title: post.title,
    description: post.summary || post.title,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [author.href],
    tags: [ARTICLE_SECTION, 'Almanya'],
    section: ARTICLE_SECTION,
    path: post.href,
    image: realCoverUrl(post.coverImageUrl) ?? DEFAULT_OG_IMAGE,
  });
}

export default async function CornerPostDetailPage({ params }: CornerPostDetailPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  const pageUrl = new URL(post.href, CANONICAL_SITE_URL).toString();
  const author = authorOfPost(post);
  const cover = realCoverUrl(post.coverImageUrl);
  const [authorProfile, candidates] = await Promise.all([
    author.kind === 'Person' ? getPublishedCornerAuthorProfileBySlug(author.slug) : Promise.resolve(undefined),
    getPublishedCornerPostSummaries(RELATED_CANDIDATE_LIMIT),
  ]);
  // Aynı yazarın diğer yazıları önce, ardından en yeniler (liste zaten yeniden eskiye sıralı).
  const others = candidates.filter((item) => item.id !== post.id);
  const relatedPosts = [
    ...others.filter((item) => item.authorId === post.authorId),
    ...others.filter((item) => item.authorId !== post.authorId),
  ].slice(0, RELATED_LIMIT);

  return (
    <>
      <ArticleJsonLd
        type="BlogPosting"
        title={post.title}
        description={post.summary || post.title}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        author={author}
        url={pageUrl}
        image={post.coverImageUrl}
        articleSection={ARTICLE_SECTION}
        wordCount={countWords(post.content)}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', CANONICAL_SITE_URL).toString() },
          { name: 'Blog', url: new URL('/blog', CANONICAL_SITE_URL).toString() },
          { name: post.title, url: pageUrl },
        ]}
      />

      <ArticleShell
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
        eyebrow={ARTICLE_SECTION}
        title={post.title}
        summary={post.summary}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        readingMinutes={post.readingMinutes}
        author={{ name: author.name, avatarUrl: author.avatarUrl, href: author.href }}
        cover={cover ? { src: cover, alt: post.title } : null}
        aside={
          <>
            <AsideShareCard
              url={pageUrl}
              title={post.title}
              shareText={buildArticleShareText({ title: post.title, summary: post.summary, url: pageUrl })}
            />
            <AuthorBox
              name={author.name}
              href={author.href}
              avatarImageUrl={author.avatarUrl}
              bio={authorProfile?.shortBio || undefined}
              kind={author.kind}
            />
            <AsideLinkList links={[{ href: '/blog', label: 'Tüm yazılara dön' }]} />
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
