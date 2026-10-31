import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layoutSource = readFileSync(path.resolve(__dirname, '../app/layout.tsx'), 'utf8');

describe('root layout analytics wiring', () => {
  it('mounts the footer, the consent-gated analytics loader and the consent banner', () => {
    expect(layoutSource).toContain('<Footer />');
    expect(layoutSource).toContain('<AnalyticsScripts />');
    expect(layoutSource).toContain('<CookieConsent />');
  });

  it('does not hard-code any tracker before consent', () => {
    expect(layoutSource).not.toMatch(
      /googletagmanager|gc\.zgo\.at|goatcounter|clarity\.ms|next\/script/i,
    );
  });

  it('renders exactly one main landmark', () => {
    expect(layoutSource.match(/<main[\s>]/g)).toHaveLength(1);
  });
});
