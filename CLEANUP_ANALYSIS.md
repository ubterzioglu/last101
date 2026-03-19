# .0old Klasör Analizi - Temizlik Raporu

## 📊 Genel İstatistikler

- **Toplam Dosya**: ~400+ dosya
- **Kategori Sayısı**: 15+
- **Tahmini Gereksiz**: ~30%
- **Tahmini Değerli**: ~70%

---

## 🗂️ Kategori Analizi

### 1. AI Agent & Dokümantasyon (DEĞERLİ)
**Konum**: `.00agent/`, `.kilocode/`

| Dosya | Önem | Not |
|-------|------|-----|
| `.00agent/devuser-docs/*.md` | ⭐⭐⭐⭐⭐ | DevUser kurulum ve güvenlik dokümanları |
| `.00agent/plans/*.md` | ⭐⭐⭐⭐ | Proje planları ve analizler |
| `.00agent/MEMORY.md` | ⭐⭐⭐⭐ | Agent hafıza/history |
| `.kilocode/rules-*/AGENTS.md` | ⭐⭐⭐ | AI agent kuralları |

**Öneri**: ✅ **KORU** - Geçmiş kararları ve konfigürasyonları içerir

---

### 2. Eski Provider Verileri (DEĞERLİ)
**Konum**: `.0md/old/`

| Tür | Dosya Sayısı | Önem |
|-----|--------------|------|
| Bochum Providers | 5 SQL | ⭐⭐⭐ |
| Dortmund Providers | 11 SQL | ⭐⭐⭐⭐ |
| Düsseldorf Providers | 7 dosya | ⭐⭐⭐ |
| Duisburg Providers | 5 SQL | ⭐⭐⭐ |
| Essen Providers | 5 SQL | ⭐⭐⭐ |
| Gelsenkirchen Providers | 5 SQL | ⭐⭐⭐ |
| Köln Providers | 4 SQL | ⭐⭐⭐⭐ |

**Öneri**: ✅ **KORU** - Veri kaynağı olarak kullanılabilir
**Alternatif**: Tek bir `providers-archive/` klasöründe birleştir

---

### 3. IDE/Editor Config (GEREKSİZ)
**Konum**: `.idea/`, `.vscode/`, `.serena/`

| Dosya | Gereklilik |
|-------|------------|
| `.idea/*` | ❌ **SİL** - IntelliJ konfigürasyonu |
| `.vscode/*` | ❌ **SİL** - VSCode konfigürasyonu |
| `.serena/*` | ❌ **SİL** - Serena AI konfigürasyonu |
| `.project` | ❌ **SİL** - Eclipse dosyası |

**Öneri**: ❌ **SİL** - Yeni projede yeniden oluşturulabilir

---

### 4. Astro Build Artifacts (GEREKSİZ)
**Konum**: `.astro/`, `dist/`

| Dosya | Gereklilik |
|-------|------------|
| `.astro/*.d.ts` | ❌ **SİL** - TypeScript decleration |
| `.astro/*.mjs` | ❌ **SİL** - Build modülleri |
| `dist/_astro/*` | ❌ **SİL** - Build çıktıları |
| `dist/robots.txt` | ❌ **SİL** - Build çıktısı |

**Öneri**: ❌ **SİL** - Build çıktıları yeniden oluşturulabilir

---

### 5. API Endpointleri (DEĞERLİ)
**Konum**: `api/`

| Modül | Dosya Sayısı | Önem | Taşıma Durumu |
|-------|--------------|------|---------------|
| Admin | 6 JS | ⭐⭐⭐⭐ | Yeni sistemde yok |
| Bookmarks | 6 JS | ⭐⭐⭐⭐ | Yeni sistemde yok |
| Community Support (CS) | 7 JS | ⭐⭐⭐⭐ | Yeni sistemde yok |
| DevUser | 16+ JS | ⭐⭐⭐⭐⭐ | Yeni sistemde yok |
| Etkinlikler (E1/E2) | 12 JS | ⭐⭐⭐ | Yeni sistemde yok |
| Diğer | 10+ JS | ⭐⭐⭐ | Çeşitli |

**Öneri**: ✅ **KORU** - Modüler taşıma için referans

---

### 6. Modül Sayfaları (DEĞERLİ)
**Konum**: `banka/`, `bookmarks/`, `devuser/`, `haberler/`, etc.

| Modül | Durum | Yeni Sistem | Öncelik |
|-------|-------|-------------|---------|
| `banka/` | ✅ Taşındı | `app/banka-secim/` | - |
| `bookmarks/` | ❌ Eksik | Yok | 🟡 Orta |
| `devuser/` | ❌ Eksik | `public/devuser/` (statik) | 🔴 Yüksek |
| `haberler/` | ⚠️ Kısmi | `app/haberler/` (temel) | 🟡 Orta |
| `belgeler/` | ❌ Eksik | Yok | 🔴 Yüksek |
| `maas/` | ✅ Taşındı | `app/maas-hesaplama/` | - |
| `sigorta/` | ✅ Taşındı | `app/sigorta-secim/` | - |
| `vatandas/` | ✅ Taşındı | `app/vatandaslik-testi/` | - |
| `ats/` | ❌ Eksik | Yok | 🟡 Orta |
| `paratransfer/` | ✅ Taşındı | `app/(marketing)/para-transferi/` | - |
| `tatil/` | ✅ Taşındı | `app/(marketing)/tatil/` | - |

**Öneri**: ✅ **KORU** - Taşıma tamamlanana kadar

---

### 7. Görseller (DEĞERLİ)
**Konum**: `img/`

| Kategori | Dosya Sayısı | Durum |
|----------|--------------|-------|
| `img/app/` | 1 görsel | Kontrol et |
| `img/articles/` | 3 görsel | Kontrol et |
| `img/bookmarks/` | 60+ görsel | ✅ KORU |
| `img/brands/` | 15 görsel | ✅ KORU |
| `img/buttons/` | 5 görsel | ✅ KORU |
| `img/generations/` | 12 görsel | ❓ Kontrol et (Gen modülü eksik) |
| `img/icons/` | 12 görsel | ✅ KORU |
| `img/misc/` | 8 dosya | ⚠️ Temizlenebilir |
| `img/social/` | 10 görsel | ✅ KORU |
| `img/tools/` | 9 görsel | ✅ KORU |
| `img/ui/` | 4 görsel | ✅ KORU |

**Öneri**: 
- ✅ **KORU**: bookmarks, brands, buttons, icons, social, tools, ui
- ⚠️ **TEMİZLE**: misc (eski/logolu görseller)
- ❓ **DEĞERLENDİR**: generations (Gen modülü taşınırsa)

---

### 8. Supabase (KRİTİK DEĞERLİ)
**Konum**: `supabase/`

| Dosya | Önem | Not |
|-------|------|-----|
| `migrations/*.sql` | ⭐⭐⭐⭐⭐ | Tüm DB şeması |
| `functions/*` | ⭐⭐⭐⭐ | Edge functions |
| `config.toml` | ⭐⭐⭐ | Supabase config |

**Öneri**: ✅ **KORU** - Production veritabanı şeması
**Önemli Migration'lar**:
- `20260128*` - Vatandaşlık soruları
- `20260211*` - DevUser tabloları
- `20260221*` - Etkinlik tabloları
- `202603*` - Turnuva, CV opt, toplantı

---

### 9. Scripts (DEĞERLİ)
**Konum**: `scripts/`

| Script | Amaç | Önem |
|--------|------|------|
| `generate-vatandaslik-seed.mjs` | Vatandaşlık soruları üret | ⭐⭐⭐⭐ |
| `upload-questions.js` | Soru yükleme | ⭐⭐⭐⭐ |
| `insert-doctors.js` | Doktor ekleme | ⭐⭐⭐ |
| `scrape-*.js` | Web scraping | ⭐⭐ |
| `backup-db*.js` | Yedekleme | ⭐⭐⭐ |
| `check-*.js` | Doğrulama | ⭐⭐ |

**Öneri**: ✅ **KORU** - Veri işleme scriptleri

---

### 10. Dokümanlar (DEĞERLİ)
**Konum**: `docs/`

| Dosya | İçerik | Önem |
|-------|--------|------|
| `2026-02-22-profile-edit-*.md` | Profil edit planı | ⭐⭐⭐ |
| `2026-02-22-vizeqa-*.md` | Vize QA planı | ⭐⭐⭐ |
| `2026-03-13-meeting-attendance*.md` | Toplantı planı | ⭐⭐⭐ |

**Öneri**: ✅ **KORU** - Planlama dokümanları

---

## 🗑️ Güvenle Silinebilir Dosyalar

### 1. IDE Konfigürasyonları (~20 dosya)
```
.idea/*
.vscode/*
.serena/*
.project
.claude/settings.local.json
```

### 2. Build Artifacts (~10 dosya)
```
.astro/*
dist/_astro/*
app/layout.tsx (eski)
app/page.tsx (eski)
app/globals.css (eski)
```

### 3. Backup ve Temp Dosyalar (~10 dosya)
```
*backup*
*tmp*
*.tmp
.tmp_live_du.html
```

### 4. Astro/Yeni Sistem Kalanları (~5 dosya)
```
astro.config.mjs
next.config.ts (eski)
next-env.d.ts (eski)
app/[...slug]/route.ts
app/api/[...slug]/route.ts
```

---

## ✅ Kesinlikle Korunmalı Dosyalar

### 1. Supabase Migrations (~40 SQL)
- Tüm `supabase/migrations/*.sql` dosyaları
- `supabase/functions/`

### 2. API Endpointleri (~60 JS)
- `api/` klasörü tamamı (modüler taşıma için)

### 3. Modül Kaynakları (~100 dosya)
- `devuser/`
- `bookmarks/`
- `haberler/`
- `belgeler/`
- `ats/`
- `gastronomi/`
- `rehber/`

### 4. Görseller (~140 dosya)
- `img/bookmarks/`
- `img/brands/`
- `img/buttons/`
- `img/icons/`
- `img/social/`
- `img/tools/`
- `img/ui/`

### 5. Veri Scriptleri (~15 dosya)
- `scripts/*.js`
- `.0md/old/*.sql`

### 6. Dokümantasyon (~20 dosya)
- `.00agent/*.md`
- `docs/plans/*.md`

---

## 📋 Temizlik Planı

### Adım 1: Güvenli Silme (Hemen)
```powershell
# IDE config
Remove-Item .idea -Recurse -Force
Remove-Item .vscode -Recurse -Force
Remove-Item .serena -Recurse -Force
Remove-Item .project -Force

# Build artifacts
Remove-Item .astro -Recurse -Force
Remove-Item dist -Recurse -Force

# Astro remnants
Remove-Item astro.config.mjs -Force
```

### Adım 2: Eski Yedekleri Silme
```powershell
# Backup files
Get-ChildItem -Filter "*backup*" | Remove-Item -Force
Get-ChildItem -Filter "*tmp*" | Remove-Item -Force
```

### Adım 3: Yeni Sistem Eski Kalanları
```powershell
# Old app folder
Remove-Item app -Recurse -Force
```

### Adım 4: Archive Oluşturma
```powershell
# Tüm değerli dosyaları bir arşiv klasöründe topla
New-Item -ItemType Directory -Force -Path ".0old-archive"
```

---

## 🎯 Özet

| Kategori | Durum | Dosya Sayısı |
|----------|-------|--------------|
| ✅ **KORU** | Kritik/Değerli | ~300 |
| ⚠️ **DEĞERLENDİR** | Karar gerektiren | ~30 |
| ❌ **SİL** | Güvenle silinebilir | ~70 |

**Toplam Tasarruf**: ~70 dosya (~%17 azalma)
