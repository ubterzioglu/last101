import { beforeEach, describe, expect, it, vi } from 'vitest';

const revalidatePath = vi.hoisted(() => vi.fn());
vi.mock('next/cache', () => ({ revalidatePath }));

import { revalidateBlogPaths } from '@/lib/admin/cornerRevalidate';

describe('revalidateBlogPaths', () => {
  // Braces matter: a returned function would be run by vitest as a cleanup after the test.
  beforeEach(() => {
    revalidatePath.mockReset();
  });

  it('names the route group for the dynamic page patterns (Next tags them with the file path)', () => {
    revalidateBlogPaths();

    expect(revalidatePath).toHaveBeenCalledWith('/(marketing)/blog/[slug]', 'page');
    expect(revalidatePath).toHaveBeenCalledWith('/(marketing)/blog/yazar/[authorSlug]', 'page');
    expect(revalidatePath).not.toHaveBeenCalledWith('/blog/yazar/[authorSlug]', 'page');
  });

  it('refreshes the hub and the RSS feed', () => {
    revalidateBlogPaths();

    expect(revalidatePath).toHaveBeenCalledWith('/blog');
    expect(revalidatePath).toHaveBeenCalledWith('/blog/feed.xml');
  });

  it('refreshes each author page once, ignoring empty slugs', () => {
    revalidateBlogPaths(['ubt', 'ubt', null, undefined, 'aslihan']);

    const authorCalls = revalidatePath.mock.calls.filter(([path]) => String(path).startsWith('/blog/yazar/'));
    expect(authorCalls.map(([path]) => path).sort()).toEqual(['/blog/yazar/aslihan', '/blog/yazar/ubt']);
  });

  it('never throws, so a committed write is not turned into an error', () => {
    revalidatePath.mockImplementation(() => {
      throw new Error('boom');
    });
    const originalError = console.error;
    const logged: unknown[][] = [];
    console.error = (...args: unknown[]) => {
      logged.push(args);
    };

    try {
      expect(() => revalidateBlogPaths(['ubt'])).not.toThrow();
    } finally {
      console.error = originalError;
    }
    expect(logged).toHaveLength(1);
  });
});
