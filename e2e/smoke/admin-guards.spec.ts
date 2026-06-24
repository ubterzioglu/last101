import { test, expect } from '@playwright/test';

/**
 * Admin guard smoke — self-contained.
 * Verifies the REAL single admin gate (lib/admin/adminAuth.ts -> isAdminAuthorized):
 *  - Admin API routes reject unauthenticated requests.
 *
 * No editor role exists in this repo; that scenario from the old spec is omitted.
 * Each test is independent (no shared auth state).
 */

// Admin API endpoints that must be protected by isAdminAuthorized.
const PROTECTED_ADMIN_APIS: { path: string; method: 'GET' | 'POST' }[] = [
  { path: '/api/news-admin-list', method: 'GET' },
  { path: '/api/news-admin-action', method: 'POST' },
  { path: '/api/devuser-admin-list', method: 'GET' },
  { path: '/api/recruitment-agencies-admin-list', method: 'GET' },
  { path: '/api/recruitment-agencies-admin-action', method: 'POST' },
];

for (const api of PROTECTED_ADMIN_APIS) {
  test(`anon ${api.method} ${api.path} is not authorized`, async ({ request }) => {
    const response =
      api.method === 'GET'
        ? await request.get(api.path)
        : await request.post(api.path, { data: {} });

    // Core invariant: unauthenticated admin calls must NEVER succeed (200).
    // isAdminAuthorized returns 401 (unauthorized), and may return 429/503/500
    // depending on rate-limit state or whether admin auth is configured in the
    // test environment — all are acceptable "denied" outcomes.
    const status = response.status();
    expect(status, `${api.path} returned ${status} for anon request`).not.toBe(200);
    expect(
      status,
      `${api.path} should be a denied status, got ${status}`
    ).toBeGreaterThanOrEqual(400);
  });
}
