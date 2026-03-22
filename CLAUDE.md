# CLAUDE.md

Bu dosya Claude Code'un bu repo ile çalışırken rehber olarak kullandığı dosyadır.

---

## Komutlar

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint (Docker build'de hata verirse deployment patlar)
```

**Paket yöneticisi: `npm` kullan — `bun` değil.**

---

## Proje Özeti

**almanya101.com** — Almanya'daki Türkler için bilgi ve araç platformu.

- **Stack**: Next.js 15, App Router, TypeScript, TailwindCSS, Supabase
- **Deployment**: Docker + Coolify (`output: 'standalone'`, `images.unoptimized: true`)
- **Repo**: `github.com/ubterzioglu/last101` (branch: `main`)
- **Dil kuralı**: Kullanıcıya görünen tüm içerik Türkçe olmalı. Kod İngilizce olabilir.

---

## Route Yapısı

| Route Group | URL Prefiks | Açıklama |
|---|---|---|
| `app/(marketing)/` | `/` | Ana sayfa ve marketing sayfaları |
| `app/(site)/` | `/araç-adı` | İnteraktif araçlar |
| `app/(devuser)/` | `/devuser/X` | Developer dashboard |
| `app/admin/` | `/admin` | Admin paneli (şifre korumalı) |

> **KRİTİK**: `(devuser)` route group URL'de **görünmez**. `app/(devuser)/devuser/survey/` → URL: `/devuser/survey` — ASLA `/devuser/devuser/survey` değil.

---

## İnteraktif Araçlar (`app/(site)/`)

Pattern: `page.tsx` (Server Component) + `*Client.tsx` (`'use client'`)

### Araç Kartı Yapısı (tüm araçlarda aynı)

Her araç sayfasının başında 3 ayrı kart bulunur:
1. **Başlık kartı** — `border-google-blue`, tıklanamaz, sadece `<h1>`
2. **Nasıl Çalışır? kartı** — `border-google-blue`, collapsible (`showInfo` state)
3. **Bu araç neden var? kartı** — `border-google-green`, collapsible (`showWhy` state)

### Araçlar

| Dizin | Açıklama |
|---|---|
| `banka-secim/` | 20 sorulu banka profil testi |
| `sigorta-secim/` | 20 sorulu sigorta önceliklendirme testi |
| `vatandaslik-testi/` | Almanya vatandaşlık sınav denemesi (sadece `page.tsx`) |
| `maas-hesaplama/` | Brüt↔Net maaş hesaplayıcı |
| `vize-secim/` | 8 kategori, 25 sonuç, dallanmalı vize seçim testi |
| `para-transferi/` | Para transferi araç karşılaştırması |
| `stepstone-karsilastirma/` | StepStone 2026 maaş karşılaştırması |

---

## DevUser Dashboard (`app/(devuser)/devuser/`)

- `DevUserShell` + `frameVariant` prop wrapper kullanır
- Sayfalar: `cvopt`, `disad`, `discussion`, `du`, `e1`, `e1a`, `e2`, `e2a`, `gelismeler`, `list`, `news`, `profile-edit`, `promote`, `reset-password`, `summary`, `survey`, `tavla`, `typing`, `ubt`, `vct`
- `ubt/page.tsx` → `redirect('/admin')`

---

## Admin Paneli (`app/admin/`)

- `page.tsx` — Full client component (`'use client'`), şifre girişi, code rain canvas, 9 bölüm
- `layout.tsx` — `robots: { index: false, follow: false }`
- **Grid**: 5 sütun (desktop), 2 sütun (mobil)
- Alt butonlar: "Ana Sayfaya Dön" + "Software Dashboard" — `<Link>` kullan, `<a>` değil

### Admin Auth (`lib/admin/adminAuth.ts`)
- **Simple mode**: `ADMIN_PANEL_PASSWORD` env var kontrolü (öncelikli)
- **DB mode**: `admin_api_keys` tablosu, PBKDF2 hash karşılaştırması
- Rate limiting: 12 deneme / 15 dk, 30 dk blok
- Supabase service client: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

### Admin API Rotaları
Tümü `isAdminAuthorized(req)` gerektirir:

| Rota | Metod | İşlev |
|---|---|---|
| `admin-auth-verify/` | GET | Şifre doğrulama |
| `devuser-admin-list/` | GET | Dev kullanıcı listesi |
| `devuser-admin-update/` | POST | Kullanıcı güncelleme |
| `participant-admin-list/` | GET | Katılımcı listesi |
| `participant-admin-action/` | POST | Katılımcı onayla/reddet |
| `participant-admin-bracket-action/` | POST | Turnuva bracket yönetimi |
| `devuser-dis-admin-list/` | GET | Tartışma listesi |
| `devuser-dis-admin-action/` | POST | Tartışma yönetimi |
| `news-admin-list/` | GET | Haber listesi |
| `news-admin-action/` | POST | Haber yönetimi |
| `meeting-attendance-admin-list/` | GET | Toplantı katılımcıları |
| `meeting-attendance-reset/` | POST | Katılım sıfırlama |

---

## Komponent Organizasyonu

```
components/
├── ui/          # Button, Card, Container, Section, Badge
├── sections/    # HeroSection, FeatureGrid, FAQ
├── layout/      # Header, Footer, Breadcrumb
├── devuser/     # DevUserShell, DevUserCanvas
├── holiday/     # Tatil hesaplayıcı
└── seo/         # JsonLd structured data
```

### Header (`components/layout/Header.tsx`)
- Sol üst: `public/almanya101.png` logosu
- Drawer menü `constants/navigation.ts`'den gelir
- Kategoriler: **Araçlar / Topluluk / İçerik / İletişim**
- `globals.css`: `body[data-devuser]` attribute'u varsa Header/Footer gizlenir
- Admin ve devuser sayfaları `useEffect` ile `document.body.setAttribute('data-devuser', 'true')` set eder

---

## Kritik Kodlama Kuralları

### 1. cn() utility — zorunlu
```typescript
import { cn } from '@/lib/utils/cn';
className={cn('base-classes', condition && 'conditional')}
```

### 2. Google Renk Paleti (tailwind.config.ts)
| Token | Hex |
|---|---|
| `google-blue` | #4285F4 |
| `google-red` | #EA4335 |
| `google-yellow` | #FBBC05 |
| `google-green` | #34A853 |
| `google-orange` | #FF9500 |

### 3. Navigasyon linkleri
- **Her zaman `<Link>` from `next/link`** — iç linklerde `<a href>` ESLint hatası verir, Docker build patlar

### 4. ESLint kuralları
- `@typescript-eslint/no-explicit-any` disable comment'i YAZMA — plugin yüklü değil, Docker build'de hata verir
- `npm run lint` çalıştır — hata varsa push etme

### 5. Server vs Client
- Default: Server Component (direktif yok)
- `'use client'`: sadece hooks, browser API, event handler kullanıldığında

---

## Supabase

```
lib/supabase/
├── client.ts    # Browser client (createBrowserClient)
├── server.ts    # Server client (createServerClient + cookies)
└── devuser.ts   # Dashboard client (getDevUserClient())
```

Admin işlemler için service client:
```typescript
createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})
```

---

## Environment Variables

`.env.example` **gitignored**'dır — gerçek değerleri commit etme.

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin API) |
| `ADMIN_PANEL_PASSWORD` | Admin paneli şifresi |
| `IP_HASH_SALT` | IP hash salt |
| `DEVUSER_AUTH_SECRET` | DevUser auth secret |
| `NEXT_PUBLIC_SITE_URL` | Site URL (https://almanya101.com) |
| `NEXT_PUBLIC_SITE_NAME` | Site adı (almanya101) |

---

## Path Aliases (tsconfig.json)

```
@/components/*  → ./components/*
@/lib/*         → ./lib/*
@/hooks/*       → ./hooks/*
@/types/*       → ./types/*
@/constants/*   → ./constants/*
```

---

## Önemli Dosyalar

```
tailwind.config.ts              # Renkler, spacing, container
next.config.ts                  # Standalone output, image config
constants/navigation.ts         # Drawer menü items + kategoriler
app/layout.tsx                  # Root layout
app/(devuser)/layout.tsx        # Dashboard layout
app/admin/page.tsx              # Admin paneli
lib/admin/adminAuth.ts          # Admin kimlik doğrulama
lib/seo/metadata.ts             # createMetadata(), createArticleMetadata()
lib/salary/                     # Maaş hesaplama modülleri
lib/utils/holiday-calculator.ts # Alman tatil hesaplayıcı
public/almanya101.png           # Site logosu
```

---

## Gitignore Notları

```
.env*          # Tüm env dosyaları (gerçek değerler)
.0temp/        # Eski repo backup klasörü
.0old/         # Eski backup
```

---

## Bilinen Tuzaklar

| Sorun | Çözüm |
|---|---|
| `(devuser)` route double path | URL `/devuser/X`, kod yolu `app/(devuser)/devuser/X/` |
| Admin sayfası boş görünüyor | `body[data-devuser]` set edilmemiş — `useEffect` ekle |
| Docker build ESLint hatası | `@typescript-eslint/no-explicit-any` comment'i sil, `npm run lint` temiz olmalı |
| `<a>` vs `<Link>` lint hatası | İç linkler için `next/link`'ten `Link` kullan |
| Admin auth "Service not configured" | `.env.local`'de `SUPABASE_SERVICE_ROLE_KEY` eksik |
| Admin auth "Invalid API key" | Yanlış service role key değeri |
| GitHub push secret engeli | `.env.example`'ı git takibinden çıkar, `git rm --cached` kullan |

---

## Claude Plugins (Aktif)

`.claude/settings.json`'da aktif olan pluginler:

| Plugin | Kaynak | Açıklama |
|---|---|---|
| `superpowers` | claude-plugins-official | Skill sistemi, brainstorming, plan/execute workflow |
| `frontend-design` | claude-plugins-official | UI/UX tasarım odaklı geliştirme |
| `supabase` | claude-plugins-official | Supabase entegrasyonu için özel yetenekler |
| `oh-my-claudecode` | omc (github) | Genişletilmiş Claude Code workflow'ları |

---

## Agents (Kullanılabilir)

`~/.claude/agents/`'da tanımlı, proaktif kullanılması önerilen agentler:

| Agent | Ne Zaman Kullan |
|---|---|
| `typescript-reviewer` | TypeScript/JS kod yazdıktan sonra — **ZORUNLU** |
| `code-reviewer` | Her kod değişikliğinden sonra |
| `security-reviewer` | Auth, input, API endpoint yazmadan önce |
| `planner` | Karmaşık özellik veya refactor öncesinde |
| `architect` | Mimari karar verirken |
| `tdd-guide` | Yeni özellik veya bug fix'te |
| `build-error-resolver` | Build/TypeScript hataları olduğunda |
| `database-reviewer` | SQL, migration, schema tasarımında |
| `refactor-cleaner` | Dead code temizliği için |
| `doc-updater` | Dokümantasyon güncellemelerinde |

---

## Skills (Slash Commands)

Skill çağırmak için: `Skill` tool veya `/skill-adı` ile kullan.

### Proje için en alakalı skilller

| Skill | Kullanım |
|---|---|
| `/tdd` | TDD workflow — önce test yaz |
| `/code-review` | Kod inceleme |
| `/security-review` | Güvenlik analizi |
| `/frontend-design` | UI/UX geliştirme |
| `/verify` | Tamamlanan iş doğrulama |
| `/plan` | Uygulama planı oluşturma |
| `/blueprint` | Tek satır hedeften adım adım plan |
| `/commit` | Git commit oluşturma |
| `/build-fix` | Build hatası çözme |
| `/simplify` | Kod sadeleştirme |

### oh-my-claudecode skilleri

| Skill | Açıklama |
|---|---|
| `/omc-plan` | Stratejik planlama (Opus) |
| `/omc-executor` | Odaklı görev çalıştırma |
| `/omc-debugger` | Kök neden analizi, debug |
| `/omc-code-reviewer` | Detaylı kod inceleme |
| `/omc-security-reviewer` | OWASP güvenlik analizi |
| `/omc-verifier` | Tamamlanma doğrulama |
| `/omc-test-engineer` | Test stratejisi |
| `/omc-tracer` | Kanıt tabanlı hata izleme |
| `/omc-qa-tester` | CLI test (tmux) |

---

## MCP Sunucuları

`~/.claude/mcp-configs/`'da tanımlı:

| MCP | Açıklama |
|---|---|
| `github` | PR, issue, repo yönetimi |
| `supabase` | Veritabanı işlemleri |
| `memory` | Oturumlar arası bellek |
| `sequential-thinking` | Zincirleme düşünme |
| `firecrawl` | Web scraping |
| `vercel` | Deployment yönetimi |

---

## Hooks (Otomatik)

`.claude/hooks/hooks.json`'dan çalışan otomatik hook'lar:

| Hook | Tetikleyici | Açıklama |
|---|---|---|
| `block-no-verify` | PreToolUse:Bash | `--no-verify` flag'ini engeller |
| `auto-tmux-dev` | PreToolUse:Bash | Dev server'ları tmux'ta otomatik başlatır |
| `tmux-reminder` | PreToolUse:Bash | Uzun işlemler için tmux hatırlatıcısı |
| `git-push-reminder` | PreToolUse:Bash | Push öncesi değişiklikleri gözden geçirme uyarısı |
| `parallel-reminder` | PreToolUse:Bash | Bağımsız işlemler için paralel execution önerir |

---

## SEO

```typescript
// Sayfa metadata
import { createMetadata } from '@/lib/seo/metadata';
export const metadata = createMetadata({ title: '...', description: '...' });

// Makale metadata
import { createArticleMetadata } from '@/lib/seo/metadata';
export const metadata = createArticleMetadata({ ... });
```
