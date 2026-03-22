# Almanya101de Project Memory

**Ortak Memory Klasörü:** `.00agent/`

Bu klasör farklı Claude agentlarının ortak kullanımına açık. Tüm agentlar memory dosyalarını buraya kaydetmelidir.

## Memory Dosyaları

- **[database-backup.md](database-backup.md)** - Supabase database backup konfigürasyonu ve yöntemleri
- **[MEMORY.md](MEMORY.md)** - Ana memory dosyası (bu dosya)

## Kullanım İlkeleri

1. **Ortak Klasör:** Tüm memory dosyaları `.00agent/` klasöründe saklanır
2. **Agentlar Arası Paylaşım:** Farklı agentlar aynı memory dosyalarına erişebilir
3. **Yeni Memory Dosyaları:** Her agent yeni memory dosyası oluşturduğunda `.00agent/` klasörüne kaydetmelidir
4. **Dosya Adlandırma:** Tanımlayıcı dosya isimleri kullanın (örn: `debugging.md`, `patterns.md`)

## Projeye Özel Bilgiler

**Proje Yapısı:** Next.js + Static HTML hibrit yapı
**Database:** Supabase (PostgreSQL)
**Backend:** `/api/` klasöründeki JavaScript handler'lar
**Shared Components:** [shared-cards.js](shared-cards.js) modülü