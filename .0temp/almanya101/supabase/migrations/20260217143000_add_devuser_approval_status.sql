-- DevUser approval workflow
-- New users are pending until admin approval

ALTER TABLE public.devuser
  ADD COLUMN IF NOT EXISTS approval_status TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by TEXT,
  ADD COLUMN IF NOT EXISTS admin_note TEXT;

UPDATE public.devuser
SET approval_status = COALESCE(NULLIF(approval_status, ''), 'approved')
WHERE approval_status IS NULL OR approval_status = '';

ALTER TABLE public.devuser
  ALTER COLUMN approval_status SET DEFAULT 'pending';

ALTER TABLE public.devuser
  ALTER COLUMN approval_status SET NOT NULL;

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_approval_status;

ALTER TABLE public.devuser
  ADD CONSTRAINT check_devuser_approval_status
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_devuser_approval_status
  ON public.devuser (approval_status);

CREATE OR REPLACE VIEW public.devuser_public AS
SELECT
  id,
  ad_soyad,
  sehir,
  rol,
  deneyim_seviye,
  aktif_kod,
  guclu_alanlar,
  programlama_dilleri,
  framework_platformlar,
  devops_cloud,
  ilgi_konular,
  ogrenmek_istenen,
  is_arama_durumu,
  ai_app_builders,
  freelance_aciklik,
  katilma_amaci,
  isbirligi_turu,
  profesyonel_destek_verebilir,
  profesyonel_destek_almak,
  kullanilan_ide,
  kullanilan_agent,
  CASE
    WHEN linkedin_url IS NOT NULL AND linkedin_url <> '' THEN linkedin_url
    ELSE NULL
  END AS linkedin_url,
  CASE
    WHEN iletisim_izni = true AND whatsapp_tel IS NOT NULL AND whatsapp_tel <> '' THEN whatsapp_tel
    ELSE NULL
  END AS whatsapp_tel,
  iletisim_izni,
  created_at
FROM public.devuser
WHERE aratilabilir = true
  AND approval_status = 'approved';
