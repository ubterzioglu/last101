import Link from 'next/link';

const HOME_ADMIN_MODULES = [
  {
    href: '/admin/home/news',
    title: 'Haberler ve Duyurular',
    description:
      'Yeni haber ekleme, taslak/yayında yönetimi, kategori düzenleme ve ana sayfa haber akışını kontrol etme alanı.',
    status: 'İlk modül hazır',
  },
  {
    href: '/admin/home/news',
    title: 'Ana Sayfa İçerik Akışı',
    description:
      'İkinci modül için aynı panel yapısını kullanacağız. Şimdilik haber modülü üzerinden editoryal omurga hazırlandı.',
    status: 'Bir sonraki adım',
  },
];

export default function HomeAdminPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,187,0,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(1,161,241,0.16),_transparent_34%)]" />
        <div className="container relative py-16 md:py-20">
          <Link
            href="/admin"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Admin ana ekrana dön
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">
              Ana Sayfa Admin
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Ana sayfayı besleyen içerikleri modül modül yönetelim.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              İlk modül olarak haberler ve duyurular canlı. Sonraki ana sayfa bloklarını da aynı yapı içine taşıyabiliriz.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {HOME_ADMIN_MODULES.map((module) => (
            <Link
              key={`${module.title}-${module.status}`}
              href={module.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                {module.status}
              </div>
              <h2 className="mt-4 text-3xl font-bold">{module.title}</h2>
              <p className="mt-4 text-base leading-7 text-white/72">{module.description}</p>
              <div className="mt-8 inline-flex items-center text-sm font-semibold text-[#ffd24a]">
                Modüle gir
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
