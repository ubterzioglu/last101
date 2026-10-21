import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAdminListUrl,
  fetchAdminList,
  getErrorMessage,
  postAdminAction,
  readJsonSafely,
} from '@/lib/admin/adminResource';

const ADMIN_HEADERS = { 'x-admin-key': 'secret', 'x-admin-password': 'secret' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>(async () => response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  // getAdminHeaders() reads the admin session that /admin stores in sessionStorage.
  vi.stubGlobal('window', {});
  vi.stubGlobal('sessionStorage', {
    getItem: () => JSON.stringify({ email: 'admin@almanya101.de', password: 'secret' }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildAdminListUrl', () => {
  it('returns the URL unchanged without a query', () => {
    expect(buildAdminListUrl('/api/reports')).toBe('/api/reports');
  });

  it('trims values and keeps the ? when nothing is left, like the hand-written clients', () => {
    expect(buildAdminListUrl('/api/reports', { search: '  kırık link ' })).toBe('/api/reports?search=k%C4%B1r%C4%B1k+link');
    expect(buildAdminListUrl('/api/reports', { search: '   ' })).toBe('/api/reports?');
  });

  it('keeps the given order and drops missing values', () => {
    expect(buildAdminListUrl('/api/agencies', { status: 'active', type: undefined, search: 'a&b', q: null })).toBe(
      '/api/agencies?status=active&search=a%26b',
    );
  });
});

describe('fetchAdminList', () => {
  it('sends the admin headers and returns the JSON payload', async () => {
    const fetchMock = mockFetch(jsonResponse({ reports: [{ id: 1 }] }));

    await expect(fetchAdminList('/api/reports?search=x')).resolves.toEqual({ reports: [{ id: 1 }] });
    expect(fetchMock).toHaveBeenCalledWith('/api/reports?search=x', { headers: ADMIN_HEADERS });
  });

  it('rejects with the HTTP status on non-2xx, ignoring the error body', async () => {
    mockFetch(jsonResponse({ error: 'Unauthorized' }, 401));

    await expect(fetchAdminList('/api/reports?')).rejects.toThrow(/^HTTP 401$/);
  });

  it('rejects when a 2xx body is not JSON', async () => {
    mockFetch(new Response('<html></html>', { status: 200 }));

    await expect(fetchAdminList('/api/reports?')).rejects.toThrow(SyntaxError);
  });
});

describe('postAdminAction', () => {
  it('posts the body as JSON with the admin headers and returns the payload', async () => {
    const fetchMock = mockFetch(jsonResponse({ success: true }));

    await expect(postAdminAction('/api/reports-action', { action: 'delete', id: 7 })).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/reports-action', {
      method: 'POST',
      headers: { ...ADMIN_HEADERS, 'Content-Type': 'application/json' },
      body: '{"action":"delete","id":7}',
    });
  });

  it('rejects with the HTTP status on non-2xx', async () => {
    mockFetch(jsonResponse({ error: 'Rapor silinemedi' }, 500));

    await expect(postAdminAction('/api/reports-action', { action: 'delete', id: 7 })).rejects.toThrow(/^HTTP 500$/);
  });

  it('resolves with {} when a 2xx body is empty', async () => {
    mockFetch(new Response(null, { status: 200 }));

    await expect(postAdminAction('/api/reports-action', { action: 'delete', id: 7 })).resolves.toEqual({});
  });
});

describe('readJsonSafely', () => {
  it('parses JSON and falls back to {} for anything else', async () => {
    await expect(readJsonSafely(jsonResponse({ error: 'Geçersiz işlem' }, 400))).resolves.toEqual({ error: 'Geçersiz işlem' });
    await expect(readJsonSafely(new Response('Bad Gateway', { status: 502 }))).resolves.toEqual({});
  });
});

describe('getErrorMessage', () => {
  it('uses the Error message and a Turkish fallback for other values', () => {
    expect(getErrorMessage(new Error('HTTP 500'))).toBe('HTTP 500');
    expect(getErrorMessage('boom')).toBe('Bilinmeyen hata');
    expect(getErrorMessage(undefined, 'İşlem başarısız.')).toBe('İşlem başarısız.');
  });
});
