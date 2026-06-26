import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { getToolHref, TOOL_CATALOG } from '@/lib/tools/catalog';

export const metadata = createMetadata({
  title: 'Almanya Araçları',
  description:
    'Almanya101 içindeki yeni interaktif araçlar: yol seçimi, maaş beklentisi, hazırlık, şehir uyumu, iş bulma ve daha fazlası.',
  path: '/almanya-araclari',
});

export default function AlmanyaAraclariPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Almanya101 Araç Paketi</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            Almanya planını parçalara ayıran 10 interaktif araç
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
            Yol seçimi, maaş beklentisi, hazırlık kontrolü, şehir uyumu, danışmanlık yönü,
            kariyer rotası ve ilk 90 gün gibi kararları tek tek ele al.
          </p>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {TOOL_CATALOG.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolHref(tool.slug)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <h2 className="text-2xl font-semibold">{tool.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">{tool.description}</p>
              <span className="mt-5 inline-flex rounded-full border border-google-blue px-4 py-2 text-sm font-medium text-google-blue">
                {tool.ctaLabel}
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
