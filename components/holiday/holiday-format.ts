import type { SiteTone } from '@/components/site/tones';
import { parseISODate } from '@/lib/utils/holiday-calculator';

// Built at runtime so the unicode property escape does not depend on the TS target.
const LEADING_PICTOGRAPHS = new RegExp('^[\\p{Extended_Pictographic}\\uFE0F\\u200D\\s]+', 'u');

/**
 * The efficiency badge text from `calculateEfficiency` starts with an emoji.
 * Page text must not show emoji, so the UI drops the leading pictographs only.
 */
export function stripLeadingEmoji(text: string): string {
  return text.replace(LEADING_PICTOGRAPHS, '');
}

/** Tone for the efficiency chip; thresholds match the original badge colours. */
export function efficiencyTone(ratio: number): SiteTone | 'neutral' {
  if (ratio >= 3.2) return 'green';
  if (ratio >= 2.4) return 'blue';
  return 'neutral';
}

/** German holiday label, e.g. `03.10.26 (Cum)` (unchanged from the original calculator). */
export function formatDateLabel(iso: string): string {
  const d = parseISODate(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return `${dd}.${mm}.${yy} (${days[d.getUTCDay()]})`;
}
