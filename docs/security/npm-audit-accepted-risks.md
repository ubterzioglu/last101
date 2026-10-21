# npm audit — kabul edilen riskler

Son güncelleme: 2026-10-21
Kapsam: `chore/deps-security-audit` dalındaki bağımlılık yamalarından sonraki durum.

## Özet

`npm audit` 26 bulgudan 7'ye indi. Kalan 7 bulgunun tamamı **high** seviyede ve hepsi aynı kök nedene bağlı: glob eşleştirme kütüphanelerinde (`braces`, `micromatch`, `fast-glob`, `chokidar`) yayınlanmış bir yama sürümü yok. Kritik ve moderate seviyede açık bulgu kalmadı.

## Kalan bulgular

| Paket | Seviye | Neden kapatılamıyor |
|---|---|---|
| `braces` | high | Advisory'nin etkilenen aralığı `*` — yamalı sürüm yayınlanmadı ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) |
| `micromatch` | high | Etkilenen aralık `>=0.2.0`, `braces`'e bağımlı |
| `fast-glob` | high | Etkilenen aralık `*`, `micromatch`'e bağımlı |
| `chokidar` | high | 3.x hattında yama yok; `tailwindcss@3` chokidar 3'e bağlı |
| `tailwindcss` | high | `chokidar` + `micromatch` + `fast-glob` üzerinden |
| `eslint-config-next` | high | `@next/eslint-plugin-next` → `fast-glob` üzerinden |
| `@next/eslint-plugin-next` | high | `fast-glob` üzerinden |

Hepsi DoS sınıfı: kötü niyetli hazırlanmış bir glob pattern'i ile CPU/bellek tüketimi veya stack tükenmesi.

## Neden kabul edilebilir

- Bu kütüphanelerin hepsi **yalnızca build ve lint zamanında** çalışır. Hiçbiri tarayıcıya giden bundle'a veya çalışan sunucu sürecine girmez.
- İstismar için saldırganın glob pattern'ini kontrol etmesi gerekir. Buradaki pattern'ler `tailwind.config.ts`'in `content` dizisinden ve ESLint yapılandırmasından geliyor — ikisi de repoda versiyonlanmış, dışarıdan girdi almıyor.
- Build, Coolify üzerinde Docker içinde kapalı bir ortamda koşuyor. Bir saldırganın bu pattern'lere erişmesi için zaten repo yazma yetkisine sahip olması gerekir ki o noktada bu açıklar en küçük sorun olur.

## npm'in önerdiği "düzeltmeler" neden uygulanmadı

`npm audit fix --force` iki şey öneriyor, ikisi de reddedildi:

1. **`eslint-config-next` 16.4.2 → 14.2.35.** Bu bir *düşürme*. Projeyi iki major sürüm geriye, daha eski ve daha çok açığı olan bir ESLint yapılandırmasına taşır. Üstelik 14.2.35 de `fast-glob` kullandığı için sorunu çözmez.
2. **`tailwindcss` 3.4.19 → 4.3.3.** Major migrasyon: yapılandırma CSS-first `@theme` yapısına taşınır, `@tailwindcss/postcss`'e geçilir, `container` ve typography ayarları yeniden yazılır. Tüm sayfaların görsel regresyon kontrolünü gerektirir. Ayrıca `eslint-config-next` bulgusunu yine kapatmaz. Ayrı bir iş olarak planlanmalı.

## `overrides` bloğunun gerekçesi

`package.json` içindeki `overrides` bloğu iki transitif bağımlılığı yamalı sürüme zorluyor:

```json
"overrides": {
  "postcss": "$postcss",
  "postcss-selector-parser": "^7.1.7"
}
```

- **`postcss: "$postcss"`** — `next@15.5.28` kendi ağacında `postcss@8.4.31`'i sabit olarak pinliyor ve bu sürüm dört ayrı açıktan etkileniyor (XSS, `sourceMappingURL` üzerinden keyfi dosya okuma). `$postcss` sözdizimi, kök `dependencies` içindeki `postcss` aralığına (`^8.5.31`) referans verir ve Next'in iç kopyasını da ona hizalar. Doğrudan bir sürüm aralığı yazmak `EOVERRIDE` hatası veriyor, çünkü `postcss` aynı zamanda doğrudan bağımlılık. Bu override olmadan tek alternatif `next@16` major geçişiydi.
- **`postcss-selector-parser: "^7.1.7"`** — `@tailwindcss/typography` üzerinden gelen moderate bulguyu kapatır. npm'in önerdiği "düzeltme" typography'yi 0.5.19'dan 0.5.4'e düşürmekti; bu da bir geri alma olduğu için uygulanmadı.

**Bu override'lar kalıcı değil.** Next kendi `postcss` pinini yamalı bir sürüme taşıdığında ve `@tailwindcss/typography` bağımlılığını güncellediğinde kaldırılmalı.

## Yeniden değerlendirme tetikleyicileri

- `braces` veya `micromatch` yamalı bir sürüm yayınlarsa → `npm audit fix` yeniden koşturulur.
- Tailwind v4 migrasyonu yapılırsa → `chokidar`/`micromatch`/`braces` zinciri düşer, bu dosya güncellenir.
- Next kendi `postcss` pinini yükseltirse → `overrides.postcss` kaldırılır.
- Yeni bir bulgu çıkarsa, bu listeye eklenmeden önce gerçekten kapatılamaz olduğu doğrulanmalıdır. Bu dosya bir çöp kutusu değil.
