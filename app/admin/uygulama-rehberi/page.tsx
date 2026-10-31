import { Suspense } from 'react';
import { UygulamaRehberiClient } from '@/components/admin/UygulamaRehberiClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function UygulamaRehberiPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page text-ink">
          <div className="container py-20 text-center text-sm text-muted">Yükleniyor...</div>
        </div>
      }
    >
      <UygulamaRehberiClient />
    </Suspense>
  );
}
