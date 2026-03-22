# Ask Mode Rules (Non-Obvious Only)

## Project Structure Context

- **Hybrid architecture**: Next.js App Router (`app/`) + static HTML directories (`devuser/`, `banka/`, etc.) + legacy API handlers (`api/`)
- **Static directories**: Multiple topic directories at root level (Turkish content) - `devuser/`, `banka/`, `maas/`, `vatandas/`, `sigorta/`, `paratransfer/`, `rehber/`, etc.
- **Primary language**: Turkish (HTML lang="tr" in layout)

## Key Architecture Decisions

- **Root redirect**: `app/page.tsx` redirects `/` to `/index.html` (static homepage)
- **API compatibility**: `app/api/[...slug]/route.ts` wraps legacy Express-style handlers - transforms Next.js Request to `function(req, res)` signature
- **Static file serving**: `app/[...slug]/route.ts` serves static files with path traversal protection

## Documentation Locations

- **DevUser docs**: `devuser/AGENTS.md`, `devuser/README.md`, `devuser/KURULUM.md` (Turkish)
- **Migration notes**: `migration.md`, `todo.md` at root
- **Security docs**: `devuser/SECURITY_EMERGENCY.md`, `devuser/SECURITY_UPDATE_README.md`

## Database Tables

- **Core**: `devuser` (user profiles), `bookmarks`, `community_support`, `newsletter`
- **Tournaments**: `typing_participants`, `tavla_participants`, `vct_participants`, `promote_participants` + bracket tables
- **Events**: `event_e1_*`, `event_e2_*` tables
- **Admin**: `admin_api_keys` table for admin authentication

## API Endpoint Patterns

- **User auth**: `api/devuser-auth.js`, `api/devuser-register.js`, `api/devuser-me.js`
- **Admin**: `api/devuser-admin-list.js`, `api/devuser-admin-update.js`
- **Bookmarks**: `api/bookmarks-*.js`
- **Community Support**: `api/cs-*.js`
- **Events**: `api/event-e1-*.js`, `api/event-e2-*.js`
- **Config**: `api/supabase-config.js` (public, returns Supabase URL + anon key)

## Shared Components

- **Footer/Contact**: `shared-cards.js` renders via `data-shared-card="contact|footer"` placeholders
- **Auto-removal**: Contact/footer removed on `bizkimiz/` and `contact/` pages (they have own implementations)
