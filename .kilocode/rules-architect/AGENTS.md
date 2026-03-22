# Architect Mode Rules

## Route Structure

- `app/(marketing)/` - Public marketing pages with shared layout
- `app/(site)/` - Interactive tools (banka-secim, sigorta-secim, maas-hesaplama, vatandaslik-testi)
- `app/(devuser)/` - Dashboard area with DevUserShell wrapper
- Root `app/layout.tsx` handles global SEO (JSON-LD, default metadata)

## Component Organization

- `components/layout/` - Header, Footer, Breadcrumb
- `components/ui/` - Reusable primitives (Button, Card, Container, Section)
- `components/sections/` - Page-specific sections (HeroSection, FAQ, FeatureGrid)
- `components/devuser/` - Dashboard shell (DevUserShell, DevUserCanvas, DevUserPageController)
- `components/holiday/` - Holiday calculator components
- `components/para-transferi/` - Money transfer components

## Supabase Architecture

- `lib/supabase/client.ts` - Browser client for client components
- `lib/supabase/server.ts` - Server client with cookie-based auth
- `lib/supabase/devuser.ts` - Special client for dashboard (fetches config via API)

## Utility Libraries

- `lib/salary/` - Salary calculation modules (tax, social insurance, company car)
- `lib/rehber/` - Guide data and types
- `lib/utils/holiday-calculator.ts` - German holiday calculations
- `lib/seo/metadata.ts` - SEO metadata utilities

## Deployment

- Built with `output: 'standalone'` for Docker/Coolify
- Images: `unoptimized: true` (container environment)
