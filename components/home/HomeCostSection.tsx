import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';

interface CostRow {
  label: string;
  value: string;
}

const COST_ROWS: CostRow[] = [
  { label: 'Kira (tek kişi, WG)', value: '€400 – €700' },
  { label: 'Sağlık sigortası', value: '€200 – €400' },
  { label: 'Yemek & market', value: '€200 – €350' },
  { label: 'Ulaşım (aylık bilet, Deutschlandticket)', value: '€49 – €90' },
  { label: 'İnternet & telefon', value: '€30 – €50' },
];

const COST_TOTAL: CostRow = { label: 'Toplam (tahmini)', value: '€879 – €1.590' };

// brand-800 (not 700): these links sit on the band surface, where brand-700 is 4.26:1.
const SOURCE_LINK_CLASS = 'text-brand-800 underline underline-offset-4 transition-colors hover:text-ink';

/** Monthly cost estimate: text left, table in a featured card right. */
export function HomeCostSection() {
  return (
    <Section tone="band" aria-labelledby="home-cost-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-[38px]">
        <SectionHeader
          id="home-cost-title"
          title="Almanya'da Yaşam Maliyeti Ne Kadar?"
          description={
            <>
              2026 yılı itibarıyla Almanya&apos;da tek kişi için tahmini aylık temel gider kalemleri aşağıdadır.
              Şehir ve yaşam tarzına göre değişiklik gösterir; örneğin Berlin&apos;de kira €450–€750, Münih&apos;te €600–€900, Hamburg&apos;da ise €500–€800 arasındadır.
              Kaynak:{' '}
              <a href="https://www.destatis.de" target="_blank" rel="noopener noreferrer" className={SOURCE_LINK_CLASS}>
                Destatis
              </a>
              ,{' '}
              <a
                href="https://www.numbeo.com/cost-of-living/country_result.jsp?country=Germany"
                target="_blank"
                rel="noopener noreferrer"
                className={SOURCE_LINK_CLASS}
              >
                Numbeo
              </a>
              .
            </>
          }
        />
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-float">
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Kalem</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold text-ink">Tahmini Aylık Maliyet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COST_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-3.5 text-muted">{row.label}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-ink">{row.value}</td>
                </tr>
              ))}
              <tr className="bg-brand-50 font-bold">
                <td className="px-5 py-3.5 text-ink">{COST_TOTAL.label}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-brand-700">{COST_TOTAL.value}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
