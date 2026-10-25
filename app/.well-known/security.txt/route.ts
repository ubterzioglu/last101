import { CANONICAL_SITE_URL, CONTACT_INFO } from '@/lib/utils/constants';

/**
 * RFC 9116 security.txt — güvenlik açığı bildirim kanalı.
 */
export async function GET() {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    `Contact: mailto:${CONTACT_INFO.email}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, '.000Z')}`,
    'Preferred-Languages: tr, en',
    `Canonical: ${CANONICAL_SITE_URL}/.well-known/security.txt`,
    `Policy: ${CANONICAL_SITE_URL}/iletisim`,
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
