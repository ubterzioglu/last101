import type { NextConfig } from 'next';

const STATIC_TRACE_GLOBS = [
  './*.html',
  './*.css',
  './*.js',
  './*.xml',
  './*.txt',
  './*.md',
  './404.html',
  './robots.txt',
  './sitemap*.xml',
  './img/**/*',
  './devuser/**/*',
  './admin/**/*',
  './article/**/*',
  './ats/**/*',
  './banka/**/*',
  './belgeler/**/*',
  './bizkimiz/**/*',
  './bookmarks/**/*',
  './contact/**/*',
  './dis/**/*',
  './docs/**/*',
  './etkinlik/**/*',
  './fikir/**/*',
  './gastronomi/**/*',
  './gen/**/*',
  './getgot/**/*',
  './haberler/**/*',
  './join/**/*',
  './maas/**/*',
  './oparayaben/**/*',
  './paratransfer/**/*',
  './path/**/*',
  './qa/**/*',
  './rehber/**/*',
  './sc/**/*',
  './sigorta/**/*',
  './supporteachother/**/*',
  './tatilde/**/*',
  './tatiltr/**/*',
  './vatandas/**/*',
];

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/app/[...slug]/route': STATIC_TRACE_GLOBS,
    '/app/api/[...slug]/route': ['./api/**/*'],
  },
};

export default nextConfig;
