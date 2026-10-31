import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryResult = vi.hoisted(() => ({ current: { data: null as unknown, error: null as unknown } }));

vi.mock('next/cache', () => ({ unstable_noStore: () => undefined }));

vi.mock('@supabase/supabase-js', () => {
  // Chainable, awaitable stand-in for a PostgREST query builder.
  const builder: Record<string, unknown> = {};
  for (const method of ['select', 'eq', 'order', 'limit', 'range']) {
    builder[method] = () => builder;
  }
  builder.maybeSingle = () => Promise.resolve(queryResult.current);
  builder.then = (resolve: (value: unknown) => unknown) => resolve(queryResult.current);
  return { createClient: () => ({ from: () => builder }) };
});

import {
  getAllCornerPostsForSitemap,
  getFeaturedCornerAuthors,
  getPublishedCornerPostBySlug,
  getPublishedCornerPostSummaries,
  isCornerPostPubliclyVisible,
  isShowcaseCornerAuthor,
  type CornerAuthorRow,
  type CornerPostRow,
} from '@/lib/corner';

const POST_ID = '11111111-1111-1111-1111-111111111111';

function authorRow(overrides: Partial<CornerAuthorRow> = {}): CornerAuthorRow {
  return {
    id: 'author-1',
    slug: 'aslihan',
    display_name: 'Aslıhan',
    short_bio: null,
    bio_content: null,
    avatar_image_url: null,
    display_order: 10,
    is_active: true,
    updated_at: null,
    ...overrides,
  };
}

function postRow(overrides: Partial<CornerPostRow> = {}): CornerPostRow {
  return {
    id: POST_ID,
    author_id: 'author-1',
    status: 'published',
    title: 'Anmeldung nasıl yapılır',
    summary: 'Özet',
    content: '<p>Metin</p>',
    cover_image_url: null,
    reading_minutes: 4,
    published_at: '2026-10-01T10:00:00Z',
    created_at: '2026-09-30T10:00:00Z',
    updated_at: '2026-10-02T10:00:00Z',
    corner_authors: authorRow(),
    ...overrides,
  };
}

describe('isCornerPostPubliclyVisible', () => {
  it('shows a published post whose author is active', () => {
    expect(isCornerPostPubliclyVisible(postRow())).toBe(true);
  });

  it('accepts the join as a single-element array', () => {
    expect(isCornerPostPubliclyVisible(postRow({ corner_authors: [authorRow()] }))).toBe(true);
  });

  it('hides a post of a passive author (join flag false)', () => {
    expect(isCornerPostPubliclyVisible(postRow({ corner_authors: authorRow({ is_active: false }) }))).toBe(false);
  });

  it('hides a post whose author is not visible in the join', () => {
    expect(isCornerPostPubliclyVisible(postRow({ corner_authors: null }))).toBe(false);
    expect(isCornerPostPubliclyVisible(postRow({ corner_authors: [] }))).toBe(false);
  });

  it('shows a published post without an author', () => {
    expect(isCornerPostPubliclyVisible(postRow({ author_id: null, corner_authors: null }))).toBe(true);
  });

  it('hides drafts regardless of the author', () => {
    expect(isCornerPostPubliclyVisible(postRow({ status: 'draft' }))).toBe(false);
    expect(isCornerPostPubliclyVisible(postRow({ status: 'draft', author_id: null, corner_authors: null }))).toBe(false);
  });
});

describe('showcase authors', () => {
  it('excludes the system author slug', () => {
    expect(isShowcaseCornerAuthor({ slug: 'almanya101' })).toBe(false);
    expect(isShowcaseCornerAuthor({ slug: 'aslihan' })).toBe(true);
  });

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
  });

  it('getFeaturedCornerAuthors drops almanya101 and respects the limit', async () => {
    queryResult.current = {
      data: [
        authorRow({ id: 'a0', slug: 'almanya101', display_order: 9999 }),
        authorRow({ id: 'a1', slug: 'aslihan' }),
        authorRow({ id: 'a2', slug: 'ubt' }),
      ],
      error: null,
    };

    const authors = await getFeaturedCornerAuthors(2);

    expect(authors.map((author) => author.slug)).toEqual(['aslihan', 'ubt']);
    expect(authors[0].href).toBe('/blog/yazar/aslihan');
  });
});

describe('visibility in data functions', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
  });

  it('detail returns undefined for a passive author', async () => {
    queryResult.current = {
      data: postRow({ corner_authors: authorRow({ is_active: false }) }),
      error: null,
    };

    await expect(getPublishedCornerPostBySlug(`anmeldung--${POST_ID}`)).resolves.toBeUndefined();
  });

  it('detail leaves author fields undefined when author_id is null', async () => {
    queryResult.current = { data: postRow({ author_id: null, corner_authors: null }), error: null };

    const post = await getPublishedCornerPostBySlug(`anmeldung--${POST_ID}`);

    expect(post).toBeDefined();
    expect(post?.authorSlug).toBeUndefined();
    expect(post?.authorName).toBeUndefined();
  });

  it('summaries and sitemap use the same visibility rule', async () => {
    queryResult.current = {
      data: [
        postRow({ id: 'p-active' }),
        postRow({ id: 'p-passive', corner_authors: authorRow({ is_active: false }) }),
        postRow({ id: 'p-anon', author_id: null, corner_authors: null }),
      ],
      error: null,
    };

    const summaries = await getPublishedCornerPostSummaries();
    const sitemap = await getAllCornerPostsForSitemap();

    expect(summaries.map((post) => post.id)).toEqual(['p-active', 'p-anon']);
    expect(sitemap.map((entry) => entry.slug.split('--')[1])).toEqual(['p-active', 'p-anon']);
    expect(sitemap[0]).toMatchObject({ href: expect.stringMatching(/^\/blog\//), authorSlug: 'aslihan' });
    expect(sitemap[1].authorSlug).toBeUndefined();
  });

  it('returns an empty list on a Supabase error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    queryResult.current = { data: null, error: { message: 'boom' } };

    await expect(getPublishedCornerPostSummaries()).resolves.toEqual([]);
    await expect(getAllCornerPostsForSitemap()).resolves.toEqual([]);
    spy.mockRestore();
  });
});
