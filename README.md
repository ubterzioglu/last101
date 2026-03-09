# Almanya101

Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vercel** - Deployment platform

## Features

- ✅ Responsive design (mobile-first)
- ✅ Google color palette
- ✅ SEO optimized (metadata, structured data, sitemap, robots.txt)
- ✅ Accessibility compliant (ARIA, keyboard navigation, semantic HTML)
- ✅ Type-safe with TypeScript
- ✅ Reusable component architecture
- ✅ Clean code principles
- ✅ Production-ready

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd almanya101
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
almanya101/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Marketing route group
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── sitemap.ts            # Sitemap generator
│   └── robots.ts             # Robots.txt
├── components/
│   ├── layout/               # Layout components
│   ├── ui/                   # Reusable UI components
│   ├── sections/             # Section components
│   └── seo/                 # SEO components
├── lib/
│   ├── supabase/            # Supabase clients (placeholder)
│   ├── seo/                 # SEO utilities
│   └── utils/               # Utility functions
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── constants/                # Constants
└── public/                   # Static assets
```

## Pages

- `/` - Ana Sayfa (Home)
- `/almanyada-yasam` - Almanya'da Yaşam (Life in Germany)
- `/is-ilanlari` - İş İlanları (Job Listings)
- `/rehber` - Rehber (Guides)
- `/topluluk` - Topluluk (Community)
- `/hakkimizda` - Hakkımızda (About Us)
- `/iletisim` - İletişim (Contact)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables

Required for production:
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_SITE_NAME` - Your site name

Future (Supabase):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

Follow these conventions:
- Use meaningful variable and function names
- Keep components small and focused
- Use server components by default
- Only use client components when necessary
- Follow existing patterns in the codebase

## SEO

The site includes:
- Meta tags for all pages
- Open Graph metadata
- Twitter Card metadata
- Schema.org structured data (JSON-LD)
- XML Sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Geographic targeting (Germany, Turkish language)

## Accessibility

The site follows WCAG AA guidelines:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Skip to main content link
- High color contrast
- Alt text for images

## Future Enhancements

- [ ] Supabase integration for dynamic content
- [ ] User authentication
- [ ] Community forum
- [ ] User-generated content
- [ ] Advanced search
- [ ] Email newsletter
- [ ] Blog platform

## License

This project is licensed under the MIT License.
