# Architect Mode Rules

## Non-Obvious Architectural Constraints

### Route Structure
- `app/(marketing)/` - Public marketing pages with shared layout
- `app/(site)/` - Interactive tools (banka-secim, sigorta-secim, maas-hesaplama, vatandaslik-testi)
- `app/(devuser)/` - Dashboard area with DevUserShell wrapper
- Root `app/layout.tsx` handles global SEO (JSON-LD, default metadata)

### Three Supabase Clients (CRITICAL)
- `lib/supabase/client.ts` - Browser client for client components
- `lib/supabase/server.ts` - Server client with cookie-based auth
- `lib/supabase/devuser.ts` - Special client that fetches config via `/api/supabase-config/` (no env vars directly)

### Component Organization
- `components/layout/` - Header, Footer, Breadcrumb
- `components/ui/` - Reusable primitives (Button, Card, Container, Section)
- `components/sections/` - Page-specific sections (HeroSection, FAQ, FeatureGrid)
- `components/devuser/` - Dashboard shell (DevUserShell, DevUserCanvas, DevUserPageController)

### Deployment
- Built with `output: 'standalone'` for Docker/Coolify
- Images: `unoptimized: true` (container environment)
