# AGENTS.md

This file provides comprehensive guidance to AI coding agents working with the almanya101 codebase.

## Project Overview

**almanya101** is a Next.js 15 web application targeting Turks living in or moving to Germany (https://almanya101.com). It serves as a comprehensive information guide, job listings platform, and community hub.

### Target Audience
- Turks living in Germany
- Turks planning to move to Germany
- Turkish-speaking residents seeking community connection

### Language Requirement
- **CRITICAL**: All user-facing content MUST be in Turkish (tr)
- Internal code (variables, comments, function names) can be in English

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 (Strict Mode) |
| Styling | TailwindCSS 3.4 |
| UI Components | Custom built |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| Deployment | Vercel |

### Dependencies
- `clsx` ^2.1.1 - Conditional class utilities
- `tailwind-merge` ^2.6.0 - Tailwind class merging
- `lucide-react` ^0.468.0 - Icon library

## Build Commands

```bash
# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

**Note**: Always use `npm` (not bun) for package operations as package.json scripts use npm-style commands.

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
│   ├── layout.tsx                # Root layout (fonts, metadata, header, footer)
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic sitemap generator
│   ├── robots.ts                 # robots.txt generator
│   └── globals.css               # Global styles & Tailwind
│
├── components/
│   ├── layout/                   # Layout components
│   │   ├── Breadcrumb.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx            # Sticky header with drawer menu
│   ├── sections/                 # Page section components
│   │   ├── ArticleCard.tsx
│   │   ├── Carousel.tsx
│   │   ├── ContactChannels.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CTASection.tsx
│   │   ├── FAQ.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InfoBlock.tsx
│   │   ├── JobCard.tsx
│   │   └── NewsCarousel.tsx
│   ├── seo/                      # SEO components
│   │   └── JsonLd.tsx            # Schema.org structured data
│   └── ui/                       # Reusable UI primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Container.tsx
│       └── Section.tsx
│
├── lib/
│   ├── seo/
│   │   └── metadata.ts           # SEO metadata utilities
│   ├── supabase/                 # Placeholder for future Supabase integration
│   │   ├── client.ts             # Browser client (returns null)
│   │   └── server.ts             # Server client (returns null)
│   └── utils/
│       ├── cn.ts                 # Tailwind class merging utility
│       └── constants.ts          # Site constants
│
├── hooks/
│   └── use-mobile-menu.ts        # Mobile menu state hook
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── constants/
│   ├── colors.ts                 # Color palette constants
│   └── navigation.ts             # Navigation configuration
│
└── public/
    └── images/                   # Static images
        ├── backgrounds/          # Page background images
        ├── profil.jpg            # Founder profile
        └── sahin-profil.jpeg     # Co-founder profile
```

## Code Style Guidelines

### Server vs Client Components
- **Default to Server Components** (no `'use client'` directive)
- Add `'use client'` ONLY when using:
  - React hooks (useState, useEffect, useCallback, etc.)
  - Browser APIs (window, document, localStorage)
  - Event handlers (onClick, onChange, etc.)

### Class Merging with `cn()`
**ALWAYS** use the `cn()` utility from `@/lib/utils/cn` for merging Tailwind classes:

```typescript
import { cn } from '@/lib/utils/cn';

// Correct
className={cn('base-classes', isActive && 'conditional-class', className)}

// Incorrect - don't concatenate strings
className={`base-classes ${isActive ? 'conditional-class' : ''}`}
```

### Path Aliases (tsconfig.json)
| Alias | Maps to |
|-------|---------|
| `@/*` | `./*` |
| `@/components/*` | `./components/*` |
| `@/lib/*` | `./lib/*` |
| `@/hooks/*` | `./hooks/*` |
| `@/types/*` | `./types/*` |
| `@/constants/*` | `./constants/*` |
| `@/app/*` | `./app/*` |
| `@/public/*` | `./public/*` |

### Component Patterns
- Use `forwardRef` for reusable UI components
- Define component props interfaces explicitly
- Export component with `displayName` for debugging

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    // implementation
  }
);

Button.displayName = 'Button';
```

## Styling Conventions

### Google Color Palette
The project uses Google's official color palette defined in `tailwind.config.ts`:

| Color | Hex | Tailwind Class |
|-------|-----|----------------|
| Google Blue | #4285F4 | `bg-google-blue`, `text-google-blue` |
| Google Red | #EA4335 | `bg-google-red`, `text-google-red` |
| Google Yellow | #FBBC05 | `bg-google-yellow`, `text-google-yellow` |
| Google Green | #34A853 | `bg-google-green`, `text-google-green` |
| Google Orange | #FF9500 | `bg-google-orange`, `text-google-orange` |

### Layout Patterns
- **Container**: Use `container` class for responsive padding (built-in: `1rem` mobile → `6rem` 2xl)
- **Hero Sections**: Use `min-h-[80vh]` for full-height hero sections
- **Content Sections**: Use `py-32 md:py-48` for section spacing
- **Responsive**: Mobile-first design (use `sm:`, `md:`, `lg:`, `xl:` prefixes)

### Section Patterns
Most marketing pages follow this structure:
```tsx
<HeroSection title="..." description="..." className="bg-google-blue" />
<Section contained>
  {/* content */}
</Section>
<Section contained className="bg-gray-50">
  {/* alternate background */}
</Section>
```

## SEO System

### Page Metadata
Every page MUST export metadata using the provided utilities:

```typescript
// Standard pages
import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Sayfa Başlığı',  // In Turkish
  description: 'Sayfa açıklaması',  // In Turkish
  path: '/sayfa-yolu',
});

// Article/content pages
import { createArticleMetadata } from '@/lib/seo/metadata';

export const metadata = createArticleMetadata({
  title: 'Makale Başlığı',
  description: 'Makale açıklaması',
  path: '/makale-yolu',
  publishedTime: '2025-03-15T00:00:00Z',
  authors: ['Yazar Adı'],
});
```

### Structured Data (JSON-LD)
Root layout includes these schema components in `<head>`:
- `OrganizationJsonLd` - Organization schema
- `WebSiteJsonLd` - Website with search action
- `LocalBusinessJsonLd` - Germany-targeted local business

For article pages, use `ArticleJsonLd` from `@/components/seo/JsonLd`.

### Auto-Generated Files
- `/sitemap.xml` - Generated by `app/sitemap.ts`
- `/robots.txt` - Generated by `app/robots.ts`

## Navigation Structure

Main navigation items (from `constants/navigation.ts`):
1. `/` - Ana Sayfa (Home)
2. `/almanyada-yasam` - Almanya'da Yaşam (Life in Germany)
3. `/is-ilanlari` - İş İlanları (Job Listings)
4. `/rehber` - Rehber (Guides)
5. `/topluluk` - Topluluk (Community)
6. `/hakkimizda` - Hakkımızda (About Us)
7. `/iletisim` - İletişim (Contact)

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

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

## Accessibility (a11y)

The site follows WCAG AA guidelines:
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Skip-to-content link (`.skip-to-main`)
- High color contrast ratios
- Alt text for all images
- Focus visible states

## Known Placeholders / Future Work

These areas are intentionally placeholders for future implementation:

1. **Supabase Integration** (`lib/supabase/`)
   - Both client.ts and server.ts return `null`
   - Will be implemented for dynamic content, user auth, community features

2. **Legal Pages**
   - Privacy Policy (`Gizlilik Politikası`)
   - Terms of Use (`Kullanım Şartları`)
   - Cookie Policy (`Çerez Politikası`)
   - Currently link to `#` in footer

3. **Planned Features** (from README)
   - User authentication
   - Community forum
   - User-generated content
   - Advanced search
   - Email newsletter
   - Blog platform

## Testing

Currently, the project does not have automated tests configured. When adding tests:
- Use Jest + React Testing Library (recommended)
- Place test files next to components: `ComponentName.test.tsx`
- Test user interactions, not implementation details

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Set environment variables in Vercel settings
4. Deploy

### Pre-Deployment Checklist
- [ ] All environment variables set in production
- [ ] Site URL correct in metadata
- [ ] OG image available at `/images/og-default.jpg`
- [ ] Turkish content verified
- [ ] Responsive design tested

## Important Notes for Agents

1. **Turkish Content**: Never use English for user-facing text. Always translate to Turkish.

2. **Color Usage**: Stick to the Google color palette. Don't introduce arbitrary colors.

3. **Component Reusability**: When creating new components, check if similar ones exist in `components/ui/` or `components/sections/` first.

4. **Image Assets**: Store in `public/images/`. Use descriptive names in English for file organization.

5. **Mobile First**: The drawer navigation is the primary navigation pattern. Test on mobile viewports.

6. **SEO**: Always include metadata exports on new pages. Use the existing utilities.

7. **Type Safety**: Enable strict TypeScript. Avoid `any` types.

8. **Comments**: Code comments can be in English. User-facing strings must be Turkish.
