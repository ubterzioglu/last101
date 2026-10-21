import type { SiteTone } from '@/components/site/tones';
import type { NewsCategory } from '@/types/news';

/** Category colour coding for news chips, filter dots and fallback tiles (decor only). */
export const NEWS_CATEGORY_TONES: Record<NewsCategory, SiteTone> = {
  almanya: 'yellow',
  turkiye: 'red',
  avrupa: 'blue',
  dunya: 'green',
  duyuru: 'orange',
};

export function newsCategoryTone(category: NewsCategory): SiteTone {
  return NEWS_CATEGORY_TONES[category] ?? 'blue';
}
