import { readdirSync } from 'node:fs';
import path from 'node:path';

const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;
const ROUTE_GROUP = /^\(.+\)$/;
const DYNAMIC_SEGMENT = /^\[.+\]$/;

/** Static URL paths of every `page.*` file under app/, with route groups removed. */
export function collectAppRoutes(dir: string, segments: readonly string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const ownRoute = entries.some((entry) => entry.isFile() && PAGE_FILE.test(entry.name))
    ? [`/${segments.join('/')}`]
    : [];

  return entries
    .filter((entry) => entry.isDirectory() && !/^[_@]/.test(entry.name))
    .flatMap((entry) => {
      const nextSegments = ROUTE_GROUP.test(entry.name) ? segments : [...segments, entry.name];
      return collectAppRoutes(path.join(dir, entry.name), nextSegments);
    })
    .concat(ownRoute);
}

/**
 * Static first URL segments served from app/: directories (route groups are
 * flattened, dynamic segments and private `_`/`@` folders skipped) plus the
 * metadata file conventions that become top-level URLs.
 */
export function collectTopLevelSegments(appDir: string): string[] {
  const found = new Set<string>();

  const visit = (dir: string, isRoot: boolean): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (/^[_@]/.test(entry.name) || DYNAMIC_SEGMENT.test(entry.name)) continue;
        if (ROUTE_GROUP.test(entry.name)) {
          visit(path.join(dir, entry.name), true);
        } else {
          found.add(entry.name);
        }
      } else if (isRoot && /^(sitemap|robots|manifest|icon|apple-icon|favicon)\.[a-z]+$/.test(entry.name)) {
        found.add(entry.name);
      }
    }
  };

  visit(appDir, true);
  return [...found].sort();
}

/** Top-level directories under public/ (each is served as a first URL segment). */
export function collectPublicDirectories(publicDir: string): string[] {
  return readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
