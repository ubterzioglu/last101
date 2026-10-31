import { cache } from 'react';
import { SITE_AUTHOR_SLUG } from '@/lib/authors';
import {
  getPublishedCornerAuthorProfileBySlug,
  getPublishedCornerPostSummaries,
} from '@/lib/corner';
import type { PublicCornerAuthor, PublicCornerPost } from '@/lib/corner';
import { getPublishedNewsArticles } from '@/lib/public-news';
import { getPublishedRehberArticles } from '@/lib/rehber-articles';
import type { PublicRehberArticle } from '@/lib/rehber-articles';
import type { PublicNewsArticle } from '@/types/news';

const SECTION_LIMIT = 6;
const BLOG_CANDIDATE_LIMIT = 100;

export interface SiteAuthorContent {
  /** DB row of the system author; undefined until the seed migration is applied. */
  profile: PublicCornerAuthor | undefined;
  guides: PublicRehberArticle[];
  news: PublicNewsArticle[];
  /** Posts attributed to the site author (no author set, or the system author). */
  blogPosts: PublicCornerPost[];
  hasContent: boolean;
}

async function settled<T>(promise: Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    console.error(`siteAuthorContent: ${label} failed`, error);
    return fallback;
  }
}

/** One load per request, shared by generateMetadata and the page. */
export const loadSiteAuthorContent = cache(async (): Promise<SiteAuthorContent> => {
  const [profile, guides, news, candidates] = await Promise.all([
    settled(getPublishedCornerAuthorProfileBySlug(SITE_AUTHOR_SLUG), undefined, 'profile'),
    settled(getPublishedRehberArticles(SECTION_LIMIT), [], 'guides'),
    settled(getPublishedNewsArticles(SECTION_LIMIT), [], 'news'),
    settled(getPublishedCornerPostSummaries(BLOG_CANDIDATE_LIMIT), [], 'posts'),
  ]);

  const blogPosts = candidates
    .filter((post) => !post.authorSlug || post.authorSlug === SITE_AUTHOR_SLUG)
    .slice(0, SECTION_LIMIT);

  return {
    profile,
    guides,
    news,
    blogPosts,
    hasContent: guides.length > 0 || news.length > 0 || blogPosts.length > 0,
  };
});
