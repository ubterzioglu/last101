import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { ServiceFinderAdminClient } from '@/components/admin/serviceFinder/ServiceFinderAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function ServiceFinderAdminPage() {
  return (
    <div className="bg-page text-ink">
      <AdminPageHeader title="Service Finder — Uzman Tarama" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-9">
        <ServiceFinderAdminClient />
      </div>
    </div>
  );
}
