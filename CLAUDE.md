# CLAUDE.md

Claude Code guidance for this repository. The shared project rules are in [AGENTS.md](./AGENTS.md); read them first. See [docs/README.md](./docs/README.md) before using a dated plan or handover.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (must be clean before deploy/push)
npm run test:unit # Run Vitest unit tests
```

Use Node.js 20 and `npm` for all package operations. Do not use `bun` or `yarn`.

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

Tool page structure (shared shell in `components/tools/`):
1. `ToolHero`: eyebrow, `<h1>` (tool title), intro, stats; on the right a card with the always-visible "Nasıl çalışır?" numbered steps
2. `ToolPanel` (band panel) holding `ToolProgress` ("Soru X / Y") and `ToolQuestionCard` (`data-pw="tool-question-card"`) with `ToolOption` buttons, or the calculator form (`components/calc/*` fields)
3. Results in featured cards (`Card variant="featured"`) with hairline metric grids
4. `ToolInfoBand` (dark band: "Bu araç neden var?" / "Bu araç kim için?"), then sources/related tools, `ToolFaq` (accordion), legal note
Config-driven tools render all of this through `ToolPageScaffold` + `ToolExperience`. Tools are login-gated: `ToolPageScaffold` (config-driven) and `ToolAccessGate` (the hand-written tool pages) show `ToolIntroPanel` to anonymous visitors, with a `/giris?next=<path>` CTA, and the interactive tool only to signed-in users. Keep `data-pw` hooks and the texts e2e specs select on.

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
|- site/        # Public page blocks (Corteqs layout): SplitHero, PageHead, SectionHeader,
|               # IntentStrip, ServiceGrid/Tile, MediaCard, PhotoCard/Tile, ColorTile,
|               # Accordion, StepList, StatRow, DarkBand, CtaRow, FilterPanel, Chip, ArrowLink, tones
|- ui/          # Button (href/external/arrow), Card, Container (1280px), Section (tone), Badge
|- tools/       # Tool shell: ToolHero, ToolPanel, ToolProgress, ToolQuestionCard, ToolOption, ToolInfoBand, ToolFaq
|- calc/        # Form controls for calculator tools
|- home/        # Home page sections
|- news/        # News/article components (ArticleShell, cards, filters)
|- layout/      # Header, HeaderDrawer, Footer, Breadcrumb, LegalPage
|- devuser/     # DevUserShell, DevUserCanvas
|- holiday/     # Holiday calculator
`- seo/         # JsonLd structured data
```

Build public pages from `components/site/*` blocks; do not add one-off hero/section components.

Header behavior (`components/layout/Header.tsx`):
- Uses `public/almanya101header.png` as logo (transparent, works on the light page)
- Desktop: primary links from `HEADER_PRIMARY_LINKS` in `constants/navigation.ts`, WhatsApp, Giriş yap / Çıkış, "Üye Ol" button
- Mobile: "Menü" opens `HeaderDrawer` (categories from `constants/navigation.ts`; Escape, focus trap, scroll lock)
- Categories: Tools / Community / Content / Contact
- Header/Footer hide when `body[data-devuser]` is set
- Admin and devuser pages set `document.body.setAttribute('data-devuser', 'true')`

## Styling and Layout Conventions

Public site: light theme, firmascope colours, Corteqs layout. Tokens live in `constants/design-tokens.ts` (Tailwind reads them; `tests/design-tokens.test.ts` guards WCAG AA contrast).

- Surfaces: `bg-page` (default), `bg-white` cards, `bg-band` full-bleed bands, `bg-ink` (one dark band per page max)
- Text: `text-ink`, `text-muted`; hairlines `border-line`
- `brand-*` (cyan) is the only interactive colour: CTAs `bg-brand-700`, links `text-brand-700`, headline accent `text-brand-600`
- `alm-*` category colours are for icons, tints and markers only; use `TONE_STYLES` from `components/site/tones.ts` (text uses the `*-ink` tones)
- Radius: `rounded-tile` 6px, `rounded-card` 12px, `rounded-btn` 10px; `shadow-float` only on featured cards
- Layout: `Container` (max 1280px, 36px side padding), sections `py-16`
- One font: Plus Jakarta Sans (`font-sans`), headings `font-extrabold` with tight tracking
- No `bg-black`, glass, glow, gradients or `google-*` colours in public pages; emoji and em-dash not in page text

Legacy Google palette tokens (admin and devuser only; do not use in public pages):
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
- `NEXT_PUBLIC_SITE_URL` (default: `https://almanya101.de`)
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
