import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { injectTrackingScripts } from '../_lib/tracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROJECT_ROOT = process.cwd();
const BLOCKED_TOP_LEVEL = new Set([
  '.git',
  '.github',
  '.idea',
  '.vscode',
  '.vercel',
  '.astro',
  '.claude',
  '.serena',
  'node_modules',
  'api',
  'supabase',
]);
const BLOCKED_ROOT_FILES = new Set([
  '.env',
  '.env.local',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'next.config.ts',
  'vercel.json',
]);

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};
function resolveSlugParts(rawParts: string[]): string[] | null {
  const safeParts: string[] = [];

  for (const rawPart of rawParts) {
    let part = rawPart;
    try {
      part = decodeURIComponent(rawPart);
    } catch {
      return null;
    }

    if (!part || part === '.' || part === '..') return null;
    if (part.includes('/') || part.includes('\\')) return null;
    if (part.startsWith('.')) return null;
    safeParts.push(part);
  }

  if (safeParts.length > 0) {
    const top = safeParts[0];
    if (BLOCKED_TOP_LEVEL.has(top)) return null;
    if (safeParts.length === 1 && BLOCKED_ROOT_FILES.has(top)) return null;
  }

  return safeParts;
}

function buildCandidatePaths(parts: string[]): string[] {
  const basePath = path.join(PROJECT_ROOT, ...parts);
  const hasExtension = path.extname(basePath).length > 0;

  if (hasExtension) {
    return [basePath];
  }

  return [basePath, `${basePath}.html`, path.join(basePath, 'index.html')];
}

async function findExistingFile(candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    const normalized = path.normalize(candidate);
    if (!normalized.startsWith(path.normalize(PROJECT_ROOT + path.sep))) {
      continue;
    }

    try {
      const stat = await fs.stat(normalized);
      if (stat.isFile()) return normalized;
    } catch {
      // ignore
    }
  }

  return null;
}

function contentTypeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  const safeParts = resolveSlugParts(Array.isArray(slug) ? slug : []);
  if (!safeParts) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const filePath = await findExistingFile(buildCandidatePaths(safeParts));
  if (!filePath) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileContent = await fs.readFile(filePath);
  const contentType = contentTypeFromPath(filePath);
  const isHtmlFile = path.extname(filePath).toLowerCase() === '.html';
  const headers = new Headers({
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=120',
  });

  if (request.method === 'HEAD') {
    return new NextResponse(null, { status: 200, headers });
  }

  if (isHtmlFile) {
    const html = injectTrackingScripts(fileContent.toString('utf8'));
    return new NextResponse(html, { status: 200, headers });
  }

  return new NextResponse(fileContent, { status: 200, headers });
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest(request, context);
}

export async function HEAD(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest(request, context);
}
