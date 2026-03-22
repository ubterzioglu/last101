'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DevUserShell } from '@/components/devuser/DevUserShell';

const css = `
  .dev-welcome-banner {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 30px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
    margin-bottom: 30px;
  }
  .dev-welcome-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
  }
  .dev-welcome-banner h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #fff;
  }
  .dev-welcome-banner p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
  }
  .dev-dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .dev-action-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: block;
    animation: devFadeInUp 0.6s ease backwards;
  }
  .dev-action-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.03) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .dev-action-card:hover::before { opacity: 1; }
  .dev-action-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
  .dev-action-card.primary { border-color: rgba(66, 133, 244, 0.3); }
  .dev-action-card.primary:hover {
    border-color: rgba(66, 133, 244, 0.5);
    box-shadow: 0 25px 50px -12px rgba(66, 133, 244, 0.2);
  }
  .dev-action-card.secondary { border-color: rgba(234, 67, 53, 0.3); }
  .dev-action-card.secondary:hover {
    border-color: rgba(234, 67, 53, 0.5);
    box-shadow: 0 25px 50px -12px rgba(234, 67, 53, 0.2);
  }
  .dev-action-card.accent { border-color: rgba(52, 168, 83, 0.3); }
  .dev-action-card.accent:hover {
    border-color: rgba(52, 168, 83, 0.5);
    box-shadow: 0 25px 50px -12px rgba(52, 168, 83, 0.15);
  }
  .dev-card-image {
    width: calc(100% + 56px);
    height: 160px;
    object-fit: cover;
    margin: -28px -28px 20px -28px;
    border-radius: 24px 24px 0 0;
  }
  .dev-action-card h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #fff;
  }
  .dev-action-card p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
  .dev-action-card:nth-child(1) { animation-delay: 0.1s; }
  .dev-action-card:nth-child(2) { animation-delay: 0.2s; }
  .dev-action-card:nth-child(3) { animation-delay: 0.3s; }
  .dev-action-card:nth-child(4) { animation-delay: 0.4s; }
  .dev-action-card:nth-child(5) { animation-delay: 0.5s; }
  .dev-action-card:nth-child(6) { animation-delay: 0.6s; }
  .dev-action-card:nth-child(7) { animation-delay: 0.7s; }
  .dev-action-card:nth-child(8) { animation-delay: 0.8s; }
  .dev-action-card:nth-child(9) { animation-delay: 0.9s; }
  .dev-action-card:nth-child(10) { animation-delay: 1.0s; }
  .dev-action-card:nth-child(11) { animation-delay: 1.1s; }
  .dev-action-card:nth-child(12) { animation-delay: 1.2s; }
  @keyframes devFadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .dev-dashboard-grid { grid-template-columns: 1fr; gap: 15px; }
    .dev-action-card { padding: 22px; border-radius: 20px; }
    .dev-card-image {
      width: calc(100% + 44px);
      height: 140px;
      margin: -22px -22px 16px -22px;
      border-radius: 20px 20px 0 0;
    }
    .dev-action-card h3 { font-size: 27px; }
    .dev-action-card p { font-size: 13px; }
    .dev-welcome-banner { padding: 22px; border-radius: 20px; }
    .dev-welcome-banner h2 { font-size: 20px; }
  }
  @media (hover: none) {
    .dev-action-card:active { transform: scale(0.98); transition: transform 0.1s ease; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default function DevPage() {
  return (
    <>
      <style>{css}</style>
      <DevUserShell title="de tr software dashboard">
        <div className="dev-welcome-banner">
          <h2>hoş geldin! yalnız değilsin! almanya101 seninle!</h2>
        </div>

        <div className="dev-dashboard-grid">
          <Link href="/devuser/devuser/survey" className="dev-action-card accent">
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"
              alt="survey"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>tanisma toplantisi anketi</h3>
            <p>1 saatlik tanisma kaynasma proje fikirleri oylama toplantisi icin uygun tarihlerini belirt.</p>
          </Link>

          <a
            href="https://chat.whatsapp.com/J6dWmKKtXPJ6BC7Z1ndu9U"
            className="dev-action-card primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop"
              alt="community people"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>whatsapp topluluğuna katıl</h3>
            <p>almanya101 software whatsapp grubuna katıl!</p>
          </a>

          <Link href="/devuser/devuser/du" className="dev-action-card accent">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop"
              alt="register"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>veritabanına kayıt ol</h3>
            <p>de tr software topluluğuna katıl, profilini oluştur ve diğer developerlarla bağlantı kur.</p>
          </Link>

          <Link href="/devuser/devuser/list" className="dev-action-card primary">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop"
              alt="developers"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>üye veritabanı</h3>
            <p>onaylı üyeler arasında ara, filtrele ve bağlantı kur.</p>
          </Link>

          <Link href="/devuser/devuser/summary" className="dev-action-card secondary">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop"
              alt="events"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>haftalık özetler</h3>
            <p>whatsapp mesajlarını takip edemiyor musun? sorun değil! her hafta chat içeriklerini özetliyoruz.</p>
          </Link>

          <Link href="/devuser/devuser/gelismeler" className="dev-action-card accent">
            <Image
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop"
              alt="calendar updates"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>etkinlik takvimi</h3>
            <p>gelecek etkinlikleri, duyurulari, haberleri ve gelismeleri tek ekranda takip et. gecmis kayitlari alana gore filtrele.</p>
          </Link>

          <Link href="/devuser/devuser/news" className="dev-action-card secondary">
            <Image
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop"
              alt="news calendar"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>haberler duyurular takvim</h3>
            <p>guncel haberleri, duyurulari ve etkinlik takvimini tek karttan takip et.</p>
          </Link>

          <Link href="/devuser/devuser/discussion" className="dev-action-card">
            <Image
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop"
              alt="discussion"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>tartışma konusu öner</h3>
            <p>bir sonraki etkinliklerde tartışmak üzere konu öner!</p>
          </Link>

          <Link href="/devuser/devuser/tavla" className="dev-action-card">
            <Image
              src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&auto=format&fit=crop"
              alt="tournament"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>turnuva</h3>
            <p>1. tavla turnuvasına katıl, şampiyon ol ve ödülü kazan!</p>
          </Link>

          <Link href="/devuser/devuser/vct" className="dev-action-card accent">
            <Image
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop"
              alt="vibecoding"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>vibecoding tournament</h3>
            <p>takımını kur, vibe coding yap ve ödülü kazan!</p>
          </Link>

          <Link href="/devuser/devuser/promote" className="dev-action-card">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop"
              alt="promote"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>promote your product</h3>
            <p>ürününü tanıt, anonim geri bildirim al ve puanla!</p>
          </Link>

          <Link href="/devuser/devuser/cvopt" className="dev-action-card primary">
            <Image
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop"
              alt="cv linkedin"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>cv linkedin iyilestirme</h3>
            <p>cv'ni whatsapp'tan gonder, linkedin profilini birak ve admin onayli siraya gir.</p>
          </Link>

          <Link href="/devuser/devuser/typing" className="dev-action-card secondary">
            <Image
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
              alt="typing"
              className="dev-card-image"
            width={600}
            height={400}
            unoptimized
            />
            <h3>klavye hız yarışması</h3>
            <p>klavyende ne kadar hızlısın? yarış ve ödülü kazan!</p>
          </Link>
        </div>
      </DevUserShell>
    </>
  );
}
