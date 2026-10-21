import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button links', () => {
  it('opens absolute URLs in a new tab with a safe rel', () => {
    const html = renderToStaticMarkup(
      createElement(Button, { href: 'https://chat.whatsapp.com/abc' }, 'WhatsApp'),
    );
    expect(html).toContain('href="https://chat.whatsapp.com/abc"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('keeps internal links in the same tab', () => {
    const html = renderToStaticMarkup(createElement(Button, { href: '/haberler' }, 'Haberler'));
    expect(html).toContain('href="/haberler"');
    expect(html).not.toContain('target=');
  });

  it('lets callers force the external behaviour', () => {
    const html = renderToStaticMarkup(
      createElement(Button, { href: '/feed.xml', external: true }, 'RSS'),
    );
    expect(html).toContain('target="_blank"');
  });
});
