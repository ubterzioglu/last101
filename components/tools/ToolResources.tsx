import { ArrowLink } from '@/components/site/ArrowLink';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import { Container } from '@/components/ui/Container';
import { getRelatedToolItems } from '@/components/tools/tool-links';
import type { ToolSource } from '@/lib/tools/types';

const sectionTitle = 'text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink';

interface ToolResourcesProps {
  officialSources: ToolSource[];
  relatedTools?: string[];
}

/** "Resmi kaynaklar" link list and "Diğer araçlar" service grid under the info band. */
export function ToolResources({ officialSources, relatedTools }: ToolResourcesProps) {
  const relatedItems = getRelatedToolItems(relatedTools);

  return (
    <section className="py-16">
      <Container className="space-y-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-start">
          <h2 className={sectionTitle}>Resmi kaynaklar</h2>
          <ul className="divide-y divide-line border-y border-line">
            {officialSources.map((source) => (
              <li key={source.href} className="py-1">
                <ArrowLink href={source.href}>{source.label}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>

        {relatedItems.length > 0 && (
          <div>
            <h2 className={sectionTitle}>Diğer araçlar</h2>
            <div className="mt-6">
              <ServiceGrid items={relatedItems} columns={relatedItems.length > 3 ? 4 : 3} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

/** Small muted legal block at the very end of a tool page. */
export function ToolLegalNote({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pb-16">
      <section className="border-t border-line pt-6">
        <h2 className="text-sm font-bold text-ink">Yasal not</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{children}</p>
      </section>
    </Container>
  );
}
