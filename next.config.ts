import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
