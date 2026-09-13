# almanya101 → corteqs.net (corteqsmvp) Araç Yönlendirme Notları

Tarih: 2026-07-14/15 sohbetinden. Yarın devam et.

## Bağlam

- Hedef: almanya101.de'deki araç sayfaları corteqs.net'e (repo: github.com/ubterzioglu/corteqsmvp)
  yönlendirilecek. Eski almanya101 kodları kalacak (silinmeyecek).
- corteqsmvp = "CorteQS Landing" — React + Vite + Supabase tabanlı, farklı bir proje.
  Domain: corteqs.net.
- corteqsmvp'deki tüm araçlar `/tools/:toolSlug` altında ve `RequireAuth` ile korunuyor
  (login olmayan kullanıcı login ekranına düşer). Kullanıcı bunu kabul etti.
- 5 klasik araç (maas-hesaplama, vize-secim, vatandaslik-testi, para-transferi,
  stepstone-karsilastirma) corteqsmvp'de "germany-standalone-tools" registry'sinden
  (src/lib/germany-standalone-tools.ts) kendi React bileşenleriyle render ediliyor.
- banka-secim ve sigorta-secim + diğer 10 "survey" aracı ise Supabase DB-backed
  (relocation_tools tablosu, migration'larla seed edilmiş), relocation_tool_* motoruyla çalışıyor.
- Migration yorumlarında "Kaynak: ref101/app/(site)/banka-secim (almanya101)" gibi notlar var —
  yani corteqsmvp tarafı bu araçları almanya101'den bilinçli olarak port etmiş.

## Tam Eşleşme Tablosu (17/17 araç eşleşti)

| # | almanya101 route | corteqs.net slug (/tools/<slug>) | Kaynak (corteqsmvp) |
|---|---|---|---|
| 1 | /banka-secim | banka-secim-almanya | DB (relocation_tools, migration 20260630100000) |
| 2 | /sigorta-secim | sigorta-secim-almanya | DB (migration 20260630110000) |
| 3 | /maas-hesaplama | maas-hesaplama-almanya | standalone component (germany-standalone-tools.ts) |
| 4 | /vize-secim | vize-secim-almanya | standalone component |
| 5 | /para-transferi | para-transferi-almanya | standalone component |
| 6 | /stepstone-karsilastirma | stepstone-karsilastirma-almanya | standalone component |
| 7 | /vatandaslik-testi | vatandaslik-testi-almanya | standalone component |
| 8 | /almanya-yasam-tarzi-uyumu | expat-yasam-tarzi-persona | DB (relocation_tool_expat_persona.sql, key: expat_lifestyle_persona) |
| 9 | /kariyer-ve-egitim-rotasi | yurtdisi-kariyer-yolu | DB (relocation_tool_career_path.sql, key: career_path_abroad) |
| 10 | /almanya-yolunu-sec | ulke-secimi | DB (relocation_tool_country_match.sql, key: country_match) |
| 11 | /hangi-sehir-sana-uygun | sehir-eslestirme | DB (relocation_tool_city_match.sql, key: city_match) |
| 12 | /topluluk-ve-danismanlik | diaspora-ag-eslestirme | DB (relocation_tool_diaspora_matchmaker.sql, key: diaspora_matchmaker) |
| 13 | /ilk-90-gun-planlayici | ilk-90-gun-planlayici | DB (relocation_tool_first_90_days.sql, key: first_90_days_planner) |
| 14 | /almanyada-is-bulma-olasiligi | is-bulma-olasiligi | DB (relocation_tool_job_probability.sql, key: job_finding_probability) |
| 15 | /almanya-maas-beklentisi | meslek-maas-karsilastirma | DB (relocation_tool_profession_salary.sql, key: profession_salary) |
| 16 | /once-hangi-sorunu-cozmelisin | oncelikli-tasinma-sorunu | DB (relocation_tool_top_challenge.sql, key: top_relocation_challenge) |
| 17 | /almanyaya-hazir-misin | tasinma-hazirlik-skoru | DB (relocation_tool_readiness.sql, key: relocation_readiness) |

Not: slug'lar bazı yerlerde almanya101 ile birebir aynı değil (örn. kariyer-ve-egitim-rotasi ≠
yurtdisi-kariyer-yolu) çünkü corteqsmvp tarafı bu araçları Almanya'ya özel değil, çok-ülkeli/genel
("relocation_assessment" kategorisi) olarak tasarlamış. Sadece 7 klasik araç (1-7) net "-almanya"
suffix'li ve Almanya'ya özel; 8-17 arası genel/çok ülkeli versiyonlar ama işlevsel olarak
almanya101'in ilgili aracına karşılık geliyor.

## Karşılığı OLMAYAN sayfalar (araç değil, içerik/dizin sayfaları — almanya101'de kalacak)

- /hizmet-rehberi (+ /hizmet-rehberi/oneri)
- /belgeler
- /almanya-araclari (bu sadece yukarıdaki 10 survey aracının listelendiği hub sayfası, kendisi araç değil)

## Henüz Karar Verilmemiş / Netleşmemiş Konular

1. **Yönlendirme türü**: Direkt 301 redirect (next.config.ts redirects()) mi, yoksa kısa bir
   ara geçiş sayfası (interstitial, "corteqs.net'e yönlendiriliyorsunuz" mesajı + 2-3 sn bekleme) mi?
   Kullanıcı net karar vermedi, tekrar sorulması gerekiyor.
2. Kullanıcı "source of truth corteqs olacak" dedi — ileride belki almanya101 tarafındaki
   TOOL_CATALOG/lib/tools yapısının tamamen kaldırılıp sadece redirect bırakılması mı isteniyor,
   yoksa mevcut sayfalar kalıp üstüne mi redirect ekleniyor? Netleştirilmeli.
3. Kullanıcı ayrıca "bunu şimdi bir ara değiştirmek de istiyorum, coolify otomatik anlar mı"
   diye sormuştu (muhtemelen repo adı veya Coolify deployment bağlantısı değişikliği) — bu konu
   hâlâ açıklığa kavuşmadı, kullanıcı "sonra anlatacağım" dedi.
4. next.config.ts zaten `redirects()` fonksiyonu kullanıyor (devuser redirects + www redirect) —
   yeni 17 kayıt buraya eklenecek muhtemelen.

## Sonraki Adım (yarın)

- Yönlendirme türünü (301 vs interstitial) netleştir.
- Onay alınca next.config.ts'e 17 redirect kaydını ekle (veya interstitial sayfası tasarımına geç).
- "Source of truth corteqs" ifadesinin kapsamını (sadece redirect mi, yoksa almanya101 tool
  kodlarının kaldırılması mı) netleştir.
