# almanya101

Almanya'da yaşayan veya Almanya'ya taşınmayı planlayan Türkler için Türkçe bilgi, araçlar ve topluluk platformu. Uygulama Next.js 15 App Router, React, TypeScript, Tailwind CSS ve Supabase kullanır.

## Yerel kurulum

Node.js 20 ve npm gerekir. Depoyu klonladıktan sonra:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır. `.env.local` içindeki Supabase değerlerini kendi ortamınızdan doldurun. Gerçek anahtarları veya parolaları Git'e eklemeyin. `NEXT_PUBLIC_` ile başlayan değerler tarayıcıya da gönderilir; servis rolü anahtarını yalnızca sunucu tarafında kullanın.

| Değişken | Kullanım |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tarayıcı ve oturum kullanan Supabase akışları |
| `SUPABASE_SERVICE_ROLE_KEY` | Yönetici API'leri ve sunucu işleri |
| `ADMIN_PANEL_PASSWORD` | Parola ile yönetici erişimi |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME` | Kanonik site adresi ve adı |
| `NEWS_PIPELINE_SECRET`, `GEMINI_API_KEY`, `THENEWSAPI_TOKEN` | Haber hattı etkinleştirildiğinde gereken servis değerleri |

Diğer isteğe bağlı ve servis özelindeki değişkenler `.env.example` içinde gruplandırılmıştır. Haber hattı ve yönetici işlevleri için ilgili değerler ayrıca dağıtım ortamına ve gerektiğinde Supabase Edge Function secrets alanına tanımlanmalıdır.

## Proje düzeni

| Konum | Amaç |
| --- | --- |
| `app/(marketing)/` | Herkese açık tanıtım ve içerik sayfaları |
| `app/(site)/` | Herkese açık etkileşimli araçlar |
| `app/(devuser)/devuser/` | Supabase Auth kullanan kullanıcı alanı; URL öneki `/devuser` |
| `app/admin/` | Yönetici paneli |
| `app/api/` | Uygulama API rotaları |
| `components/`, `lib/`, `types/` | Arayüz, iş mantığı ve tipler |
| `supabase/` | Migration'lar ve Edge Function'lar |
| `e2e/`, `tests/` | Uçtan uca ve birim testleri |

Geliştirme kuralları için [AGENTS.md](./AGENTS.md), konuya göre plan ve teknik belgeler için [doküman dizini](./docs/README.md) kullanılır. Tarihsel planlar mevcut sistemin doğrulanmış çalışma talimatı olarak kabul edilmemelidir.

## Komutlar

```bash
npm run dev        # Geliştirme sunucusu
npm run lint       # ESLint
npm run test:unit  # Vitest
npm run e2e:smoke  # Playwright herkese açık sayfa testleri
npm run build      # Üretim derlemesi
npm run start      # Standalone üretim sunucusu
```

Tüm komutlar ve seçenekler [package.json](./package.json) içinde tanımlıdır. Kimlik doğrulamalı E2E testleri için ayrıca test hesabı ve ortam değişkenleri gerekir.

## Dağıtım

Üretim yapılandırması `output: 'standalone'` kullanır. [Dockerfile](./Dockerfile) Node.js 20 ile derler ve standalone sunucuyu başlatır; [docker-compose.yml](./docker-compose.yml) Coolify için temel servis örneğidir. `NEXT_PUBLIC_` değerleri istemci derlemesine gömülebildiğinden bunları build aşamasında doğru sağlayın. Sunucu sırlarını Coolify ortam ayarlarında ve ilgili Edge Function sırlarını Supabase'de tanımlayın.

Dağıtımdan önce `npm run lint`, `npm run test:unit` ve `npm run build` çalıştırın.
