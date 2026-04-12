'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

const FAQ_ACCENT_STYLES = [
  {
    border: 'border-google-blue/45',
    background: 'bg-google-blue/10',
    openBackground: 'bg-google-blue/16',
    icon: 'border-google-blue/40 bg-google-blue/15 text-white',
    hover: 'hover:text-google-blue',
  },
  {
    border: 'border-google-red/45',
    background: 'bg-google-red/10',
    openBackground: 'bg-google-red/16',
    icon: 'border-google-red/40 bg-google-red/15 text-white',
    hover: 'hover:text-google-red',
  },
  {
    border: 'border-google-yellow/40',
    background: 'bg-google-yellow/8',
    openBackground: 'bg-google-yellow/12',
    icon: 'border-google-yellow/40 bg-google-yellow/12 text-google-yellow',
    hover: 'hover:text-google-yellow',
  },
  {
    border: 'border-google-green/45',
    background: 'bg-google-green/10',
    openBackground: 'bg-google-green/16',
    icon: 'border-google-green/40 bg-google-green/15 text-white',
    hover: 'hover:text-google-green',
  },
] as const;

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

function FAQAccordion({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const accent = FAQ_ACCENT_STYLES[index % FAQ_ACCENT_STYLES.length];
  const buttonId = `faq-button-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div
      className={cn(
        'rounded-[1.6rem] border transition-all duration-300',
        accent.border,
        isOpen ? accent.openBackground : accent.background
      )}
    >
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-white transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          accent.hover
        )}
      >
        <span className="pr-4 text-lg font-semibold leading-snug">{item.question}</span>
        <ChevronDown
          className={cn(
            'h-10 w-10 flex-shrink-0 rounded-full border p-2 transition-transform duration-300',
            accent.icon,
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 px-5 pb-5' : 'max-h-0 px-5'
        )}
      >
        <p className="border-t border-white/10 pt-5 leading-8 text-white/84">{item.answer}</p>
      </div>
    </div>
  );
}

export function FAQ({
  title = 'Sık Sorulan Sorular',
  subtitle = 'Merak ettiğiniz her şeyin cevabı burada',
  items,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black py-16 text-white md:py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-white/72">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-4xl space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm md:p-6">
          {items.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
