# .0old (Eski Sistem) vs Yeni Sistem Karşılaştırması

## Eksik Özellikler ve Modüller

---

### 1. API Endpoints (Birçok API eksik)

Eski sistemde `api/` klasöründe **56+ API endpoint** varken, yeni sistemde sadece temel yapı var.

#### Admin API'leri
- [ ] `admin-auth-verify.js` - Admin yetkilendirme
- [ ] `admin-list.js` - Admin listesi
- [ ] `admin-update.js` - Admin güncelleme

#### Bookmarks (Yer İmleri)
- [ ] `bookmarks-admin-action.js`
- [ ] `bookmarks-admin-curate.js`
- [ ] `bookmarks-admin-list.js`
- [ ] `bookmarks-admin-update.js`
- [ ] `bookmarks-list.js`
- [ ] `bookmarks-submit.js`

#### Community Support (CS)
- [ ] `cs-admin-delete-answer.js`
- [ ] `cs-admin-delete-question.js`
- [ ] `cs-admin-list.js`
- [ ] `cs-answer-list.js`
- [ ] `cs-answer-submit.js`
- [ ] `cs-question-list.js`
- [ ] `cs-question-submit.js`

#### DevUser (Developer Topluluğu) - Kapsamlı
- [ ] `_devuser-admin.js` - Admin endpoint
- [ ] `_devuser-auth.js` - Auth endpoint
- [ ] `_supabase-user.js` - Supabase kullanıcı
- [ ] `devuser-admin-list.js`
- [ ] `devuser-admin-update.js`
- [ ] `devuser-auth.js`
- [ ] `devuser-count.js`
- [ ] `devuser-dis-admin-action.js` - Tartışma admin
- [ ] `devuser-dis-admin-list.js`
- [ ] `devuser-dis-list.js`
- [ ] `devuser-dis-submit.js` - Tartışma gönder
- [ ] `devuser-list.js`
- [ ] `devuser-me.js` - Kendi profili
- [ ] `devuser-register.js`
- [ ] `devuser-update.js`
- [ ] `devusers.js` / `devusers-new.js`

#### Etkinlikler (E1 & E2)
- [ ] `event-e1-admin-action.js`
- [ ] `event-e1-admin-list.js`
- [ ] `event-e1-question-list.js`
- [ ] `event-e1-question-submit.js`
- [ ] `event-e1-results.js`
- [ ] `event-e1-submit.js`
- [ ] `event-e2-*.js` (E2 için benzer set)

#### Diğer
- [ ] `cvopt-register.js` - CV optimizasyon kayıt
- [ ] `cvopt-satisfaction-stats.js`
- [ ] `dik-admin-action.js` / `dik-admin-list.js`
- [ ] `dik-submit.js`
- [ ] `fikir-submit.js` - Fikir kutusu
- [ ] `get-users.js`
- [ ] `google-place-sync.js`
- [ ] `meeting-attendance-*.js` (3 endpoint)
- [ ] `meeting-survey-submit.js`
- [ ] `news-admin-action.js` / `news-admin-list.js`
- [ ] `newsletter-subscribe.js`
- [ ] `participant-admin-*.js` (2 endpoint)
- [ ] `tavla-register.js` - Tavla turnuvası
- [ ] `vct-register.js` - VCT kayıt
- [ ] `vizeqa-question-list.js` / `vizeqa-question-submit.js`

---

### 2. Sayfalar / Modüller

| Modül | Eski Sistem | Yeni Sistem | Durum |
|-------|-------------|-------------|-------|
| **Ana Sayfa** | `index.html` | `app/page.tsx` | ✅ Taşındı |
| **Banka Seçimi** | `banka/` | `app/banka-secim/` | ✅ Aktif |
| **Belgeler** | `belgeler/` | `app/belgeler/` | ⚠️ Var ama boş |
| **DevUser** | `devuser/` (15+ dosya) | `public/devuser/` statik | ❌ **EKSİK** |
| **Etkinlikler** | `etkinlik/`, `devuser/e*.html` | Yok | ❌ **EKSİK** |
| **Fikir Kutusu** | `fikir/` | Yok | ❌ **EKSİK** |
| **Gastronomi** | `gastronomi/` | Yok | ❌ **EKSİK** |
| **Gen (Nesil)** | `gen/` | Yok | ❌ **EKSİK** |
| **GetGot** | `getgot/` | Yok | ❌ **EKSİK** |
| **Haberler** | `haberler/` (admin+detay) | `app/haberler/` | ⚠️ Temel sayfa |
| **Hizmet Rehberi** | `rehber/`, `gastronomi/` | `public/rehber-old/` | ❌ **EKSİK** |
| **İş Başvuru (ATS)** | `ats/` (PDF.js ile) | Yok | ❌ **EKSİK** |
| **Maaş Hesaplama** | `maas/` (detaylı) | Yok | ❌ **EKSİK** |
| **OParayaBen** | `oparayaben/` | Yok | ❌ **EKSİK** |
| **Para Transferi** | `paratransfer/` | `app/(marketing)/para-transferi/` | ✅ Aktif |
| **Path (Kariyer)** | `path/` | Yok | ❌ **EKSİK** |
| **QA (Soru-Cevap)** | `qa/` | Yok | ❌ **EKSİK** |
| **Sigorta Seçimi** | `sigorta/` | `app/sigorta-secim/` | ✅ Aktif |
| **Support Each Other** | `sc/`, `supporteachother/` | Yok | ❌ **EKSİK** |
| **Tatil Planlayıcı** | Yok | `app/(marketing)/tatil/` | ✅ Yeni özellik |
| **Vatandaşlık Testi** | `vatandas/` | `app/vatandaslik-testi/` | ✅ Aktif |
| **Vize QA** | `vizeqa/` | Yok | ❌ **EKSİK** |
| **Yazı Dizisi** | Yok | `app/yazi-dizisi/` | ✅ Yeni sayfa |

---

### 3. DevUser Sistemi Detayları

Eski sistemde kapsamlı bir developer topluluğu vardı:

#### Sayfalar
- `du.html` - Kayıt formu (25 soru)
- `list.html` - Üye arama/liste
- `profile-edit.html` - Profil düzenleme
- `admin.html` - Admin paneli
- `discussion.html` - Tartışma forumu
- `cvopt.html` - CV optimizasyonu
- `e1.html`, `e2.html` - Etkinlikler
- `tavla.html` - Tavla turnuvası
- `vct.html` - VCT sistemi
- `survey.html` - Anketler
- `news.html` - Gelişmeler/haberler
- `dad.html`, `disad.html` - DAD/DISAD modülleri

#### Özellikler
- Kapsamlı kullanıcı profili (25 alan)
- Şehir, rol, deneyim filtreleme
- LinkedIn/WhatsApp entegrasyonu
- Tartışma forumu
- Etkinlik yönetimi
- CV optimizasyon aracı

#### Veritabanı Tabloları
- `devuser` - Ana kullanıcı tablosu
- `devuser_discussion` - Tartışmalar
- `cvopt_participants` - CV katılımcıları
- `event_e1_*`, `event_e2_*` - Etkinlik tabloları

---

### 4. Admin Paneli

Eski sistemde (`admin/`):
- `admin.html` - Admin dashboard
- `admin.js` - Admin işlevleri
- Kullanıcı yönetimi
- İçerik moderasyonu
- İstatistikler

Yeni sistemde: **YOK**

---

### 5. Bookmarks Sistemi

Eski sistemde (`bookmarks/`):
- Kullanıcıların yer imi kaydetmesi
- Admin paneli (onay/ret)
- Kategoriler
- API entegrasyonu

Yeni sistemde: **YOK**

---

### 6. Diğer Önemli Dosyalar

#### Shared Components
- ❌ `shared-cards.js` - Ortak kart/footer JS
- ❌ `ubt-shared.css` - Ortak CSS

#### Scripts
Eski sistemde (`scripts/`):
- `backup-db*.js` - Veritabanı yedekleme
- `generate-vatandaslik-seed.mjs` - Vatandaşlık soruları
- `insert-doctors.js` - Doktor ekleme
- `scrape-*.js` - Web scraping
- `upload-questions.js` - Soru yükleme
- `verify-doctors.js` - Doğrulama

#### Supabase
Eski sistemde **35+ migration** var:
- Vatandaşlık soruları
- DevUser tabloları
- Etkinlik tabloları
- CV Optimizasyon
- Toplantı/anket
- Turnuva tabloları
- Admin API keys

---

### 7. Görsel/Statik Dosyalar Eksikleri

#### Eski Sistem (`img/`)
| Klasör | İçerik | Yeni Sistem |
|--------|--------|-------------|
| `bookmarks/` | 50+ yer imi logosu | ❌ Yok |
| `brands/` | 15 marka logosu | ❌ Yok |
| `buttons/` | UI butonları | ❌ Yok |
| `generations/` | 12 nesil avatarı | ❌ Yok |
| `icons/` | Sosyal medya ikonları | ❌ Yok |
| `misc/` | Çeşitli görseller | ❌ Yok |
| `social/` | Sosyal medya logoları | ❌ Yok |
| `tools/` | Araç görselleri | ❌ Yok |
| `ui/` | UI elementleri | ❌ Yok |

#### Yeni Sistem (`public/images/`)
- Sadece temel hero görselleri
- Profil fotoğrafları
- Arka plan görselleri

---

## Özet: Öncelikli Eklenecekler

### 🔴 Yüksek Öncelik (Kritik/Trafikli)
1. **Maaş Hesaplama** - En çok kullanılan araç
2. **Haberler Sistemi** - Admin paneliyle beraber
3. **DevUser Sistemi** - Topluluk platformu
4. **Belgeler Arşivi** - Önemli kaynak

### 🟡 Orta Öncelik
5. **ATS (İş Başvuru Takibi)** - PDF özelliği
6. **Vize QA** - Vize süreci desteği
7. **Hizmet Rehberi** - Türk uzmanlar rehberi
8. **Bookmarks** - Kullanıcı kaydetme
9. **Gastronomi Rehberi**

### 🟢 Düşük Öncelik
10. Etkinlik sistemi (E1, E2)
11. OParayaBen
12. Path (Kariyer)
13. GetGot
14. Fikir Kutusu
15. Support Each Other

### 🔵 Teknik Altyapı
16. Admin Paneli
17. API endpoint'lerinin modernizasyonu
18. Eksik görsellerin taşınması
19. Supabase migration'ların senkronizasyonu

---

## Teknik Notlar

### Eski Sistem
- HTML/CSS/JS (jQuery)
- Vanilla JavaScript
- Supabase JS client
- Vercel serverless functions

### Yeni Sistem
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Modern Supabase SSR
- Server/Client components

### Taşıma Stratejisi
1. Önce statik sayfaları taşı
2. API'leri modernize et
3. Veritabanı şemalarını kontrol et
4. Görselleri optimize ederek taşı
5. Admin panelini en son ekle
