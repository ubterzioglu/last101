# Banka Seçim Aracı — Layout Güncelleme Tasarımı

**Tarih:** 2026-03-20
**Kapsam:** `app/banka-secim/BankaClient.tsx` ve `app/banka-secim/page.tsx` tam yenileme
**Yaklaşım:** Tam yenileme (mevcut mantık korunur, UI katmanı tamamen yeniden yazılır)

---

## Özet

Google Material tasarım diline dayalı, siyah arka plan üzerinde beyaz kartlardan oluşan bir quiz arayüzü. Mevcut skorlama/öneri mantığı (`useMemo`, `calculateBankScore`) dokunulmadan korunur; sadece JSX/CSS katmanı değişir. Soru kategorileri `data.ts`'e eklenir ve her soruda üst etiket olarak gösterilir.

---

## 1. Sayfa Yapısı (`page.tsx`)

### Arka Plan
- `bg-[#111111]` — tam siyah değil, hafif koyu (göz yorgunluğunu azaltır)
- `min-h-screen`

### Header
- almanya101.de küçük badge — `text-white/50`, `text-sm`
- `Banka Seçim Aracı` — `text-white`, `font-bold`, `text-2xl sm:text-3xl`
- Alt yazı — `text-white/50`
- Konum: `max-w-xl mx-auto text-center`, `mb-8`

### Footer
- Mevcut mavi footer (`bg-[#01A1F1]`) korunur

---

## 2. Stepper & Progress (`BankaClient.tsx`)

Mevcut ayrı "Progress Card" kaldırılır. Soru kartının içine entegre edilir:

```
[Soru 3 / 20]                              [Sıfırla]
[████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  ← mavi dolum bar
```

- Üst satır: `text-white/60 text-sm` + `Sıfırla` ghost butonu (siyah arka planda, `text-white/50`)
- Progress bar: `bg-white/10` zemin, `bg-blue-500` dolum, `transition-all duration-300`

---

## 3. Soru Kartı

### Kart Çerçevesi
- `bg-white rounded-2xl shadow-2xl` — siyah zemin üstünde güçlü kontrast
- `p-6`

### Kategori Etiketi
- `text-blue-600 text-xs font-semibold uppercase tracking-widest mb-2`
- Her soru için kategori ataması `data.ts`'deki `Question` tipine `category` alanı eklenerek yapılır

**Kategori Haritası:**

| Soru ID | Kategori |
|---|---|
| q1, q2, q3 | Profil |
| q4, q8, q9 | Şube & Nakit |
| q5, q6, q7 | Masraf & Ücretler |
| q10 | Kart Tercihi |
| q11, q12 | Yatırım |
| q13, q14 | Kripto |
| q15, q16 | Kullanım Tercihi |
| q17, q18, q19 | Güven & Destek |
| q20 | Genel Tercih |

### Soru Başlık Alanı
- `text-gray-900 font-bold text-lg mb-1` — başlık
- `text-gray-500 text-sm mb-5` — açıklama

### Seçenekler
Her seçenek için:

```
[gri numara badge] [label bold] [açıklama text-gray-500]
```

- **Seçilmemiş:** `bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all`
- **Seçili:** `bg-blue-50 border-2 border-blue-500 rounded-xl p-4`
- Numara badge: `w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold` (seçilince `bg-blue-100 text-blue-600`)
- Seçime tıklayınca otomatik ilerleme korunur

### Alt Bar
- Sol: `← Geri` — `text-sm text-gray-400 hover:text-gray-600`, disabled ilk soruda
- Sağ: `Seçince otomatik ilerler` — `text-xs text-gray-400`
- `border-t border-gray-100 mt-5 pt-4`

---

## 4. Info Kartı (Bilgi)

Mevcut sarı accordion korunur ama restyle:
- `bg-white border border-gray-200 rounded-2xl`
- Başlık: `text-gray-700 font-medium`
- İçerik: `text-gray-500 text-sm`
- Chevron ikonu (▼/▲ yerine SVG veya lucide-react `ChevronDown`)

---

## 5. Sonuç Ekranı

### Başlık (kart dışında, siyah zeminde)
- `Sonuçların hazır!` — `text-white font-bold text-2xl`
- `text-white/50 text-sm` — alt yazı

### #1 Öneri Kartı
- `bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-5`
- Üst badge: `bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full` — `EN UYGUN`
- Banka adı: `text-gray-900 font-bold text-xl`
- Tip: `text-gray-400 text-sm`
- Etiketler: `bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full`
- Maddeler: `text-gray-600 text-sm list-disc list-inside space-y-1`

### #2 ve #3 Kartları
- `bg-white rounded-2xl shadow-md border border-gray-200 p-4`
- Badge: `bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full`
- Daha kompakt — maddeler max 2 satır

### Butonlar
- `Tekrar Yap` — `bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-xl px-4 py-2.5 text-sm font-medium`
- `Sonucu Kopyala` — `bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-bold`

### Uyarı Notu
- `text-white/30 text-xs mt-4 leading-relaxed` — kart dışında

---

## 6. Tip Değişiklikleri (`types.ts`)

`Question` tipine `category` alanı eklenir:

```typescript
export interface Question {
  id: string;
  title: string;
  desc: string;
  type: 'single';
  category: string; // YENİ
  options: Option[];
}
```

---

## 7. Değişmeyen Parçalar

- Tüm skorlama mantığı (`scores`, `calculateBankScore`, `needs`, `topSignals`, `recommendations`)
- `handleAnswer`, `handleBack`, `handleReset`, `handleCopy`, `buildCopyText`
- `data.ts` — sadece `category` alanı eklenir, mevcut veri dokunulmaz
- `page.tsx` metadata

---

## 8. Dosya Değişiklik Özeti

| Dosya | Değişiklik |
|---|---|
| `app/banka-secim/BankaClient.tsx` | Tam UI yenileme (mantık korunur) |
| `app/banka-secim/page.tsx` | Header + arka plan güncelleme |
| `app/banka-secim/types.ts` | `Question`'a `category: string` eklenir |
| `app/banka-secim/data.ts` | Her soruya `category` değeri eklenir |
