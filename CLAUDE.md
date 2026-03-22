# CLAUDE.md

This file is the single working guide for Claude Code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (must be clean before deploy/push)
```

Use `npm` for all package operations. Do not use `bun`.

## Project Snapshot

`almanya101` is a Next.js 15 application for Turks living in or moving to Germany.

- Stack: Next.js 15 (App Router), TypeScript, TailwindCSS, Supabase
- Deployment: Docker + Coolify with `output: 'standalone'` and `images.unoptimized: true`
- Repo: `github.com/ubterzioglu/last101` (main branch)
- Critical language rule: all user-facing content must be in Turkish; internal code can be in English

## Route Structure

| Route Group | URL Prefix | Purpose |
|---|---|---|
| `app/(marketing)/` | `/` | Public marketing pages |
| `app/(site)/` | `/<tool-name>` | Interactive tools |
| `app/(devuser)/` | `/devuser/<page>` | Supabase-auth dashboard |
| `app/admin/` | `/admin` | Password-protected admin panel |

Important: `(devuser)` is hidden in the URL.  
Code path: `app/(devuser)/devuser/survey/` -> URL: `/devuser/survey` (never `/devuser/devuser/survey`).

## Core Coding Rules

1. Class merging: always use `cn()` from `@/lib/utils/cn`.
2. SEO metadata: use `createMetadata()` from `@/lib/seo/metadata`.
3. Article pages: use `createArticleMetadata()` instead of `createMetadata()`.
4. Internal navigation: use `Link` from `next/link`; avoid raw `<a href>` for internal links.
5. Server/Client split: default to Server Components; add `'use client'` only for hooks/browser APIs/event handlers.
6. ESLint: do not add disable comments for `@typescript-eslint/no-explicit-any`; keep lint clean.

## Interactive Tools (`app/(site)/`)

Pattern: `page.tsx` (Server Component) + `*Client.tsx` (Client Component with `'use client'`).

Existing tool directories:
- `banka-secim/`
- `sigorta-secim/`
- `vatandaslik-testi/`
- `maas-hesaplama/`
- `vize-secim/`
- `para-transferi/`
- `stepstone-karsilastirma/`

Common tool-page card structure:
1. Title card (`border-google-blue`, non-clickable, `<h1>` only)
2. "How it works?" card (`border-google-blue`, collapsible with `showInfo`)
3. "Why this tool exists?" card (`border-google-green`, collapsible with `showWhy`)

## DevUser Dashboard (`app/(devuser)/devuser/`)

- Use `DevUserShell` with `frameVariant` prop (`default`, `compact`, `wide`)
- Typical page pattern: server `page.tsx` imports client `*Client.tsx`
- Pages include: `cvopt`, `disad`, `discussion`, `du`, `e1`, `e1a`, `e2`, `e2a`, `gelismeler`, `list`, `news`, `profile-edit`, `promote`, `reset-password`, `summary`, `survey`, `tavla`, `typing`, `ubt`, `vct`
- `ubt/page.tsx` redirects to `/admin`

## Admin Panel (`app/admin/`)

- `page.tsx`: full client component with password gate, code-rain canvas, 9 sections
- `layout.tsx`: sets `robots: { index: false, follow: false }`
- Grid layout: 5 columns desktop, 2 columns mobile
- Bottom actions should use `Link`, not `<a>`

Admin auth (`lib/admin/adminAuth.ts`):
- Simple mode: `ADMIN_PANEL_PASSWORD`
- DB mode: `admin_api_keys` table with PBKDF2 hash checks
- Rate limit: 12 attempts / 15 min, then 30 min block
- Service client uses `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

Admin API routes require `isAdminAuthorized(req)`:
- `admin-auth-verify/`
- `devuser-admin-list/`
- `devuser-admin-update/`
- `participant-admin-list/`
- `participant-admin-action/`
- `participant-admin-bracket-action/`
- `devuser-dis-admin-list/`
- `devuser-dis-admin-action/`
- `news-admin-list/`
- `news-admin-action/`
- `meeting-attendance-admin-list/`
- `meeting-attendance-reset/`

## Supabase Clients

Use the correct client for each runtime:

- Browser: `createClient` from `@/lib/supabase/client`
- Server: `createClient` from `@/lib/supabase/server` (async)
- DevUser: `getDevUserClient` from `@/lib/supabase/devuser` (async)

## Component Organization

```text
components/
|- ui/          # Button, Card, Container, Section, Badge
|- sections/    # HeroSection, FeatureGrid, FAQ
|- layout/      # Header, Footer, Breadcrumb
|- devuser/     # DevUserShell, DevUserCanvas
|- holiday/     # Holiday calculator
`- seo/         # JsonLd structured data
```

Header behavior (`components/layout/Header.tsx`):
- Uses `public/almanya101.png` as logo
- Drawer menu comes from `constants/navigation.ts`
- Categories: Tools / Community / Content / Contact
- Header/Footer hide when `body[data-devuser]` is set
- Admin and devuser pages set `document.body.setAttribute('data-devuser', 'true')`

## Styling and Layout Conventions

- Container: `className="container"` (responsive padding built in)
- Hero sections: `min-h-[80vh]`
- Content sections: `py-32 md:py-48`

Google palette tokens:
- `google-blue` / `bg-google-blue` / `text-google-blue` = `#4285F4`
- `google-red` / `bg-google-red` / `text-google-red` = `#EA4335`
- `google-yellow` / `bg-google-yellow` / `text-google-yellow` = `#FBBC05`
- `google-green` / `bg-google-green` / `text-google-green` = `#34A853`
- `google-orange` / `bg-google-orange` / `text-google-orange` = `#FF9500`

## SEO Usage

```typescript
import { createMetadata, createArticleMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({ title: '...', description: '...' });
// or
export const metadata = createArticleMetadata({ ... });
```

## Environment Variables

Do not commit real env values. `.env*` files are ignored.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (admin APIs)
- `ADMIN_PANEL_PASSWORD`
- `IP_HASH_SALT`
- `DEVUSER_AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL` (default: `https://almanya101.com`)
- `NEXT_PUBLIC_SITE_NAME` (default: `almanya101`)

## Path Aliases (`tsconfig.json`)

- `@/components/*` -> `./components/*`
- `@/lib/*` -> `./lib/*`
- `@/hooks/*` -> `./hooks/*`
- `@/types/*` -> `./types/*`
- `@/constants/*` -> `./constants/*`

## Important Files

- `tailwind.config.ts`
- `next.config.ts`
- `tsconfig.json`
- `constants/navigation.ts`
- `app/layout.tsx`
- `app/(devuser)/layout.tsx`
- `app/admin/page.tsx`
- `lib/admin/adminAuth.ts`
- `lib/utils/cn.ts`
- `lib/seo/metadata.ts`
- `lib/salary/`
- `lib/rehber/`
- `lib/utils/holiday-calculator.ts`
- `public/almanya101.png`

## Known Pitfalls

- Devuser route appears duplicated in code path, but URL is always `/devuser/<page>`
- Admin/devuser UI can render incorrectly if `body[data-devuser]` is not set
- Docker build can fail on ESLint issues; always run `npm run lint`
- Missing `SUPABASE_SERVICE_ROLE_KEY` breaks admin service mode
- Wrong service key causes "Invalid API key" errors
- Internal `<a href>` usage can fail lint/build; use `Link`
