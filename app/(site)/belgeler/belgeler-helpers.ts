import type { CategoryData, DocumentData } from './data';

/** Removes the Markdown emphasis markers (`*`, `**`) the source texts carry, plus stray spacing. */
export function plainText(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value.replaceAll('*', '').replace(/\s+/g, ' ').trim();
}

export function countDocuments(categories: readonly CategoryData[]): number {
  return categories.reduce((total, category) => total + category.documents.length, 0);
}

/** Stable anchor id for a category, e.g. `belge-kategori-1`. */
export function categoryAnchor(index: number): string {
  return `belge-kategori-${index + 1}`;
}

export interface DocumentFact {
  label: string;
  value: string;
}

const FACT_FIELDS: ReadonlyArray<{ key: keyof DocumentData; label: string }> = [
  { key: 'who', label: 'Kimler' },
  { key: 'supportingDocs', label: 'Gerekenler' },
  { key: 'authority', label: 'Makam' },
  { key: 'duration', label: 'Süre' },
  { key: 'cost', label: 'Ücret' },
];

/** The labelled fact rows of a document, skipping empty fields. */
export function documentFacts(document: DocumentData): DocumentFact[] {
  return FACT_FIELDS.flatMap(({ key, label }) => {
    const value = plainText(document[key]);
    return value ? [{ label, value }] : [];
  });
}
