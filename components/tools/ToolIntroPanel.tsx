import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ToolFaq } from '@/components/tools/ToolFaq';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolLegalNote, ToolResources } from '@/components/tools/ToolResources';
import { getToolCatalogItem } from '@/lib/tools/catalog';
import { getToolUser } from '@/lib/tools/access';
import type { ToolConfig } from '@/lib/tools/types';

const CTA_EYEBROW = 'Ücretsiz üyelikle kullanılabilen interaktif araç';

function buildLoginHref(toolPath: string) {
  return `/giris?next=${encodeURIComponent(toolPath)}`;
}

function LoginCtaCard({ toolPath }: { toolPath: string }) {
  return (
    <div className="rounded-card border border-line bg-white p-6 shadow-float md:p-7">
      <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-brand-700">{CTA_EYEBROW}</p>
      <h2 className="mt-3 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
        Aracı açmak ister misin?
      </h2>
      <p className="mt-2 max-w-3xl leading-relaxed text-muted">
        Bu sayfadaki tanıtım içeriği ve sıkça sorulan sorular herkese açıktır. Soru akışını
        başlatmak, kişisel sonucunu görmek ve ilerlemeni kaydetmek için ücretsiz hesapla giriş
        yapman yeterlidir.
      </p>
      <Button href={buildLoginHref(toolPath)} className="mt-5">
        Ücretsiz giriş yap ve aracı aç
      </Button>
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
 * ücretsiz girişe yönlendirir. Sayfanın H1'i sayfadaki ToolHero'dan gelir.
 */
export function SimpleToolIntro({ title, description, highlights, toolPath }: SimpleToolIntroProps) {
  return (
    <Container className="py-10 md:py-12">
      <div className="space-y-6">
        <LoginCtaCard toolPath={toolPath} />

        <section aria-label={`${title} kapsamı`} className="rounded-card bg-band p-6 md:p-7">
          <h2 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
            Bu araç sana ne sunar?
          </h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted">{description}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3 py-3 leading-relaxed text-ink">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-line pt-6">
          <h2 className="text-sm font-bold text-ink">Sınırlar ve yasal not</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Kişisel hesaplama ve sonuç işlemleri ücretsiz üyelik gerektirir; bu sayfadaki tanıtım
            içeriği genel bilgilendirme amaçlıdır ve hukuki, mali veya resmî danışmanlık yerine
            geçmez. Güncel ve bağlayıcı bilgi için ilgili resmî kurumların kaynaklarını kullan.
          </p>
        </section>
      </div>
    </Container>
  );
}

/**
 * ToolConfig tabanlı araçlar için geniş tanıtım: giriş metni, gerekçe,
 * hedef kitle, çalışma biçimi, resmî kaynaklar, yasal not, ilgili araçlar
 * ve görünür SSS — JSON-LD ile aynı bilgilerden türetilir.
 */
export function ToolIntroPanel({ config }: { config: ToolConfig }) {
  return (
    <>
      <ToolHero
        eyebrow={getToolCatalogItem(config.slug)?.category ?? 'Araç'}
        title={config.title}
        intro={config.intro}
        howItWorks={config.howItWorks}
      />

      <Container className="py-10 md:py-12">
        <LoginCtaCard toolPath={config.path} />
      </Container>

      <ToolInfoBand why={config.why} whoFor={config.whoFor} />

      {(config.officialSources.length > 0 || (config.relatedTools?.length ?? 0) > 0) && (
        <ToolResources officialSources={config.officialSources} relatedTools={config.relatedTools} />
      )}

      <ToolFaq name={`${config.slug}-sss`} items={config.faqs} />

      <ToolLegalNote>
        {config.legalNote} Kişisel hesaplama ve sonuç kaydı ücretsiz üyelik gerektirir; yukarıdaki
        tanıtım içeriği herkese açıktır.
      </ToolLegalNote>
    </>
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
