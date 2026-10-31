import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { SITE_AUTHOR, SITE_AUTHOR_SLUG, authorProfileHref } from '@/lib/authors';
import { getPublishedCornerAuthorProfileBySlug } from '@/lib/corner';

interface AuthorRootShimProps {
  params: Promise<{ authorSlug: string }>;
}

// Legacy root author URLs (/<slug>) only redirect to /blog/yazar/<slug>; they are never indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthorRootShim({ params }: AuthorRootShimProps) {
  const { authorSlug } = await params;

  if (authorSlug.trim().toLowerCase() === SITE_AUTHOR_SLUG) {
    permanentRedirect(SITE_AUTHOR.href);
  }

  const author = await getPublishedCornerAuthorProfileBySlug(authorSlug);
  if (!author) notFound();

  permanentRedirect(authorProfileHref(author.slug));
}
