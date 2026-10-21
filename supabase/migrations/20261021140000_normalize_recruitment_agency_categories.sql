-- Migration: recruitment_agencies kategori normalizasyonu
-- Eski ajans kayıtlarının category alanında alt kategori metinleri kalmış
-- ("Executive Search", "Tech & Digital" vb.). Admin formu yalnızca üç ana
-- kategoriyi tanıdığı için bunlar düzenlemede "İş Bulma Ajansları"na düşüyordu.
-- Ana kategoriye çekilir; alt kategori bilgisi statik listede (subCategory) duruyor.

UPDATE recruitment_agencies
SET category = 'İş Bulma Ajansları',
    updated_at = NOW()
WHERE category IS NULL
   OR category NOT IN ('İş Bulma Ajansları', 'İngilizce İşe Alan Şirketler', 'İş ve Kariyer Platformları');
