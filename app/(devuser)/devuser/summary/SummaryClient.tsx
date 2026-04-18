'use client';

import { useState } from 'react';

interface SummaryItem {
  id: string;
  title: string;
  dateLabel: string;
  bullets: string[];
}

const SUMMARIES: SummaryItem[] = [
  {
    id: 'CV16',
    title: 'CV16 — 13 Nisan - 18 Nisan',
    dateLabel: '13 Nisan - 18 Nisan 2026',
    bullets: [
      'GLM 5.1 ile Claude modellerinin karşılaştırılması',
      'Claude kota sorunları ve alternatifler (OpenRouter API)',
      'almanya101.de yeni arayüzüyle yenilendi, 700 üye hedefi',
      'Spindora SEO aracı WordPress eklentisi WP markete gönderildi',
      'WorkExe white label enterprise paketi 299$/ay satışa çıktı',
      'Şahin Yozbakar böbrek ameliyatı oldu',
      'hyped.today platformunda geliştirmeler hızlandırıldı',
      'Toplulukta tanışma roundu başladı (UBT, Hakan Cengiz, Batuhan Yalçın, Özer Subaşı)',
      'Nage.ai ve SEDIM mimarisi tanıtıldı',
      'Clicky (macOS AI sesli asistan) ve Cavavan (token optimizasyonu) paylaşıldı',
      'GSAP animasyon kütüphanesi önerildi',
      'Neo4j ve FalkorDB graph DB önerileri',
      'Yeni üyeler: Alperen Keskinsoy (SirketOn), Büşra (CarentIQ)',
      'Anabasis platformu (Türkiye\'nin ilk CV analiz sistemi) gündeme geldi',
      'Girişimcilik etkinlikleri eleştirildi (hayal satma, yüksek bilet fiyatları)',
    ],
  },
  {
    id: 'CV15',
    title: 'CV15 — 6 Nisan - 12 Nisan',
    dateLabel: '6 Nisan - 12 Nisan 2026',
    bullets: [
      'Claude AI kota sorunları yaygınlaştı, GitHub Copilot deneme sürümü önerildi',
      'Gemma 4 (Google DeepMind) lokal AI modeli detaylıca tartışıldı',
      'Kimi K2.5 ve Qwen 3.5 lokal AI modelleri karşılaştırıldı',
      'GLM 5.1 modeli Claude Sonnet 4.5\'e yakın performans gösteriyor',
      'Claude abonelik fiyatları 2 katına çıkarıldı',
      'VPS sağlayıcıları kapsamlı tartışıldı (Hetzner, Contabo, OVH)',
      'UBT kişisel web sayfasını yeniledi ve CV review hizmeti başlattı',
      'Hakan Cengiz teknik kaynaklar paylaştı (Build Your Own X, Tremor, Webstudio)',
      'Rubican İTÜ Çekirdek Big Bang\'de FinCognis projesini geliştiriyor',
      'Batuhan Spindora SEO eklentisini yayınladı',
      'Vatandaşlık başvurusu için website projesi (Nuxt)',
      'WorkExe SEO aracı log analizi özelliğini yayına aldı',
      'Projesi/ürünü olanlar için özel WhatsApp grubu açıldı',
      'AI kodlama araçları karşılaştırıldı (Cursor, Kilo Code, Antigravity)',
    ],
  },
  {
    id: 'CV14',
    title: 'CV14 — 30 Mart - 5 Nisan',
    dateLabel: '30 Mart - 5 Nisan 2026',
    bullets: [
      'Ali Can Yücel .NET Core NuGet paketleri yayınladı',
      'Mistral AI 830 milyon dolar borç finansmanı sağladı',
      'Rubican İTÜ Çekirdek\'te FinCognis projesini tanıttı',
      'Siber güvenlik aracı yakında resmi satışa çıkacak',
      'Onat Can Zeytin AI destekli işe alım ajanı Onyx Agent geliştiriyor',
      'Ahmet Tahir Mat Papex bilimsel araştırma yatırım platformunu tanıttı',
      'WorkExe SEO aracı log analizi yayına alındı, 90 aktif kullanıcıya ulaştı',
      'Spindora SEO Chrome eklentisi en kapsamlı güncellemesini yayınladı',
      'kasguide.de için Google Maps API alternatifleri araştırıldı',
      '"İnsan tabanlı CDN" fikri paylaşıldı',
      'axios güvenlik uyarısı yapıldı',
      '.NET işe alım mülakatları için hazırlık konuları tartışıldı',
      '"Sığınak" anahtar kelimesinin Türkiye\'de %516 arttığı SEO araştırması',
      'Fiber (Go) ve .NET performans karşılaştırması',
      'Emir AML dolandırıcılık tespiti projesini paylaştı',
    ],
  },
  {
    id: 'CV13',
    title: 'CV13 — 23 Mart - 29 Mart',
    dateLabel: '23 Mart - 29 Mart 2026',
    bullets: [
      '101.almanya101.de BETA sürümü yayına alındı',
      'Mobil oyun geliştirme tartışması: Unity, Flutter ve vibe coding karşılaştırıldı',
      'PlayerZero AI tabanlı üretim mühendisi aracı tanıtıldı',
      'WordPress içerik scraping yöntemleri tartışıldı (Firecrawl, WebHarvy, Claude)',
      'Clean Architecture, JS vs TSX ve overengineering tartışması',
      'RAG konusunda detaylı teknik sohbet (Dify, semantik özetleme)',
      'Hibrit fotonik bilgisayar mimarisi tanıtıldı',
      'Grup 600 kişiye ulaştı, soru-cevap session anketi yapıldı',
      'YouTube Shopping Affiliate abone şartı 1000\'den 500\'e indirildi',
      'SEO keyword research araçları konuşuldu (Semrush, KeywordsEverywhere)',
      'NuGet paketleri yayınlama furyası (CQRS, Fluent Validation vb.)',
      'Anthropic Academy RAG kursu önerildi',
      'Şahin Yozbakar open #towork paylaşımı viral yapılmak istendi',
      'Sağlık takip uygulaması (Ölçüm Defteri) erken erişim testçisi arıyor',
      'kasguide.de genişletme çağrısı yapıldı',
    ],
  },
  {
    id: 'CV12',
    title: 'CV12 — 16 Mart - 22 Mart',
    dateLabel: '16 Mart - 22 Mart 2026',
    bullets: [
      'Software Testing TR tanışma toplantısı anketi açıldı, 25+ kayıt',
      'Buğra Kurnaz tarım teknolojileri ARGE projesi (TÜBİTAK 1812 başvurusu)',
      'Murat Özkılınç TalkPilot (AI satış yönlendirme) MVP\'sini test ediyor',
      'Hakan Cengiz haftalık AI özeti: NVIDIA GTC 2027, Claude Dispatch, GPT-5.4',
      'EU Inc. taslağı tartışıldı (48 saatte 100 eurodan az maliyetle şirket)',
      'Yazılım kariyerinde lisans mezuniyeti tartışması',
      '101.almanya101.de BETA sürümü yayınlandı',
      'Anıl Yağız MicroBox açık kaynak sandbox runner projesini paylaştı',
      'Startup\'lar için AWS 100K$ ve IBM 120K$ bulut kredileri',
      'Baykar Technologies ve .NET/MongoDB remote ilanları',
      'Supabase vs VPS/Coolify veritabanı tartışması',
      'Rubican\'ın sitesinde CORS ve cache sorunları çözüldü',
      'PlayerZero "AI üretim mühendisi" aracı tanıtıldı',
      'Ali Can Yücel Angular 21 ve .NET Core GitHub repolarını paylaştı',
      'Gemini AI\'nin görsel halüsinasyon sorunları tartışıldı',
    ],
  },
  {
    id: 'CV11',
    title: 'CV11 — 9 Mart - 15 Mart',
    dateLabel: '9 Mart - 15 Mart 2026',
    bullets: [
      'Berkcan Gümüşışık 50+ AI aracı projesi ve LLMRadar platformu tanıttı',
      'Çağatay Uncu CursorClarify Chrome eklentisini yayınladı',
      'Almanya\'dan remote çalışma imkanları ve VW\'nin 50K personel çıkaracağı',
      'Software Testing TR tanışma toplantısı planlandı',
      'ITCS Köln 2026 teknoloji konferansı tanıtıldı',
      'Anthropic ücretsiz AI kursları duyuruldu',
      'Depix, GitNexus ve fly.io gibi araçlar paylaşıldı',
      'Claude kullanım limitleri ve GitHub Copilot Pro tartışıldı',
      'Gemini, Claude ve ChatGPT performansları karşılaştırıldı',
      'Sağlık sektörü CRM projeleri ve SQL injection güvenlik açıkları',
      'Spindora otomatik SEO aracı LinkedIn\'de tanıtıldı',
      'Oyun geliştirme ve AI ile video üretme maliyetleri tartışıldı',
      'YouTube transkript çekme, web scraping tartışmaları',
      'Almanya\'da vergi dilimleri ve KDV oranları hakkında bilgiler',
      'IT duyurularının Almanca/İngilizce paylaşılması önerisi',
    ],
  },
  {
    id: 'CV10',
    title: 'CV10 — 2 Mart - 8 Mart',
    dateLabel: '2 Mart - 8 Mart 2026',
    bullets: [
      'Oyun geliştirme fikirleri tartışıldı (Free Guys tarzı, Roblox, sanal evren).',
      'CursorClarify Chrome eklentisi tanıtıldı (Groq API ile özet ve gramer düzeltme).',
      "Türkiye'den Almanya'ya remote çalışma yöntemleri konuşuldu (Akkodis, taşeron firmalar).",
      'ITCS Köln 2026 iş fuarı duyuruldu (18 Eylül, teknoloji konferansı).',
      'Anthropic ücretsiz AI kursları paylaşıldı (Claude, Prompt Mühendisliği, MCP).',
      'Apple hesabı güvenlik ihlali yaşayan üyeye destek verildi.',
      'Yeni "soru-cevap" kanalı açıldı.',
      '"Minimum kural, maksimum fayda" ve "give to get" prensipleri hatırlatıldı.',
      'Railway.com alternatifi olarak Outplane (Türk girişimi) önerildi.',
      'FreelancerMap.de platformu tanıtıldı.',
    ],
  },
  {
    id: 'CV09',
    title: 'CV09 — 23 Şubat - 1 Mart',
    dateLabel: '23 Şubat - 1 Mart 2026',
    bullets: [
      'İş bulma sürecinin zorlaştığı ve birçok kişinin uzun süredir iş aradığı konuşuldu.',
      'LinkedIn paylaşımlarına destek çağrıları yapıldı.',
      'Yazılım piyasasının durgunluğu ve alan değiştirme ihtimali gündeme geldi.',
      'Zülkarneyn ve dinler üzerine entelektüel bir sohbet yapıldı.',
      'Güncel AI ve teknoloji haberleri paylaşıldı (Apple etkinliği, OpenAI yatırım turu, Gemini 3.1 Pro).',
      'İş arayanlara yönelik ihtiyaç anketi yapıldı (CV, freelance, LinkedIn vb.).',
      'LinkedIn görünürlük üzerine "kadın profil daha mı görünür?" tartışması oldu.',
      'Topluluk için etkinlik ve workshop planları duyuruldu.',
      "Biruni Üniversitesi'nde siber güvenlik ve kuantum etkinliği paylaşıldı.",
      'Savaş gündemiyle ilgili moral ve dayanışma mesajı paylaşıldı.',
      'Yeni üyeler yoğun şekilde gruba katıldı.',
      'Almanya101 projeleri ve showroom altyapısı fikri anlatıldı.',
      'Web site yayını, domain ve www yönlendirme konularında teknik destek verildi.',
      'Next.js, Vite, Turbopack ve Cloudflare altyapısı tartışıldı.',
      'ERP, e-fatura ve ödeme sistemleri üzerine teknik fikir alışverişi sürdü.',
      'GitHub Sponsors ve commit sayısı anketi yapıldı.',
      'AI modelleri, araçları ve ücretsiz alternatifler paylaşıldı.',
      'Blackbox.ai pro plan kampanyası duyuruldu.',
      'Stripe gibi ödeme sistemleri için PCI compliance skill önerildi.',
      'Önümüzdeki hafta ürün/proje sunum etkinliklerinin hızlandırılacağı açıklandı.',
    ],
  },
  {
    id: 'CV08',
    title: 'CV08 — 16 Şubat - 22 Şubat',
    dateLabel: '16 Şubat - 22 Şubat 2025',
    bullets: [
      "Almanya'da kullanılan yazılım dilleri & tech stack",
      "Almanya'ya yüksek lisans ve göç planları",
      '"Give to get" prensibi & topluluk kültürü',
      'Almanya101 veritabanı & gizlilik',
      "Almanya'da iş arama, LinkedIn ve ilan okuma",
      'Öğrenci vizesiyle çalışma ve uzaktan iş',
      "Türkiye-Almanya evrak ve eşya taşıma",
      'Kurumsallarda yapay zekaya geçiş',
      "Mercedes-Benz İstanbul ekibinin kapanması",
      'Networking, ortak projeler ve etkinlik fikirleri',
      'Discord, WhatsApp, YouTube, Reddit yapısı',
      'Mobil uygulamalar için tester grubu & MVP araçları',
      'Eyalet bazlı alt gruplar & organizasyon',
      "Almanya'da çalışma dili: Almanca vs İngilizce",
      'Yan projeler, ürün tanıtımı ve görünürlük artırma',
    ],
  },
];

export function SummaryClient() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <style>{`
        .sum-hero {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(66,133,244,0.3);
          border-radius: 24px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .sum-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
        }

        .sum-hero-domain {
          font-size: 14px;
          font-weight: 600;
          color: #4285F4;
          text-transform: lowercase;
          margin-bottom: 8px;
        }

        .sum-hero h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #fff;
        }

        .sum-hero p {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.6;
        }

        .sum-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sum-accordion {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .sum-accordion:hover {
          border-color: rgba(255,255,255,0.15);
        }

        .sum-accordion.open {
          border-color: rgba(66,133,244,0.3);
        }

        .sum-header-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 24px 28px;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          transition: background 0.3s ease;
          font-family: inherit;
          color: #fff;
        }

        .sum-header-btn:hover {
          background: rgba(255,255,255,0.03);
        }

        .sum-title {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0 0 4px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .sum-date {
          color: #4285F4;
          font-size: 13px;
          font-weight: 600;
          display: block;
        }

        .sum-chevron {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(66,133,244,0.10);
          border: 1px solid rgba(66,133,244,0.3);
          border-radius: 10px;
          color: #4285F4;
          font-size: 14px;
          transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
        }

        .sum-accordion.open .sum-chevron {
          transform: rotate(180deg);
          background: #4285F4;
          color: #fff;
        }

        .sum-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .sum-accordion.open .sum-body {
          max-height: 3000px;
        }

        .sum-body-inner {
          padding: 0 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sum-bullet {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.6;
          padding: 6px 0;
          transition: color 0.2s ease;
        }

        .sum-bullet:hover {
          color: #fff;
        }

        @media (max-width: 768px) {
          .sum-hero {
            padding: 22px;
            border-radius: 20px;
          }

          .sum-hero h2 {
            font-size: 20px;
          }

          .sum-header-btn {
            padding: 20px 22px;
          }

          .sum-title {
            font-size: 16px;
          }

          .sum-body-inner {
            padding: 0 22px 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sum-accordion,
          .sum-body,
          .sum-chevron {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="sum-hero">
        <div className="sum-hero-domain">almanya101.de</div>
        <h2>Haftalık Özet</h2>
        <p>
          Her hafta grubumuzda konuşulan tüm konuların madde başlıklarını buradan takip
          edebilirsin. WhatsApp mesajlarını kaçırdıysan, bu sayfada önemli konuları görebilirsin.
        </p>
      </div>

      <div className="sum-accordion-list">
        {SUMMARIES.map((summary) => {
          const isOpen = openId === summary.id;
          return (
            <div
              key={summary.id}
              className={`sum-accordion${isOpen ? ' open' : ''}`}
            >
              <button
                className="sum-header-btn"
                type="button"
                onClick={() => toggle(summary.id)}
                aria-expanded={isOpen}
              >
                <div>
                  <h5 className="sum-title">{summary.title}</h5>
                  <span className="sum-date">{summary.dateLabel}</span>
                </div>
                <span className="sum-chevron" aria-hidden="true">▼</span>
              </button>
              <div className="sum-body">
                <div className="sum-body-inner">
                  {summary.bullets.map((bullet, i) => (
                    <p key={i} className="sum-bullet">✅ {bullet}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
