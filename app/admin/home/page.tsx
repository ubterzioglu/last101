import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/site/Chip';

const HOME_ADMIN_MODULES = [
  {
    href: '/admin/haberler',
    title: 'Haberler ve Duyurular',
    description: 'Ana sayfadaki haber ve duyuru akışını yönet.',
    status: 'Aktif',
  },
];

export default function HomeAdminPage() {
  return (
    <div className="bg-page text-ink">
      <AdminPageHeader
        title="Ana Sayfa Yönetimi"
        description="Ana sayfadaki haberler, duyurular ve diğer içerik modüllerini buradan yönet."
        actions={
          <Link
            href="/admin"
            className="inline-flex min-h-[44px] items-center rounded-btn border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            ← Admin Paneli'ne dön
          </Link>
        }
      />

      <section className="px-4 py-8 sm:px-6 lg:px-9">
        <div className="grid gap-6 md:grid-cols-3">
          {HOME_ADMIN_MODULES.map((module) => (
            <Link
              key={`${module.title}-${module.status}`}
              href={module.href}
              className="group block rounded-card"
            >
              <Card variant="hoverable" className="h-full">
                <Chip tone="green">{module.status}</Chip>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{module.title}</h2>
                <p className="mt-2 text-sm text-muted">{module.description}</p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-brand-700">
                  Yönet →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
