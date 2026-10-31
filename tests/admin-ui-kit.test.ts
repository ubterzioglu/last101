import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { AdminStatusBadge, STATUS_TONES, statusTone } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import {
  AdminTable,
  AdminTd,
  AdminTh,
  AdminThead,
  AdminTr,
} from '@/components/admin/ui/AdminTable';

describe('statusTone', () => {
  it('maps pending states to yellow', () => {
    expect(statusTone('pending')).toBe('yellow');
    expect(statusTone('bekliyor')).toBe('yellow');
  });

  it('maps approved states to green', () => {
    for (const status of ['approved', 'onaylandı', 'active', 'açık']) {
      expect(statusTone(status)).toBe('green');
    }
  });

  it('maps rejected and error states to red', () => {
    for (const status of ['rejected', 'reddedildi', 'error', 'open']) {
      expect(statusTone(status)).toBe('red');
    }
  });

  it('maps closed states to neutral', () => {
    for (const status of ['closed', 'kapalı', 'inactive']) {
      expect(statusTone(status)).toBe('neutral');
    }
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(statusTone('  PENDING ')).toBe('yellow');
    expect(statusTone('Approved')).toBe('green');
  });

  it('falls back to neutral for unknown statuses', () => {
    expect(statusTone('bilinmiyor')).toBe('neutral');
    expect(statusTone('')).toBe('neutral');
  });

  it('exposes the mapping constant', () => {
    expect(STATUS_TONES.pending).toBe('yellow');
  });
});

describe('AdminStatusBadge', () => {
  it('renders the status as label with the mapped tone', () => {
    const html = renderToStaticMarkup(createElement(AdminStatusBadge, { status: 'pending' }));
    expect(html).toContain('pending');
    expect(html).toContain('bg-alm-yellow/10');
  });

  it('prefers an explicit label and tone', () => {
    const html = renderToStaticMarkup(
      createElement(AdminStatusBadge, { status: 'pending', label: 'Bekliyor', tone: 'red' })
    );
    expect(html).toContain('Bekliyor');
    expect(html).toContain('bg-alm-red/10');
  });
});

describe('AdminTable', () => {
  it('renders an empty table shell', () => {
    const html = renderToStaticMarkup(createElement(AdminTable, null));
    expect(html).toContain('<table');
    expect(html).toContain('overflow-x-auto');
    expect(html).toContain('border-line');
  });

  it('renders caption, header and rows', () => {
    const html = renderToStaticMarkup(
      createElement(
        AdminTable,
        { caption: 'Üyeler' },
        createElement(
          AdminThead,
          null,
          createElement(AdminTr, null, createElement(AdminTh, null, 'Ad'))
        ),
        createElement(
          'tbody',
          null,
          createElement(AdminTr, null, createElement(AdminTd, null, 'Ayşe'))
        )
      )
    );
    expect(html).toContain('<caption class="sr-only">Üyeler</caption>');
    expect(html).toContain('<th');
    expect(html).toContain('scope="col"');
    expect(html).toContain('Ayşe');
    expect(html).toContain('bg-band');
  });
});

describe('AdminEmptyState', () => {
  it('renders title, description and action', () => {
    const html = renderToStaticMarkup(
      createElement(AdminEmptyState, {
        title: 'Kayıt yok',
        description: 'Henüz kayıt eklenmedi.',
        action: createElement('button', null, 'Ekle'),
      })
    );
    expect(html).toContain('Kayıt yok');
    expect(html).toContain('Henüz kayıt eklenmedi.');
    expect(html).toContain('Ekle');
    expect(html).toContain('border-dashed');
  });

  it('renders only the title when optional props are missing', () => {
    const html = renderToStaticMarkup(createElement(AdminEmptyState, { title: 'Boş' }));
    expect(html).toContain('Boş');
    expect(html.match(/<p/g)).toHaveLength(1);
  });
});

describe('AdminFilterBar', () => {
  it('renders children in a wrapping row with optional title', () => {
    const html = renderToStaticMarkup(
      createElement(AdminFilterBar, { title: 'Filtreler' }, createElement('input', { name: 'q' }))
    );
    expect(html).toContain('Filtreler');
    expect(html).toContain('flex-wrap');
    expect(html).toContain('bg-band');
    expect(html).toContain('name="q"');
  });
});

describe('AdminTabs', () => {
  it('renders a button group with the active tab pressed', () => {
    const html = renderToStaticMarkup(
      createElement(AdminTabs, {
        tabs: [
          { key: 'a', label: 'Birinci' },
          { key: 'b', label: 'İkinci' },
        ],
        active: 'b',
        onChange: () => undefined,
      })
    );
    expect(html).toContain('role="group"');
    expect(html).not.toContain('role="tab');
    expect(html.match(/aria-pressed="/g)).toHaveLength(2);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('border-brand-700');
    expect(html).toContain('min-h-[44px]');
  });
});

describe('AdminModal', () => {
  const baseProps = { onClose: () => undefined, title: 'Silme onayı' };

  it('renders nothing when closed', () => {
    const html = renderToStaticMarkup(
      createElement(AdminModal, { ...baseProps, open: false }, 'içerik')
    );
    expect(html).toBe('');
  });

  it('renders an accessible dialog when open', () => {
    const html = renderToStaticMarkup(
      createElement(
        AdminModal,
        { ...baseProps, open: true, footer: createElement('button', null, 'Kapat') },
        'içerik'
      )
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby=');
    expect(html).toContain('Silme onayı');
    expect(html).toContain('içerik');
    expect(html).toContain('Kapat');
    expect(html).toContain('bg-ink/40');
    expect(html).not.toContain('backdrop-blur');
  });
});
