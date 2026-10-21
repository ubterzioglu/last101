// Admin / corner / pipeline kimlik doğrulama header adları. Hem sunucu (auth kontrolleri) hem istemci
// (getAdminHeaders) kullanır; bu yüzden 'server-only' değildir ve yalnızca sabit + saf yardımcı içerir.

export const ADMIN_KEY_HEADER = 'x-admin-key';
export const ADMIN_PASSWORD_HEADER = 'x-admin-password';
export const ADMIN_TOKEN_HEADER = 'x-admin-token';

export const CORNER_ADMIN_KEY_HEADER = 'x-corner-admin-key';
export const CORNER_ADMIN_PASSWORD_HEADER = 'x-corner-admin-password';

export const CORNER_AUTHOR_KEY_HEADER = 'x-corner-author-key';
export const CORNER_AUTHOR_PASSWORD_HEADER = 'x-corner-author-password';

export const PIPELINE_SECRET_HEADER = 'x-pipeline-secret';

/** Kabul edilen admin anahtarı header'ları, öncelik sırasıyla. */
export const ADMIN_KEY_HEADERS = [ADMIN_KEY_HEADER, ADMIN_PASSWORD_HEADER, ADMIN_TOKEN_HEADER] as const;
export const CORNER_ADMIN_KEY_HEADERS = [CORNER_ADMIN_KEY_HEADER, CORNER_ADMIN_PASSWORD_HEADER] as const;
export const CORNER_AUTHOR_KEY_HEADERS = [CORNER_AUTHOR_KEY_HEADER, CORNER_AUTHOR_PASSWORD_HEADER] as const;

interface HeaderSource {
  get(name: string): string | null;
}

/** `Authorization: Bearer <token>` değerini döndürür; yoksa boş string. */
export function readBearerToken(headers: HeaderSource): string {
  const authorization = headers.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

/**
 * Verilen header'lardan ilk dolu olanı, yoksa Bearer token'ı döndürür (kırpılmış).
 * Admin ve corner auth'ta aynı öncelik kuralı kullanılır.
 */
export function readProvidedKey(headers: HeaderSource, headerNames: readonly string[]): string {
  for (const name of headerNames) {
    const value = headers.get(name)?.trim();
    if (value) return value;
  }
  return readBearerToken(headers);
}
