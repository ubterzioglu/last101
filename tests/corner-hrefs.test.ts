import { describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({ unstable_noStore: () => undefined }));
const createClientSpy = vi.hoisted(() => vi.fn(() => null));
vi.mock('@supabase/supabase-js', () => ({ createClient: createClientSpy }));

import {
  getPublishedCornerPostBySlug,
  mapCornerAuthorRow,
  mapCornerPostRow,
  type CornerAuthorRow,
  type CornerPostRow,
} from '@/lib/corner';
import { DEFAULT_COVER_IMAGE } from '@/lib/utils/constants';

const POST_ID = '22222222-2222-2222-2222-222222222222';

function authorRow(overrides: Partial<CornerAuthorRow> = {}): CornerAuthorRow {
  return {
    id: 'author-1',
    slug: 'ubt',
    display_name: 'UBT',
    short_bio: null,
    bio_content: null,
    avatar_image_url: null,
    updated_at: null,
    ...overrides,
  };
}

function postRow(overrides: Partial<CornerPostRow> = {}): CornerPostRow {
  return {
    id: POST_ID,
    author_id: null,
    title: 'Anmeldung Rehberi: Adim Adim',
    summary: null,
    content: null,
    cover_image_url: null,
    reading_minutes: null,
    published_at: '2026-10-01T10:00:00Z',
    created_at: null,
    updated_at: null,
    ...overrides,
  };
}

describe('corner hrefs', () => {
  it('builds the post href under /blog with the title--uuid slug', () => {
    const post = mapCornerPostRow(postRow());

    expect(post.slug).toBe(`anmeldung-rehberi-adim-adim--${POST_ID}`);
    expect(post.href).toBe(`/blog/${post.slug}`);
  });

  it('transliterates Turkish letters instead of dropping them from the slug', () => {
    const post = mapCornerPostRow(postRow({ title: 'Kaydı Yaptırmak: İkamet Şartları, Öğrenci Çıkışı ğüç' }));

    expect(post.slug).toBe(`kaydi-yaptirmak-ikamet-sartlari-ogrenci-cikisi-guc--${POST_ID}`);
  });

  it('builds the author href under /blog/yazar', () => {
    expect(mapCornerAuthorRow(authorRow()).href).toBe('/blog/yazar/ubt');
  });
});

describe('post slug lookup', () => {
  it('rejects a slug whose id part is not a UUID before querying', async () => {
    createClientSpy.mockClear();

    await expect(getPublishedCornerPostBySlug('baslik--abc')).resolves.toBeUndefined();
    await expect(getPublishedCornerPostBySlug('baslik-without-id')).resolves.toBeUndefined();
    expect(createClientSpy).not.toHaveBeenCalled();
  });
});

describe('corner defaults', () => {
  it('does not invent a display name', () => {
    expect(mapCornerAuthorRow(authorRow({ display_name: null })).displayName).toBe('');
  });

  it('uses the neutral brand avatar and the shared default cover', () => {
    expect(mapCornerAuthorRow(authorRow()).avatarImageUrl).toBe('/almanya101.png');
    expect(mapCornerPostRow(postRow()).coverImageUrl).toBe(DEFAULT_COVER_IMAGE);
  });

  it('keeps author fields undefined when the post has no author', () => {
    const post = mapCornerPostRow(postRow());

    expect(post.authorSlug).toBeUndefined();
    expect(post.authorName).toBeUndefined();
  });
});
