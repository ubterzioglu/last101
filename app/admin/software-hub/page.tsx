import { Suspense } from 'react';
import SoftwareHubAdminClient from '@/components/admin/SoftwareHubAdminClient';

export default function SoftwareHubAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page text-ink">
          <div className="container py-20 text-center text-sm text-muted">Yükleniyor...</div>
        </div>
      }
    >
      <SoftwareHubAdminClient />
    </Suspense>
  );
}
