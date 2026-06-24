# HANDOVER — Working Tree Devir Notu

> **Tarih:** 2026-06-25
> **Hazırlayan:** Güvenlik Notları / News Pipeline oturumu
> **Mevcut branch:** `main`
> **Amaç:** Çalışma ağacında (working tree) duran ve **bu oturuma ait olmayan**, başka oturumların sahiplenmesi gereken commit'siz değişiklikleri devretmek.

---

## TL;DR

`main` working tree'sinde, benim işimle **ilgisiz**, henüz hiçbir branch'e commit'lenmemiş 3 ayrı iş seti duruyor. Branch değiştirildiğinde commit'siz dosyalar taşındığı için hepsi `main`'de görünüyor — ama **commit'lenmemeliler** (en azından `main`'e). Aşağıda her set, sahibi ve yapılacak aksiyon var.

Benim (bu oturumun) işi **zaten commit'lendi** — aşağıdaki "Bana ait, tamamlandı" bölümüne bak. Onlara dokunma.

---

## 1. OG Image Fix — başka oturuma ait ⚠️

**Dosyalar (hepsi `M` modified):**
- `lib/utils/constants.ts` — `DEFAULT_OG_IMAGE = '/og.png'` → `'/og.png?v=2'`
- `lib/seo/metadata.ts` — `.png` tespiti query string'i yok sayacak regex'e çevrildi
- `lib/public-news.ts` — hardcoded `/og.png` fallback'i `DEFAULT_OG_IMAGE`'e bağlandı
- `OG_IMAGE_FIX_HANDOFF.md` (untracked) — bu işin KENDİ devir dökümanı

**Durum:** Bu iş kendi handoff dökümanını içeriyor (`OG_IMAGE_FIX_HANDOFF.md`) — ne yapıldığı, neden, kalan deploy adımları (commit + push + Coolify, Facebook Debugger ile cache temizliği, WhatsApp testi) orada **eksiksiz** yazılı.

**Yapılacak (sahibi):**
1. Bu 3 dosyayı birlikte commit'le (tek tutarlı değişiklik):
   ```bash
   git add lib/utils/constants.ts lib/seo/metadata.ts lib/public-news.ts
   ```
   Önerilen mesaj `OG_IMAGE_FIX_HANDOFF.md` içinde hazır.
2. `OG_IMAGE_FIX_HANDOFF.md`'yi de commit'le veya `docs/` altına taşı.
3. Deploy sonrası Facebook Debugger ile scrape (kritik — detay handoff'ta).

---

## 2. E2E Test Çalışması — `test/interactive-tools-e2e` branch'ine ait ⚠️

**Dosyalar (untracked, `main`'de):**
- `e2e/` — Playwright testleri (auth.setup.ts, smoke/, tools/). **Bu klasör zaten `test/interactive-tools-e2e` branch'inde commit'li** (son commit `e737de4 docs(e2e): document gated tool tests`).
- `toools.md` — E2E test stratejisi/raporu dokümanı (isim muhtemelen yazım hatası → `docs/e2e-test-plan.md`).
- `playwright-report/`, `test-results/` — test çalıştırma artifact'leri (`.gitignore`'da; commit'lenmemeli).

**Neden `main`'de görünüyor:** Bu dosyalar `test/interactive-tools-e2e` branch'inde commit'siz oldukları için branch geçişinde working tree'de kaldılar.

**Yapılacak (sahibi):**
1. `test/interactive-tools-e2e` branch'ine geç: `git switch test/interactive-tools-e2e`
2. `toools.md`'yi orada commit'le (gerekiyorsa yeniden adlandır).
3. `playwright-report/` ve `test-results/` artifact'lerini commit'leme (gitignore zaten kapsıyor; gerekiyorsa `git clean` ile temizle).
4. `e2e/` zaten o branch'te tracked — ek aksiyon gerekmeyebilir, `git status` ile doğrula.

---

## 3. Bana ait — TAMAMLANDI ✅ (dokunma)

Bu oturumun işi **`main`'de commit'lendi**, working tree'de kalan bir parçası yok:

| Commit | İçerik |
|---|---|
| `6f20674` | feat(admin): Supabase-backed security notes module (tablo, API, admin sayfa, sidebar, eslint fix) |
| `b2e7fa5` | chore(security): .secret takipten çıkar + gitignore |
| (önceki) | News pipeline: trthaber adaptörü, kaynak seed, cron migration'ları |

**İlgili açık aksiyon (kullanıcıda):** `.secret` içindeki Supabase PAT git geçmişine (`f02abaf`) sızmıştı → **revoke + yenile** gerekiyor. Bu uyarı `security_notes` tablosuna ilk kayıt olarak eklendi (admin → Güvenlik Notları).

---

## Özetle: hızlı eylem listesi (devralan oturum)

- [ ] OG fix 3 dosyasını commit'le (mesaj `OG_IMAGE_FIX_HANDOFF.md`'de) + deploy + FB Debugger scrape
- [ ] E2E: `test/interactive-tools-e2e`'e geç, `toools.md`'yi commit'le, artifact'leri temizle
- [ ] `playwright-report/` ve `test-results/`'ı **commit'leme** (gitignore'lu artifact)
- [ ] Benim `main` commit'lerime (`6f20674`, `b2e7fa5`, news pipeline) **dokunma**

> Not: `main`'e henüz push yapılmadı. OG fix ve E2E işleri kendi branch/akışlarında commit'lendikten sonra push sırası koordine edilebilir.
