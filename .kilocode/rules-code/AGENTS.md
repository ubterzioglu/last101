# Code Mode Rules

## Component Patterns

- Use `cn()` from `@/lib/utils/cn` for ALL conditional className merging - never use template literals directly
- Import icons from `lucide-react` (already installed)
- Components use named exports: `export function ComponentName()`

## SEO Requirements

- Every page MUST export metadata using `createMetadata()` from `@/lib/seo/metadata`
- Article/guide pages use `createArticleMetadata()` instead

## Styling Conventions

- Public site uses the light design tokens in `constants/design-tokens.ts` (`bg-page`, `text-ink`, `border-line`, `brand-*`, `alm-*`); `google-*` colours are legacy, admin/devuser only
- Build pages from `components/site/*` blocks; use `Container` (max 1280px) and `Section` (`py-16`) from `components/ui`
- See CLAUDE.md "Styling and Layout Conventions" for the full rules

## DevUser Dashboard Pattern

- Dashboard pages use `DevUserShell` wrapper with `frameVariant` prop
- Pattern: `page.tsx` (Server) imports `*Client.tsx` (Client with 'use client')
- Available frameVariants: `'default' | 'compact' | 'wide'`

## Supabase Clients

- Browser: `import { createClient } from '@/lib/supabase/client'`
- Server: `import { createClient } from '@/lib/supabase/server'` (async)
- DevUser: `import { getDevUserClient } from '@/lib/supabase/devuser'` (async)
