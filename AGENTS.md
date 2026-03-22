# AGENTS.md

This file provides comprehensive guidance to AI coding agents working with the almanya101 codebase.

## Project Overview

**almanya101** is a Next.js 15 web application for Turks living in or moving to Germany (https://almanya101.com).

**CRITICAL**: All user-facing content MUST be in Turkish (tr). Internal code can be in English.

## Build Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server (standalone)
npm run lint     # Run ESLint
```

Use `npm` (not bun) for all package operations.

## Route Groups Architecture

| Route Group | Purpose | Auth |
|-------------|---------|------|
| `app/(marketing)/` | Public marketing pages | No |
| `app/(site)/` | Interactive tools (banka-secim, sigorta-secim, maas-hesaplama, vatandaslik-testi) | No |
| `app/(devuser)/` | User dashboard area | Supabase Auth |

### DevUser Dashboard Pages (`app/(devuser)/devuser/`)
Uses `DevUserShell` component wrapper with `frameVariant` prop:
- `cvopt`, `disad`, `discussion`, `du`, `e1`, `e1a`, `e2`, `e2a`
- `gelismeler`, `list`, `news`, `profile-edit`, `promote`, `reset-password`
- `summary`, `survey`, `tavla`, `typing`, `ubt`, `vct`

## Key Patterns

### Server vs Client Components
- Default to Server Components (no `'use client'`)
- Add `'use client'` ONLY for hooks, browser APIs, or event handlers
- Interactive tools use pattern: `page.tsx` (Server) + `*Client.tsx` (Client)

### Class Merging
**ALWAYS** use `cn()` from `@/lib/utils/cn`:
```typescript
import { cn } from '@/lib/utils/cn';
className={cn('base-classes', isActive && 'conditional-class')}
```

### SEO Metadata
Every page MUST export metadata:
```typescript
import { createMetadata } from '@/lib/seo/metadata';
export const metadata = createMetadata({
  title: 'Sayfa Başlığı',  // Turkish
  description: 'Açıklama',
  path: '/sayfa-yolu',
});
```

## Supabase Integration (ACTIVE)

Three clients available in `lib/supabase/`:
- `client.ts` - Browser client (`createBrowserClient`)
- `server.ts` - Server client (`createServerClient` with cookies)
- `devuser.ts` - Special client for dashboard (`getDevUserClient()`)

API Routes: `/api/devuser/list/`, `/api/devuser-count/`, `/api/supabase-config/`

## Styling

### Google Color Palette (pre-configured in tailwind.config.ts)
- `bg-google-blue`, `text-google-blue` (#4285F4)
- `bg-google-red`, `text-google-red` (#EA4335)
- `bg-google-yellow`, `text-google-yellow` (#FBBC05)
- `bg-google-green`, `text-google-green` (#34A853)
- `bg-google-orange`, `text-google-orange` (#FF9500)

### Layout Patterns
- Container: `className="container"` (responsive padding built-in)
- Hero sections: `min-h-[80vh]`
- Content sections: `py-32 md:py-48`

## Component Organization

| Directory | Purpose |
|-----------|---------|
| `components/ui/` | Primitives (Button, Card, Container, Section, Badge) |
| `components/sections/` | Page sections (HeroSection, FAQ, FeatureGrid) |
| `components/layout/` | Header, Footer, Breadcrumb |
| `components/devuser/` | Dashboard shell (DevUserShell, DevUserCanvas) |
| `components/holiday/` | Holiday calculator components |
| `components/seo/` | JsonLd structured data |

## Utility Modules

| Module | Purpose |
|--------|---------|
| `lib/salary/` | Salary calculation (tax, social insurance, company car) |
| `lib/rehber/` | Guide data and types |
| `lib/utils/holiday-calculator.ts` | German holiday calculations |
| `lib/seo/metadata.ts` | SEO metadata utilities |

## Deployment

- Built with `output: 'standalone'` for Docker/Coolify
- Images: `unoptimized: true` (container environment)
