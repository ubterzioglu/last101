# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

* `npm run dev` - Start development server (localhost:3000)
* `npm run build` - Production build
* `npm run start` - Start production server
* `npm run lint` - Run ESLint

**Note:** Use `npm` for all package operations (not `bun` - package.json scripts use npm-style commands).

## Architecture Overview

**This is a Next.js 15 application using App Router with TypeScript and TailwindCSS.**

### Route Groups
- `app/(marketing)/` - Marketing pages sharing a common layout (almanyada-yasam, is-ilanlari, rehber, tatil, para-transferi, topluluk, hakkimizda, iletisim)
- `app/` - Root directory with root layout, home page, and interactive tool pages

### Interactive Tool Pages (outside marketing group)
These pages live directly under `app/` and use the `'use client'` pattern with a `*Client.tsx` component holding state, and a `page.tsx` as the Server Component wrapper:
- `app/banka-secim/` - Bank selection quiz (BankaClient.tsx + data.ts + types.ts)
- `app/sigorta-secim/` - Insurance selection quiz (same pattern)
- `app/vatandaslik-testi/` - Citizenship test
- `app/maas-hesaplama/` - Salary calculator
- `app/hizmet-rehberi/` - Service guide
- `app/belgeler/` - Documents
- `app/haberler/` - News
- `app/yazi-dizisi/` - Article series
- `app/software-hub/` - Software hub

### API Routes
- `app/api/health/` - Health check endpoint
- `app/api/supabase-config/` - Supabase configuration check
- `app/api/devuser/list/` - Dev user listing (development only)
- `app/api/devuser-count/` - Dev user count (development only)

### Component Organization
- `components/ui/` - Low-level reusable primitives (Button, Card, Container, Section, Badge)
- `components/sections/` - Page section components (HeroSection, FeatureGrid, FAQ, etc.)
- `components/layout/` - Layout components (Header, Footer, Breadcrumb)
- `components/seo/` - SEO components (JsonLd structured data)

### Key Architectural Patterns

**1. Server vs Client Components**
- Use Server Components by default (no `'use client'` directive)
- Mark with `'use client'` only when using hooks (useState, useEffect), browser APIs, or event handlers

**2. Class Merging with `cn()` Utility**
Always use the `cn()` utility from `@/lib/utils/cn` for merging Tailwind classes:
```typescript
import { cn } from '@/lib/utils/cn';
className={cn('base-classes', conditionalClass && 'conditional')}
```

**3. Google Color Palette**
Colors are defined in `tailwind.config.ts` and used throughout:
- `bg-google-blue`, `text-google-blue` (#4285F4)
- `bg-google-red`, `text-google-red` (#EA4335)
- `bg-google-yellow`, `text-google-yellow` (#FBBC05)
- `bg-google-green`, `text-google-green` (#34A853)
- `bg-google-orange`, `text-google-orange` (#FF9500)

**4. SEO Metadata System**
- Use `createMetadata()` from `@/lib/seo/metadata` for page metadata
- Use `createArticleMetadata()` for article/content pages
- Global metadata in `app/layout.tsx` includes Open Graph, Twitter Card, and robots settings
- Sitemap and robots.txt are auto-generated in `app/sitemap.ts` and `app/robots.ts`
- JSON-LD structured data from `@/components/seo/JsonLd` (Organization, WebSite, LocalBusiness, Article schemas)

### Path Aliases (tsconfig.json)
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/hooks/*` → `./hooks/*`
- `@/types/*` → `./types/*`
- `@/constants/*` → `./constants/*`
- `@/app/*` → `./app/*`

### Important Files

**Configuration:**
- `tailwind.config.ts` - Custom colors, spacing, animations, container padding
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript config with strict mode enabled

**Core Architecture:**
- `app/layout.tsx` - Root layout with fonts, metadata, header, footer, and skip link
- `app/(marketing)/layout.tsx` - Shared layout for marketing route group
- `lib/utils/cn.ts` - Tailwind class merging utility (clsx + tailwind-merge)
- `lib/utils/constants.ts` - Site constants (name, URL, locale, social links)
- `lib/seo/metadata.ts` - Metadata creation utilities
- `constants/navigation.ts` - Navigation items and footer links configuration
- `types/index.ts` - TypeScript type definitions

**Future Integrations (Placeholders):**
- `lib/supabase/client.ts` - Supabase browser client (returns null, not yet implemented)
- `lib/supabase/server.ts` - Supabase server client (returns null, not yet implemented)

### Deployment
- Built with `output: 'standalone'` for Docker/Coolify deployment
- `images.unoptimized: true` — Next.js image optimization is disabled (container environment)
- `lucide-react` is configured with `optimizePackageImports` for tree-shaking

## Language Requirement

All user-facing content MUST be in Turkish. Internal code (variables, comments) can be in English.

## Environment

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SITE_URL` - Site URL (default: https://almanya101.com)
- `NEXT_PUBLIC_SITE_NAME` - Site name (default: almanya101)

Future Supabase integration will require:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
