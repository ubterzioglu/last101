# AGENTS.md

This file provides guidance to AI coding agents when working with the almanya101 codebase.

---

## Project Overview

**almanya101** is a comprehensive information guide, job listings, and community platform for Turks living in or planning to move to Germany. The platform provides resources on life in Germany, visa processes, job searching, health insurance, and community connections.

- **Target Audience**: Turks living in or moving to Germany
- **Language**: All user-facing content MUST be in Turkish (tr)
- **Domain**: https://almanya101.com

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.7.x | Type-safe development |
| TailwindCSS | 3.4.x | Utility-first CSS framework |
| Lucide React | 0.468.x | Icon library |
| ESLint | 8.x | Code linting |

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

---

## Project Structure

```
almanya101/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing route group (shared layout)
│   │   ├── almanyada-yasam/      # Life in Germany page
│   │   ├── hakkimizda/           # About Us page
│   │   ├── iletisim/             # Contact page
│   │   ├── is-ilanlari/          # Job Listings page
│   │   ├── rehber/               # Guides page
│   │   ├── topluluk/             # Community page
│   │   └── layout.tsx            # Marketing layout wrapper
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout (SEO, fonts, header, footer)
│   ├── not-found.tsx             # 404 page
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # robots.txt generator
│   └── sitemap.ts                # sitemap.xml generator
├── components/
│   ├── layout/                   # Layout components (Header, Footer, Breadcrumb)
│   ├── sections/                 # Page section components (Hero, FAQ, Cards, etc.)
│   ├── seo/                      # SEO components (JsonLd)
│   └── ui/                       # Reusable UI components (Button, Card, Container, Section)
├── constants/
│   ├── colors.ts                 # Google color palette constants
│   └── navigation.ts             # Navigation links configuration
├── hooks/
│   └── use-mobile-menu.ts        # Mobile menu state hook
├── lib/
│   ├── seo/
│   │   └── metadata.ts           # SEO metadata utilities
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client (placeholder)
│   │   └── server.ts             # Supabase server client (placeholder)
│   └── utils/
│       ├── cn.ts                 # Tailwind class merging utility
│       └── constants.ts          # Site constants (name, URL, social links)
├── types/
│   └── index.ts                  # TypeScript type definitions
├── public/                       # Static assets
│   └── images/
│       └── backgrounds/          # Hero section background images
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # TailwindCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Key Conventions and Patterns

### 1. Component Architecture

- **Server Components by Default**: Use Server Components unless client-side interactivity is required
- **Client Components**: Mark with `'use client'` when using hooks, browser APIs, or event handlers
- **Component Organization**:
  - `components/ui/` - Low-level reusable UI primitives (Button, Card, Container)
  - `components/sections/` - Page section components (HeroSection, FeatureGrid)
  - `components/layout/` - Layout components (Header, Footer)
  - `components/seo/` - SEO-related components

### 2. Styling with TailwindCSS

**Always use the `cn()` utility for class merging:**

```typescript
import { cn } from '@/lib/utils/cn';

// ❌ DON'T: Direct string concatenation
className={`px-4 py-2 ${isActive ? 'bg-blue-500' : ''}`}

// ✅ DO: Use cn() utility
className={cn('px-4 py-2', isActive && 'bg-blue-500')}
```

**Section Spacing Pattern:**
- Hero sections: `min-h-screen` or `min-h-[80vh]`
- Content sections: `py-32 md:py-48`

### 3. Google Color Palette

The project uses Google's official brand colors:

| Color | Hex | Tailwind Class |
|-------|-----|----------------|
| Blue | `#4285F4` | `bg-google-blue`, `text-google-blue` |
| Red | `#EA4335` | `bg-google-red`, `text-google-red` |
| Yellow | `#FBBC05` | `bg-google-yellow`, `text-google-yellow` |
| Green | `#34A853` | `bg-google-green`, `text-google-green` |
| Orange | `#FF9500` | `bg-google-orange`, `text-google-orange` |

### 4. Container Padding

The `container` class applies responsive padding:
- Default: `1rem`
- sm: `2rem`
- lg: `4rem`
- xl: `5rem`
- 2xl: `6rem`

### 5. SEO Metadata

**Always use `createMetadata()` for page metadata:**

```typescript
import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Sayfa Başlığı',  // Page title (site name appended automatically)
  description: 'Sayfa açıklaması',  // Meta description
  path: '/sayfa-yolu',  // URL path
});
```

**For article/blog content, use `createArticleMetadata()`:**

```typescript
import { createArticleMetadata } from '@/lib/seo/metadata';

export const metadata = createArticleMetadata({
  title: 'Makale Başlığı',
  description: 'Makale açıklaması',
  publishedTime: '2025-01-15',
  modifiedTime: '2025-01-20',
  authors: ['Yazar Adı'],
  tags: ['etiket1', 'etiket2'],
  path: '/rehber/makale-slug',
});
```

### 6. TypeScript Path Aliases

Use these import aliases (configured in `tsconfig.json`):

```typescript
@import/*        → ./*
@/components/*   → ./components/*
@/lib/*          → ./lib/*
@/hooks/*        → ./hooks/*
@/types/*        → ./types/*
@/constants/*    → ./constants/*
@/app/*          → ./app/*
@/public/*       → ./public/*
```

### 7. Route Groups

Marketing pages are organized under `app/(marketing)/` which shares a common layout. New public pages should typically go here.

---

## UI Components Usage

### Button Component

```typescript
import { Button } from '@/components/ui/Button';

// Variants: primary, secondary, danger, success, outline, ghost
// Sizes: sm, md, lg, xl

<Button variant="primary" size="md">Tıkla</Button>
<Button variant="secondary" size="lg" asChild href="/sayfa">Link</Button>
```

### Container Component

```typescript
import { Container } from '@/components/ui/Container';

// Sizes: sm, md, lg, xl, full
<Container size="xl">İçerik</Container>
```

### Section Component

```typescript
import { Section } from '@/components/ui/Section';

// Use contained={false} for full-width backgrounds
<Section contained>
  <h2>Başlık</h2>
</Section>
```

---

## Accessibility Requirements

The project follows WCAG AA guidelines:

1. **Semantic HTML** - Use proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
2. **ARIA Labels** - Add to interactive elements without visible text
3. **Keyboard Navigation** - All interactive elements must be keyboard accessible
4. **Color Contrast** - Maintain 4.5:1 contrast ratio for text
5. **Skip Link** - Root layout includes "Ana içeriğe atla" skip link
6. **Alt Text** - All images must have descriptive alt text

---

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://almanya101.com
NEXT_PUBLIC_SITE_NAME=Almanya101

# Future Supabase integration (not yet implemented)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## SEO Guidelines

### JSON-LD Structured Data

Use predefined components from `@/components/seo/JsonLd`:

```typescript
import { OrganizationJsonLd, ArticleJsonLd } from '@/components/seo/JsonLd';

// In layout: Organization, WebSite, LocalBusiness schemas
// In articles: Article schema
```

### Page Metadata Checklist

- [ ] `createMetadata()` or `createArticleMetadata()` used
- [ ] Title in Turkish
- [ ] Description between 150-160 characters
- [ ] Open Graph image (1200x630px recommended)

---

## Testing

Currently, the project does not have automated tests configured. When adding tests:

1. Use **Jest** or **Vitest** for unit tests
2. Use **React Testing Library** for component tests
3. Use **Playwright** for E2E tests
4. Place tests in `__tests__` directories or `*.test.ts(x)` files

---

## Deployment

The project is configured for **Vercel** deployment:

1. Push code to GitHub
2. Connect repository in Vercel dashboard
3. Set environment variables
4. Deploy automatically on push to main branch

---

## Future Integrations (Placeholders)

### Supabase

Placeholder files exist in `lib/supabase/` for future database/auth integration:
- `client.ts` - Browser client (returns `null` currently)
- `server.ts` - Server client (returns `null` currently)

When implementing, install `@supabase/ssr` and follow the commented example code.

---

## Language Requirements

**CRITICAL**: All user-facing text MUST be in Turkish.

Examples:
- ✅ "Hoş Geldiniz", "İletişim", "Hakkımızda"
- ❌ "Welcome", "Contact", "About Us"

Internal code (variables, comments) can be in English.

---

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `HeroSection.tsx`)
- Utilities/Hooks: `kebab-case.ts` (e.g., `use-mobile-menu.ts`, `cn.ts`)
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- Types: `index.ts` or descriptive name in `types/` folder

---

## Code Style Guidelines

1. **Use TypeScript strictly** - Avoid `any` types
2. **Export components as named exports** (except pages)
3. **Use forwardRef for reusable UI components**
4. **Keep components focused and small**
5. **Extract reusable logic into custom hooks**
6. **Use constants for navigation and colors** from `constants/`
7. **Follow existing patterns** - Check similar files before creating new ones
