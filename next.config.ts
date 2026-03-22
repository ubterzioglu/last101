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

const nextConfig: NextConfig = {
  async redirects() {
    return devuserRedirects;
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
