import Link from 'next/link';

const HOME_ADMIN_MODULES = [
  {
    href: '/admin/home/news',
    title: 'Haberler ve Duyurular',
    description: 'Ana sayfadaki haber ve duyuru akışını yönet.',
    status: 'Aktif',
  },
];

export default function HomeAdminPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-blue-500/10" />
        <div className="container relative py-12">
          <Link
            href="/admin"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
          >
            ← Admin Paneli'ne dön
          </Link>
          <div className="mt-6">
            <h1 className="text-4xl font-bold">Ana Sayfa Yönetimi</h1>
            <p className="mt-2 max-w-2xl text-white/72">
              Ana sayfadaki haberler, duyurular ve diğer içerik modüllerini buradan yönet.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {HOME_ADMIN_MODULES.map((module) => (
            <Link
              key={`${module.title}-${module.status}`}
              href={module.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-white/45">
                {module.status}
              </div>
              <h2 className="mt-3 text-2xl font-bold">{module.title}</h2>
              <p className="mt-2 text-sm text-white/72">{module.description}</p>
              <div className="mt-6 inline-flex items-center text-sm font-semibold text-google-yellow">
                Yönet →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
