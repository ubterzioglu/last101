'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const SUBMIT_API_URL = '/api/devuser-dis-submit';
const LIST_API_URL = '/api/devuser-dis-list';

interface ApprovedItem {
  topic: string;
  anonymous: boolean;
  full_name?: string;
  created_at?: string;
}

type StatusType = '' | 'loading' | 'success' | 'error';

function formatDate(value: string | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR');
}

export function DiscussionClient() {
  const [anonymous, setAnonymous] = useState(false);
  const [fullName, setFullName] = useState('');
  const [topic, setTopic] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<StatusType>('');
  const [submitting, setSubmitting] = useState(false);
  const [approvedItems, setApprovedItems] = useState<ApprovedItem[] | null>(null);
  const [listError, setListError] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const trapRef = useRef<HTMLInputElement>(null);

  function setStatus(message: string, type: StatusType) {
    setStatusMsg(message);
    setStatusType(type);
  }

  const loadApprovedItems = useCallback(async () => {
    setListLoading(true);
    setListError('');
    try {
      const response = await fetch(`${LIST_API_URL}?limit=60`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setApprovedItems(payload.items ?? []);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Liste yüklenemedi.';
      setListError(msg);
      setApprovedItems(null);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApprovedItems();
  }, [loadApprovedItems]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('', '');

    const normalizedName = fullName.replace(/\r\n/g, '\n').trim().replace(/\n/g, ' ');
    const normalizedTopic = topic.replace(/\r\n/g, '\n').trim();

    if (!anonymous && !normalizedName) {
      setStatus('Ad soyad zorunlu (anonim seçili değil).', 'error');
      return;
    }
    if (!normalizedTopic) {
      setStatus('Konu zorunlu.', 'error');
      return;
    }
    if (normalizedTopic.length > 250) {
      setStatus('Konu en fazla 250 karakter olabilir.', 'error');
      return;
    }

    setSubmitting(true);
    setStatus('Kayıt alınıyor...', 'loading');

    try {
      const response = await fetch(SUBMIT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: normalizedName,
          anonymous,
          topic: normalizedTopic,
          website: trapRef.current?.value ?? '',
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Gönderim başarısız');
      }

      setFullName('');
      setTopic('');
      setCharCount(0);
      setAnonymous(false);
      setStatus('Gönderildi. Admin onayından sonra aşağıda görünecek.', 'success');
      await loadApprovedItems();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gönderim sırasında hata oluştu.';
      setStatus(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        .dis-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dis-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          backdrop-filter: blur(20px);
        }

        .dis-card h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #fff;
        }

        .dis-card > p {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.6;
        }

        .dis-form {
          display: grid;
          gap: 20px;
        }

        .dis-field-label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .dis-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .dis-input:focus {
          outline: none;
          border-color: #4285F4;
          background: rgba(255,255,255,0.08);
        }

        .dis-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .dis-textarea {
          min-height: 140px;
          resize: vertical;
        }

        .dis-checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
        }

        .dis-checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #4285F4;
          cursor: pointer;
        }

        .dis-char-meta {
          text-align: right;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          margin-top: 8px;
        }

        .dis-btn-primary {
          padding: 16px 32px;
          background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dis-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(66,133,244,0.4);
        }

        .dis-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dis-status {
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
        }

        .dis-status-loading {
          background: rgba(251,188,5,0.15);
          color: #FBBC05;
          border: 1px solid rgba(251,188,5,0.3);
        }

        .dis-status-success {
          background: rgba(52,168,83,0.15);
          color: #34A853;
          border: 1px solid rgba(52,168,83,0.3);
        }

        .dis-status-error {
          background: rgba(234,67,53,0.15);
          color: #EA4335;
          border: 1px solid rgba(234,67,53,0.3);
        }

        .dis-hp {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .dis-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .dis-list-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .dis-refresh-btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .dis-refresh-btn:hover {
          background: rgba(255,255,255,0.10);
          border-color: #4285F4;
        }

        .dis-approved-list {
          display: grid;
          gap: 15px;
        }

        .dis-topic-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .dis-topic-card:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
        }

        .dis-topic-text {
          margin: 0;
          color: #fff;
          font-size: 15px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .dis-topic-meta {
          margin-top: 12px;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
        }

        .dis-empty-state {
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          padding: 30px;
        }

        @media (max-width: 768px) {
          .dis-card {
            padding: 22px;
            border-radius: 20px;
          }

          .dis-list-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dis-refresh-btn {
            width: 100%;
          }
        }
      `}</style>

      <main className="dis-main">
        <div className="dis-card">
          <h2>Tartışma Konusu Öner</h2>
          <p>Kısa konu önerini bırak. Admin onayından sonra aynı sayfada görünür.</p>
        </div>

        <div className="dis-card">
          <form className="dis-form" onSubmit={handleSubmit} noValidate>
            {!anonymous && (
              <div>
                <label className="dis-field-label" htmlFor="fullNameInput">
                  Ad Soyad
                </label>
                <input
                  id="fullNameInput"
                  className="dis-input"
                  type="text"
                  maxLength={80}
                  placeholder="Adınız soyadınız"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!anonymous}
                />
              </div>
            )}

            <label className="dis-checkbox-label" htmlFor="anonymousInput">
              <input
                id="anonymousInput"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => {
                  setAnonymous(e.target.checked);
                  if (e.target.checked) setFullName('');
                }}
              />
              <span>Anonim paylaş</span>
            </label>

            <div>
              <label className="dis-field-label" htmlFor="topicInput">
                Tartışılmasını istediğin konu
              </label>
              <textarea
                id="topicInput"
                className="dis-input dis-textarea"
                maxLength={250}
                placeholder="En fazla 250 karakter..."
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                required
              />
              <div className="dis-char-meta">{charCount} / 250</div>
            </div>

            <input
              ref={trapRef}
              className="dis-hp"
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
            />

            <button className="dis-btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>

            {statusMsg && (
              <div
                className={`dis-status dis-status-${statusType}`}
                aria-live="polite"
              >
                {statusMsg}
              </div>
            )}
          </form>
        </div>

        <div className="dis-card">
          <div className="dis-list-header">
            <h4 className="dis-list-title">Onaylanan Konular</h4>
            <button
              className="dis-refresh-btn"
              type="button"
              onClick={loadApprovedItems}
              disabled={listLoading}
            >
              {listLoading ? 'Yükleniyor...' : 'Yenile'}
            </button>
          </div>

          {listError && (
            <div className="dis-empty-state">{listError}</div>
          )}

          {!listError && approvedItems === null && (
            <div className="dis-empty-state">Yükleniyor...</div>
          )}

          {!listError && approvedItems !== null && approvedItems.length === 0 && (
            <div className="dis-empty-state">Henüz onaylanan konu yok.</div>
          )}

          {!listError && approvedItems !== null && approvedItems.length > 0 && (
            <div className="dis-approved-list">
              {approvedItems.map((item, i) => (
                <article key={i} className="dis-topic-card">
                  <p className="dis-topic-text">{item.topic}</p>
                  <div className="dis-topic-meta">
                    {item.anonymous ? 'Anonim' : (item.full_name || 'İsim belirtilmedi')}
                    {' · '}
                    {formatDate(item.created_at)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
