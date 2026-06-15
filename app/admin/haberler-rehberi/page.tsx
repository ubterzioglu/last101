import { Suspense } from 'react';
import { NewsGuideAdminClient } from '@/components/admin/news/NewsGuideAdminClient';

export default function AdminNewsGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="container py-20 text-center text-sm text-white/60">Yükleniyor...</div>
        </div>
      }
    >
      <NewsGuideAdminClient />
    </Suspense>
  );
}
