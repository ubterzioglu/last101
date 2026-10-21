import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { ADMIN_KEY_HEADERS, readBearerToken, readProvidedKey } from '@/lib/admin/headers';
import { authFailureResponse, withAuth, type AuthCheckResult } from '@/lib/admin/withAuth';

function headersOf(values: Record<string, string>) {
  return new Headers(values);
}

describe('readProvidedKey', () => {
  it('returns the first non-empty header in priority order', () => {
    expect(readProvidedKey(headersOf({ 'x-admin-password': 'p', 'x-admin-key': 'k' }), ADMIN_KEY_HEADERS)).toBe('k');
    expect(readProvidedKey(headersOf({ 'x-admin-password': ' p ' }), ADMIN_KEY_HEADERS)).toBe('p');
  });

  it('falls back to a Bearer token', () => {
    expect(readProvidedKey(headersOf({ authorization: 'Bearer abc ' }), ADMIN_KEY_HEADERS)).toBe('abc');
    expect(readBearerToken(headersOf({ authorization: 'Basic abc' }))).toBe('');
  });

  it('returns an empty string when nothing is provided', () => {
    expect(readProvidedKey(headersOf({}), ADMIN_KEY_HEADERS)).toBe('');
  });

  it('ignores whitespace-only headers because Headers strips surrounding whitespace (same as the old a || b || c)', () => {
    expect(readProvidedKey(headersOf({ 'x-admin-key': '   ', authorization: 'Bearer valid' }), ADMIN_KEY_HEADERS)).toBe('valid');
  });
});

describe('authFailureResponse', () => {
  it('returns the reason and status', async () => {
    const response = authFailureResponse({ ok: false, reason: 'Unauthorized', status: 401 });
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(response.headers.get('Retry-After')).toBeNull();
  });

  it('adds Retry-After for rate limited requests', () => {
    const response = authFailureResponse({ ok: false, reason: 'Too many', status: 429, retryAfterSeconds: 90 });
    expect(response.headers.get('Retry-After')).toBe('90');
  });
});

describe('withAuth', () => {
  const request = new NextRequest('https://example.test/api/thing');

  it('does not call the handler when the check fails', async () => {
    const handler = vi.fn();
    const route = withAuth(async (): Promise<AuthCheckResult> => ({ ok: false, reason: 'Unauthorized', status: 401 }), handler);
    const response = await route(request, {});
    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  it('passes request, context and auth to the handler on success', async () => {
    const auth = { ok: true, reason: '', status: 200, actor: 'admin' };
    const context = { params: Promise.resolve({ id: '1' }) };
    const route = withAuth(async () => auth, async (req, ctx, verified) => {
      expect(req).toBe(request);
      expect(ctx).toBe(context);
      expect(verified).toBe(auth);
      return new Response('ok', { status: 200 });
    });
    expect((await route(request, context)).status).toBe(200);
  });
});
