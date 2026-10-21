# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

**almanya101** - Next.js 15 app for Turks living in/moving to Germany (https://almanya101.de).

Start with [README.md](./README.md) for setup and [docs/README.md](./docs/README.md) for document status. Dated plans and handovers are historical context unless verified against code.

**CRITICAL**: All user-facing content MUST be in Turkish (tr). Internal code can be in English.

## Non-Obvious Patterns

### Custom Utilities (USE INSTEAD of standard approaches)
- **Class merging**: Always use `cn()` from `@/lib/utils/cn` - never use template literals directly
- **SEO Metadata**: Every page MUST export metadata using `createMetadata()` from `@/lib/seo/metadata`
- **Article pages**: Use `createArticleMetadata()` instead of `createMetadata()`
- **Internal links**: Use `Link` from `next/link`

### Route Groups & Auth
| Route Group | Purpose | Auth |
|-------------|---------|------|
| `app/(marketing)/` | Public marketing pages | No |
| `app/(site)/` | Interactive tools | No |
| `app/(devuser)/` | User dashboard | Supabase Auth |
| `app/admin/` | Admin panel | Admin authorization |

`app/(devuser)/devuser/<page>` maps to `/devuser/<page>`; route-group names do not appear in URLs.

### DevUser Dashboard Pattern
- Dashboard pages use `DevUserShell` wrapper with `frameVariant` prop
- Pattern: `page.tsx` (Server) imports `*Client.tsx` (Client with 'use client')
- Available frameVariants: `'default' | 'compact' | 'wide'`

### Three Supabase Clients (different purposes!)
- Browser: `import { createClient } from '@/lib/supabase/client'`
- Server: `import { createClient } from '@/lib/supabase/server'` (async)
- DevUser: `import { getDevUserClient } from '@/lib/supabase/devuser'` (async)

### Pre-configured Google Colors
`bg-google-blue`, `text-google-red`, `bg-google-yellow`, `text-google-green`, `bg-google-orange`

### Layout Patterns
- Container: `className="container"` (responsive padding built-in)
- Hero sections: `min-h-[80vh]`, content sections: `py-32 md:py-48`

## Build Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server (standalone)
npm run lint     # Run ESLint
npm run test:unit # Run Vitest
```

Use Node.js 20 and `npm` (not bun or yarn) for all package operations. Keep real credentials in `.env.local` or deployment secrets; `.env.example` is a template.

## Deployment

- Built with `output: 'standalone'` for Docker/Coolify
- Images: `unoptimized: true` (container environment)
