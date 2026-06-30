import { Suspense } from 'react';
import { AraclarAdminClient } from '@/components/admin/AraclarAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminAraclarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="container py-20 text-center text-sm text-white/60">Yükleniyor...</div>
        </div>
      }
    >
      <AraclarAdminClient />
    </Suspense>
  );
}
