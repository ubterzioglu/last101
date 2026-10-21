import { FileText } from 'lucide-react';
import { Accordion } from '@/components/site/Accordion';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import { categoryAnchor, documentFacts, plainText } from './belgeler-helpers';
import type { CategoryData, DocumentData } from './data';

function DocumentEntry({ document, toneIndex }: { document: DocumentData; toneIndex: number }) {
  const tone = TONE_STYLES[toneAt(toneIndex)];
  const facts = documentFacts(document);

  return (
    <li className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10">
      <div className="flex min-w-0 gap-3">
        <span
          aria-hidden="true"
          className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-tile', tone.tint, tone.text)}
        >
          <FileText className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
            {plainText(document.name)}
          </h3>
          {document.officialName ? (
            <p className="mt-1 text-sm text-muted">{plainText(document.officialName)}</p>
          ) : null}
          {document.purpose ? (
            <p className="mt-3 text-[15px] leading-relaxed text-ink">{plainText(document.purpose)}</p>
          ) : null}
        </div>
      </div>
      <div className="min-w-0">
        <dl className="divide-y divide-line border-y border-line text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-1 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-semibold text-ink">{fact.label}:</dt>
              <dd className="leading-relaxed text-muted">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {document.note ? (
          <p className="mt-3 rounded-tile border border-alm-yellow/20 bg-alm-yellow/5 p-3 text-sm leading-relaxed text-ink">
            <strong className="font-semibold">Not:</strong> {plainText(document.note)}
          </p>
        ) : null}
      </div>
    </li>
  );
}

/** Document categories as a single-open hairline accordion; each panel is a hairline list. */
export function DocumentCategories({ categories }: { categories: CategoryData[] }) {
  return (
    <Accordion
      name="belge-kategorileri"
      toneCycle
      defaultOpenIndex={0}
      items={categories.map((category, index) => ({
        id: categoryAnchor(index),
        title: (
          <>
            {category.category}{' '}
            <span className="font-medium text-muted">({category.documents.length})</span>
          </>
        ),
        content: (
          <ul className="divide-y divide-line">
            {category.documents.map((document) => (
              <DocumentEntry key={document.name} document={document} toneIndex={index} />
            ))}
          </ul>
        ),
      }))}
    />
  );
}
