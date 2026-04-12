import Link from 'next/link';

const ADMIN_SECTIONS = [
  {
    href: '/admin/software-hub',
    title: 'Software Hub',
    description: 'Devuser, turnuva ve diğer topluluk operasyonları.',
    accent: 'border-google-blue/40 bg-google-blue/10',
  },
  {
    href: '/admin/home',
    title: 'Ana Sayfa',
    description: 'Haberler, duyurular ve diğer editoryal içerikler.',
    accent: 'border-google-yellow/50 bg-google-yellow/10',
  },
  {
    href: '/admin/hizmet-rehberi',
    title: 'Hizmet Rehberi',
    description: 'Doktor, avukat ve diğer hizmet önerilerini onayla.',
    accent: 'border-google-red/45 bg-google-red/10',
  },
  {
    href: '/admin/recruitment-agencies',
    title: 'Recruitment Agencies',
    description: '150 recruitment agency listesini yönet ve düzenle.',
    accent: 'border-google-green/45 bg-google-green/10',
  },
];

export default function AdminIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-6 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group rounded-xl border p-6 transition hover:bg-white/[0.06] ${section.accent}`}
            >
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-2 text-sm text-white/72">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
