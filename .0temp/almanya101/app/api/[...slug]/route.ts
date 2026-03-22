import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const dynamicImport = new Function('modulePath', 'return import(modulePath)') as (
  modulePath: string
) => Promise<any>;

type LegacyQueryValue = string | string[];
type LegacyQuery = Record<string, LegacyQueryValue>;

type LegacyRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  query: LegacyQuery;
  body?: unknown;
};

type LegacyResponseState = {
  statusCode: number;
  headers: Headers;
  body: BodyInit | null;
};

function isSafeSegment(segment: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(segment);
}

function toLegacyQuery(url: URL): LegacyQuery {
  const query: LegacyQuery = {};

  for (const [key, value] of url.searchParams.entries()) {
    const existing = query[key];
    if (existing === undefined) {
      query[key] = value;
      continue;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      query[key] = existing;
      continue;
    }
    query[key] = [existing, value];
  }

  return query;
}

function normalizeBody(rawBody: string, contentType: string): unknown {
  if (!rawBody) return undefined;
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }
  return rawBody;
}

function createLegacyResponse() {
  const state: LegacyResponseState = {
    statusCode: 200,
    headers: new Headers(),
    body: null,
  };

  const legacyRes: any = {
    statusCode: 200,
    setHeader(name: string, value: string | number | string[]) {
      const headerName = String(name);
      if (Array.isArray(value)) {
        state.headers.set(headerName, value.join(', '));
      } else {
        state.headers.set(headerName, String(value));
      }
      return legacyRes;
    },
    getHeader(name: string) {
      return state.headers.get(String(name));
    },
    removeHeader(name: string) {
      state.headers.delete(String(name));
      return legacyRes;
    },
    status(code: number) {
      state.statusCode = code;
      legacyRes.statusCode = code;
      return legacyRes;
    },
    writeHead(code: number, headers?: Record<string, string>) {
      state.statusCode = code;
      legacyRes.statusCode = code;
      if (headers && typeof headers === 'object') {
        for (const [key, value] of Object.entries(headers)) {
          state.headers.set(key, String(value));
        }
      }
      return legacyRes;
    },
    json(payload: unknown) {
      if (!state.headers.has('Content-Type')) {
        state.headers.set('Content-Type', 'application/json; charset=utf-8');
      }
      state.body = JSON.stringify(payload ?? {});
      return legacyRes;
    },
    send(payload: unknown) {
      if (payload === undefined || payload === null) {
        state.body = null;
        return legacyRes;
      }
      if (typeof payload === 'object' && !(payload instanceof Uint8Array)) {
        if (!state.headers.has('Content-Type')) {
          state.headers.set('Content-Type', 'application/json; charset=utf-8');
        }
        state.body = JSON.stringify(payload);
        return legacyRes;
      }
      state.body = payload as BodyInit;
      return legacyRes;
    },
    end(payload?: unknown) {
      if (payload !== undefined) {
        legacyRes.send(payload);
      }
      return legacyRes;
    },
  };

  return { state, legacyRes };
}

async function resolveHandler(slug: string[]) {
  if (!Array.isArray(slug) || slug.length === 0) return null;
  if (!slug.every(isSafeSegment)) return null;

  const relativePath = path.join(...slug);
  const absolutePath = path.join(process.cwd(), 'api', `${relativePath}.js`);
  const normalizedApiRoot = path.normalize(path.join(process.cwd(), 'api') + path.sep);
  const normalizedTarget = path.normalize(absolutePath);

  if (!normalizedTarget.startsWith(normalizedApiRoot)) return null;

  try {
    const stat = await fs.stat(normalizedTarget);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }

  const moduleUrl = pathToFileURL(normalizedTarget).href;
  const mod = await dynamicImport(moduleUrl);
  if (typeof mod.default !== 'function') return null;
  return mod.default as (req: LegacyRequest, res: any) => Promise<unknown> | unknown;
}

async function handleLegacyApi(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  const handler = await resolveHandler(slug);
  if (!handler) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const url = new URL(request.url);
  const rawBody = request.method === 'GET' || request.method === 'HEAD' ? '' : await request.text();
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';

  const legacyReq: LegacyRequest = {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    query: toLegacyQuery(url),
    body: normalizeBody(rawBody, contentType),
  };

  const { state, legacyRes } = createLegacyResponse();

  try {
    await handler(legacyReq, legacyRes);
  } catch (error) {
    console.error('Legacy API handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  if (request.method === 'HEAD' || state.statusCode === 204 || state.statusCode === 304) {
    return new NextResponse(null, { status: state.statusCode, headers: state.headers });
  }

  return new NextResponse(state.body, {
    status: state.statusCode,
    headers: state.headers,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return handleLegacyApi(request, context);
}
