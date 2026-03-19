# Banka Seçim Aracı Layout Güncelleme — Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `app/banka-secim` arayüzünü Google Material tasarım diline, siyah arka plan + beyaz kart sistemine taşımak; mevcut skorlama mantığına dokunmadan sadece UI katmanını yenilemek.

**Architecture:** `types.ts`'e `category` alanı eklenir, `data.ts`'deki her soruya kategori atanır, ardından `BankaClient.tsx` ve `page.tsx` tamamen yeniden yazılır. Mantık (`useMemo`, skorlama, öneri üretimi) değişmez.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, TailwindCSS, `cn()` utility (`@/lib/utils/cn`)

---

### Task 1: `types.ts` — `category` alanı ekle

**Files:**
- Modify: `app/banka-secim/types.ts`

- [ ] **Step 1: Mevcut `types.ts` dosyasını oku**

```bash
cat app/banka-secim/types.ts
```

- [ ] **Step 2: `Question` tipine `category` alanı ekle**

`Question` interface'ine şu satırı ekle:
```typescript
category: string;
```

- [ ] **Step 3: Build kontrolü yap**

```bash
npm run build 2>&1 | head -30
```

`data.ts`'de `category` eksik olduğundan TypeScript hatası beklenir — bu beklenen bir durum, sonraki task'ta düzeltilecek.

- [ ] **Step 4: Commit**

```bash
git add app/banka-secim/types.ts
git commit -m "feat(banka-secim): add category field to Question type"
```

---

### Task 2: `data.ts` — Her soruya kategori ata

**Files:**
- Modify: `app/banka-secim/data.ts`

- [ ] **Step 1: Her `Question` objesine `category` ekle**

Aşağıdaki haritaya göre her soruya `category` alanını ekle:

| Soru ID | category değeri |
|---|---|
| q1, q2, q3 | `'Profil'` |
| q4, q8, q9 | `'Şube & Nakit'` |
| q5, q6, q7 | `'Masraf & Ücretler'` |
| q10 | `'Kart Tercihi'` |
| q11, q12 | `'Yatırım'` |
| q13, q14 | `'Kripto'` |
| q15, q16 | `'Kullanım Tercihi'` |
| q17, q18, q19 | `'Güven & Destek'` |
| q20 | `'Genel Tercih'` |

Örnek — q1 için:
```typescript
{
  id: 'q1',
  category: 'Profil',
  title: 'Almanya\'da ne zamandır yaşıyorsun?',
  // ... geri kalanı aynı
}
```

- [ ] **Step 2: Build kontrolü yap — hata olmamalı**

```bash
npm run build 2>&1 | head -30
```

Beklenen: TypeScript hatası yok.

- [ ] **Step 3: Commit**

```bash
git add app/banka-secim/data.ts
git commit -m "feat(banka-secim): add category to all questions"
```

---

### Task 3: `page.tsx` — Siyah arka plan + yeni header

**Files:**
- Modify: `app/banka-secim/page.tsx`

- [ ] **Step 1: Mevcut `page.tsx` içeriğini incele**

Mevcut header ve arka plan sınıflarını not et (özellikle `bg-gradient-to-b from-[#050127]` kısımları).

- [ ] **Step 2: `page.tsx`'i yeniden yaz**

```tsx
import { createMetadata } from '@/lib/seo/metadata';
import BankaClient from './BankaClient';

export const metadata = createMetadata({
  title: 'Banka Seçim Aracı',
  description: '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.',
  path: '/banka-secim',
});

export default function BankaSecimPage() {
  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-white/50 text-sm font-medium">almanya101.de</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Banka Seçim Aracı
        </h1>
        <p className="text-white/50">20 soruyla size en uygun bankayı bulun</p>
      </div>

      {/* Quiz */}
      <BankaClient />

      {/* Footer */}
      <div className="max-w-xl mx-auto mt-12 text-center">
        <div className="bg-[#01A1F1] rounded-2xl p-5 text-white">
          <p className="font-medium mb-1">yalnız değilsin! almanya101 seninle!</p>
          <p className="text-xs text-white/70">made by UBT with love</p>
          <p className="text-xs text-white/60 mt-2">&copy; almanya101de &bull; 2026</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Dev server'da görsel kontrol**

```bash
npm run dev
```

`http://localhost:3000/banka-secim` adresini aç. Siyah arka plan ve beyaz header metni görünmeli.

- [ ] **Step 4: Commit**

```bash
git add app/banka-secim/page.tsx
git commit -m "feat(banka-secim): black background and updated header"
```

---

### Task 4: `BankaClient.tsx` — Stepper + Progress entegrasyonu

**Files:**
- Modify: `app/banka-secim/BankaClient.tsx`

Bu task mevcut ayrı "Progress Card"ı kaldırır ve yeni stepper'ı ekler. Mantık state'lerine (`useState`, `useMemo`, handler'lar) dokunmadan sadece JSX değişir.

- [ ] **Step 1: Mevcut `BankaClient.tsx`'i oku**

Özellikle progress card JSX'ini (satır 172–192 arası) not et.

- [ ] **Step 2: Return bloğunun başındaki progress card'ı yeni stepper ile değiştir**

`{!showResult && (` bloğu içindeki ilk `<div>` (progress card) yerine:

```tsx
{!showResult && (
  <div className="max-w-xl mx-auto mb-3">
    <div className="flex justify-between items-center mb-2">
      <span className="text-white/50 text-sm">
        Soru {currentQuestion + 1} / {totalQuestions}
      </span>
      <button
        onClick={handleReset}
        className="text-xs text-white/40 hover:text-white/70 transition-colors"
      >
        Sıfırla
      </button>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
)}
```

- [ ] **Step 3: Build kontrolü**

```bash
npm run build 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add app/banka-secim/BankaClient.tsx
git commit -m "feat(banka-secim): replace progress card with inline stepper"
```

---

### Task 5: `BankaClient.tsx` — Soru kartı Material redesign

**Files:**
- Modify: `app/banka-secim/BankaClient.tsx`

- [ ] **Step 1: Info kartını restyle et**

Mevcut sarı info kartını (`bg-[#FFBB00]`) bul ve şununla değiştir:

```tsx
<div className="max-w-xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
  <button
    onClick={() => setShowInfo(!showInfo)}
    className="w-full px-5 py-4 text-left text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
  >
    <span>Nasıl çalışır?</span>
    <span className="text-gray-400 text-sm">{showInfo ? '▲' : '▼'}</span>
  </button>
  {showInfo && (
    <div className="px-5 pb-4 text-gray-500 text-sm space-y-1 border-t border-gray-100">
      <ul className="list-disc list-inside space-y-1 pt-3">
        <li>Bu araç 20 soruyla size en uygun bankacılık profilini önerir.</li>
        <li>Sonuçlar yönlendirme amaçlıdır; son kararınızı vermeden önce bankanın güncel şartlarını kontrol edin.</li>
        <li>Ücretler, kart koşulları, şube erişimi ve müşteri hizmetleri bankaya göre değişebilir.</li>
      </ul>
    </div>
  )}
</div>
```

- [ ] **Step 2: Soru kartını Material stile çevir**

Mevcut `{!showResult && (...)}` içindeki soru kartını (`bg-[#F65314]`) şununla değiştir:

```tsx
{!showResult && (
  <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
    {/* Kategori etiketi */}
    <div className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-2">
      {question.category}
    </div>

    {/* Soru */}
    <h2 className="text-gray-900 font-bold text-lg leading-tight mb-1">
      {question.title}
    </h2>
    <p className="text-gray-500 text-sm mb-5">{question.desc}</p>

    {/* Seçenekler */}
    <div className="space-y-3">
      {question.options.map((option, idx) => (
        <button
          key={option.key}
          onClick={() => handleAnswer(option.key)}
          className={cn(
            'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
            answers[question.id] === option.key
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
          )}
        >
          <span className={cn(
            'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
            answers[question.id] === option.key
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500'
          )}>
            {idx + 1}
          </span>
          <div>
            <div className="font-semibold text-sm text-gray-900">{option.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
          </div>
        </button>
      ))}
    </div>

    {/* Alt bar */}
    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
      <button
        onClick={handleBack}
        disabled={currentQuestion === 0}
        className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
      >
        ← Geri
      </button>
      <span className="text-xs text-gray-400">Seçince otomatik ilerler</span>
    </div>
  </div>
)}
```

`cn` import'unun dosyanın başında olduğundan emin ol:
```tsx
import { cn } from '@/lib/utils/cn';
```

- [ ] **Step 3: Dev server'da görsel kontrol**

```bash
npm run dev
```

`http://localhost:3000/banka-secim` adresini aç. Beyaz kart, mavi kategori etiketi, seçenek hover efektleri çalışmalı.

- [ ] **Step 4: Commit**

```bash
git add app/banka-secim/BankaClient.tsx
git commit -m "feat(banka-secim): Material design question card with category label"
```

---

### Task 6: `BankaClient.tsx` — Sonuç ekranı redesign

**Files:**
- Modify: `app/banka-secim/BankaClient.tsx`

- [ ] **Step 1: Sonuç başlığını siyah zemine taşı**

Mevcut sonuç kartının (`bg-gradient-to-br from-[#8F03B7]`) içindeki başlık kısmı karta gömülü. Yeni tasarımda başlık kart dışında, siyah zeminde olacak.

- [ ] **Step 2: Sonuç ekranını yeniden yaz**

Mevcut `{showResult && (...)}` bloğunu şununla değiştir:

```tsx
{showResult && (
  <div className="max-w-xl mx-auto space-y-4">
    {/* Başlık — kart dışında */}
    <div className="text-center mb-6">
      <h2 className="text-white font-bold text-2xl mb-1">Sonuçların hazır!</h2>
      <p className="text-white/50 text-sm">Cevaplarına göre en uygun bankacılık profilleri</p>
    </div>

    {/* Banka kartları */}
    {recommendations.map((rec, idx) => (
      <div
        key={rec.bank.id}
        className={cn(
          'bg-white rounded-2xl p-5',
          idx === 0
            ? 'shadow-2xl border-2 border-blue-500'
            : 'shadow-md border border-gray-200'
        )}
      >
        {/* Badge + Banka adı */}
        <div className="flex items-center gap-3 mb-3">
          <span className={cn(
            'text-xs font-bold px-3 py-1 rounded-full',
            idx === 0
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-500'
          )}>
            {idx === 0 ? 'EN UYGUN' : `#${rec.rank}`}
          </span>
          <span className="font-bold text-gray-900 text-xl">{rec.bank.name}</span>
          <span className="text-gray-400 text-sm ml-auto">{rec.bank.type}</span>
        </div>

        {/* Etiketler */}
        {rec.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rec.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Maddeler */}
        <ul className={cn(
          'text-gray-600 text-sm space-y-1 list-disc list-inside',
          idx > 0 && 'line-clamp-2'
        )}>
          {rec.bullets.slice(0, idx === 0 ? 5 : 2).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    ))}

    {/* Butonlar */}
    <div className="flex gap-3 pt-2">
      <button
        onClick={handleReset}
        className="flex-1 text-sm text-white/70 border border-white/20 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-colors font-medium"
      >
        Tekrar Yap
      </button>
      <button
        onClick={handleCopy}
        className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-colors font-bold"
      >
        {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
      </button>
    </div>

    {/* Uyarı notu */}
    <p className="text-white/30 text-xs leading-relaxed text-center pt-2">
      Not: Bu araç yönlendirme amaçlıdır. Son seçimde ücretler, kart koşulları, şube erişimi,
      müşteri hizmetleri ve kimlik doğrulama seçeneklerini bankanın kendi sayfasından kontrol et.
    </p>
  </div>
)}
```

- [ ] **Step 3: Dev server'da uçtan uca test**

```bash
npm run dev
```

`http://localhost:3000/banka-secim` adresinde:
1. Tüm 20 soruyu yanıtla
2. Sonuç ekranının geldiğini doğrula
3. #1 kartın mavi border ile öne çıktığını kontrol et
4. "Sonucu Kopyala" butonunun çalıştığını kontrol et
5. "Tekrar Yap" butonunun ilk soruya döndürdüğünü doğrula

- [ ] **Step 4: Lint kontrolü**

```bash
npm run lint
```

Hata yoksa devam et.

- [ ] **Step 5: Production build kontrolü**

```bash
npm run build
```

Build başarısız olmamalı.

- [ ] **Step 6: Commit**

```bash
git add app/banka-secim/BankaClient.tsx
git commit -m "feat(banka-secim): Material design result screen with ranked cards"
```

---

## Tamamlanma Kriterleri

- [ ] `npm run build` hatasız geçiyor
- [ ] `npm run lint` hatasız geçiyor
- [ ] `/banka-secim` sayfası siyah arka plan üstünde beyaz kartlarla görünüyor
- [ ] Her soruda kategori etiketi gösteriliyor
- [ ] Progress bar mavi ve düzgün ilerliyor
- [ ] Seçili option mavi highlight alıyor
- [ ] Sonuç ekranında #1 kart mavi border ile öne çıkıyor
- [ ] "Sonucu Kopyala" ve "Tekrar Yap" butonları çalışıyor
