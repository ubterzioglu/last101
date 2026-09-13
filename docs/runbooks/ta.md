# Tuerkische Aerzte Backfill Brief

> Güncel ve birleşik sürüm: [BACKFILL_AGENT_MASTER.md](/c:/.temp_private/.0000last/BACKFILL_AGENT_MASTER.md)

## Amaç

`https://tuerkischeaerzte.de/aerzte/` kaynağındaki doktor profillerinden `providers` tablosundaki `type='doctor'` kayıtlarını zenginleştirmek.

Bu görevde öncelik yeni kayıt açmak değil, mevcut kayıtlardaki eksik alanları tamamlamaktır.

Birincil alanlar:

- `address`
- `phone`

İkincil alanlar:

- `website`
- `google_maps_url`
- `notes_public`

## Kısa Problem Tanımı

Projede zaten [scripts/import-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/import-tuerkische-aerzte.mjs) var. Bu script profil sayfalarından veri parse ediyor ama mevcut kayıtları `display_name + city` eşleşmesiyle tamamen skip ettiği için backfill yapmıyor.

Asıl ihtiyaç:

- `insert-only` akışı değil
- `update/backfill` odaklı akış

## İlgili Dosyalar

- [scripts/import-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/import-tuerkische-aerzte.mjs)
- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)
- [scripts/verify-backfill.mjs](/c:/.temp_private/.0000last/scripts/verify-backfill.mjs)
- [lib/rehber/types.ts](/c:/.temp_private/.0000last/lib/rehber/types.ts)
- [lib/rehber/data.ts](/c:/.temp_private/.0000last/lib/rehber/data.ts)

## Hedef Tablo

Tablo:

- `providers`

Filtre:

- `type = 'doctor'`

İlgili kolonlar:

- `display_name`
- `city`
- `address`
- `phone`
- `website`
- `google_maps_url`
- `notes_public`
- `status`

## Agent İçin Çalışma Kuralı

Bu brief tek seferde komple uygulanmak için değil. Agent her run'da yalnızca bir fazı tamamlamalı ve o fazın çıktısını vermeli.

Bir faz tamamlanmadan bir sonrakine geçilmemeli.

## Fazlar

### Faz 1: İnceleme ve Haritalama

Bu fazda yapılacaklar:

- [scripts/import-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/import-tuerkische-aerzte.mjs) dosyasını oku
- şu alanların gerçekten parse edilip edilmediğini doğrula:
  - `display_name`
  - `city`
  - `address`
  - `phone`
  - `website`
  - `google_maps_url`
  - `notes_public`
- mevcut dedupe mantığını çıkar
- neden backfill yapılamadığını 5-10 maddelik net bir özetle yaz

Bu fazın çıktısı:

- `mevcut parser alanları`
- `mevcut dedupe davranışı`
- `backfill blocker listesi`
- `önerilen yaklaşım: mevcut scripti genişlet / ayrı backfill scripti yaz`

Bu fazda yapılmayacaklar:

- kod yazma
- script çalıştırma
- DB update

### Faz 2: Dry-Run Tasarımı

Bu fazda yapılacaklar:

- mevcut parser mantığını yeniden kullanacak en güvenli yaklaşımı seç
- dry-run modunda hangi kayıtların eşleşeceğini tarif et
- update edilecek alan kurallarını netleştir

Önerilen update kuralları:

- `address` sadece mevcut alan boşsa veya yeni veri daha belirginse güncellensin
- `phone` sadece mevcut alan boşsa veya yeni veri daha normalize ise güncellensin
- `website` boşsa profil URL veya parse edilen website ile doldurulsun
- `google_maps_url` boşsa doldurulsun
- `notes_public` sadece ek bilgi katıyorsa güncellensin

Bu fazın çıktısı:

- `eşleştirme kuralları`
- `field update kuralları`
- `dry-run output şeması`
- `riskler`

Bu fazda yapılmayacaklar:

- gerçek update
- toplu insert

### Faz 3: Uygulama

Bu fazda yapılacaklar:

- mevcut parser mantığını kullan
- tercihen ayrı bir backfill script yaz
- script en az şu modları desteklesin:
  - `dry-run`
  - `apply`
- eşleşme anahtarı ilk etapta:
  - `normalize(display_name) + normalize(city)`

Bu fazın çıktısı:

- değişen dosya listesi
- script kullanım örneği
- dry-run örnek raporu

Bu fazda yapılmayacaklar:

- agresif fuzzy matching
- dolu alanları kalitesiz veriyle ezme

### Faz 4: Doğrulama

Bu fazda yapılacaklar:

- `type='doctor'` kayıtlarında önce/sonra karşılaştırması yap
- özellikle şu metrikleri raporla:
  - `phone IS NOT NULL` artışı
  - `address IS NOT NULL` artışı
  - güncellenen kayıt sayısı
  - yeni eklenen kayıt sayısı
  - parse edilemeyen profil sayısı
- rastgele örnek kayıtları kaynak profil ile karşılaştır

Bu fazın çıktısı:

- kısa doğrulama raporu
- açık kalan riskler

## Çıktı Sözleşmesi

Agent her run sonunda şu formatta dönsün:

1. `Tamamlanan faz`
2. `Yapılan işler`
3. `Değişen dosyalar`
4. `Riskler / açık noktalar`
5. `Sonraki faz için net öneri`

## Eşleştirme Kuralları

İlk tercih:

- `normalize(display_name) + normalize(city)`

Yardımcı sinyaller:

- profil URL
- normalize edilmiş isim

Ama düşük güvenli eşleşmede update yapılmamalı.

## Başarı Kriteri

Görev başarılı sayılması için en az şu koşullar sağlanmalı:

- mevcut doktor kayıtlarında eksik `address` alanlarının anlamlı kısmı dolmalı
- mevcut doktor kayıtlarında eksik `phone` alanlarının anlamlı kısmı dolmalı
- duplicate üretimi kontrol altında kalmalı
- script dry-run ve apply modlarıyla çalışmalı

## İstenmeyen Davranışlar

- mevcut dolu `phone` alanını daha kötü veriyle ezmek
- mevcut dolu `address` alanını daha kısa veriyle ezmek
- bütün eşleşmeyen kayıtları körlemesine insert etmek
- sadece isim çekip görevi tamamlandı saymak
- aynı run içinde hem parser refactor, hem backfill mantığı, hem doğrulama raporunu tek devasa değişiklikte toplamak

## Agent'a Verilecek En Güvenli İlk Görev

İlk run için yalnızca şu görev verilsin:

`Faz 1'i tamamla. scripts/import-tuerkische-aerzte.mjs dosyasını incele, parse edilen alanları ve backfill'i engelleyen mevcut dedupe davranışını çıkar. Kod yazma, sadece analiz ve kısa uygulanabilir öneri ver.`
