import { describe, expect, it } from 'vitest';
import {
  buildRedirects,
  CANONICAL_ORIGIN,
  WWW_HOST,
  type RedirectRule,
} from '@/lib/seo/redirects';

const rules = buildRedirects();

function find(source: string, host?: string): RedirectRule | undefined {
  return rules.find((rule) => {
    const ruleHost = rule.has?.find((cond) => cond.type === 'host')?.value;
    return rule.source === source && ruleHost === host;
  });
}

/** Minimal matcher for the Next.js path patterns used in the redirect table. */
function sourceToRegExp(source: string): RegExp {
  const pattern = source
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:[A-Za-z]+\*/g, '(?:/.*)?')
    .replace(/:[A-Za-z]+/g, '[^/]+');
  return new RegExp(`^${pattern}$`);
}

function splitDestination(destination: string): { host: string | null; path: string } {
  if (!/^https?:\/\//.test(destination)) return { host: null, path: destination };
  const url = new URL(destination.replace(/:[A-Za-z]+\*?/g, 'x'));
  return { host: url.host, path: destination.slice(url.origin.length) };
}

/** Request host a redirect destination is followed on (relative = same host as the request). */
function matchesAfterHop(rule: RedirectRule, candidate: RedirectRule): boolean {
  const { host, path } = splitDestination(rule.destination);
  const requestHost = host ?? rule.has?.find((cond) => cond.type === 'host')?.value ?? null;
  const candidateHost = candidate.has?.find((cond) => cond.type === 'host')?.value ?? null;
  if (candidateHost && candidateHost !== requestHost) return false;
  const concretePath = path.replace(/:[A-Za-z]+\*?/g, 'x');
  return sourceToRegExp(candidate.source).test(concretePath);
}

describe('legacy blog redirects', () => {
  it('redirects /yazi-dizisi to /blog permanently', () => {
    expect(find('/yazi-dizisi')).toMatchObject({ destination: '/blog', permanent: true });
  });

  it('redirects /yazi-dizisi/:slug to /blog/:slug permanently', () => {
    expect(find('/yazi-dizisi/:slug')).toMatchObject({
      destination: '/blog/:slug',
      permanent: true,
    });
  });

  it('sends www requests straight to the final apex URL', () => {
    expect(find('/yazi-dizisi', WWW_HOST)).toMatchObject({
      destination: `${CANONICAL_ORIGIN}/blog`,
      permanent: true,
    });
    expect(find('/yazi-dizisi/:slug', WWW_HOST)).toMatchObject({
      destination: `${CANONICAL_ORIGIN}/blog/:slug`,
      permanent: true,
    });
  });

  it('orders rules: www legacy rules, generic www rule, apex legacy rules', () => {
    const indexOf = (source: string, host?: string) => rules.indexOf(find(source, host) as RedirectRule);
    const wwwGeneric = indexOf('/:path*', WWW_HOST);
    expect(indexOf('/yazi-dizisi', WWW_HOST)).toBeLessThan(wwwGeneric);
    expect(indexOf('/yazi-dizisi/:slug', WWW_HOST)).toBeLessThan(wwwGeneric);
    expect(indexOf('/yazi-dizisi')).toBeGreaterThan(wwwGeneric);
    expect(indexOf('/yazi-dizisi/:slug')).toBeGreaterThan(wwwGeneric);
  });

  it('keeps the existing devuser .html redirects', () => {
    expect(find('/devuser/du.html')).toMatchObject({ destination: '/devuser/du', permanent: true });
  });
});

describe('redirect table integrity', () => {
  it('marks every rule permanent', () => {
    expect(rules.every((rule) => rule.permanent)).toBe(true);
  });

  it('has no duplicate source+host pairs', () => {
    const keys = rules.map((rule) => `${rule.has?.[0]?.value ?? '*'}|${rule.source}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('never chains: no destination matches another rule source', () => {
    for (const rule of rules) {
      const chained = rules.filter((candidate) => candidate !== rule && matchesAfterHop(rule, candidate));
      expect(chained, `${rule.source} -> ${rule.destination} chains into ${chained.map((c) => c.source).join(', ')}`)
        .toEqual([]);
    }
  });

  it('never redirects a path to itself (no loops)', () => {
    for (const rule of rules) {
      const { host, path } = splitDestination(rule.destination);
      const sameHost = host === null || !rule.has?.length || rule.has.some((cond) => cond.value === host);
      expect(sameHost && path === rule.source, `${rule.source} loops`).toBe(false);
    }
  });
});
