import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Production build ayarları
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: false,
  },
  
  // Headers ve security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
