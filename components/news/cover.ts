import { DEFAULT_OG_IMAGE } from '@/lib/utils/constants';

/**
 * Stand-in covers the data layer substitutes when a row has no image: the
 * branded OG banner for news (`lib/public-news.ts`) and the 6.6 MB Berlin
 * night photo used as DEFAULT_COVER by `lib/corner.ts` and
 * `lib/rehber-articles.ts`. Cards and article heads show a tone tile (or no
 * cover) instead of repeating them. Metadata and JSON-LD keep the raw URL.
 */
const PLACEHOLDER_COVERS: ReadonlySet<string> = new Set([DEFAULT_OG_IMAGE, '/images/hero-background.jpg']);

/** The cover URL when it is a real photo, otherwise `null`. */
export function realCoverUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed || PLACEHOLDER_COVERS.has(trimmed)) return null;
  return trimmed;
}
