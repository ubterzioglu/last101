# almanya101

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

## News Module V2

The repository now includes a Supabase-backed news workflow with:

- Public pages: `/haberler`, `/haberler/[slug]`
- Admin pages: `/admin/haberler`, `/admin/haberler/yeni`, `/admin/haberler/[id]`, `/admin/haberler/kaynaklar`, `/admin/haberler/pipeline`, `/admin/haberler/ayarlar`
- Public API: `GET /api/news`, `GET /api/news/[slug]`
- Admin API: `/api/admin/news/*`
- Supabase Edge Function: `supabase/functions/news-ingest`

### Required Environment Variables

Keep these in `.env.local` for local development and in your hosting platform for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_SERVICE_KEY=

NEXT_PUBLIC_SITE_URL=https://almanya101.de
NEXT_PUBLIC_SITE_NAME=Almanya101

ADMIN_PANEL_PASSWORD=
NEWS_PIPELINE_SECRET=
GEMINI_API_KEY=
THENEWSAPI_TOKEN=
```

Rules:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- `NEWS_PIPELINE_SECRET`, `GEMINI_API_KEY`, and `THENEWSAPI_TOKEN` are optional for development but required for the full pipeline.
- The canonical storage bucket for news images is `news`.

### Local Setup

```bash
npm install
```

Apply the new migration:

```bash
supabase db push
```

If your project is not linked yet:

```bash
supabase login
supabase link --project-ref ldptefnpiudquipdsezr
```

### Edge Function Deploy

Deploy the ingest function after the migration:

```bash
supabase functions deploy news-ingest
```

The function expects these secrets in Supabase:

```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set NEWS_PIPELINE_SECRET=...
supabase secrets set GEMINI_API_KEY=...
supabase secrets set THENEWSAPI_TOKEN=...
```

### Cron / Scheduler

Recommended daily ingest trigger:

```sql
select
  cron.schedule(
    'news-ingest-daily',
    '0 6 * * *',
    $$
    select
      net.http_post(
        url := 'https://ldptefnpiudquipdsezr.supabase.co/functions/v1/news-ingest',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-pipeline-secret', vault.decrypted_secret('NEWS_PIPELINE_SECRET')
        ),
        body := '{"trigger":"cron"}'::jsonb
      );
    $$
  );
```

Weekly cleanup suggestion:

```sql
select
  cron.schedule(
    'news-cleanup-weekly',
    '15 6 * * 0',
    $$
    delete from public.news_raw_items
    where fetched_at < now() - interval '30 days';
    $$
  );
```

### Manual Test Flow

1. Open `/admin/haberler/kaynaklar` and create at least one RSS source.
2. Open `/admin/haberler/pipeline` and trigger a manual run.
3. Confirm `pending_review` records appear in `/admin/haberler`.
4. Open a post detail, refine title/content/source data, and publish it.
5. Verify `/haberler` hero, filters, load-more flow, and `/haberler/[slug]`.

### Verification Commands

Run these after installing dependencies:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Rollback Notes

- UI rollback: revert the news module commit and redeploy the Next.js app.
- DB rollback: create a compensating migration instead of mutating the applied migration file.
- If the ingest function causes issues, disable `pipeline_enabled` in `/admin/haberler/ayarlar` or remove the cron job first, then roll back code.
