import { revalidatePath } from 'next/cache';

/**
 * Drops cached blog pages after a successful corner write. Next derives the cache tag of a
 * dynamic page from its file path, which includes the route group, so the group patterns below
 * must name `(marketing)`; the plain `/blog/...` URLs only match exact paths. Post detail slugs
 * embed the title, so detail pages are invalidated as a group. Failures never break the
 * already-committed write.
 */
export function revalidateBlogPaths(authorSlugs: ReadonlyArray<string | null | undefined> = []): void {
  const uniqueSlugs = [...new Set(authorSlugs.filter((slug): slug is string => Boolean(slug)))];
  try {
    revalidatePath('/blog');
    revalidatePath('/blog/feed.xml');
    revalidatePath('/(marketing)/blog/[slug]', 'page');
    revalidatePath('/(marketing)/blog/yazar/[authorSlug]', 'page');
    for (const slug of uniqueSlugs) revalidatePath(`/blog/yazar/${slug}`);
  } catch (error) {
    console.error('revalidateBlogPaths failed:', error);
  }
}
