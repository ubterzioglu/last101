import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ToolProgress } from '@/components/tools/ToolProgress';

describe('ToolProgress reset button', () => {
  it('has a 44px tap target without growing the progress row', () => {
    const html = renderToStaticMarkup(
      createElement(ToolProgress, { current: 1, total: 20, onReset: () => undefined }),
    );
    const button = html.match(/<button[^>]*>/)?.[0] ?? '';
    expect(button).toContain('min-h-[44px]');
    expect(button).toContain('-my-2');
  });
});
