import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  isReservedAuthorSlug,
  normalizeAuthorSlug,
  RESERVED_AUTHOR_SLUGS,
} from '@/lib/admin/cornerAuthorAuth';
import { SITE_AUTHOR_SLUG, SYSTEM_AUTHOR_SLUGS } from '@/lib/authors';
import { collectPublicDirectories, collectTopLevelSegments } from './helpers/app-routes';

const APP_DIR = fileURLToPath(new URL('../app', import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL('../public', import.meta.url));

/**
 * Segments that are not routable author slugs. Every entry is a file/dir whose
 * name contains a dot or a leading dot: normalizeAuthorSlug() strips dots, so
 * such a name can never be produced as a slug. Anything else must be reserved.
 */
const NOT_SLUG_REACHABLE = new Set([
  '.well-known',
  'sitemap.ts',
  'robots.ts',
  'manifest.ts',
  'icon.svg',
  'feed.xml',
]);

describe('reserved author slugs', () => {
  const appSegments = collectTopLevelSegments(APP_DIR);

  it('discovers the app directory segments', () => {
    expect(appSegments).toEqual(expect.arrayContaining(['admin', 'api', 'blog', 'rehber', 'giris']));
  });

  it.each(appSegments.filter((segment) => !NOT_SLUG_REACHABLE.has(segment)))(
    'reserves top-level app segment "%s"',
    (segment) => {
      expect(isReservedAuthorSlug(segment)).toBe(true);
    },
  );

  it.each(collectPublicDirectories(PUBLIC_DIR).filter((dir) => !dir.startsWith('.')))(
    'reserves top-level public directory "%s"',
    (dir) => {
      expect(isReservedAuthorSlug(dir)).toBe(true);
    },
  );

  it('keeps every explicit exception dotted (unreachable through slug normalisation)', () => {
    for (const name of NOT_SLUG_REACHABLE) {
      expect(name.includes('.')).toBe(true);
      expect(RESERVED_AUTHOR_SLUGS.has(normalizeAuthorSlug(name))).toBe(false);
    }
  });

  it.each(['blog', 'yazar', 'almanya101', 'yazi-dizisi', 'feed.xml', 'llms.txt', 'ai', 'giris', 'auth'])(
    'reserves planned name "%s"',
    (slug) => {
      expect(isReservedAuthorSlug(slug)).toBe(true);
    },
  );

  it('reserves every system author slug', () => {
    expect(SYSTEM_AUTHOR_SLUGS).toContain(SITE_AUTHOR_SLUG);
    for (const slug of SYSTEM_AUTHOR_SLUGS) expect(isReservedAuthorSlug(slug)).toBe(true);
  });

  it('does not reserve the live author slugs', () => {
    for (const slug of ['aslihan', 'ubt', 'didem', 'elif', 'ozan']) {
      expect(isReservedAuthorSlug(slug)).toBe(false);
    }
  });
});
