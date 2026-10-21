# Shared design brief (all redesign agents read this first)

Repo: C:\temp_private\almanya101last, branch `redesign/firmascope-corteqs`. Next.js 15 App Router, Tailwind v3, TypeScript.
Approved plan (Turkish): C:\Users\baris-terzioglu\.claude\plans\c-users-baris-terzioglu-claude-plans-htt-golden-spring.md. Read it.
Project rules: C:\temp_private\almanya101last\CLAUDE.md and AGENTS.md.
Reference screenshots: C:\temp_private\almanya101last\.omc\artifacts\reference\ (corteqs-home-1440.jpeg = LAYOUT reference, corteqs-hizmet-verenler-1440.jpeg = inner/listing page reference, corteqs-home-390.jpeg = mobile, firmascope-home-1440.jpeg + firmascope-sirketler-1440.jpeg = COLOUR reference). "Before" state: .omc\artifacts\before\.

Goal: public site goes from black/neon to light. Colours = firmascope, layout = Corteqs. Surfaces are HYBRID: sections, grids and lists use Corteqs 1px hairlines with no shadow; featured cards (hero card, result cards, the card inside the dark band) use 12px radius + soft shadow; buttons 10px radius.

## Hard rules
- All user-facing text Turkish. Keep existing Turkish copy, headings, labels, links, routes and slugs. No emoji, no em-dash in page text.
- Do NOT change metadata, JSON-LD values, slugs, Supabase queries, middleware, API routes, form field ids/names, business logic.
- Keep every `data-pw` attribute. Keep visible texts that e2e tests select on ("Nasıl çalışır?", "Yasal not", "Sıkça Sorulan Sorular", "Soru 1 / 20", "Sonuç", "Sonucu Kopyala", h1 texts).
- Admin (`app/admin`, `components/admin`, root `components/*AdminClient.tsx`), devuser (`app/(devuser)`, `components/devuser`) and `/authors` panel (`components/CornerAuthorPanelClient.tsx`) are OUT OF SCOPE. If a public component is shared with them, add an opt-in prop and keep the old look as default.
- Use `cn()` from `@/lib/utils/cn`, `Link` from `next/link` for internal links, icons ONLY from `lucide-react`. Server Components by default; `'use client'` only when hooks/events are needed.
- New public code must not use: `bg-black`, `text-white` outside the dark band/brand buttons, `border-white/*`, `google-*` colours, `shadow-glow-*`, `bg-aurora`, `bg-grid`, `bg-noise`, `neon-border`, `text-gradient-tech`, `reveal*`, `font-display`, gradients, backdrop blur glass. ESLint must stay clean; never add eslint-disable comments.
- Files under ~200 lines where practical; no barrel `index.ts` files.
- Do NOT run `npm run build`, `npm run dev`, `npm run start`, or any git command that writes (add/commit/stash/checkout/reset). Other agents work in the same tree at the same time. Allowed checks: `npx eslint <your files>`, `npx tsc --noEmit -p tsconfig.json` (ignore errors in files you do not own), `npx vitest run <your tests>`.

## Tokens (Tailwind classes, defined in constants/design-tokens.ts)
- Surfaces: `bg-page` (#F6F7F9, body default), `bg-white` (cards), `bg-band` (#EDF0F3, full-bleed Corteqs bands), `bg-ink` (#252B37, the one dark band).
- Text: `text-ink` (body/headings), `text-muted` (secondary, AA), `text-white` (only on bg-ink / brand fills).
- Lines: `border-line` (#E3E7ED). Hairlines are 1px.
- Brand (the ONLY interactive colour): `bg-brand-700 hover:bg-brand-800 text-white` for CTAs; `text-brand-700` links; `text-brand-600` headline accent lines; `bg-brand-500` progress bars/decor; `bg-brand-50`/`bg-brand-100` selected/hover surfaces; `border-brand-700` selected borders. Focus ring is global (2px brand-700 outline).
- Category colours (decor/coding only, never CTAs): import `TONE_STYLES`, `TONE_CYCLE`, `toneAt`, type `SiteTone` from `@/components/site/tones`. Each tone has `tint` (bg 10%), `wash` (bg 5%), `border` (20%), `text` (AA text), `solid` (decor fill). firmascope rotates blue, green, orange, yellow through lists.
- Radius: `rounded-tile` (6px: tiles, photos), `rounded-card` (12px: featured cards, panels), `rounded-btn` (10px: buttons, inputs), `rounded-full` (chips, number badges).
- Shadow: `shadow-float` only on featured cards. No other shadows.

## Typography (single font: Plus Jakarta Sans via `font-sans`, weight 800 for headings)
- H1 hero: `text-[clamp(2.5rem,5vw,4.125rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink`.
- H1 inner page (PageHead): `text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em]`.
- H2 section: `text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em]`.
- H3: `text-[19px] font-extrabold leading-snug tracking-[-0.02em]`.
- Eyebrow: `text-[13px] font-bold uppercase tracking-[0.13em]`. Max 3 per page.
- Body 16px `leading-relaxed`; descriptions `text-muted`; small meta `text-sm text-muted`.
- Corteqs headline pattern: 2-3 short lines; the accent line in `text-brand-600`.

## Geometry (Corteqs measurements)
- Container: `<Container>` from `@/components/ui/Container` → `mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-9`.
- Section vertical rhythm `py-16` (64px). Full-bleed bands (`bg-band`, `bg-ink`) span the viewport with a Container inside.
- Header 80px, sticky, `bg-page/95 backdrop-blur-sm border-b border-line` (the one allowed blur).
- Hero grid `lg:grid-cols-[1.05fr_1fr] gap-[38px]`, stacks on mobile (text first).
- Service grid 4 columns desktop / 2 mobile, tiles padded `px-[18px] py-6`, inner hairlines only.
- Photo/colour tile grid 3 columns desktop / 2 mobile, `gap-[22px]`.
- Buttons: `min-h-[44px] rounded-btn px-6 py-3.5 text-sm font-semibold`, with lucide `ArrowUpRight` (16px) after the label for navigational CTAs.
- Text link (Corteqs `.text-link`): `text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-brand-700 hover:decoration-brand-700` + `ArrowUpRight` 14px.
- Motion: colour/border transitions only (`transition-colors`). Nothing animates on load. Respect reduced motion.
- Photos: `next/image` (images are unoptimized in this repo) from `public/images/site/`: `berlin-brandenburger-tor.webp` (hero), `berlin-spree.webp`, `berlin-brandenburger-tor-aksam.webp`, `frankfurt-skyline.webp`, `ofis-ekip.webp` (all 1600px wide). NEVER use `koln.jpg`, `munih.jpg`, `frankfurt1.jpg`, `frankfurt2.jpg` (they show Chicago/London). Where no photo fits, use `ColorTile` (tinted tile + lucide icon), never fake image placeholders.
- Logo: `/almanya101header.png` (transparent, outlined letters, works on light). `/yeniherologo.png` (mascot, white letters) ONLY on `bg-ink`.

## Block library contract: components/site/*
Page agents consume these; block agents implement exactly these names and props (extra optional props are fine).
- `tones.ts` (exists): `TONE_STYLES`, `TONE_CYCLE`, `toneAt`, `SiteTone`.
- `Eyebrow.tsx`: `Eyebrow({ children, tone?: 'ink' | 'light', className })` renders a div.
- `HeadingAccent.tsx`: `HeadingAccent({ children, className })` → `<span className="text-brand-600">`; on dark use `className="text-brand-500"`.
- `SectionHeader.tsx`: `SectionHeader({ eyebrow?, title: ReactNode, accent?: ReactNode (2nd line, brand-600), description?: ReactNode, link?: { href: string; label: string }, as?: 'h1' | 'h2' (default 'h2'), id?: string (heading id), align?: 'left' | 'center', tone?: 'ink' | 'light', className })`. Title and accent each render as block lines; link sits right-aligned on desktop, below on mobile.
- `ArrowLink.tsx`: `ArrowLink({ href, children, external?: boolean (auto when href starts with http), tone?: 'ink' | 'brand' | 'light', className })`. External → `<a target="_blank" rel="noopener noreferrer">`, internal → `Link`.
- `SplitHero.tsx`: `SplitHero({ id?, eyebrow?: ReactNode, title: ReactNode (h1 content), description?: ReactNode, actions?: ReactNode, media?: ReactNode, aside?: ReactNode (under media, e.g. shortcut tiles), decorated?: boolean (firmascope dots), className })`. Root is `<section>`.
- `HeroDots.tsx`: decorative firmascope dots (absolute, `aria-hidden`, static, ~10 dots of 8/12/20px in alm colours at 25% opacity with blur(1px)).
- `PhotoCard.tsx`: `PhotoCard({ src, alt, chip?: { label: string; href?: string }, footer?: ReactNode, priority?: boolean, aspect?: 'hero' | 'wide' | 'tall', className })` → rounded-card image with white pill chip top-left and optional white inset footer bar at the bottom.
- `ShortcutTile.tsx`: `ShortcutTile({ href, icon: LucideIcon, label: ReactNode, tone: 'brand' | 'band', external?: boolean })` → Corteqs hero-shortcuts (brand = `bg-brand-700 text-white`, band = `bg-band text-ink`), icon left, label, ↗.
- `IntentStrip.tsx`: `IntentStrip({ label: string, items: { label: string; href: string }[] })` → full-bleed `border-y border-line`, bold label then links separated by vertical hairlines, each with ↗ in brand-700; 2-column grid on mobile.
- `ServiceGrid.tsx`: `ServiceGrid({ items?: ServiceItem[]; groups?: { title: string; tone: SiteTone; items: ServiceItem[] }[]; columns?: 3 | 4 })` and `ServiceTile.tsx`: `ServiceTile(item: ServiceItem & { className? })`; `type ServiceItem = { href: string; icon: LucideIcon; title: string; description?: string; tone?: SiteTone; external?: boolean }`. Tile: icon in a 40px `rounded-tile` chip with tone tint/text, title (h3, 17px extrabold), one-line muted description, ↗ appears top-right on hover, hover `bg-white`. Groups render a small group title row (dot in tone solid + title).
- `ColorTile.tsx`: `ColorTile({ href?, icon: LucideIcon, title: string, kicker?: string, tone: SiteTone, className })` → tinted tile (tone tint) with large icon, kicker + title bottom-left, ↗ bottom-right; aspect like Corteqs city tiles.
- `PhotoTile.tsx`: `PhotoTile({ href, src, alt, title, kicker? })` → Corteqs city tile: photo, dark gradient bottom, white kicker + title, ↗.
- `MediaCard.tsx`: `MediaCard({ href, title, description?, image?: { src: string; alt: string }, fallback?: { icon: LucideIcon; tone: SiteTone }, tag?: { label: string; tone?: SiteTone }, meta?: ReactNode, linkLabel?: string, external?: boolean, className })` → white rounded-card border-line card, image (or ColorTile-like fallback) on top 16/10, body p-5, h3 title, muted 3-line description, bottom link in brand-700 with ↗. Whole card clickable via the title link (stretched link), not nested anchors.
- `StepList.tsx`: `StepList({ steps: { title: ReactNode; description?: ReactNode }[], tone?: 'ink' | 'light', layout?: 'vertical' | 'inline', className })` → `<ol>` with 28px circle number badges (`border border-current`), title bold, description muted.
- `StatRow.tsx`: `StatRow({ stats: { value: string; label: string }[], tone?: 'ink' | 'light', className })` → value `text-[28px] font-extrabold`, label `text-sm text-muted`.
- `FilterPanel.tsx`: `FilterPanel({ children, title?: ReactNode, className })` → `rounded-card bg-band p-5 md:p-6`.
- `Accordion.tsx` (Server Component, native `<details name>` for single-open + keyboard): `Accordion({ name: string, items: { id?: string; title: ReactNode; content: ReactNode }[], toneCycle?: boolean, defaultOpenIndex?: number, className, itemClassName? })` → `border-y border-line divide-y divide-line`, summary row with title (h3-size 17px bold; when `toneCycle`, title colour cycles `toneAt(i)` text tones and a small solid dot), lucide `ChevronDown` rotating on open (`group-open:rotate-180`), content `pb-5 text-muted leading-relaxed`.
- `DarkBand.tsx`: `DarkBand({ id?, eyebrow?, title: ReactNode, description?: ReactNode, children?: ReactNode (left column extras), aside?: ReactNode (rendered inside a white rounded-card shadow-float card), className })` → full-bleed `bg-ink text-white`, 2 columns desktop. At most one per page.
- `CtaRow.tsx`: `CtaRow({ eyebrow?, title: ReactNode, description?: ReactNode, action: ReactNode })` → Container row with `border-t border-line`, title 28px extrabold, action right.
- `PageHead.tsx`: `PageHead({ breadcrumb?: { label: string; href?: string }[], eyebrow?, title: ReactNode (h1), description?: ReactNode, stats?: { value: string; label: string }[], actions?: ReactNode, media?: ReactNode, className })` → inner-page split head (Corteqs hizmet-verenler top), text left, media right (stacks on mobile), bottom hairline.
- `Chip.tsx`: `Chip({ children, tone?: SiteTone | 'neutral' | 'brand', className })` → `rounded-full px-3 py-1 text-xs font-semibold` neutral = `border border-line bg-white text-ink`, tones = tint + text.

## components/ui (updated, API unchanged)
- `Container` as above. `Section({ contained = true, size = 'xl', tone?: 'page' | 'band' | 'white' | 'ink', ... })` → `py-16` + tone background (default transparent).
- `Button({ variant, size, asChild, href, arrow?: boolean, ... })`: primary = brand-700/white, secondary = `bg-ink text-white`, outline = `border border-line bg-white text-ink hover:border-ink`, ghost = text-link look, danger/success kept but on new palette (`bg-alm-red-ink`/`bg-alm-green-ink`). Sizes keep names; md/lg = Corteqs button.
- `Card({ variant })`: default = `rounded-card border border-line bg-white`; hoverable = default + `hover:border-ink/30 transition-colors`; featured = default + `shadow-float`; bordered = default.
- `Badge` → same look as `Chip`.

## Tool shell contract: components/tools/* (implemented by the TOOLS-CORE agent, consumed by all tool agents)
Plain components without `'use client'` unless they need hooks; they may receive callbacks from client parents.
- `ToolHero.tsx`: `ToolHero({ eyebrow?: string (default 'Araç'), title: string (h1, keep the existing tool title text exactly), intro?: ReactNode, stats?: { value: string; label: string }[], howItWorks: ReactNode[], howItWorksTitle?: string (default 'Nasıl çalışır?'; hand-built tools pass their current casing, e.g. 'Nasıl Çalışır?'), className })` → inner-page split head: left eyebrow + H1 + intro + StatRow; right a featured card (rounded-card border-line bg-white shadow-float) with an h2 = howItWorksTitle and a numbered StepList. Always visible (no collapsible). Bottom hairline.
- `ToolPanel.tsx`: `ToolPanel({ children, id?, className })` → Container > `rounded-card bg-band p-4 md:p-6` (Corteqs filter panel) holding the interactive area (progress + question card or the calculator form).
- `ToolProgress.tsx`: `ToolProgress({ current: number, total: number, label?: ReactNode (default `Soru ${current} / ${total}` — keep this exact text, e2e depends on it), onReset?: () => void, resetLabel?: string (default 'Sıfırla') })` → label left (text-sm font-semibold ink), optional reset ghost button right, 6px `bg-line` track with `bg-brand-500` fill (rounded-full).
- `ToolQuestionCard.tsx`: `ToolQuestionCard({ category?: ReactNode, title: ReactNode (h2), description?: ReactNode, children (options + nav), className })` → ROOT is `<div data-pw="tool-question-card" ...>` with `rounded-card border border-line bg-white p-5 md:p-7 shadow-float`. Category renders as a Chip.
- `ToolOption.tsx`: `ToolOption({ selected?: boolean, onClick?: () => void, children (label), description?: ReactNode, disabled?: boolean, className })` → `<button type="button">` full width, left aligned, `min-h-[44px] rounded-btn border px-4 py-3.5 transition-colors`; idle `border-line bg-white hover:border-ink/40`; selected `border-brand-700 bg-brand-50` + `aria-pressed`.
- `ToolInfoBand.tsx`: `ToolInfoBand({ whyTitle?: string (default 'Bu araç neden var?'), why: ReactNode | ReactNode[], whoForTitle?: string (default 'Bu araç kim için?'), whoFor?: ReactNode[], aside?: ReactNode })` → DarkBand; why points as a light StepList; whoFor as a list inside the white aside card (or `aside` override).
- `ToolFaq.tsx`: `ToolFaq({ items: { question: string; answer: ReactNode }[], title?: string (default 'Sıkça Sorulan Sorular'), name: string })` → Section with SectionHeader (eyebrow 'SSS') + Accordion (toneCycle). FAQ JSON-LD stays where it is today (do not move it).
Result areas: use `Card variant="featured"` / SectionHeader / hairline lists from the brief; result headings keep their texts ('Sonuç', 'Ana Öneri', ...). Action buttons: `Button` (primary for the main action, outline for secondary, e.g. 'Sıfırla', 'Sonucu Kopyala', 'Ana Sayfaya Dön').
Tool page order: ToolHero → ToolPanel (progress + question card / form) → results → ToolInfoBand → official sources / related tools (ServiceGrid) → ToolFaq → legal note (small muted text block).

## Page agent ownership (Faz 3-7) — edit ONLY your files; if you need a change elsewhere, report it instead
- HOME: `app/page.tsx`, `components/home/*`, `components/sections/{FAQ,NewsCarousel,KenBurnsSlideshow}.tsx`, `constants/home-data.ts`, `app/layout.tsx` (only removing Sora/`--font-display`), tests `tests/home-*.test.ts`.
- TOOLS-CORE: `components/tools/*`, `lib/tools/types.ts` (types only if needed), the 10 config tool folders `app/(site)/{almanya-maas-beklentisi,almanya-yasam-tarzi-uyumu,almanya-yolunu-sec,almanyada-is-bulma-olasiligi,almanyaya-hazir-misin,hangi-sehir-sana-uygun,ilk-90-gun-planlayici,kariyer-ve-egitim-rotasi,once-hangi-sorunu-cozmelisin,topluluk-ve-danismanlik}/` (never change toolConfig content/logic), `e2e/smoke/{almanya-tools,almanya-yolunu-sec,almanya-maas-beklentisi}.spec.ts` (selectors only), tests `tests/tool-shell.test.ts`.
- TOOLS-WIZARD: `app/(site)/{banka-secim,sigorta-secim,vize-secim,para-transferi}/`, `components/para-transferi/*`, `e2e/tools/{banka-secim,sigorta-secim,vize-secim,para-transferi}.spec.ts`.
- TOOLS-CALC: `app/(site)/{maas-hesaplama,stepstone-karsilastirma,vatandaslik-testi}/`, `app/(marketing)/tatil/{almanya,turkiye}/`, `components/holiday/*`, `e2e/tools/{maas-hesaplama,stepstone-karsilastirma,vatandaslik-testi}.spec.ts`.
- HUBS: `app/(site)/{almanya-araclari,yeniarachub,belgeler,hizmet-rehberi}/` (except `hizmet-rehberi/oneri/`), `app/(marketing)/{is-ilanlari,topluluk,almanyada-yasam,blog}/`, `app/(marketing)/tatil/page.tsx`, `components/sections/RecruitmentAgencies.tsx`.
- CONTENT: `app/(site)/haberler/**`, `app/(site)/yazi-dizisi/**`, `app/(site)/[authorSlug]/`, `app/(marketing)/rehber/**`, `components/news/*`, `components/MarkdownPreview.tsx` (add `tone?: 'dark' | 'light'`, default 'dark' so admin is unchanged).
- PAGES: `app/(marketing)/{iletisim,ekibimize-katil,hakkimizda,kariyer,cerez-politikasi,gizlilik-politikasi,impressum,kullanim-sartlari,kvkk-gdpr-ccpa}/`, `app/(site)/hizmet-rehberi/oneri/`, `app/(auth)/**`, `components/auth/AuthSplitLayout.tsx` (add `tone?: 'dark' | 'light'`, default 'dark' so admin/author panel are unchanged), `components/layout/LegalPage.tsx`, `app/not-found.tsx`.
- Nobody edits: `components/ui/*`, `components/layout/{Header,Footer,Breadcrumb}.tsx`, `components/site/*` (report gaps instead), `components/sections/{HeroSection,CTASection,FeatureGrid,InfoBlock,ArticleCard}.tsx` (replace their usage in your pages with site blocks; the old files get deleted centrally at the end), `components/home/ContactChannelCard.tsx` except HOME, `app/globals.css`, `tailwind.config.ts`, `CLAUDE.md`, `middleware.ts`.
