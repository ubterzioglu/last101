'use client';

import { useCallback, useEffect, useState } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { normalizeFounderStatus } from '@/lib/founder';

const css = `
  .founder-main {
    display: grid;
    gap: 18px;
  }

  .founder-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }

  .founder-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
  }

  .hero-card {
    text-align: center;
  }

  .hero-kicker {
    font-size: 14px;
    font-weight: 600;
    color: #34A853;
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
    font-size: 28px;
    margin-top: 12px;
  }

  .hero-card p {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.6;
    font-size: 14px;
  }

  .info-box {
    margin-top: 16px;
    border-radius: 14px;
    border: 1px solid rgba(66, 133, 244, 0.26);
    background: rgba(66, 133, 244, 0.1);
    padding: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    line-height: 1.6;
  }

  .form-grid {
    display: grid;
    gap: 18px;
  }

  .two-col {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form-group {
    display: grid;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    color: #fff;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.3s ease;
    outline: none;
  }

  .form-input:focus {
    border-color: #4285F4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.16);
  }

  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  textarea.form-input {
    min-height: 160px;
    resize: vertical;
  }

  .submit-btn {
    width: 100%;
    padding: 16px 20px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    margin-top: 8px;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(52, 168, 83, 0.25);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-message {
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
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

  .list-grid {
    display: grid;
    gap: 14px;
  }

  .list-card {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.025);
    display: grid;
    gap: 12px;
  }

  .list-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .list-title {
    margin: 0;
    font-size: 20px;
    color: #fff;
  }

  .list-subtitle {
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 14px;
  }

  .badge-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 700;
  }

  .status-badge.pending {
    background: rgba(251, 188, 5, 0.14);
    border: 1px solid rgba(251, 188, 5, 0.3);
    color: #fbd66b;
  }

  .status-badge.approved {
    background: rgba(52, 168, 83, 0.14);
    border: 1px solid rgba(52, 168, 83, 0.3);
    color: #a4efb8;
  }

  .status-badge.rejected {
    background: rgba(234, 67, 53, 0.14);
    border: 1px solid rgba(234, 67, 53, 0.3);
    color: #ffb0a8;
  }

  .status-badge.muted {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.66);
  }

  .list-description {
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.65;
    white-space: pre-wrap;
  }

  .empty-list {
    padding: 22px 18px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    .two-col {
      grid-template-columns: 1fr;
    }

    .hero-card h2 {
      font-size: 24px;
    }
  }
`;

type StatusType = 'success' | 'error' | null;

interface FounderListItem {
  id: string;
  full_name: string | null;
  project_name: string | null;
  short_description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
}

const INITIAL_FORM = {
  fullName: '',
  linkedinUrl: '',
  whatsapp: '',
  projectName: '',
  shortDescription: '',
};

export function FounderClient() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<StatusType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [submissions, setSubmissions] = useState<FounderListItem[]>([]);

  const showStatus = useCallback((message: string, type: StatusType) => {
    setStatusMsg(message);
    setStatusType(type);
  }, []);

  const handleChange = useCallback(
    (key: keyof typeof INITIAL_FORM, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const loadSubmissions = useCallback(async () => {
    setListLoading(true);
    setListError('');

    try {
      const response = await fetch('/api/founder-submissions', {
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error || 'Founder kayıtları yüklenemedi.');
      }

      const items = Array.isArray((payload as { items?: FounderListItem[] }).items)
        ? (payload as { items: FounderListItem[] }).items
        : [];
      setSubmissions(items);
    } catch (error) {
      setListError((error as Error)?.message || 'Founder kayıtları yüklenemedi.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setStatusMsg('');
      setStatusType(null);

      try {
        const response = await fetch('/api/founder-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: form.fullName,
            linkedin_url: form.linkedinUrl,
            whatsapp: form.whatsapp,
            project_name: form.projectName,
            short_description: form.shortDescription,
          }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((payload as { error?: string }).error || 'Başvuru gönderilemedi.');
        }

        const duplicate = Boolean((payload as { duplicate?: boolean }).duplicate);
        showStatus(
          duplicate
            ? 'Daha önce gönderdiğin kayıt güncellendi. Admin incelemesi devam ediyor.'
            : 'Founder başvurun alındı. İnceleme sonrası survey linki admin tarafından paylaşılacak.',
          'success'
        );
        setForm(INITIAL_FORM);
        await loadSubmissions();
      } catch (error) {
        showStatus((error as Error)?.message || 'Bir hata oluştu.', 'error');
      } finally {
        setSubmitting(false);
      }
    },
    [form, loadSubmissions, showStatus]
  );

  function formatDate(value: string | null) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusLabel(value: FounderListItem['status']) {
    const status = normalizeFounderStatus(value);
    if (status === 'approved') return 'Onaylandı';
    if (status === 'rejected') return 'Reddedildi';
    return 'İncelemede';
  }

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <main className="founder-main">
          <section className="founder-card hero-card">
            <div className="hero-kicker">almanya101.de</div>
            <h2>Founder Kayıt</h2>
            <p>Projeni topluluğa taşı ve founder havuzuna gir.</p>
            <div className="info-box">
              Başvuru sonrası kayıt admin onayına düşer. Tüm alanlar opsiyoneldir; ne kadar bilgi paylaşırsan değerlendirme o kadar kolay olur. Survey linki yalnızca uygun görülen kayıtlarla paylaşılır.
            </div>
          </section>

          <section className="founder-card">
            <h3 className="section-title">Başvuru Formu</h3>
            <div style={{ height: 16 }} />

            {statusMsg && statusType ? (
              <div className={`status-message ${statusType}`} style={{ marginBottom: 18 }}>
                {statusMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="two-col">
                <div className="form-group">
                  <label htmlFor="fullName">İsim Soyisim</label>
                  <input
                    id="fullName"
                    className="form-input"
                    value={form.fullName}
                    onChange={(event) => handleChange('fullName', event.target.value)}
                    placeholder="Örn: Ayşe Yılmaz"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="linkedinUrl">LinkedIn</label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    className="form-input"
                    value={form.linkedinUrl}
                    onChange={(event) => handleChange('linkedinUrl', event.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="two-col">
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    className="form-input"
                    value={form.whatsapp}
                    onChange={(event) => handleChange('whatsapp', event.target.value)}
                    placeholder="+49 171 123 45 67"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectName">Proje Adı</label>
                  <input
                    id="projectName"
                    className="form-input"
                    value={form.projectName}
                    onChange={(event) => handleChange('projectName', event.target.value)}
                    placeholder="Örn: yapay zeka destekli işe alım aracı"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shortDescription">Kısa Açıklama</label>
                <textarea
                  id="shortDescription"
                  className="form-input"
                  value={form.shortDescription}
                  onChange={(event) => handleChange('shortDescription', event.target.value)}
                  placeholder="Projen ne yapıyor, kimin problemini çözüyor ve şu an hangi aşamada?"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Gönderiliyor...' : 'Founder Başvurusunu Gönder'}
              </button>
            </form>
          </section>

          <section className="founder-card">
            <div className="list-head" style={{ marginBottom: 18 }}>
              <div>
                <h3 className="section-title">Kayıt Olan Founderlar</h3>
                <div className="list-subtitle">
                  Son başvurular aşağıda görünüyor. Survey linki burada değil; admin onaylı kayıt için özel link üretip paylaşır.
                </div>
              </div>
            </div>

            {listLoading ? (
              <div className="empty-list">Founder kayıtları yükleniyor...</div>
            ) : listError ? (
              <div className="status-message error">{listError}</div>
            ) : submissions.length === 0 ? (
              <div className="empty-list">Henüz founder kaydı görünmüyor.</div>
            ) : (
              <div className="list-grid">
                {submissions.map((item) => {
                  const status = normalizeFounderStatus(item.status);
                  return (
                    <article key={item.id} className="list-card">
                      <div className="list-head">
                        <div>
                          <h4 className="list-title">{item.full_name || 'İsimsiz founder'}</h4>
                          <div className="list-subtitle">{item.project_name || 'Proje adı paylaşılmadı'}</div>
                        </div>
                        <div className="badge-row">
                          <span className={`status-badge ${status}`}>{getStatusLabel(status)}</span>
                          <span className="status-badge muted">{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                      <div className="list-description">
                        {item.short_description || 'Henüz kısa açıklama eklenmedi.'}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </DevUserShell>
    </>
  );
}
