'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { formatFounderSlotLabel, type FounderEventSlot } from '@/lib/founder';

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
    inset: 0 0 auto 0;
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

  .info-box {
    background: rgba(66, 133, 244, 0.08);
    border: 1px solid rgba(66, 133, 244, 0.24);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
  }

  .checkbox-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px;
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

  .checkbox-item input[type='checkbox'] {
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
    gap: 4px;
    color: #fff;
    font-size: 14px;
  }

  .checkbox-meta {
    color: rgba(255, 255, 255, 0.56);
    font-size: 12px;
    line-height: 1.4;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  .selected-tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: rgba(52, 168, 83, 0.15);
    border: 1px solid rgba(52, 168, 83, 0.3);
    border-radius: 20px;
    font-size: 13px;
    color: #a4efb8;
  }

  .submit-btn {
    width: 100%;
    margin-top: 20px;
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

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(66, 133, 244, 0.28);
  }

  .submit-btn:disabled {
    opacity: 0.55;
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

  .loading-box,
  .empty-box {
    padding: 28px 18px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }

  @media (max-width: 640px) {
    .checkbox-grid {
      grid-template-columns: 1fr;
    }
  }
`;

type StatusType = 'success' | 'error' | null;

interface FounderSurveyPayload {
  founder: {
    id: string;
    full_name: string;
    project_name: string;
  };
  slots: FounderEventSlot[];
  existing_vote: {
    id: string;
    selected_slot_ids: string[];
    updated_at: string | null;
  } | null;
}

export function FounderSurveyClient({ founderId }: { founderId: string }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<StatusType>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [payload, setPayload] = useState<FounderSurveyPayload | null>(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const selectedLabels = useMemo(() => {
    if (!payload) return [];
    const slotMap = new Map(payload.slots.map((slot) => [slot.id, formatFounderSlotLabel(slot)]));
    return selectedSlotIds.map((slotId) => slotMap.get(slotId) || slotId);
  }, [payload, selectedSlotIds]);

  const loadSurveyData = useCallback(async () => {
    if (!founderId) {
      setErrorMsg('Founder linki eksik. Lütfen admin tarafından paylaşılan linki kullanın.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`/api/founder-event-slots?founder=${encodeURIComponent(founderId)}`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error((result as { error?: string }).error || 'Anket bilgileri yüklenemedi.');
      }

      const nextPayload = result as FounderSurveyPayload;
      setPayload(nextPayload);
      setSelectedSlotIds(Array.isArray(nextPayload.existing_vote?.selected_slot_ids) ? nextPayload.existing_vote?.selected_slot_ids : []);
    } catch (error) {
      setErrorMsg((error as Error)?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [founderId]);

  useEffect(() => {
    void loadSurveyData();
  }, [loadSurveyData]);

  const toggleSlot = useCallback((slotId: string) => {
    setSelectedSlotIds((prev) =>
      prev.includes(slotId) ? prev.filter((current) => current !== slotId) : [...prev, slotId]
    );
  }, []);

  const showStatus = useCallback((message: string, type: StatusType) => {
    setStatusMsg(message);
    setStatusType(type);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!payload?.founder?.id) {
        showStatus('Founder bilgisi bulunamadı.', 'error');
        return;
      }
      if (selectedSlotIds.length === 0) {
        showStatus('Lütfen en az bir tarih seçin.', 'error');
        return;
      }

      setSubmitting(true);
      setStatusMsg('');
      setStatusType(null);

      try {
        const response = await fetch('/api/founder-event-vote-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            founder_submission_id: payload.founder.id,
            selected_slot_ids: selectedSlotIds,
          }),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((result as { error?: string }).error || 'Anket gönderilemedi.');
        }

        showStatus('Tarih tercihleriniz kaydedildi. İsterseniz daha sonra aynı linkten güncelleyebilirsiniz.', 'success');
        await loadSurveyData();
      } catch (error) {
        showStatus((error as Error)?.message || 'Bir hata oluştu.', 'error');
      } finally {
        setSubmitting(false);
      }
    },
    [loadSurveyData, payload, selectedSlotIds, showStatus]
  );

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <main className="survey-main">
          <section className="survey-card hero-card">
            <div className="hero-kicker">almanya101.de</div>
            <h2>Founder Etkinlik Tarih Anketi</h2>
            <p>
              Onaylanan founder kaydın için uygun tarih ve saatleri seç. Bu link sana özel olarak admin
              tarafından paylaşılmıştır.
            </p>
          </section>

          <section className="survey-card">
            {loading ? (
              <div className="loading-box">Anket bilgileri yükleniyor...</div>
            ) : errorMsg ? (
              <div className="status-message error">{errorMsg}</div>
            ) : !payload ? (
              <div className="empty-box">Anket bilgisi bulunamadı.</div>
            ) : payload.slots.length === 0 ? (
              <>
                <h3 className="section-title">Henüz aktif slot yok</h3>
                <div className="info-box" style={{ marginTop: 16 }}>
                  Admin henüz tarih/saat seçeneklerini eklememiş. Bir süre sonra aynı linki tekrar deneyebilirsin.
                </div>
              </>
            ) : (
              <>
                <h3 className="section-title">{payload.founder.full_name}</h3>
                <div className="info-box" style={{ margin: '16px 0 20px' }}>
                  <strong>Proje:</strong> {payload.founder.project_name}
                  <br />
                  Uygun olduğun kadar tarih seçebilirsin. Daha önce kayıt yaptıysan bu form yeni tercihlerinle güncellenir.
                </div>

                {statusMsg && statusType ? (
                  <div className={`status-message ${statusType}`}>{statusMsg}</div>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <div className="checkbox-grid">
                    {payload.slots.map((slot) => (
                      <label key={slot.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedSlotIds.includes(slot.id)}
                          onChange={() => toggleSlot(slot.id)}
                        />
                        <span className="checkbox-label">
                          {formatFounderSlotLabel(slot)}
                          <span className="checkbox-meta">
                            {slot.ends_at
                              ? 'Başlangıç ve bitiş saati admin tarafından tanımlanmıştır.'
                              : 'Tek saatlik / açık uçlu slot.'}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="selected-tags">
                    {selectedLabels.map((label) => (
                      <span key={label} className="selected-tag">
                        {label}
                      </span>
                    ))}
                  </div>

                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Kaydediliyor...' : 'Tarih Tercihlerini Kaydet'}
                  </button>
                </form>
              </>
            )}
          </section>
        </main>
      </DevUserShell>
    </>
  );
}
