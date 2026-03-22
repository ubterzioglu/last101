'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { getDevUserClient } from '@/lib/supabase/devuser';

const PAGE_CSS = `
  .cvopt-main {
    display: grid;
    gap: 18px;
  }

  .cvopt-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }

  .cvopt-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
  }

  .hero-card {
    display: grid;
    gap: 12px;
    text-align: center;
  }

  .hero-kicker {
    font-size: 14px;
    font-weight: 600;
    color: #4285F4;
    text-transform: lowercase;
  }

  .hero-card h2,
  .section-title {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #fff;
  }

  .hero-card h2 {
    font-size: 32px;
  }

  .hero-card p,
  .section-copy,
  .queue-copy {
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.6;
    font-size: 14px;
  }

  .cta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .whatsapp-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    background: linear-gradient(135deg, #34A853 0%, #2e8b57 100%);
    border: none;
    border-radius: 14px;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .whatsapp-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(52, 168, 83, 0.28);
  }

  .form-grid {
    display: grid;
    gap: 18px;
  }

  .form-group {
    display: grid;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.74);
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    color: #fff;
    font-size: 15px;
    font-family: inherit;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #4285F4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.16);
  }

  .form-group input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .submit-btn {
    width: 100%;
    padding: 16px 20px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #4285F4 0%, #3367d6 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(66, 133, 244, 0.28);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .status-message {
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .status-message.success {
    background: rgba(52, 168, 83, 0.16);
    border: 1px solid rgba(52, 168, 83, 0.36);
    color: #a4efb8;
  }

  .status-message.error {
    background: rgba(234, 67, 53, 0.16);
    border: 1px solid rgba(234, 67, 53, 0.36);
    color: #ffb0a8;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin: 18px 0;
  }

  .stat-chip {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.03);
    text-align: center;
  }

  .stat-chip strong {
    display: block;
    font-size: 24px;
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
  }

  .stat-chip span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.62);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .queue-list {
    display: grid;
    gap: 12px;
    margin-top: 12px;
  }

  .queue-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-top: 18px;
  }

  .queue-column-title {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.74);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .queue-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
  }

  .queue-item.approved {
    border-color: rgba(52, 168, 83, 0.32);
    background: rgba(52, 168, 83, 0.08);
  }

  .queue-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .queue-name {
    font-weight: 700;
    color: #fff;
  }

  .queue-meta {
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.58);
  }

  .queue-status {
    flex-shrink: 0;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
  }

  .queue-status-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .queue-status.pending {
    background: rgba(251, 188, 5, 0.16);
    color: #fde293;
  }

  .queue-status.approved {
    background: rgba(52, 168, 83, 0.16);
    color: #a4efb8;
  }

  .scroll-top-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    background: #FBBC05;
    color: #000;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(251, 188, 5, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 100;
  }

  .scroll-top-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(251, 188, 5, 0.5);
  }

  .empty-state {
    padding: 28px 20px;
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    text-align: center;
    color: rgba(255, 255, 255, 0.58);
  }

  @media (max-width: 768px) {
    .cta-grid {
      grid-template-columns: 1fr;
    }

    .stats-row {
      grid-template-columns: 1fr;
    }

    .hero-card h2 {
      font-size: 24px;
    }

    .queue-columns {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .queue-column-title {
      font-size: 11px;
    }

    .queue-item {
      padding: 10px 12px;
      gap: 8px;
    }

    .queue-name {
      font-size: 13px;
    }

    .queue-meta {
      font-size: 10px;
    }

    .queue-status {
      font-size: 10px;
      padding: 4px 8px;
    }

    .scroll-top-btn {
      bottom: 16px;
      right: 16px;
      padding: 10px 16px;
      font-size: 13px;
    }
  }
`;

interface Participant {
  name: string;
  created_at: string;
  approved: boolean;
  linkedin_ok: boolean;
  cv_ok: boolean;
}

interface StatusState {
  message: string;
  type: 'success' | 'error' | '';
}

function formatNameInitials(fullName: string): string {
  if (!fullName) return '';
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return `${parts[0].charAt(0).toUpperCase()}.`;
  return `${parts[0].charAt(0).toUpperCase()}.${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

function formatDate(value: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CvoptClient() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [status, setStatus] = useState<StatusState>({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);

  const loadParticipants = useCallback(async () => {
    try {
      const client = await getDevUserClient();
      const { data, error } = await client
        .from('cvopt_participants_public')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setParticipants(Array.isArray(data) ? (data as Participant[]) : []);
    } catch {
      // silently fail — queue display is non-critical
    }
  }, []);

  useEffect(() => {
    loadParticipants();

    let cleanup: (() => void) | undefined;

    getDevUserClient()
      .then((client) => {
        const channel = client
          .channel('cvopt_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'cvopt_participants' },
            () => { loadParticipants(); }
          )
          .subscribe();
        cleanup = () => { client.removeChannel(channel); };
      })
      .catch(() => {});

    return () => { cleanup?.(); };
  }, [loadParticipants]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = nameRef.current?.value.trim() ?? '';
    const linkedin = linkedinRef.current?.value.trim() ?? '';
    const whatsapp = whatsappRef.current?.value.trim() ?? '';

    if (!name || !linkedin || !whatsapp) {
      setStatus({ message: 'Tüm alanları doldurun.', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/cvopt-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, linkedin, whatsapp }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error || 'Kayıt oluşturulamadı');
      }

      setStatus({
        message: 'Başvurun alındı. Admin onayından sonra durumun güncellenecek.',
        type: 'success',
      });

      if (nameRef.current) nameRef.current.value = '';
      if (linkedinRef.current) linkedinRef.current.value = '';
      if (whatsappRef.current) whatsappRef.current.value = '';

      window.setTimeout(() => setStatus({ message: '', type: '' }), 5000);
      await loadParticipants();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Başvuru gönderilemedi.';
      setStatus({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  const approved = participants.filter((p) => p.approved);
  const pending = participants.filter((p) => !p.approved);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <main className="cvopt-main">
          <section className="cvopt-card hero-card" style={{ marginBottom: 6 }}>
            <div className="hero-kicker">almanya101.de</div>
            <h2>Ücretsiz CV ve Linkedin Profil İyileştirme Önerileri</h2>
            <p>
              Hoş geldin! Önce Formu Doldur Sıraya Gir<br />
              Sonra Whatsapp&apos;dan CV Gönder! :)<br />
              Unutma! Yalnız değilsin! almanya101 seninle!
            </p>
          </section>

          <section className="cta-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="cvopt-card">
              <h3 className="section-title">Sıra listesine katıl</h3>
              <p className="section-copy" style={{ marginTop: 12 }}>
                Ad Soyad, LinkedIn profil linki ve WhatsApp numaranı bırak. Kaydın admin
                onayından sonra durumun güncellenir.
              </p>
            </div>

            <div className="cvopt-card">
              <h3 className="section-title">WhatsApp&apos;tan CV gönder</h3>
              <p className="section-copy" style={{ margin: '12px 0 18px' }}>
                Hazır CV&apos;ni doğrudan WhatsApp&apos;a yolla. Hemen yazmak istersen
                aşağıdaki buton seni direkt mesaja götürür.
              </p>
              <a
                className="whatsapp-cta"
                href="https://wa.me/905302404995?text=Merhaba%21%20Formu%20doldurup%20s%C4%B1raya%20girdim%21%20%C5%9Eimdi%20Whatsapp%27dan%20CV%27mi%20g%C3%B6nderiyorum."
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>WhatsApp me</span>
                <span>+905302404995</span>
              </a>
            </div>
          </section>

          <section className="cvopt-card">
            <h3 className="section-title">Başvuru formu</h3>
            {status.message && (
              <div className={`status-message ${status.type}`}>{status.message}</div>
            )}
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Ad Soyad *</label>
                <input
                  type="text"
                  id="fullName"
                  ref={nameRef}
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn profil linki *</label>
                <input
                  type="url"
                  id="linkedin"
                  ref={linkedinRef}
                  placeholder="https://www.linkedin.com/in/kullanici-adi"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp numarası *</label>
                <input
                  type="tel"
                  id="whatsapp"
                  ref={whatsappRef}
                  placeholder="Örn: +49 171 1234567"
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Gönderiliyor...' : 'Sıraya gir'}
              </button>
            </form>
          </section>

          <section className="cvopt-card">
            <h3 className="section-title">Sıra durumu</h3>
            <p className="queue-copy">
              Genel görünüm sadece adının kısaltmasını ve süreç durumlarını gösterir.
              İletişim bilgileri gizli tutulur.
            </p>
            <div className="stats-row">
              <div className="stat-chip">
                <strong>{participants.length}</strong>
                <span>Toplam</span>
              </div>
              <div className="stat-chip">
                <strong>{pending.length}</strong>
                <span>Bekleyen</span>
              </div>
              <div className="stat-chip">
                <strong>{approved.length}</strong>
                <span>Onaylı</span>
              </div>
            </div>
            <div className="queue-columns">
              <div className="queue-column">
                <h4 className="queue-column-title">Onaylanmış</h4>
                <div className="queue-list">
                  {approved.length === 0 ? (
                    <div className="empty-state">Henüz onaylanmış başvuru yok.</div>
                  ) : (
                    approved.map((item, i) => (
                      <QueueItem key={i} item={item} />
                    ))
                  )}
                </div>
              </div>
              <div className="queue-column">
                <h4 className="queue-column-title">Sıra Bekleyenler</h4>
                <div className="queue-list">
                  {pending.length === 0 ? (
                    <div className="empty-state">Bekleyen başvuru yok.</div>
                  ) : (
                    pending.map((item, i) => (
                      <QueueItem key={i} item={item} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <button
          type="button"
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Yukarı çık"
        >
          Go up!
        </button>
      </DevUserShell>
    </>
  );
}

function QueueItem({ item }: { item: Participant }) {
  return (
    <div className={`queue-item${item.approved ? ' approved' : ''}`}>
      <div className="queue-item-left">
        <div>
          <div className="queue-name">{formatNameInitials(item.name)}</div>
          <div className="queue-meta">{formatDate(item.created_at)}</div>
        </div>
      </div>
      <div className="queue-status-group">
        <span className={`queue-status ${item.approved ? 'approved' : 'pending'}`}>Onay</span>
        <span className={`queue-status ${item.linkedin_ok ? 'approved' : 'pending'}`}>LinkedIn</span>
        <span className={`queue-status ${item.cv_ok ? 'approved' : 'pending'}`}>CV</span>
      </div>
    </div>
  );
}
