import { getAdminHeaders } from '@/lib/admin/clientAuth';

// Fetch/parse helpers for the admin list pages; hooks/useAdminResource.ts builds on them.
// They keep the URLs, headers, bodies and error messages the hand-written admin clients used.

/** Filter values sent as query params; missing, empty or whitespace-only values are not sent. */
export type AdminQuery = Readonly<Record<string, string | null | undefined>>;

const UNKNOWN_ERROR_MESSAGE = 'Bilinmeyen hata';

/**
 * `${url}?${params}` with every value trimmed. As in the hand-written clients the `?` stays even
 * when no value is left; without a query the URL is returned unchanged.
 */
export function buildAdminListUrl(url: string, query?: AdminQuery): string {
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    const trimmed = value?.trim();
    if (trimmed) params.append(key, trimmed);
  }
  return `${url}?${params}`;
}

/** JSON body of the response, or `{}` when the body is empty or not JSON. */
export async function readJsonSafely(response: Response): Promise<unknown> {
  return response.json().catch(() => ({}));
}

function assertOk(response: Response): void {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

/** GET with the stored admin credentials. Rejects with `HTTP <status>` on non-2xx; a 2xx body that is not JSON rejects too. */
export async function fetchAdminList(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: getAdminHeaders() });
  assertOk(response);
  return response.json();
}

/** POSTs `body` as JSON. Rejects with `HTTP <status>` on non-2xx; resolves with the body (or `{}`). */
export async function postAdminAction(url: string, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getAdminHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  assertOk(response);
  return readJsonSafely(response);
}

/** Message to show for a caught value; non-`Error` values get the Turkish fallback. */
export function getErrorMessage(error: unknown, fallback = UNKNOWN_ERROR_MESSAGE): string {
  return error instanceof Error ? error.message : fallback;
}
