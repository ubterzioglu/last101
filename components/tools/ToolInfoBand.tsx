import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { ToolSteps } from '@/components/tools/ToolSteps';

interface ToolInfoBandProps {
  /** Defaults to 'Bu araç neden var?'. */
  whyTitle?: string;
  why: ReactNode | ReactNode[];
  /** Defaults to 'Bu araç kim için?'. */
  whoForTitle?: string;
  whoFor?: ReactNode[];
  /** Replaces the who-for list inside the white card. */
  aside?: ReactNode;
}

/** The page's single dark band: why the tool exists (left) and who it is for (white card right). */
export function ToolInfoBand({
  whyTitle = 'Bu araç neden var?',
  why,
  whoForTitle = 'Bu araç kim için?',
  whoFor,
  aside,
}: ToolInfoBandProps) {
  const whyItems = Array.isArray(why) ? why : [why];
  const hasCard = Boolean(aside) || (whoFor && whoFor.length > 0);

  return (
    <section className="bg-ink py-16 text-white">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em]">
            {whyTitle}
          </h2>
          {whyItems.length > 1 ? (
            <ToolSteps steps={whyItems} tone="light" className="mt-6" />
          ) : (
            <p className="mt-5 max-w-xl leading-relaxed text-white/80">{whyItems[0]}</p>
          )}
        </div>

        {hasCard && (
          <div className="rounded-card bg-white p-6 text-ink shadow-float md:p-7">
            {aside ?? (
              <>
                <h3 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em]">{whoForTitle}</h3>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {whoFor?.map((item, index) => (
                    <li key={index} className="flex gap-3 py-3 leading-relaxed">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
