import { Accordion } from '@/components/site/Accordion';
import type { AccordionItem } from '@/components/site/Accordion';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { HOMEPAGE_FAQ_ITEMS } from '@/constants/home-data';

// Answers sit in <p> so the Speakable JSON-LD selector `.faq-section p` reads them.
const FAQ_ACCORDION_ITEMS: AccordionItem[] = HOMEPAGE_FAQ_ITEMS.map((item) => ({
  title: item.question,
  content: <p>{item.answer}</p>,
}));

/** Home FAQ (same items as the FAQ JSON-LD). */
export function HomeFaqSection() {
  return (
    <Section className="faq-section" aria-labelledby="home-faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <SectionHeader
          id="home-faq-title"
          title="Almanya'ya Taşınırken En Çok Merak Edilen Sorular"
          description="Almanya'ya taşınma, iş bulma ve topluluğa katılma sürecinde en sık sorulan sorulara kısa cevaplar."
        />
        <Accordion name="home-faq" toneCycle items={FAQ_ACCORDION_ITEMS} />
      </div>
    </Section>
  );
}
