import { Suspense } from 'react';
import { GuidesAdminClient } from '@/components/admin/GuidesAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminGuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page text-ink">
          <div className="container py-20 text-center text-sm text-muted">Yükleniyor...</div>
        </div>
      }
    >
      <GuidesAdminClient />
    </Suspense>
  );
}
