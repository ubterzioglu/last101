import { Suspense } from 'react';
import { NewsGuideAdminClient } from '@/components/admin/news/NewsGuideAdminClient';

export default function AdminNewsGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page text-ink">
          <div className="px-4 py-20 text-center text-sm text-muted sm:px-6 lg:px-9">Yükleniyor...</div>
        </div>
      }
    >
      <NewsGuideAdminClient />
    </Suspense>
  );
}
