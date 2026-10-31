import { Suspense } from 'react';
import { NewsAdminPanel } from '@/components/admin/news/NewsAdminPanel';

interface PageProps {
  searchParams: Promise<{ tab?: string; id?: string }>;
}

export default async function AdminNewsPage({ searchParams }: PageProps) {
  const { tab, id } = await searchParams;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page text-ink">
          <div className="px-4 py-20 text-center text-sm text-muted sm:px-6 lg:px-9">Yükleniyor...</div>
        </div>
      }
    >
      <NewsAdminPanel initialTab={tab} initialPostId={id} />
    </Suspense>
  );
}
