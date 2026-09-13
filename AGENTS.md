# AGENTS.md

Bu depoda çalışan ajanlar için giriş noktası.

**Tek kaynak: [CLAUDE.md](CLAUDE.md).** Komutlar, route yapısı, Supabase
istemcileri, stil konvansiyonları, admin auth ve bilinen tuzaklar orada
anlatılır. Bu dosya yalnızca en sık ihlal edilen kuralları tekrarlar; geri
kalanı için CLAUDE.md'yi oku.

## İhlal edilince pahalıya patlayan dört kural

1. **Dil**: Kullanıcıya görünen tüm içerik Türkçe olmalı. Kod İngilizce olabilir.
2. **Class birleştirme**: `cn()` (`@/lib/utils/cn`) kullan — template literal ile
   sınıf birleştirme yapma.
3. **Metadata**: Her sayfa `createMetadata()` (`@/lib/seo/metadata`) export
   etmeli; makale sayfaları `createArticleMetadata()` kullanır.
4. **Supabase istemcisi**: Üç ayrı istemci var ve birbirinin yerine geçmez —
   tarayıcı `@/lib/supabase/client`, sunucu `@/lib/supabase/server` (async),
   devuser `@/lib/supabase/devuser` (async).

## En sık yapılan hata

`app/(devuser)/devuser/<sayfa>/` kod yolundaki `devuser` iki kez görünür ama
URL **her zaman** `/devuser/<sayfa>` olur — `(devuser)` bir route group'tur ve
URL'de yer almaz.

## Dokümantasyon

Tüm dökümanlar `docs/` altında: [docs/README.md](docs/README.md).
