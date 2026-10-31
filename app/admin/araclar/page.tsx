import { Suspense } from 'react';
import { AraclarAdminClient } from '@/components/admin/AraclarAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminAraclarPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page text-ink">
          <div className="container py-20 text-center text-sm text-muted">Yükleniyor...</div>
        </div>
      }
    >
      <AraclarAdminClient />
    </Suspense>
  );
}
