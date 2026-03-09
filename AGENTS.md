# Almanya101 - AI Agent Guide

This document provides essential information for AI coding agents working on the Almanya101 project.

## Project Overview

**Almanya101** is a comprehensive information guide, job listing, and community platform for Turks living in or planning to move to Germany. The website is built as a modern, SEO-optimized, and accessible Next.js application targeting Turkish-speaking users in Germany.

- **Primary Language**: Turkish (tr)
- **Target Country**: Germany (DE)
- **Site URL**: https://almanya101.com

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.4 | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.7.2 | Type-safe development |
| TailwindCSS | 3.4.17 | Utility-first CSS framework |
| Lucide React | 0.468.0 | Icon library |
| clsx + tailwind-merge | latest | CSS class utilities |

### Build Tools
- **Package Manager**: npm
- **Bundler**: Next.js built-in (Turbopack in dev)
- **Linter**: ESLint (Next.js config)
- **CSS**: PostCSS + Autoprefixer

## Project Structure

```
almanya101/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Route group for marketing pages
│   │   ├── almanyada-yasam/  # Life in Germany page
│   │   ├── hakkimizda/       # About Us page
│   │   ├── iletisim/         # Contact page
│   │   ├── is-ilanlari/      # Job Listings page
│   │   ├── rehber/           # Guides page
│   │   ├── topluluk/         # Community page
│   │   └── layout.tsx        # Marketing layout wrapper
│   ├── layout.tsx            # Root layout (global)
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   ├── sitemap.ts            # Sitemap generator
│   ├── robots.ts             # Robots.txt generator
│   └── not-found.tsx         # 404 page
├── components/
│   ├── layout/               # Layout components (Header, Footer, Breadcrumb)
│   ├── ui/                   # Reusable UI components (Button, Card, etc.)
│   ├── sections/             # Page section components (Hero, FAQ, etc.)
│   └── seo/                  # SEO components (JsonLd)
├── lib/
│   ├── seo/                  # SEO utilities (metadata.ts)
│   ├── supabase/             # Supabase client placeholders
│   └── utils/                # Utility functions (cn.ts, constants.ts)
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── constants/                # Constants (navigation, colors)
└── public/                   # Static assets
    └── images/
```

## Build and Development Commands

```bash
# Development server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

The development server runs on http://localhost:3000 by default.

## Code Style Guidelines

### Component Architecture

1. **Use Server Components by Default**
   - All components are server components unless marked with `'use client'`
   - Only add `'use client'` when using:
     - React hooks (useState, useEffect, etc.)
     - Browser APIs
     - Event handlers

2. **Component File Pattern**
   ```tsx
   // components/ui/Button.tsx
   import { cn } from '@/lib/utils/cn';
   
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     // ...
   }
   
   export function Button({ ... }: ButtonProps) {
     // implementation
   }
   ```

3. **Named Exports**
   - Use named exports for all components: `export function ComponentName()`
   - Exception: Use `forwardRef` when ref forwarding is needed

### Import Conventions

Use path aliases defined in `tsconfig.json`:
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/hooks/*` → `./hooks/*`
- `@/types/*` → `./types/*`
- `@/constants/*` → `./constants/*`

### TypeScript Guidelines

- **Strict mode enabled**: All strict TypeScript options are active
- **Type all props**: Define interfaces for all component props
- **Use type over interface** for simple type definitions (see `types/index.ts`)

### Naming Conventions

- **Components**: PascalCase (`HeroSection.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Types**: PascalCase with descriptive names

## Styling Guidelines

### Google Color Palette

The project uses Google's brand colors as the primary palette:

| Color | Hex | Tailwind Class |
|-------|-----|----------------|
| Blue | `#4285F4` | `bg-google-blue`, `text-google-blue` |
| Red | `#EA4335` | `bg-google-red`, `text-google-red` |
| Yellow | `#FBBC05` | `bg-google-yellow`, `text-google-yellow` |
| Green | `#34A853` | `bg-google-green`, `text-google-green` |
| Orange | `#FF9500` | `bg-google-orange`, `text-google-orange` |

### Tailwind CSS Patterns

1. **Use the `cn()` utility** for conditional classes:
   ```tsx
   import { cn } from '@/lib/utils/cn';
   
   className={cn('base-classes', variantClass, className)}
   ```

2. **Responsive Design** (Mobile-first):
   ```tsx
   // Base = mobile, then larger screens
   className="px-4 md:px-8 lg:px-12"
   ```

3. **Section Spacing Pattern**:
   - Use `min-h-[80vh]` for full-viewport sections
   - Use generous padding: `py-32 md:py-48`
   - Use gradient overlays for transitions between colored sections

### Accessibility Requirements

- All interactive elements must have proper ARIA labels
- Include "Skip to main content" link (already in root layout)
- Maintain keyboard navigation support
- Color contrast must meet WCAG AA standards
- Use semantic HTML elements

## SEO and Metadata

### Page Metadata Pattern

Every page must export metadata using the helper:

```tsx
import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Page Title in Turkish',
  description: 'Page description in Turkish',
  path: '/page-path',
});
```

### Structured Data

The root layout includes JSON-LD structured data:
- `OrganizationJsonLd` - Organization schema
- `WebSiteJsonLd` - Website schema
- `LocalBusinessJsonLd` - Local business targeting Germany

For article pages, use `ArticleJsonLd` component.

## Page Routes

| Route | Description | Priority |
|-------|-------------|----------|
| `/` | Home page | 1.0 |
| `/almanyada-yasam` | Life in Germany guide | 0.9 |
| `/is-ilanlari` | Job listings | 0.9 |
| `/rehber` | Guides/Articles | 0.9 |
| `/topluluk` | Community | 0.8 |
| `/hakkimizda` | About Us | 0.7 |
| `/iletisim` | Contact | 0.7 |

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://almanya101.com
NEXT_PUBLIC_SITE_NAME=Almanya101

# Future Supabase integration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## UI Components

### Available Components

**Layout Components** (`components/layout/`):
- `Header` - Sticky header with mobile drawer menu
- `Footer` - Site footer with links
- `Breadcrumb` - Navigation breadcrumb (placeholder)

**UI Components** (`components/ui/`):
- `Button` - Multi-variant button with Link support
- `Card` - Card container component
- `Container` - Max-width container with responsive padding
- `Section` - Section wrapper with contained option
- `Badge` - Status/label badges

**Section Components** (`components/sections/`):
- `HeroSection` - Full-width hero with background support
- `ArticleCard` / `ArticleGrid` - Article display components
- `CTASection` - Call-to-action section
- `ContactChannels` - Contact method grid
- `FAQ` - FAQ accordion
- `FeatureGrid` - Feature display grid
- `InfoBlock` / `InfoGrid` - Information display
- `JobCard` - Job listing card
- `NewsCarousel` - News carousel/marquee

## Supabase Integration (Future)

The project includes placeholder files for Supabase integration:
- `lib/supabase/client.ts` - Browser client (not implemented)
- `lib/supabase/server.ts` - Server client (not implemented)

When implementing:
1. Install `@supabase/ssr` package
2. Configure environment variables
3. Implement the client functions

## Testing

Currently, the project does not have automated tests configured. When adding tests:
- Use Vitest or Jest for unit tests
- Use Playwright for E2E tests
- Test accessibility with axe-core

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Build Output

The project outputs to `.next/` directory. Static assets are served from `public/`.

## Common Patterns

### Creating a New Page

1. Create directory in `app/(marketing)/` or `app/`
2. Add `page.tsx` with:
   - Metadata export using `createMetadata()`
   - Page component as default export
3. Use `HeroSection` for page header
4. Use `Section` with `contained` prop for content areas

### Adding a New Component

1. Determine category: `layout/`, `ui/`, or `sections/`
2. Create file with PascalCase name
3. Define props interface
4. Export component as named export
5. Use `cn()` utility for class merging
6. Add types to `types/index.ts` if shared

### Using Icons

Import from Lucide React:
```tsx
import { Menu, X, Phone } from 'lucide-react';
```

## Security Considerations

- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- Never commit `.env.local` to git
- Validate all user inputs (when forms are added)
- Use `rel="noopener noreferrer"` for external links

## Notes for AI Agents

1. **Language**: All user-facing content must be in Turkish
2. **Colors**: Stick to the Google color palette for consistency
3. **Responsive**: Design mobile-first, test on small screens
4. **SEO**: Always include proper metadata for new pages
5. **Performance**: Use Next.js Image component for images when possible
6. **Accessibility**: Run axe DevTools to check for issues
