import { Suspense } from 'react';
import { GuidesAdminClient } from '@/components/admin/GuidesAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminGuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="container py-20 text-center text-sm text-white/60">Yükleniyor...</div>
        </div>
      }
    >
      <GuidesAdminClient />
    </Suspense>
  );
}
