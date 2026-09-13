# Dokümantasyon

Bu klasör `almanya101` deposunun tüm dökümanlarını barındırır. Kökte yalnızca
üç dosya kalır: `README.md` (proje tanıtımı ve kurulum), `CLAUDE.md` (kod
çalışma rehberi) ve `AGENTS.md` (ajanlar için giriş noktası).

## Klasörler

| Klasör | Ne içerir | Güncel tutulur mu? |
|---|---|---|
| `runbooks/` | Hâlâ uygulanan operasyon rehberleri — backfill, deploy, E2E | Evet |
| `content/` | Türkçe içerik ve tanıtım taslakları, araç spesifikasyonları | Kısmen |
| `archive/` | Tamamlanmış tek seferlik raporlar ve analizler | Hayır, tarihsel kayıt |
| `handovers/` | Oturum devir notları | Hayır |
| `superpowers/` | Brainstorm çıktıları: `specs/` ve `plans/` | Hayır |

## Runbook'lar

| Dosya | Konu |
|---|---|
| `runbooks/BACKFILL_AGENT_MASTER.md` | Rehber backfill agent master brief |
| `runbooks/BACKFILL_AI_RUNBOOK.md` | AI için güvenli backfill runbook |
| `runbooks/avukat.md` | Avukat24 backfill brief — `scripts/backfill-avukat24.mjs` |
| `runbooks/ta.md` | Türkische Ärzte backfill brief — `scripts/backfill-tuerkische-aerzte.mjs` |
| `runbooks/NEWS_PIPELINE_DEPLOY.md` | Haber pipeline kurulum ve deploy |
| `runbooks/news.md` | Admin paneli + haber pipeline teknik dökümanı |
| `runbooks/admin.md` | Admin dark-mode E2E test dökümanı |
| `runbooks/E2E_TEST_KULLANIM.md` | E2E test kullanım kılavuzu |
| `runbooks/SUPABASE_TODO.md` | Açık Supabase entegrasyon maddeleri |

## Taşıma tablosu (2026-09-13)

Repo kökü 25 markdown dosyasından temizlendi. Eski yollar:

| Eski (kök) | Yeni |
|---|---|
| `BACKFILL_AGENT_MASTER.md`, `BACKFILL_AI_RUNBOOK.md`, `NEWS_PIPELINE_DEPLOY.md`, `E2E_TEST_KULLANIM.md`, `SUPABASE_TODO.md`, `avukat.md`, `ta.md`, `news.md`, `admin.md` | `docs/runbooks/` |
| `belgeler.md`, `araclar-tanitim.md`, `commercial.md`, `newtools.md`, `toolsrenewed.md`, `notyarinbak.md` | `docs/content/` |
| `CLEANUP_ANALYSIS.md`, `HATALAR.md`, `compare.md`, `diary.md`, `nad1.md`, `kose-yazisi-eksikler.md`, `kose-yazisi-modul-durum.md` | `docs/archive/` |
| `english-jobs-insert.sql` | `docs/archive/sql/` |
| `update_oneri.js` | `docs/archive/scripts/` |

Silinenler (hepsi birebir kopyaydı): `a101newtools.md` (= `newtools.md`),
kökteki `og.png` ve `yeniherologo.png` (= `public/` altındaki kopyalar).

`supabase/migrations/*.sql` içindeki `news.md §…` yorumları bilerek
güncellenmedi — uygulanmış migration'lar tarihsel kayıttır, bölüm
referansları o günkü dökümanı işaret eder.
