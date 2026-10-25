import { describe, expect, it } from 'vitest';
import { areHomeNewsArchived } from '@/lib/news/home-news-status';

const now = new Date('2026-10-25T12:00:00.000Z');

describe('areHomeNewsArchived', () => {
  it('keeps an empty news section in its existing state', () => {
    expect(areHomeNewsArchived([], now)).toBe(false);
  });

  it('marks news older than 90 UTC days as archive', () => {
    expect(areHomeNewsArchived([{ publishedAt: '2026-04-13T08:00:00.000Z' }], now)).toBe(true);
  });

  it('keeps recent news and the exact 90-day boundary current', () => {
    expect(areHomeNewsArchived([{ publishedAt: '2026-10-24T08:00:00.000Z' }], now)).toBe(false);
    expect(areHomeNewsArchived([{ publishedAt: '2026-07-27T12:00:00.000Z' }], now)).toBe(false);
    expect(areHomeNewsArchived([{ publishedAt: '2026-07-27T11:59:59.999Z' }], now)).toBe(true);
  });

  it('uses the newest valid publication date even if items are unordered', () => {
    expect(areHomeNewsArchived([
      { publishedAt: '2026-04-13T08:00:00.000Z' },
      { publishedAt: '2026-10-20T08:00:00.000Z' },
    ], now)).toBe(false);
  });

  it('does not treat invalid or future dates as current news', () => {
    expect(areHomeNewsArchived([{ publishedAt: 'geçersiz' }], now)).toBe(true);
    expect(areHomeNewsArchived([{ publishedAt: '2026-11-01T00:00:00.000Z' }], now)).toBe(true);
  });
});
