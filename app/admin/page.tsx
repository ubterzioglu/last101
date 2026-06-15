import { Suspense } from 'react';
import { AdminHomeClient } from '@/components/admin/AdminHomeClient';

export default function AdminIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="container py-20 text-center text-sm text-white/60">Yükleniyor...</div>
        </div>
      }
    >
      <AdminHomeClient />
    </Suspense>
  );
}
