import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { getToolHref, TOOL_CATALOG } from '@/lib/tools/catalog';
import { cn } from '@/lib/utils/cn';

export const metadata = createMetadata({
  title: 'Yeni Araç Hub',
  description:
    'Almanya101 içindeki yeni planlama araçlarını tek sayfada incele, kategori bazında gez ve ilgili araca doğrudan eriş.',
  path: '/yeniarachub',
});

const CATEGORY_META = {
  'Rota ve Strateji': {
    accent: 'border-google-blue bg-blue-50 text-blue-900',
    shell: 'border-google-blue/30 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-transparent',
    description: 'Önce hangi yoldan ilerlemen gerektiğini ve büyük karar sırasını netleştirir.',
  },
  'Kariyer ve Gelir': {
    accent: 'border-google-green bg-green-50 text-green-900',
    shell: 'border-google-green/30 bg-gradient-to-br from-green-500/10 via-white/[0.03] to-transparent',
    description: 'İş bulma gücü, maaş beklentisi ve kariyer gerçekçiliği üzerine odaklanır.',
  },
  'Hazırlık ve Yerleşim': {
    accent: 'border-google-yellow bg-yellow-50 text-yellow-900',
    shell: 'border-google-yellow/30 bg-gradient-to-br from-yellow-500/10 via-white/[0.03] to-transparent',
    description: 'Başvuru öncesi hazırlığı, ilk gün operasyonlarını ve blokaj sıralamasını düzenler.',
  },
  'Yaşam ve Destek': {
    accent: 'border-google-red bg-red-50 text-red-900',
    shell: 'border-google-red/30 bg-gradient-to-br from-red-500/10 via-white/[0.03] to-transparent',
    description: 'Şehir, yaşam ritmi ve destek kanallarıyla ilgili kararları daha görünür hale getirir.',
  },
} as const;

const CATEGORY_ORDER = [
  'Rota ve Strateji',
  'Kariyer ve Gelir',
  'Hazırlık ve Yerleşim',
  'Yaşam ve Destek',
] as const;

const toolsByCategory = CATEGORY_ORDER.map((category) => ({
  category,
  tools: TOOL_CATALOG.filter((tool) => tool.category === category),
}));

export default function YeniAracHubPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(251,188,5,0.18),_transparent_28%),rgba(255,255,255,0.03)] p-8 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">Almanya101 Yeni Araç Hub’ı</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Yeni eklenen araçları tek sayfada incele, karşılaştır ve doğrudan aç
              </h1>
              <p className="mt-4 text-base leading-8 text-white/72 md:text-lg">
                Yol seçimi, iş bulma, maaş beklentisi, şehir uyumu, ilk 90 gün planı ve destek
                kanalları dahil yeni planlama araçlarını tek merkezde topladık. Her kartta ne işe
                yaradığını görebilir ve ilgili araca butonla geçebilirsin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Toplam araç</p>
                <p className="mt-2 text-3xl font-bold">{TOOL_CATALOG.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Kategori</p>
                <p className="mt-2 text-3xl font-bold">{CATEGORY_ORDER.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Kullanım tipi</p>
                <p className="mt-2 text-xl font-bold">Anonim erişim</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Hızlı gezinme</h2>
              <p className="mt-2 text-sm leading-7 text-white/65">
                Araçları amaçlarına göre grupladık. İstersen kategoriden başla, istersen doğrudan
                karttaki butonla aracı aç.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORY_ORDER.map((category) => (
                <a
                  key={category}
                  href={`#${slugify(category)}`}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/35 hover:bg-white/[0.06] hover:text-white"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10 space-y-10">
          {toolsByCategory.map(({ category, tools }) => {
            const meta = CATEGORY_META[category];

            return (
              <section
                key={category}
                id={slugify(category)}
                className={cn('rounded-[2rem] border p-6 md:p-8', meta.shell)}
              >
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-3xl">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
                        meta.accent
                      )}
                    >
                      {category}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold">{category}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/68 md:text-base">
                      {meta.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">Bu bölümde</p>
                    <p className="mt-2 text-lg font-semibold">{tools.length} araç var</p>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {tools.map((tool) => (
                    <article
                      key={tool.slug}
                      className="flex h-full flex-col rounded-[1.6rem] border border-white/10 bg-black/25 p-6 transition-colors hover:border-white/25 hover:bg-black/35"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                          {tool.questionCount} soru
                        </span>
                        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                          {tool.category}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold">{tool.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/72">{tool.description}</p>

                      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Bu araç sana ne verir?</p>
                        <p className="mt-2 text-sm leading-7 text-white/82">{tool.spotlight}</p>
                      </div>

                      <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                        <Link
                          href={getToolHref(tool.slug)}
                          className="inline-flex items-center justify-center rounded-xl bg-google-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                        >
                          {tool.ctaLabel}
                        </Link>
                        <Link
                          href={getToolHref(tool.slug)}
                          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/88 transition-colors hover:border-white/35 hover:bg-white/[0.06] hover:text-white"
                        >
                          Aracı aç
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr')
    .replaceAll(' ', '-')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}
