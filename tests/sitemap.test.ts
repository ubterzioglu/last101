import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MockPost {
  slug: string;
  href: string;
  publishedAt: string;
  updatedAt: string | null;
  authorSlug?: string;
}

const mocks = vi.hoisted(() => ({
  corner: vi.fn(),
  news: vi.fn(),
  rehber: vi.fn(),
}));

vi.mock('@/lib/corner', () => ({ getAllCornerPostsForSitemap: mocks.corner }));
vi.mock('@/lib/public-news', () => ({ getAllPublishedNewsEntriesForSitemap: mocks.news }));
vi.mock('@/lib/rehber-articles', () => ({ getAllRehberArticlesForSitemap: mocks.rehber }));

import sitemap from '@/app/sitemap';

const BASE = 'https://almanya101.de';

function post(overrides: Partial<MockPost> & { slug: string }): MockPost {
  return {
    href: `/blog/${overrides.slug}`,
    publishedAt: '2026-10-01T10:00:00.000Z',
    updatedAt: null,
    ...overrides,
  };
}

async function urls(): Promise<string[]> {
  return (await sitemap()).map((entry) => entry.url);
}

async function find(url: string) {
  return (await sitemap()).find((entry) => entry.url === url);
}

beforeEach(() => {
  mocks.corner.mockReset().mockResolvedValue([]);
  mocks.news.mockReset().mockResolvedValue([]);
  mocks.rehber.mockReset().mockResolvedValue([]);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('sitemap blog entries', () => {
  it('no longer lists /yazi-dizisi and lists /blog with priority 0.8', async () => {
    const all = await urls();
    const blog = await find(`${BASE}/blog`);

    expect(all.some((url) => url.includes('/yazi-dizisi'))).toBe(false);
    expect(all.filter((url) => url === `${BASE}/blog`)).toHaveLength(1);
    expect(blog?.priority).toBe(0.8);
  });

  it('gives /blog no lastModified when there are no posts (no fake dates)', async () => {
    const blog = await find(`${BASE}/blog`);

    expect(blog).toBeDefined();
    expect(blog?.lastModified).toBeUndefined();
  });

  it('uses the newest publish date as /blog lastModified', async () => {
    mocks.corner.mockResolvedValue([
      post({ slug: 'eski--1', publishedAt: '2026-09-01T00:00:00.000Z' }),
      post({ slug: 'yeni--2', publishedAt: '2026-10-20T00:00:00.000Z' }),
    ]);
    const blog = await find(`${BASE}/blog`);

    expect(blog?.lastModified).toEqual(new Date('2026-10-20T00:00:00.000Z'));
  });

  it('lists each post with priority 0.7 under /blog/<slug>', async () => {
    mocks.corner.mockResolvedValue([post({ slug: 'ilk-yazi--abc' })]);
    const entry = await find(`${BASE}/blog/ilk-yazi--abc`);

    expect(entry?.priority).toBe(0.7);
  });

  it('uses updatedAt as lastModified only for a meaningful update', async () => {
    mocks.corner.mockResolvedValue([
      post({
        slug: 'guncel--1',
        publishedAt: '2026-10-01T10:00:00.000Z',
        updatedAt: '2026-10-10T10:00:00.000Z',
      }),
      post({
        slug: 'ayni-gun--2',
        publishedAt: '2026-10-01T10:00:00.000Z',
        updatedAt: '2026-10-01T12:00:00.000Z',
      }),
      post({ slug: 'guncellenmemis--3', publishedAt: '2026-10-02T10:00:00.000Z', updatedAt: null }),
    ]);

    expect((await find(`${BASE}/blog/guncel--1`))?.lastModified).toEqual(new Date('2026-10-10T10:00:00.000Z'));
    expect((await find(`${BASE}/blog/ayni-gun--2`))?.lastModified).toEqual(new Date('2026-10-01T10:00:00.000Z'));
    expect((await find(`${BASE}/blog/guncellenmemis--3`))?.lastModified).toEqual(
      new Date('2026-10-02T10:00:00.000Z'),
    );
  });

  it('lists a post without an author but creates no author page for it', async () => {
    mocks.corner.mockResolvedValue([post({ slug: 'yazarsiz--1' })]);
    const all = await urls();

    expect(all).toContain(`${BASE}/blog/yazarsiz--1`);
    expect(all.filter((url) => url.includes('/blog/yazar/'))).toEqual([`${BASE}/blog/yazar/almanya101`]);
  });

  it('lists the editorial author page with priority 0.5 even without posts', async () => {
    const entry = await find(`${BASE}/blog/yazar/almanya101`);

    expect(entry?.priority).toBe(0.5);
  });

  it('lists an author page once for an author with several posts', async () => {
    mocks.corner.mockResolvedValue([
      post({ slug: 'a--1', authorSlug: 'ayse' }),
      post({ slug: 'b--2', authorSlug: 'ayse' }),
      post({ slug: 'c--3', authorSlug: 'mehmet' }),
    ]);
    const authorUrls = (await urls()).filter((url) => url.includes('/blog/yazar/')).sort();

    expect(authorUrls).toEqual([
      `${BASE}/blog/yazar/almanya101`,
      `${BASE}/blog/yazar/ayse`,
      `${BASE}/blog/yazar/mehmet`,
    ]);
  });

  it('omits posts and authors that lib/corner already filtered out (inactive author)', async () => {
    // lib/corner drops posts of inactive authors; the sitemap must not resurrect them.
    mocks.corner.mockResolvedValue([post({ slug: 'aktif--1', authorSlug: 'aktif-yazar' })]);
    const all = await urls();

    expect(all).not.toContain(`${BASE}/blog/yazar/pasif-yazar`);
    expect(all.some((url) => url.includes('pasif'))).toBe(false);
  });
});

describe('sitemap resilience', () => {
  it('keeps static routes and other sources when the corner source rejects', async () => {
    mocks.corner.mockRejectedValue(new Error('supabase down'));
    mocks.news.mockResolvedValue([{ slug: 'haber-1', updatedAt: '2026-10-05T00:00:00.000Z' }]);
    const all = await urls();

    expect(all).toContain(BASE);
    expect(all).toContain(`${BASE}/rehber`);
    expect(all).toContain(`${BASE}/blog`);
    expect(all).toContain(`${BASE}/blog/yazar/almanya101`);
    expect(all).toContain(`${BASE}/haberler/haber-1`);
  });

  it('keeps static routes and blog posts when news and guide sources reject', async () => {
    mocks.news.mockRejectedValue(new Error('news down'));
    mocks.rehber.mockRejectedValue(new Error('rehber down'));
    mocks.corner.mockResolvedValue([post({ slug: 'yazi--1' })]);
    const all = await urls();

    expect(all).toContain(`${BASE}/haberler`);
    expect(all).toContain(`${BASE}/blog/yazi--1`);
  });

  it('still returns every static route when all dynamic sources fail', async () => {
    mocks.corner.mockRejectedValue(new Error('x'));
    mocks.news.mockRejectedValue(new Error('x'));
    mocks.rehber.mockRejectedValue(new Error('x'));
    const all = await urls();

    expect(all).toContain(BASE);
    expect(all).toContain(`${BASE}/hakkimizda`);
    expect(all).not.toContain(`${BASE}/yazi-dizisi`);
  });
});

describe('sitemap other entries', () => {
  it('still lists news and guide articles with their updated dates', async () => {
    mocks.news.mockResolvedValue([{ slug: 'haber-1', updatedAt: '2026-10-05T00:00:00.000Z' }]);
    mocks.rehber.mockResolvedValue([{ slug: 'rehber-1', updatedAt: '2026-10-06T00:00:00.000Z' }]);

    expect((await find(`${BASE}/haberler/haber-1`))?.lastModified).toEqual(new Date('2026-10-05T00:00:00.000Z'));
    expect((await find(`${BASE}/rehber/rehber-1`))?.lastModified).toEqual(new Date('2026-10-06T00:00:00.000Z'));
  });
});
