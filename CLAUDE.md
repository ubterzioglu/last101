# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

* `npm run dev` - Start development server (localhost:3000)
* `npm run build` - Production build
* `npm run start` - Start production server
* `npm run lint` - Run ESLint

**Note:** Use `npm` for all package operations (not `bun`).

## Architecture Overview

**This is a Next.js 15 application using App Router with TypeScript and TailwindCSS.**

### Route Groups
- `app/(marketing)/` - Marketing pages sharing a common layout
- `app/(site)/` - Interactive tools (banka-secim, sigorta-secim, maas-hesaplama, vatandaslik-testi)
- `app/(devuser)/` - Dashboard area with Supabase Auth

### Interactive Tool Pages (site group)
Pattern: `page.tsx` (Server) + `*Client.tsx` (Client with 'use client')
- `app/(site)/banka-secim/` - Bank selection quiz
- `app/(site)/sigorta-secim/` - Insurance selection quiz
- `app/(site)/vatandaslik-testi/` - Citizenship test
- `app/(site)/maas-hesaplama/` - Salary calculator

### DevUser Dashboard Pages (`app/(devuser)/devuser/`)
Uses `DevUserShell` component wrapper with `frameVariant` prop:
- `cvopt`, `disad`, `discussion`, `du`, `e1`, `e1a`, `e2`, `e2a`
- `gelismeler`, `list`, `news`, `profile-edit`, `promote`, `reset-password`
- `summary`, `survey`, `tavla`, `typing`, `ubt`, `vct`

### API Routes
- `app/api/health/` - Health check endpoint
- `app/api/supabase-config/` - Supabase configuration for client
- `app/api/devuser/list/` - Dev user listing
- `app/api/devuser-count/` - Dev user count

### Component Organization
- `components/ui/` - Low-level reusable primitives (Button, Card, Container, Section, Badge)
- `components/sections/` - Page section components (HeroSection, FeatureGrid, FAQ)
- `components/layout/` - Layout components (Header, Footer, Breadcrumb)
- `components/devuser/` - Dashboard shell (DevUserShell, DevUserCanvas)
- `components/holiday/` - Holiday calculator components
- `components/seo/` - SEO components (JsonLd structured data)

### Key Architectural Patterns

**1. Server vs Client Components**
- Use Server Components by default (no `'use client'` directive)
- Mark with `'use client'` only when using hooks, browser APIs, or event handlers

**2. Class Merging with `cn()` Utility**
Always use the `cn()` utility from `@/lib/utils/cn`:
```typescript
import { cn } from '@/lib/utils/cn';
className={cn('base-classes', conditionalClass && 'conditional')}
```

**3. Google Color Palette**
Colors are defined in `tailwind.config.ts`:
- `bg-google-blue`, `text-google-blue` (#4285F4)
- `bg-google-red`, `text-google-red` (#EA4335)
- `bg-google-yellow`, `text-google-yellow` (#FBBC05)
- `bg-google-green`, `text-google-green` (#34A853)
- `bg-google-orange`, `text-google-orange` (#FF9500)

**4. SEO Metadata System**
- Use `createMetadata()` from `@/lib/seo/metadata` for page metadata
- Use `createArticleMetadata()` for article/content pages

### Supabase Integration (ACTIVE)

Three clients available in `lib/supabase/`:
- `client.ts` - Browser client (`createBrowserClient`)
- `server.ts` - Server client (`createServerClient` with cookies)
- `devuser.ts` - Special client for dashboard (`getDevUserClient()`)

### Path Aliases (tsconfig.json)
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/hooks/*` → `./hooks/*`
- `@/types/*` → `./types/*`
- `@/constants/*` → `./constants/*`

### Important Files

**Configuration:**
- `tailwind.config.ts` - Custom colors, spacing, container padding
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript config with strict mode

**Core Architecture:**
- `app/layout.tsx` - Root layout with fonts, metadata, header, footer
- `app/(devuser)/layout.tsx` - Dashboard layout with DevUserCanvas
- `lib/utils/cn.ts` - Tailwind class merging utility
- `lib/seo/metadata.ts` - Metadata creation utilities
- `lib/salary/` - Salary calculation modules
- `lib/rehber/` - Guide data and types
- `lib/utils/holiday-calculator.ts` - German holiday calculations

### Deployment
- Built with `output: 'standalone'` for Docker/Coolify deployment
- `images.unoptimized: true` — Next.js image optimization disabled

## Language Requirement

All user-facing content MUST be in Turkish. Internal code can be in English.

## Environment

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SITE_URL` - Site URL (default: https://almanya101.com)
- `NEXT_PUBLIC_SITE_NAME` - Site name (default: almanya101)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
