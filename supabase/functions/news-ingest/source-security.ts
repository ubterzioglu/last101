// SSRF koruması: feed/endpoint fetch'lerinden önce URL ve IP doğrulaması.
// Bağımlılıksız, saf TypeScript: hem Deno edge function hem Next (lib/news/source-security.ts) kullanır.
// corteqsmvp radar-news-scan/lib/source-security.ts mantığından uyarlandı.

const BLOCKED_HOST_SUFFIXES = ['.local', '.internal', '.localdomain', '.localhost']
const BLOCKED_HOSTS = ['localhost']

const PRIVATE_IPV4_PATTERNS = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^192\.0\.0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGNAT 100.64.0.0/10
  /^198\.1[89]\./,
  /^(22[4-9]|2[3-5]\d)\./, // multicast + reserved
]

const IPV4_PATTERN = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/

export function isIPv4(address: string): boolean {
  return IPV4_PATTERN.test(address)
}

/** IPv6 adresini 8 adet 16-bit gruba açar ("::" ve gömülü IPv4 dahil). Geçersizse null. */
export function parseIPv6(address: string): number[] | null {
  let ip = address.toLowerCase().replace(/^\[|\]$/g, '')
  const zoneIndex = ip.indexOf('%')
  if (zoneIndex !== -1) ip = ip.slice(0, zoneIndex)
  if (!ip.includes(':')) return null

  const lastColon = ip.lastIndexOf(':')
  const tail = ip.slice(lastColon + 1)
  if (tail.includes('.')) {
    if (!isIPv4(tail)) return null
    const [a, b, c, d] = tail.split('.').map(Number)
    ip = `${ip.slice(0, lastColon + 1)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`
  }

  const halves = ip.split('::')
  if (halves.length > 2) return null
  const toGroups = (part: string) => (part ? part.split(':') : [])
  const head = toGroups(halves[0])
  const rest = halves.length === 2 ? toGroups(halves[1]) : []
  const missing = 8 - head.length - rest.length
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null

  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...rest]
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return null
  return groups.map((group) => parseInt(group, 16))
}

function embeddedIPv4(groups: number[]): string {
  return [groups[6] >> 8, groups[6] & 0xff, groups[7] >> 8, groups[7] & 0xff].join('.')
}

function isPrivateIPv6(groups: number[]): boolean {
  const firstFiveZero = groups.slice(0, 5).every((group) => group === 0)
  // ::ffff:a.b.c.d (IPv4-mapped) — URL ayrıştırıcısı bunu ::ffff:7f00:1 biçimine çevirir.
  if (firstFiveZero && groups[5] === 0xffff) return isPrivateAddress(embeddedIPv4(groups))
  // ::, ::1 ve kullanımdan kalkmış IPv4-compatible ::a.b.c.d
  if (firstFiveZero && groups[5] === 0) return true
  // 64:ff9b::/96 NAT64 — gömülü IPv4'e çevrilir
  if (groups[0] === 0x64 && groups[1] === 0xff9b && groups.slice(2, 6).every((group) => group === 0)) {
    return isPrivateAddress(embeddedIPv4(groups))
  }
  const first = groups[0]
  return (
    (first & 0xfe00) === 0xfc00 || // fc00::/7 unique local
    (first & 0xffc0) === 0xfe80 || // fe80::/10 link-local
    (first & 0xffc0) === 0xfec0 || // fec0::/10 site-local (eski)
    (first & 0xff00) === 0xff00 || // ff00::/8 multicast
    (first === 0x0100 && groups.slice(1, 4).every((group) => group === 0)) || // 100::/64 discard
    (first === 0x2001 && groups[1] === 0x0db8) // 2001:db8::/32 documentation
  )
}

/** IP literal'ı özel/ayrılmış bir aralıktaysa true. IP olmayan veya tanınmayan girdi de engellenir. */
export function isPrivateAddress(address: string): boolean {
  const ip = address.toLowerCase().replace(/^\[|\]$/g, '')
  if (isIPv4(ip)) return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(ip))
  const groups = parseIPv6(ip)
  return groups ? isPrivateIPv6(groups) : true
}

export function isIpLiteral(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '')
  return isIPv4(host) || parseIPv6(host) !== null
}

export type UrlCheck = { ok: true; url: URL } | { ok: false; reason: string }

/** URL'nin yapısal olarak güvenli olduğunu doğrular (DNS çözümlemesi yapmaz). */
export function checkSourceUrl(rawUrl: string): UrlCheck {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return { ok: false, reason: 'Geçersiz URL formatı.' }
  }

  if (url.protocol !== 'https:') return { ok: false, reason: 'Yalnızca https adresleri kabul edilir.' }
  if (url.username || url.password) return { ok: false, reason: 'URL içinde kullanıcı bilgisi olamaz.' }
  if (url.port && url.port !== '443') return { ok: false, reason: 'Yalnızca standart https portu (443) kabul edilir.' }

  const hostname = url.hostname.toLowerCase()
  if (BLOCKED_HOSTS.includes(hostname) || BLOCKED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return { ok: false, reason: `Engellenen alan adı: ${hostname}` }
  }
  if (isIpLiteral(hostname) && isPrivateAddress(hostname)) {
    return { ok: false, reason: `Özel IP aralığı engellendi: ${hostname}` }
  }
  return { ok: true, url }
}

/** Geriye uyumlu arayüz (edge adapter'ları kullanıyor). */
export function validateSourceUrl(url: string): { ok: boolean; reason?: string } {
  const result = checkSourceUrl(url)
  return result.ok ? { ok: true } : { ok: false, reason: result.reason }
}

/**
 * Yönlendirmeleri elle izleyerek fetch eder; her adımda URL yeniden doğrulanır.
 * (Edge runtime'da DNS doğrulaması yok; Next tarafı ayrıca DNS kontrolü yapar.)
 */
export async function fetchWithValidatedRedirects(
  rawUrl: string,
  init: RequestInit,
  maxRedirects = 3
): Promise<Response> {
  let currentUrl = rawUrl
  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    const check = checkSourceUrl(currentUrl)
    if (!check.ok) throw new Error(`SSRF engeli: ${check.reason}`)

    const response = await fetch(check.url, { ...init, redirect: 'manual' })
    const location = response.headers.get('location')
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel()
      currentUrl = new URL(location, check.url).toString()
      continue
    }
    return response
  }
  throw new Error(`Çok fazla yönlendirme (>${maxRedirects})`)
}
