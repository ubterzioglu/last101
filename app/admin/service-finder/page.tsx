import { ServiceFinderAdminClient } from '@/components/admin/serviceFinder/ServiceFinderAdminClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function ServiceFinderAdminPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-black">Service Finder — Uzman Tarama</h1>
        <ServiceFinderAdminClient />
      </div>
    </div>
  );
}
