import { lookup } from 'node:dns/promises';
import { NewsInputError } from '@/lib/news/errors';
import {
  checkSourceUrl,
  isIpLiteral,
  isPrivateAddress,
} from '../../supabase/functions/news-ingest/source-security';

// Admin panelinden tetiklenen kaynak fetch'leri için SSRF koruması (Node runtime).
// URL/IP kuralları edge function ile ortaktır (tek doğruluk kaynağı); burada ayrıca DNS denetlenir.

export { isPrivateAddress };

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const DEFAULT_MAX_REDIRECTS = 3;

/** URL'nin yapısal olarak güvenli olduğunu doğrular (DNS çözümlemesi yapmaz). */
export function validateFeedUrl(rawUrl: string): URL {
  const result = checkSourceUrl(rawUrl);
  if (!result.ok) throw new NewsInputError(result.reason);
  return result.url;
}

function timeoutError(timeoutMs: number): NewsInputError {
  return new NewsInputError(`Kaynak ${Math.round(timeoutMs / 1000)} sn içinde yanıt vermedi.`);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
}

async function assertPublicHost(hostname: string, signal: AbortSignal, timeoutMs: number): Promise<void> {
  if (isIpLiteral(hostname)) return; // validateFeedUrl IP literal'ı zaten denetledi
  const aborted = new Promise<never>((_, reject) => {
    signal.addEventListener('abort', () => reject(timeoutError(timeoutMs)), { once: true });
  });
  const addresses = await Promise.race([lookup(hostname, { all: true }), aborted]).catch((error: unknown) => {
    if (error instanceof NewsInputError) throw error;
    throw new NewsInputError(`Alan adı çözümlenemedi: ${hostname}`);
  });
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new NewsInputError(`Alan adı özel bir IP'ye çözümleniyor: ${hostname}`);
  }
}

async function readTextWithLimit(response: Response, maxBytes: number, timeoutMs: number): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel();
        throw new NewsInputError(`Yanıt ${Math.round(maxBytes / 1024 / 1024)} MB sınırını aştı.`);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (isAbortError(error)) throw timeoutError(timeoutMs);
    throw error;
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export interface SafeFetchResult {
  ok: boolean;
  status: number;
  text: string;
  finalUrl: string;
}

/**
 * Her adımda (yönlendirmeler dahil) URL'yi ve DNS çözümlemesini doğrulayarak fetch eder;
 * zaman aşımı ve boyut sınırı uygular. Not: DNS denetimi ile bağlantı arasındaki yeniden
 * çözümleme (DNS rebinding) bu katmanda engellenmez.
 */
export async function fetchFeedSafely(
  rawUrl: string,
  options: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number } = {}
): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const signal = AbortSignal.timeout(timeoutMs);

  let currentUrl = rawUrl;
  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    const url = validateFeedUrl(currentUrl);
    await assertPublicHost(url.hostname.replace(/^\[|\]$/g, ''), signal, timeoutMs);

    const response = await fetch(url, {
      redirect: 'manual',
      signal,
      cache: 'no-store',
      headers: { 'user-agent': 'almanya101-news-ingest/1.0' },
    }).catch((error: unknown) => {
      if (isAbortError(error)) throw timeoutError(timeoutMs);
      throw new NewsInputError(`Kaynağa bağlanılamadı: ${url.hostname}`);
    });

    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      currentUrl = new URL(location, url).toString();
      continue;
    }

    const text = await readTextWithLimit(response, maxBytes, timeoutMs);
    return { ok: response.ok, status: response.status, text, finalUrl: url.toString() };
  }

  throw new NewsInputError(`Çok fazla yönlendirme (>${maxRedirects}).`);
}
