'use client';

import { useState, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';

const css = `
  .survey-main {
    display: grid;
    gap: 18px;
  }

  .survey-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }

  .survey-card::before {
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
    font-size: 26px;
  }

  .hero-card p {
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.6;
    font-size: 14px;
  }

  .form-grid {
    display: grid;
    gap: 20px;
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

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .checkbox-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .checkbox-item:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(66, 133, 244, 0.3);
  }

  .checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #34A853;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .checkbox-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    flex: 1;
  }

  .checkbox-label .date-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 500px) {
    .checkbox-grid {
      grid-template-columns: 1fr;
    }
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
    min-height: 32px;
  }

  .selected-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(52, 168, 83, 0.15);
    border: 1px solid rgba(52, 168, 83, 0.3);
    border-radius: 20px;
    font-size: 13px;
    color: #a4efb8;
  }

  .selected-tag .remove {
    cursor: pointer;
    font-weight: bold;
    opacity: 0.7;
  }

  .selected-tag .remove:hover {
    opacity: 1;
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
    margin-top: 8px;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(66, 133, 244, 0.28);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  .info-box {
    background: rgba(66, 133, 244, 0.08);
    border: 1px solid rgba(66, 133, 244, 0.24);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
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

  @media (max-width: 768px) {
    .hero-card h2 {
      font-size: 22px;
    }

    .scroll-top-btn {
      bottom: 16px;
      right: 16px;
      padding: 10px 16px;
      font-size: 13px;
    }
  }
`;

const DATE_OPTIONS: { value: string; label: string; time: string }[] = [
  { value: '2026-03-20', label: '20 Mart Cuma', time: '21:00 TR / 19:00 DE' },
  { value: '2026-03-21', label: '21 Mart Cumartesi', time: '21:00 TR / 19:00 DE' },
  { value: '2026-03-22', label: '22 Mart Pazar', time: '21:00 TR / 19:00 DE' },
  { value: '2026-03-27', label: '27 Mart Cuma', time: '21:00 TR / 19:00 DE' },
  { value: '2026-03-28', label: '28 Mart Cumartesi', time: '21:00 TR / 19:00 DE' },
  { value: '2026-03-29', label: '29 Mart Pazar', time: '21:00 TR / 19:00 DE' },
  { value: '2026-04-03', label: '3 Nisan Cuma', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-04', label: '4 Nisan Cumartesi', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-05', label: '5 Nisan Pazar', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-10', label: '10 Nisan Cuma', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-11', label: '11 Nisan Cumartesi', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-12', label: '12 Nisan Pazar', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-17', label: '17 Nisan Cuma', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-18', label: '18 Nisan Cumartesi', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-19', label: '19 Nisan Pazar', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-24', label: '24 Nisan Cuma', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-25', label: '25 Nisan Cumartesi', time: '21:00 TR / 20:00 DE' },
  { value: '2026-04-26', label: '26 Nisan Pazar', time: '21:00 TR / 20:00 DE' },
];

const DATE_LABELS: Record<string, string> = Object.fromEntries(
  DATE_OPTIONS.map((d) => [d.value, d.label])
);

type StatusType = 'success' | 'error' | null;

export function SurveyClient() {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<StatusType>(null);
  const [submitting, setSubmitting] = useState(false);

  const showStatus = useCallback((message: string, type: StatusType) => {
    setStatusMsg(message);
    setStatusType(type);
    if (type === 'success') {
      setTimeout(() => {
        setStatusMsg('');
        setStatusType(null);
      }, 5000);
    }
  }, []);

  const toggleDate = useCallback((value: string) => {
    setSelectedDates((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  }, []);

  const removeDate = useCallback((value: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== value));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedName = fullName.trim();
      const trimmedWhatsapp = whatsapp.trim();

      if (!trimmedName) {
        showStatus('Lütfen ad soyad girin.', 'error');
        return;
      }
      if (!trimmedWhatsapp) {
        showStatus('Lütfen WhatsApp numarası girin.', 'error');
        return;
      }
      if (selectedDates.length === 0) {
        showStatus('Lütfen en az bir tarih seçin.', 'error');
        return;
      }

      setSubmitting(true);

      try {
        const response = await fetch('/api/meeting-attendance-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: trimmedName,
            whatsapp: trimmedWhatsapp,
            available_dates: selectedDates,
          }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((payload as { error?: string }).error || 'Gönderilemedi');
        }

        showStatus('Kaydınız alındı! Teşekkürler.', 'success');
        setFullName('');
        setWhatsapp('');
        setSelectedDates([]);
      } catch (err) {
        const error = err as Error;
        showStatus(error.message || 'Bir hata oluştu.', 'error');
      } finally {
        setSubmitting(false);
      }
    },
    [fullName, whatsapp, selectedDates, showStatus]
  );

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <main className="survey-main">
          <section className="survey-card hero-card" style={{ marginBottom: 6 }}>
            <div className="hero-kicker">almanya101.de</div>
            <h2>Tanışma Kaynaşma Toplantısı</h2>
            <p>1 saatlik online tanışma, kaynaşma ve proje fikirleri toplantısı için formu doldur.</p>
          </section>

          <section className="survey-card">
            <h3 className="section-title">Katılım Formu</h3>
            <div className="info-box" style={{ margin: '16px 0 20px' }}>
              📅 20 Mart&apos;tan itibaren tüm Cuma, Cumartesi ve Pazarlar (Nisan sonuna kadar). İstediğin kadar tarih seçebilirsin.<br /><br />
              ⚠️ <strong>Yaz saati uyarısı:</strong> 30 Mart&apos;tan itibaren Türkiye ve Almanya yaz saatine geçiyor. Her tarihin yanındaki saatleri kontrol et.
            </div>

            {statusMsg && statusType && (
              <div className={`status-message ${statusType}`}>{statusMsg}</div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Ad Soyad *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp Numarası *</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  className="form-input"
                  placeholder="Örn: +49 171 1234567"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Uygun Tarihleri Seç *</label>
                <div className="checkbox-grid">
                  {DATE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={opt.value}
                        checked={selectedDates.includes(opt.value)}
                        onChange={() => toggleDate(opt.value)}
                      />
                      <span className="checkbox-label">
                        {opt.label}
                        <span className="date-time">{opt.time}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="selected-tags" style={{ marginTop: 16 }}>
                  {selectedDates.map((date) => (
                    <span key={date} className="selected-tag">
                      {DATE_LABELS[date] || date}
                      <span className="remove" onClick={() => removeDate(date)}>×</span>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
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
