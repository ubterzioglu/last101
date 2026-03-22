import type { Metadata } from 'next';
import Link from 'next/link';
import { DevUserShell } from '@/components/devuser/DevUserShell';

export const metadata: Metadata = {
  title: 'Profil Düzenleme Kapalı - almanya101',
  robots: { index: false, follow: false },
};

const css = `
  .devuserprofile-container {
    max-width: 720px;
    margin: 0 auto;
  }
  .devuserprofile-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px;
    backdrop-filter: blur(20px);
    margin-bottom: 20px;
  }
  .devuserprofile-domain {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .devuserprofile-card h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .devuserprofile-card p {
    margin: 10px 0 0 0;
    color: rgba(255, 255, 255, 0.92);
    font-size: 15px;
    line-height: 1.6;
  }
  .devuserprofile-info p {
    margin: 0 0 14px 0;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.88);
    font-size: 15px;
  }
  .devuserprofile-btn {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 100%);
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .devuserprofile-btn:hover {
    opacity: 0.88;
  }
`;

export default function DevUserProfilePage() {
  return (
    <>
      <style>{css}</style>
      <DevUserShell
        title="de tr software dashboard"
        backHref="/devuser/dev"
        backLabel="← dashboard'a dön"
        frameVariant="compact"
      >
        <div className="devuserprofile-container">
          <div className="devuserprofile-card">
            <div className="devuserprofile-domain">almanya101.de</div>
            <h3>Profil Düzenleme Kapalı</h3>
            <p>Profil güncelleme işlemleri artık sadece admin panelinden yapılıyor.</p>
          </div>

          <div className="devuserprofile-card devuserprofile-info">
            <p>
              Değişiklik taleplerinizi admin&apos;e iletin. Onay, profil düzenleme ve bilgi güncelleme
              sadece admin tarafında yapılır.
            </p>
            <Link href="/devuser/devuser/list" className="devuserprofile-btn">
              Liste Sayfasına Dön
            </Link>
          </div>
        </div>
      </DevUserShell>
    </>
  );
}
