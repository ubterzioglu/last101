import { Suspense } from 'react';
import SoftwareHubAdminClient from '@/components/admin/SoftwareHubAdminClient';

export default function SoftwareHubAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="container py-20 text-center text-sm text-white/60">Yükleniyor...</div>
        </div>
      }
    >
      <SoftwareHubAdminClient />
    </Suspense>
  );
}
