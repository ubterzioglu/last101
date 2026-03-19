import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Port environment variable desteği
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: [],
    remotePatterns: [],
  },
  // Enable image optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
