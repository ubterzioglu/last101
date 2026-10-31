/**
 * Static redirect table used by next.config.ts (and by tests/redirects.test.ts).
 *
 * Kept free of DB lookups on purpose: legacy URLs must keep working during a
 * Supabase outage. Relative imports only: next.config.ts cannot use the `@/` alias.
 */

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
  has?: Array<{ type: 'host'; value: string }>;
}

export const CANONICAL_ORIGIN = 'https://almanya101.de';
export const WWW_HOST = 'www.almanya101.de';

const LEGACY_BLOG_PREFIX = '/yazi-dizisi';
const BLOG_PREFIX = '/blog';

const devuserPages = [
  'du', 'list', 'cvopt', 'dev', 'devuser', 'devuseradmin', 'devuserlist',
  'devuserprofile', 'profile-edit', 'reset-password', 'news', 'gelismeler',
  'discussion', 'survey', 'promote', 'summary', 'typing', 'tavla', 'vct',
  'ubt', 'e1', 'e1a', 'e2', 'e2a', 'dad', 'disad',
] as const;

export const devuserRedirects: readonly RedirectRule[] = devuserPages.map((slug) => ({
  source: `/devuser/${slug}.html`,
  destination: `/devuser/${slug}`,
  permanent: true,
}));

/** Any www request is sent to the apex domain, path preserved. */
export const wwwRedirect: RedirectRule = {
  source: '/:path*',
  has: [{ type: 'host', value: WWW_HOST }],
  destination: `${CANONICAL_ORIGIN}/:path*`,
  permanent: true,
};

/**
 * www + legacy blog path: one hop straight to the final URL. Must be listed
 * BEFORE wwwRedirect, otherwise www/yazi-dizisi would chain www -> apex -> /blog.
 */
export const legacyBlogWwwRedirects: readonly RedirectRule[] = [
  {
    source: LEGACY_BLOG_PREFIX,
    has: [{ type: 'host', value: WWW_HOST }],
    destination: `${CANONICAL_ORIGIN}${BLOG_PREFIX}`,
    permanent: true,
  },
  {
    source: `${LEGACY_BLOG_PREFIX}/:slug`,
    has: [{ type: 'host', value: WWW_HOST }],
    destination: `${CANONICAL_ORIGIN}${BLOG_PREFIX}/:slug`,
    permanent: true,
  },
];

/** /yazi-dizisi -> /blog on the apex domain. Keep for at least 12 months. */
export const legacyBlogRedirects: readonly RedirectRule[] = [
  { source: LEGACY_BLOG_PREFIX, destination: BLOG_PREFIX, permanent: true },
  { source: `${LEGACY_BLOG_PREFIX}/:slug`, destination: `${BLOG_PREFIX}/:slug`, permanent: true },
];

/** Final, ordered redirect list (first match wins in Next.js). */
export function buildRedirects(): RedirectRule[] {
  return [
    ...legacyBlogWwwRedirects,
    wwwRedirect,
    ...legacyBlogRedirects,
    ...devuserRedirects,
  ];
}
