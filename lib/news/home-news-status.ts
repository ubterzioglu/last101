const ARCHIVE_AFTER_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Ana sayfada tarihli haberleri güncel içerik olarak sunup sunmayacağımızı belirler. */
export function areHomeNewsArchived(
  items: ReadonlyArray<{ publishedAt: string }>,
  now: Date = new Date()
): boolean {
  if (items.length === 0) return false;

  const nowMs = now.getTime();
  let newestValidPublication = -Infinity;

  for (const item of items) {
    const publishedMs = Date.parse(item.publishedAt);
    if (Number.isFinite(publishedMs) && publishedMs <= nowMs) {
      newestValidPublication = Math.max(newestValidPublication, publishedMs);
    }
  }

  return newestValidPublication < nowMs - ARCHIVE_AFTER_DAYS * DAY_MS;
}
