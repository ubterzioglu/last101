import type { NextConfig } from 'next';
import { buildRedirects } from './lib/seo/redirects';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');

// Analitik betikleri yalnızca açık izin sonrası yüklendiği için CSP'de de
// yalnızca izinli kaynaklar listelenir. Politika önce Report-Only olarak
// izlenir; canlıda ihlal raporu görülmediğinde zorunlu mod'a alınmalıdır
// (bkz. docs/plans/site-audit-2026-10-24.md bölüm 4.2).
const cspDirectives: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://gc.zgo.at',
    'https://almanya101de.goatcounter.com',
    'https://www.clarity.ms',
    'https://*.clarity.ms',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'connect-src': [
    "'self'",
    ...(supabaseUrl ? [supabaseUrl, supabaseUrl.replace(/^https?:\/\//, 'wss://')] : []),
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com',
    'https://almanya101de.goatcounter.com',
    'https://www.clarity.ms',
    'https://*.clarity.ms',
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
};

const contentSecurityPolicy = Object.entries(cspDirectives)
  .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
  .join('; ');

const nextConfig: NextConfig = {
  async redirects() {
    // Sıra önemli: yazi-dizisi www kuralları wwwRedirect'ten önce gelmeli (tek sıçrama).
    return buildRedirects();
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
          // HSTS: site HTTPS üzerinden yayın yapıyor (Coolify/Traefik TLS).
          // preload bilinçli olarak kapalı; önce canlı davranış doğrulanmalı.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
        ],
      },
      {
        // Statik görseller için uzun süreli cache (Core Web Vitals)
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Kök dizindeki sürümsüz statik dosyalar: orta vadeli cache + SWR
          source: '/:file(almanya101\\.png|almanya101header\\.png|almanya101header\\.webp|yeniherologo\\.png|yeniherologo\\.avif|icon-192\\.png|icon-512\\.png|apple-touch-icon\\.png|favicon\\.ico|og\\.png)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' },
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
