import Link from 'next/link';

const ADMIN_SECTIONS = [
  {
    href: '/admin/software-hub',
    eyebrow: 'Software Hub Admin',
    title: 'Operasyon, başvuru ve topluluk yönetimi',
    description:
      'Devuser, turnuva, promote, CV opt, discussion ve toplantı gibi mevcut admin işlerini tek yerde yönet.',
    accent: 'border-[#01A1F1]/40 bg-[#01A1F1]/10',
  },
  {
    href: '/admin/home',
    eyebrow: 'Ana Sayfa Admin',
    title: 'Editoryal alanlar ve içerik blokları',
    description:
      'Ana sayfayı besleyen içerikleri ayrı bir panelde düzenle. İlk modül olarak haberler ve duyurular burada yer alıyor.',
    accent: 'border-[#FFBB00]/50 bg-[#FFBB00]/10',
  },
];

export default function AdminIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,187,0,0.18),_transparent_34%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
              almanya101 admin merkezi
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
              Admin panelini iki ana çalışma alanına ayırıyoruz.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Biri Software Hub operasyonları için, diğeri doğrudan ana sayfa ve editoryal akışlar için. Böylece
              içerik yönetimi ile topluluk operasyonları birbirine karışmıyor.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group rounded-[2rem] border p-8 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06] ${section.accent}`}
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                {section.eyebrow}
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-tight">{section.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/72">{section.description}</p>
              <div className="mt-8 inline-flex items-center text-sm font-semibold text-white">
                Alana gir
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
