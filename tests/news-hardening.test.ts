import { describe, expect, it } from 'vitest';
import { NewsInputError } from '@/lib/news/errors';
import { buildIlikeOrFilter } from '@/lib/news/search';
import { isPrivateAddress, validateFeedUrl } from '@/lib/news/source-security';

describe('buildIlikeOrFilter', () => {
  it('quotes the term so commas and parentheses cannot add filter conditions', () => {
    expect(buildIlikeOrFilter(['title', 'summary'], 'a,status.eq.published')).toBe(
      'title.ilike."%a,status.eq.published%",summary.ilike."%a,status.eq.published%"'
    );
    expect(buildIlikeOrFilter(['title'], 'x),or(id.neq.0')).toBe('title.ilike."%x),or(id.neq.0%"');
  });

  it('escapes quotes for PostgREST and backslashes for both LIKE and PostgREST', () => {
    // LIKE: \ → \\ ; PostgREST: each \ → \\ again, " → \"
    expect(buildIlikeOrFilter(['title'], 'say "hi" \\ bye')).toBe('title.ilike."%say \\"hi\\" \\\\\\\\ bye%"');
  });

  it('treats LIKE wildcards in the term literally', () => {
    // % → \% (LIKE) → \\% (PostgREST); _ likewise; * is dropped
    expect(buildIlikeOrFilter(['title'], '50%_off*')).toBe('title.ilike."%50\\\\%\\\\_off%"');
  });
});

describe('isPrivateAddress', () => {
  it.each(['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:10.0.0.1'])(
    'blocks %s',
    (address) => {
      expect(isPrivateAddress(address)).toBe(true);
    }
  );

  it.each(['8.8.8.8', '151.101.1.69', '2606:4700::6810:84e5', '172.32.0.1', '::ffff:8.8.8.8', '::ffff:808:808'])(
    'allows %s',
    (address) => {
      expect(isPrivateAddress(address)).toBe(false);
    }
  );

  it.each([
    '::ffff:7f00:1', // ::ffff:127.0.0.1 after WHATWG URL normalisation
    '::ffff:a9fe:a9fe', // ::ffff:169.254.169.254
    '::7f00:1', // IPv4-compatible ::127.0.0.1
    '::',
    '64:ff9b::a00:1', // NAT64 of 10.0.0.1
    'fec0::1',
    'ff02::1',
    '100::1',
    '2001:db8::1',
    'not-an-ip',
  ])('blocks IPv6 special/embedded form %s', (address) => {
    expect(isPrivateAddress(address)).toBe(true);
  });
});

describe('validateFeedUrl', () => {
  it('accepts public https feeds', () => {
    expect(validateFeedUrl('https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml').hostname).toBe('www.tagesschau.de');
  });

  it('does not treat domains that look like IPv6 prefixes as private', () => {
    for (const url of ['https://fdp.de/feed', 'https://fcbayern.com/rss', 'https://febxyz.de/rss']) {
      expect(validateFeedUrl(url).protocol).toBe('https:');
    }
  });

  it.each([
    ['http://example.com/feed', 'https'],
    ['ftp://example.com/feed', 'https'],
    ['https://localhost/feed', 'Engellenen'],
    ['https://metadata.internal/feed', 'Engellenen'],
    ['https://169.254.169.254/latest/meta-data', 'Özel IP'],
    ['https://[::1]/feed', 'Özel IP'],
    ['https://[::ffff:127.0.0.1]/feed', 'Özel IP'],
    ['https://[::ffff:169.254.169.254]/latest/meta-data', 'Özel IP'],
    ['https://[::127.0.0.1]/feed', 'Özel IP'],
    ['https://[fd00::1]/feed', 'Özel IP'],
    ['https://user:pass@example.com/feed', 'kullanıcı'],
    ['https://example.com:8443/feed', 'port'],
    ['not a url', 'Geçersiz'],
  ])('rejects %s', (url, reason) => {
    expect(() => validateFeedUrl(url)).toThrow(NewsInputError);
    expect(() => validateFeedUrl(url)).toThrow(new RegExp(reason));
  });
});
