# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project-Specific Rules

- **Language**: All user-facing content MUST be in Turkish (tr)
- **Target Audience**: Turks living in or moving to Germany

## Custom Tailwind Configuration

Google brand colors are configured in [`tailwind.config.ts`](tailwind.config.ts:11):
- `bg-google-blue` / `text-google-blue` → `#4285F4`
- `bg-google-red` / `text-google-red` → `#EA4335`
- `bg-google-yellow` / `text-google-yellow` → `#FBBC05`
- `bg-google-green` / `text-google-green` → `#34A853`
- `bg-google-orange` / `text-google-orange` → `#FF9500`

Custom container padding: `container` class applies responsive padding (1rem → 6rem)

## Key Utilities

- **Class merging**: Use `cn()` from [`@/lib/utils/cn`](lib/utils/cn.ts) for conditional Tailwind classes
- **Page metadata**: Use `createMetadata()` from [`@/lib/seo/metadata`](lib/seo/metadata.ts) for all pages
- **Article metadata**: Use `createArticleMetadata()` for blog/guide content pages

## Route Structure

Marketing pages use route group `app/(marketing)/` which shares a common layout. New public pages should go here.

## Section Spacing Pattern

Use `min-h-[80vh]` for hero sections and `py-32 md:py-48` for content sections.

## Supabase Placeholders

`lib/supabase/client.ts` and `lib/supabase/server.ts` are placeholder files - not yet implemented.
