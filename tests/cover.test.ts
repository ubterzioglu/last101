import { describe, expect, it } from 'vitest';
import { realCoverUrl } from '@/components/news/cover';
import { DEFAULT_COVER_IMAGE, DEFAULT_OG_IMAGE } from '@/lib/utils/constants';

describe('realCoverUrl', () => {
  it('treats the shared default cover (webp) as a placeholder', () => {
    expect(DEFAULT_COVER_IMAGE).toBe('/images/hero-background.webp');
    expect(realCoverUrl(DEFAULT_COVER_IMAGE)).toBeNull();
    expect(realCoverUrl(`  ${DEFAULT_COVER_IMAGE}  `)).toBeNull();
  });

  it('still treats the legacy jpg hero and the OG banner as placeholders', () => {
    expect(realCoverUrl('/images/hero-background.jpg')).toBeNull();
    expect(realCoverUrl(DEFAULT_OG_IMAGE)).toBeNull();
  });

  it('returns null for empty values', () => {
    expect(realCoverUrl(null)).toBeNull();
    expect(realCoverUrl(undefined)).toBeNull();
    expect(realCoverUrl('   ')).toBeNull();
  });

  it('returns a real photo URL trimmed', () => {
    expect(realCoverUrl(' https://cdn.example.com/foto.jpg ')).toBe('https://cdn.example.com/foto.jpg');
    expect(realCoverUrl('/uploads/kapak.webp')).toBe('/uploads/kapak.webp');
  });
});
