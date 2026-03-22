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
