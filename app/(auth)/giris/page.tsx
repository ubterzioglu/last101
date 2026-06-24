import { Suspense } from 'react';
import { createMetadata } from '@/lib/seo/metadata';
import GirisClient from './GirisClient';

export const metadata = createMetadata({
  title: 'Üye Girişi',
  description: 'Almanya101 araçlarını kullanmak için ücretsiz üye olun veya giriş yapın.',
  path: '/giris',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only allow internal relative paths as redirect targets (open-redirect guard).
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-black px-4 py-16">
      <Suspense fallback={null}>
        <GirisClient next={safeNext} />
      </Suspense>
    </div>
  );
}
