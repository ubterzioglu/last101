# Hata Raporu — Anasayfa Görsel Yenileme Oturumu

**Tarih:** 2026-06-15
**Kapsam:** Anasayfa (homepage) neon/cyber-tech görsel yenilemesi sırasında karşılaşılan hatalar.

---

## Özet

| # | Hata | Kaynak | Benim değişikliğimle ilgili mi? | Güncel durum |
|---|------|--------|---------------------------------|--------------|
| 1 | `npm run build` tip hatasıyla kırılıyordu | `components/admin/news/*` (admin-haber WIP) | ❌ Hayır | ✅ Çözüldü (build temiz geçiyor) |
| 2 | `fetchPublishedNewsRows failed` runtime uyarısı | Supabase haber çekimi | ❌ Hayır | ⚠️ Devam ediyor (sayfa yine de render ediyor) |

> **Not:** Yaptığım hiçbir anasayfa dosyasında (hero, kartlar, layout, tailwind, globals.css) hata yok. Aşağıdaki iki hata da benim değişikliklerimden bağımsızdır.

---

## 1. Build'i kıran TypeScript tip hataları (admin-haber) — ✅ ÇÖZÜLDÜ

### Belirti
Görsel yenileme sırasında `npm run build` çalıştırıldığında derleme şu hatayla başarısız oluyordu:

```
./components/admin/news/NewsAdminPanel.tsx:216:11
Type error: Type '{ key: string; postId: string | undefined; onCreated: (id: any) => void; }'
is not assignable to type 'IntrinsicAttributes & { postId?: string | undefined; }'.
  Property 'onCreated' does not exist on type 'IntrinsicAttributes & { postId?: string | undefined; }'.
```

Ek olarak `tsc --noEmit` aşağıdaki hataları da gösteriyordu:

```
components/admin/news/NewsPipelineAdminClient.tsx(57,6):  TS2304: Cannot find name 'NewsAdminShell'.
components/admin/news/NewsPipelineAdminClient.tsx(118,7): TS2304: Cannot find name 'NewsAdminShell'.
components/admin/news/NewsSettingsAdminClient.tsx(53,6):  TS2739: '{ children; title; description; }'
   tipi 'NewsAdminShellProps' için gerekli şu alanları içermiyor: tabs, activeTab, onTabChange, onLogout
```

### Kök neden
- Bu hatalar **anasayfa görsel yenilemesinden tamamen bağımsız**, yarım kalmış bir **admin-haber paneli refactor'ından** kaynaklanıyordu.
- İlgili dosyalar (`NewsAdminPanel.tsx`, `NewsAdminShell.tsx`, `NewsQueueAdminClient.tsx`, `NewsPipelineAdminClient.tsx`, `NewsSettingsAdminClient.tsx` vb.) oturum başında çalışma ağacında değiştirilmiş/eklenmiş (untracked) halde bulunuyordu.
- `NewsAdminShell` bileşeninin prop sözleşmesi (`tabs`, `activeTab`, `onTabChange`, `onLogout`) ile onu kullanan client bileşenlerinin ona geçirdiği prop'lar uyuşmuyordu; ayrıca bazı dosyalarda import eksikti.

### Çözüm
Bu dosyalara **dokunmadım** (kapsam dışı + başkasının devam eden çalışması). Oturum sırasında bu admin-haber refactor'ı tamamlanmış ve hatalar giderilmiştir.

### Doğrulama
- `npx tsc --noEmit` → **exit 0, hata yok**
- `npm run build` → **başarıyla tamamlandı**, anasayfa (`○ /`) dahil tüm rotalar derlendi.

---

## 2. `fetchPublishedNewsRows failed` runtime uyarısı — ⚠️ DEVAM EDİYOR

### Belirti
Dev sunucuda anasayfa render edilirken loglara şu uyarı düşüyor:

```
fetchPublishedNewsRows failed: { ... }
```

### Kök neden
- Anasayfa, haber carousel'i için `getPublishedNewsItems(12)` çağrısıyla **Supabase'den yayınlanmış haberleri** çekiyor ([app/page.tsx:213](app/page.tsx#L213)).
- Bu çağrı dev ortamında başarısız oluyor — büyük olasılıkla eksik/yanlış Supabase ortam değişkenleri (`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`) veya ilgili tablo/satırların dev ortamında bulunmaması.
- **Görsel yenilemeyle ilgisi yok** — bu bir veri/ortam yapılandırması konusudur.

### Etki
- **Düşük.** Hata yakalanıp yönetiliyor; anasayfa yine de **HTTP 200** ile sorunsuz render ediliyor. Sadece haber carousel'i boş/eksik veriyle gelebilir.

### Öneri (yapılmadı — kapsam dışı)
- Dev ortamında `.env.local` içindeki Supabase değişkenlerinin doğru ayarlandığını kontrol et.
- `getPublishedNewsItems` / `fetchPublishedNewsRows` fonksiyonunda hata logunun tam içeriğini inceleyerek (RLS politikası, tablo adı, anahtar) gerçek nedeni netleştir.

---

## Anasayfa değişikliklerimin durumu

| Kontrol | Sonuç |
|---------|-------|
| `npm run lint` | ✅ Temiz |
| `npx tsc --noEmit` | ✅ Hata yok |
| `npm run build` | ✅ Başarılı |
| Anasayfa runtime | ✅ HTTP 200, hatasız render |
| Tasarım marker'ları (HTML'de) | ✅ `bg-aurora`, `text-gradient-tech`, `font-display`, `reveal-delay`, `shadow-glow`, neon font değişkenleri mevcut |

Değiştirdiğim dosyalar: `app/layout.tsx`, `tailwind.config.ts`, `app/globals.css`, `components/home/HomeHeroSection.tsx`, `components/home/LinkCard.tsx`, `components/home/LinkGridSection.tsx`, `app/page.tsx` — **hiçbirinde hata yok.**
