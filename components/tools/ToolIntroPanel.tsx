import Link from 'next/link';
import { getToolCatalogItem, getToolHref } from '@/lib/tools/catalog';
import { getToolUser } from '@/lib/tools/access';
import type { ToolConfig } from '@/lib/tools/types';

function buildLoginHref(toolPath: string) {
  return `/giris?next=${encodeURIComponent(toolPath)}`;
}

function LoginCtaCard({ toolPath }: { toolPath: string }) {
  return (
    <div className="rounded-xl border-2 border-google-green bg-white px-4 py-4">
      <p className="font-semibold text-gray-900">Aracı açmak ister misin?</p>
      <p className="mt-1 text-sm leading-6 text-gray-700">
        Bu sayfadaki tanıtım içeriği ve sıkça sorulan sorular herkese açıktır. Soru akışını
        başlatmak, kişisel sonucunu görmek ve ilerlemeni kaydetmek için ücretsiz hesapla giriş
        yapman yeterlidir.
      </p>
      <Link
        href={buildLoginHref(toolPath)}
        className="mt-3 inline-flex items-center justify-center rounded-lg bg-google-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
      >
        Ücretsiz giriş yap ve aracı aç
      </Link>
    </div>
  );
}

export interface SimpleToolIntroProps {
  title: string;
  description: string;
  highlights: string[];
  toolPath: string;
}

/**
 * Anonim ziyaretçiye sunucudan render edilen tanıtım içeriği: aracın ne
 * yaptığını, kapsamını ve sınırlamalarını anlatır; etkileşimli akış için
 * ücretsiz girişe yönlendirir.
 */
export function SimpleToolIntro({ title, description, highlights, toolPath }: SimpleToolIntroProps) {
  return (
    <div className="space-y-4 py-6">
      <div className="rounded-xl border-2 border-google-blue bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-google-blue">
          Ücretsiz üyelikle kullanılabilen interaktif araç
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">{description}</p>
      </div>

      <LoginCtaCard toolPath={toolPath} />

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
        <h2 className="text-lg font-semibold">Bu araç sana ne sunar?</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-50">
        <h2 className="text-lg font-semibold">Sınırlar ve yasal not</h2>
        <p className="mt-2 text-sm leading-6">
          Kişisel hesaplama ve sonuç işlemleri ücretsiz üyelik gerektirir; bu sayfadaki tanıtım
          içeriği genel bilgilendirme amaçlıdır ve hukuki, mali veya resmî danışmanlık yerine
          geçmez. Güncel ve bağlayıcı bilgi için ilgili resmî kurumların kaynaklarını kullan.
        </p>
      </section>
    </div>
  );
}

/**
 * ToolConfig tabanlı araçlar için geniş tanıtım: giriş metni, gerekçe,
 * hedef kitle, çalışma biçimi, resmî kaynaklar, yasal not, ilgili araçlar
 * ve görünür SSS — JSON-LD ile aynı bilgilerden türetilir.
 */
export function ToolIntroPanel({ config }: { config: ToolConfig }) {
  return (
    <div className="space-y-4 py-6">
      <div className="rounded-xl border-2 border-google-blue bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-google-blue">
          Ücretsiz üyelikle kullanılabilen interaktif araç
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900">{config.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">{config.intro}</p>
      </div>

      <LoginCtaCard toolPath={config.path} />

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
        <h2 className="text-lg font-semibold">Bu araç neden var?</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">{config.why}</p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
        <h2 className="text-lg font-semibold">Bu araç kimin için?</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
          {config.whoFor.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
        <h2 className="text-lg font-semibold">Nasıl çalışır?</h2>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-white/80">
          {config.howItWorks.map((item, index) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 shrink-0">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {config.officialSources.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
          <h2 className="text-lg font-semibold">Resmî kaynaklar</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.officialSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85 hover:border-white/40 hover:text-white"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-50">
        <h2 className="text-lg font-semibold">Yasal not</h2>
        <p className="mt-2 text-sm leading-6">{config.legalNote}</p>
        <p className="mt-2 text-sm leading-6">
          Kişisel hesaplama ve sonuç kaydı ücretsiz üyelik gerektirir; yukarıdaki tanıtım
          içeriği herkese açıktır.
        </p>
      </section>

      {config.relatedTools && config.relatedTools.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-white">
          <h2 className="text-lg font-semibold">Diğer araçlar</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {config.relatedTools.map((slug) => {
              const item = getToolCatalogItem(slug);
              if (!item) return null;
              return (
                <Link
                  key={slug}
                  href={getToolHref(slug)}
                  className="rounded-xl border border-white/15 bg-white/[0.03] p-4 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {config.faqs.length > 0 && (
        <section className="border-t border-white/10 pt-8 text-white" aria-labelledby="sss-baslik">
          <h2 id="sss-baslik" className="text-2xl font-bold md:text-3xl">
            Sıkça Sorulan Sorular
          </h2>
          <div className="mt-6 space-y-4">
            {config.faqs.map((item) => (
              <details key={item.question} className="group rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 leading-7 text-white/75">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Giriş kapısı: oturum varsa etkileşimli aracı (children), yoksa anonim
 * tanıtım içeriğini render eder. Yetki denetimi değildir; kişisel veri
 * işleyen API'ler kendi kontrollerini yapar.
 */
export async function ToolAccessGate({
  intro,
  children,
}: {
  intro: SimpleToolIntroProps;
  children: React.ReactNode;
}) {
  const user = await getToolUser();

  if (user) {
    return <>{children}</>;
  }

  return <SimpleToolIntro {...intro} />;
}
