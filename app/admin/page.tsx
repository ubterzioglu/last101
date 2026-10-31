import { Suspense } from 'react';
import { AdminHomeClient } from '@/components/admin/AdminHomeClient';

export default function AdminIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page text-ink">
          <div className="container py-20 text-center text-sm text-muted">Yükleniyor...</div>
        </div>
      }
    >
      <AdminHomeClient />
    </Suspense>
  );
}
