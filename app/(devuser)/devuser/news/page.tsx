import Link from 'next/link';
import { DevUserShell } from '@/components/devuser/DevUserShell';

export default function NewsPage() {
  return (
    <DevUserShell
      title="haberler duyurular takvim"
      backHref="/devuser/dev"
      backLabel="← dashboard'a dön"
      frameVariant="default"
    >
      <style>{`
        .news-hero {
          text-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(66, 133, 244, 0.3);
          padding: 22px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.03);
        }

        .news-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
        }

        .news-hero-domain {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1.6px;
          color: #4285F4;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .news-hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 5vw, 38px);
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .news-hero p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
          line-height: 1.65;
        }

        .news-grid-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          margin-bottom: 16px;
        }

        .news-link-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .news-link-item {
          display: block;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 16px;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
        }

        .news-link-item:hover {
          transform: translateY(-2px);
          border-color: rgba(66, 133, 244, 0.5);
          box-shadow: 0 18px 26px rgba(66, 133, 244, 0.12);
        }

        .news-link-item h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          margin-bottom: 8px;
          color: #fff;
        }

        .news-link-item p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        @media (max-width: 768px) {
          .news-link-grid {
            grid-template-columns: 1fr;
          }

          .news-hero {
            padding: 18px;
            border-radius: 20px;
          }
        }
      `}</style>

      <section className="news-hero">
        <div className="news-hero-domain">almanya101.de</div>
        <h1>haberler duyurular takvim</h1>
        <p>
          Topluluğun güncel akışını tek alandan takip et. Yeni gelişmeler, etkinlik planları
          ve haftalık duyurular burada.
        </p>
      </section>

      <div className="news-grid-card">
        <nav className="news-link-grid">
          <Link href="/devuser/gelismeler" className="news-link-item">
            <h3>etkinlik takvimi</h3>
            <p>Yaklaşan buluşmalar, gelecek planı ve geçmiş etkinlik kayıtları.</p>
          </Link>

          <Link href="/devuser/summary" className="news-link-item">
            <h3>haftalık özetler</h3>
            <p>WhatsApp konuşmalarından çıkarılmış haftalık gündem ve özet akışı.</p>
          </Link>

          <Link href="/haberler" className="news-link-item">
            <h3>site haberleri</h3>
            <p>Almanya101 genelinde yayınlanan yeni haberler ve duyurular.</p>
          </Link>

          <Link href="/devuser/discussion" className="news-link-item">
            <h3>duyuru ve konu akışı</h3>
            <p>Topluluğun tartışma başlıklarını takip et, yeni konu önerilerini gör.</p>
          </Link>
        </nav>
      </div>
    </DevUserShell>
  );
}
