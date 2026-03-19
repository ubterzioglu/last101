import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Coolify/Docker için standalone output
  output: 'standalone',
  
  // Güvenlik ve performans
  poweredByHeader: false,
  compress: true,
  
  // Container ortamında image optimization için
  images: {
    unoptimized: true,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/biz-kimiz',
        destination: '/hakkimizda',
        permanent: true,
      },
      {
        source: '/bize-katil',
        destination: '/topluluk',
        permanent: true,
      },
    ];
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
