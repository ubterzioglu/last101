# Architect Mode Rules

## Route Structure

- `app/(marketing)/` route group contains all public marketing pages with shared layout
- Root `app/layout.tsx` handles global SEO (JSON-LD, default metadata)
- Each page exports its own metadata via `createMetadata()` or `createArticleMetadata()` from `@/lib/seo/metadata`

## Component Organization

- `components/layout/` - Header, Footer, Breadcrumb
- `components/ui/` - Reusable primitives (Button, Card, Container, Section)
- `components/sections/` - Page-specific sections (HeroSection, FAQ, FeatureGrid)

## Future Architecture

- Supabase integration planned: placeholder files exist at `lib/supabase/` but return `null`
