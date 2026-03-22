# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

**almanya101** is a Turkish-language information portal for Turkish expats living in Germany. It provides guides on banking, insurance, salary calculation, citizenship tests, and a developer community platform.

- **Website**: https://almanya101.de
- **Language**: Turkish (tr)
- **Architecture**: Hybrid Next.js + Static HTML
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | Node.js |
| Language | TypeScript 5.9 (strict mode) |
| Frontend | Vanilla HTML/CSS/JS (static) |
| UI Library | React 19.2 (minimal usage) |
| Database | Supabase (PostgreSQL 17) |
| Auth | Supabase Auth |
| Analytics | Microsoft Clarity, GoatCounter, ContentSquare |
| Hosting | Vercel |

## Build/Lint/Test Commands

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # TypeScript type checking (no emit)
```

**No lint or test framework is configured.** Run `npm run typecheck` after modifying TypeScript files.

For local static file testing (without Next.js): `npx http-server -p 8080 --cors`

## Project Architecture

This is a **hybrid Next.js project** combining modern App Router with static HTML content.

```
almanya101/
├── app/                    # Next.js App Router (TypeScript)
│   ├── [...slug]/route.ts  # Static file server with path security
│   ├── api/[...slug]/route.ts  # Legacy API compatibility layer
│   ├── _lib/tracking.ts    # Analytics tracking utilities
│   ├── layout.tsx          # Root layout with tracking scripts
│   └── page.tsx            # Redirects to index.html
├── api/                    # Legacy Express-style API handlers (JavaScript/ESM)
│   ├── _*.js               # Private helper modules (not endpoints)
│   └── *.js                # API endpoints
├── supabase/               # Database migrations and Edge Functions
│   ├── migrations/         # SQL migration files
│   └── functions/          # Supabase Edge Functions (Deno)
├── shared-cards.js         # Client-side shared components (vanilla JS)
├── devuser/                # Developer community pages (static HTML)
├── admin/                  # Admin panel pages
├── banka/, maas/, vatandas/ # Static content directories
└── *.html, *.css, *.js     # Root-level static files
```

### Key Files

| File | Purpose |
|------|---------|
| `app/[...slug]/route.ts` | Static file server with path traversal protection |
| `app/api/[...slug]/route.ts` | Legacy API compatibility wrapper (Express-style → Next.js) |
| `shared-cards.js` | Client-side shared components (footer, contact, menu) |
| `next.config.ts` | Static directory mappings via `STATIC_TRACE_GLOBS` |

## Code Style Guidelines

### TypeScript (app/**/*.ts, app/**/*.tsx)

```typescript
import type { ReactNode } from 'react';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CustomType = { method: string; headers: Record<string, string> };

async function handler(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  return NextResponse.json({ data: 'value' });
}

export async function GET(request: NextRequest) {
  return handler(request);
}
```

- Use `import type` for type-only imports
- Explicit return types on exported async functions
- Named exports for route handlers (GET, POST, PUT, PATCH, DELETE)
- Declare runtime constants at module level: `export const runtime = 'nodejs';`
- Path alias available: `@/*` maps to root directory

### JavaScript API Handlers (api/*.js)

```javascript
import { getSupabaseUserFromRequest } from './_supabase-user.js';

const ALLOWED_ORIGINS = new Set(['https://almanya101.de', 'http://localhost:3000']);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('handler failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

- ESM syntax with `.js` extension in imports
- Files prefixed with `_` are helper modules (not direct endpoints)
- Legacy Express-style signature: `function(req, res)`
- Always include `.js` extension in relative imports
- Validate method first, then origin, then auth
- Wrap main logic in try/catch

### Imports Order

1. Node.js built-ins (`node:fs`, `node:path`, `node:url`)
2. External packages (`next`, `react`)
3. Internal modules (relative imports with `./` or `../`)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Functions | camelCase | `sanitizeString`, `buildCandidatePaths` |
| Types/Interfaces | PascalCase | `LegacyRequest`, `LegacyResponseState` |
| Constants | SCREAMING_SNAKE_CASE | `BLOCKED_TOP_LEVEL`, `ALLOWED_ORIGINS` |
| Private helpers | underscore prefix | `_supabase-user.js` |
| API files | kebab-case | `devuser-register.js` |

### Error Handling

```javascript
if (!body) return res.status(400).json({ error: 'Invalid body' });
if (!auth) return res.status(401).json({ error: 'Unauthorized' });

catch (error) {
  console.error('operation failed:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

## Security Patterns

### Path Traversal Protection

```typescript
const BLOCKED_TOP_LEVEL = new Set(['.git', 'node_modules', 'api', 'supabase']);
if (BLOCKED_TOP_LEVEL.has(topLevelDir)) return null;
if (part.includes('/') || part.includes('\\')) return null;
```

### Origin Validation & Auth

```javascript
const ALLOWED_ORIGINS = new Set(['https://almanya101.de']);
const origin = normalizeOrigin(req.headers.origin);
if (origin && !ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ error: 'Unauthorized origin' });

const auth = await getSupabaseUserFromRequest(req);
if (!auth) return res.status(401).json({ error: 'Unauthorized' });
// auth.user.id and auth.user.email available
```

### Input Sanitization

```javascript
function sanitizeString(value, maxLength = 500) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function sanitizeArray(value, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, maxItems);
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}
```

## Database (Supabase)

### Connection

Uses Supabase JavaScript client with two access patterns:

1. **Service Role** (server-side admin operations):
   ```javascript
   const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
   ```

2. **Anon Key** (client-side with RLS):
   ```javascript
   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```

### Key Tables

| Table | Purpose |
|-------|---------|
| `devuser` | Developer community profiles |
| `bookmark_submissions` | User-submitted bookmarks |
| `community_support_questions/answers` | Q&A system |
| `vatandaslik_sorulari` | Citizenship test questions |
| `event_e1/e2_*` | Tournament/event tables |
| `newsletter_subscriptions` | Email subscriptions |

### Row Level Security (RLS)

All tables have RLS enabled. Policies include:
- Public read for searchable profiles
- Authenticated users can update own records
- Service role bypasses RLS for admin operations

### Migrations

Located in `supabase/migrations/`. Naming convention: `YYYYMMDDhhmmss_description.sql`

Run migrations with: `supabase db push`

## Static Files

- HTML/CSS/JS files in root directories are served directly
- No build step for static content
- Asset paths resolved dynamically by `shared-cards.js`
- Add new directories to `STATIC_TRACE_GLOBS` in `next.config.ts`

## Operational Notes

- Admin panel canonical URL is `/ubt.html`
- Keep `devuser/ubt.html` as a compatibility redirect to `/ubt.html` unless intentionally removing old links
- Meeting attendance admin reads must go through a server-side admin API, not client-side anon Supabase queries
- Do not enable ContentSquare by default; only load it when `CONTENTSQUARE_SCRIPT_URL` or `NEXT_PUBLIC_CONTENTSQUARE_SCRIPT_URL` is explicitly configured
- For meeting attendance schema changes, run `supabase db push` and verify `meeting_attendance` plus related views exist remotely before deploying frontend-only changes

### Client-Side Components (shared-cards.js)

The `shared-cards.js` file provides shared UI components for static pages:

```javascript
// Placeholders in HTML:
<div data-shared-card="footer"></div>
<div data-shared-card="contact"></div>

// Menu is auto-initialized
<button data-shared-menu="true">Menu</button>
```

## Environment Variables

Required in `.env` (never commit):

```bash
# Supabase
SUPABASE_URL="https://project-id.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."

# App Security
DEVUSER_AUTH_SECRET="..."
IP_HASH_SALT="..."

# Optional Integrations
GOOGLE_PLACES_API_KEY="..."
NEXT_PUBLIC_CLARITY_PROJECT_ID="..."
```

## API Endpoints

### Legacy API (via `/api/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/supabase-config` | GET | Returns Supabase config to frontend |
| `/api/devuser-register` | POST | Register developer profile |
| `/api/devuser-list` | GET | List developer profiles |
| `/api/bookmarks-submit` | POST | Submit bookmark |
| `/api/bookmarks-list` | GET | List bookmarks |
| `/api/cs-question-submit` | POST | Submit Q&A question |
| `/api/cs-answer-submit` | POST | Submit Q&A answer |
| `/api/newsletter-subscribe` | POST | Subscribe to newsletter |

### Edge Functions

| Function | Purpose |
|----------|---------|
| `get-users` | Secure user list with filtering |
| `register-user` | User registration handler |

## Deployment

- **Platform**: Vercel
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Vercel Configuration (vercel.json)

- CORS headers for `/api/*`
- Content Security Policy headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

## Development Workflow

1. Start dev server: `npm run dev`
2. Make changes
3. Run typecheck: `npm run typecheck`
4. Test locally
5. Deploy to Vercel (auto-deploys from git)

## Do Not

- Commit `.env` files
- Expose service role keys in frontend code
- Add comments in code (code should be self-documenting)
- Use `any` type in TypeScript
- Skip input validation in API handlers
- Add new static directories without updating `STATIC_TRACE_GLOBS`
