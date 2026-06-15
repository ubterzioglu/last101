import type { NextConfig } from 'next';

const devuserRedirects = [
  'du', 'list', 'cvopt', 'dev', 'devuser', 'devuseradmin', 'devuserlist',
  'devuserprofile', 'profile-edit', 'reset-password', 'news', 'gelismeler',
  'discussion', 'survey', 'promote', 'summary', 'typing', 'tavla', 'vct',
  'ubt', 'e1', 'e1a', 'e2', 'e2a', 'dad', 'disad',
].map((slug) => ({
  source: `/devuser/${slug}.html`,
  destination: `/devuser/${slug}`,
  permanent: true,
}));

const wwwRedirect = {
  source: '/:path*',
  has: [
    {
      type: 'host',
      value: 'www.almanya101.de',
    },
  ],
  destination: 'https://almanya101.de/:path*',
  permanent: true,
};

const nextConfig: NextConfig = {
  async redirects() {
    return [wwwRedirect, ...devuserRedirects];
  },

  async headers() {
    return [
      {
        // Tüm rotalar için temel güvenlik başlıkları
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Statik görseller için uzun süreli cache (Core Web Vitals)
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // Coolify/Docker için standalone output
  output: 'standalone',
  
  // Güvenlik ve performans
  poweredByHeader: false,
  compress: true,
  
  // Container ortamında image optimization için
  images: {
    unoptimized: true,
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
