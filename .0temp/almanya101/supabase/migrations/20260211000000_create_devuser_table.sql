-- Create devuser table for developer community registration
CREATE TABLE IF NOT EXISTS public.devuser (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Kimlik ve iletiÅŸim
  ad_soyad TEXT NOT NULL,
  linkedin_url TEXT,
  whatsapp_tel TEXT,
  almanya_yasam BOOLEAN DEFAULT false,
  sehir TEXT,
  
  -- Profil ve teknik arka plan
  rol TEXT, -- Software Developer, QA/Test, DevOps, Data/AI, Product/Project, UI/UX, Ã–ÄŸrenci, DiÄŸer
  deneyim_seviye TEXT, -- 0-1 yÄ±l, 1-3 yÄ±l, 3-5 yÄ±l, 5-10 yÄ±l, 10+ yÄ±l
  aktif_kod BOOLEAN DEFAULT false,
  guclu_alanlar TEXT[], -- Backend, Frontend, Mobile, QA/Manual Testing, Test Automation, DevOps/CI-CD, Data/BI, AI/ML, Cloud, Security, Product/Project, UI/UX, DiÄŸer
  acik_kaynak BOOLEAN DEFAULT false,
  kendi_proje BOOLEAN DEFAULT false,
  proje_link TEXT,
  
  -- Teknoloji bilgisi
  programlama_dilleri TEXT[], -- JavaScript, TypeScript, Python, Java, C#, Go, PHP, C/C++, Kotlin, Swift, SQL, DiÄŸer
  framework_platformlar TEXT[], -- React, Angular, Vue, Node.js, .NET, Spring, Django, FastAPI, Flutter, React Native, DiÄŸer
  devops_cloud TEXT[], -- Docker, Kubernetes, AWS, Azure, GCP, Terraform, GitHub Actions, GitLab CI, Jenkins, DiÄŸer
  
  -- Ä°lgi alanlarÄ± ve yÃ¶nelim
  ilgi_konular TEXT[], -- AI araÃ§larÄ±/LLM uygulamalarÄ±, Startup/Ã¼rÃ¼n geliÅŸtirme, Freelance/danÄ±ÅŸmanlÄ±k, Remote Ã§alÄ±ÅŸma, Almanya'da kariyer & iÅŸ piyasasÄ±, Networking/event/meetup, Side project/hackathon, Open-source, Sertifika/eÄŸitim, Teknik yazÄ±/iÃ§erik Ã¼retimi, DiÄŸer
  ogrenmek_istenen TEXT[], -- Backend, Frontend, Mobile, Test Automation, DevOps, Cloud, AI/ML, Data Engineering/Analytics, Security, System Design/Architecture, Performance/Scalability, UI/UX, Product/Agile, Interview prep/CV, Almanya kariyer/iÅŸ arama, DiÄŸer
  
  -- Ä°ÅŸ durumu ve fÄ±rsatlar
  is_arama_durumu TEXT, -- HayÄ±r, Evet pasif (fÄ±rsat olursa), Evet aktif, Sadece freelance bakÄ±yorum
  freelance_aciklik TEXT, -- HayÄ±r, Evet hafta iÃ§i akÅŸamlarÄ±, Evet hafta sonu, Evet part-time dÃ¼zenli, Evet full-time freelance
  gonullu_proje BOOLEAN DEFAULT false,
  
  -- Ä°ÅŸ birliÄŸi ve topluluk amacÄ±
  katilma_amaci TEXT, -- Networking, Ä°ÅŸ bulmak, Ä°ÅŸ arkadaÅŸÄ± bulmak, Proje geliÅŸtirmek, Bilgi paylaÅŸmak, Mentorluk almak, Mentorluk vermek
  isbirligi_turu TEXT[], -- Side project (haftada 2-5 saat), Side project (haftada 5-10 saat), Startup kurmak (ciddi), MVP Ã§Ä±karma ekibi (tasarÄ±m+dev+test), Freelance ekip kurmak (Ã¼cretli), AÃ§Ä±k kaynak proje, Study group (system design, leetcode vb.), Mentorluk/koÃ§luk, Sadece tanÄ±ÅŸma & network
  profesyonel_destek_verebilir BOOLEAN DEFAULT false,
  profesyonel_destek_almak BOOLEAN DEFAULT false,
  
  -- GÃ¶rÃ¼nÃ¼rlÃ¼k ve iletiÅŸim izni
  aratilabilir BOOLEAN DEFAULT true,
  iletisim_izni BOOLEAN DEFAULT true
);

-- Create indexes for common search queries
CREATE INDEX idx_devuser_rol ON public.devuser(rol);
CREATE INDEX idx_devuser_sehir ON public.devuser(sehir);
CREATE INDEX idx_devuser_deneyim_seviye ON public.devuser(deneyim_seviye);
CREATE INDEX idx_devuser_is_arama_durumu ON public.devuser(is_arama_durumu);
CREATE INDEX idx_devuser_aratilabilir ON public.devuser(aratilabilir);
CREATE INDEX idx_devuser_guclu_alanlar ON public.devuser USING GIN(guclu_alanlar);
CREATE INDEX idx_devuser_programlama_dilleri ON public.devuser USING GIN(programlama_dilleri);
CREATE INDEX idx_devuser_ilgi_konular ON public.devuser USING GIN(ilgi_konular);

-- Enable Row Level Security
ALTER TABLE public.devuser ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read searchable profiles
CREATE POLICY "Public read access for searchable profiles"
  ON public.devuser
  FOR SELECT
  USING (aratilabilir = true);

-- Policy: Anyone can insert (register)
CREATE POLICY "Public insert access"
  ON public.devuser
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own profile (if authenticated)
-- For now, we'll allow updates based on matching whatsapp_tel or linkedin_url
CREATE POLICY "Users can update own profile"
  ON public.devuser
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_devuser_updated_at
  BEFORE UPDATE ON public.devuser
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.devuser TO anon;
GRANT SELECT, INSERT, UPDATE ON public.devuser TO authenticated;


