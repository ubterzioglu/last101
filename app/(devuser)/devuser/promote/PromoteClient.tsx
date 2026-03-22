'use client';

import { useState, useEffect, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { getDevUserClient } from '@/lib/supabase/devuser';

const css = `
  .promote-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.6s ease backwards;
  }

  .card:nth-child(1) { animation-delay: 0.1s; }
  .card:nth-child(2) { animation-delay: 0.2s; }
  .card:nth-child(3) { animation-delay: 0.3s; }
  .card:nth-child(4) { animation-delay: 0.4s; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-card {
    border-color: rgba(251, 188, 5, 0.3);
    text-align: center;
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #FBBC05 0%, #EA4335 100%);
  }

  .hero-domain {
    font-size: 14px;
    font-weight: 600;
    color: #FBBC05;
    text-transform: lowercase;
    margin-bottom: 8px;
  }

  .trophy-icon {
    font-size: 64px;
    margin: 16px 0;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hero-card h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
  }

  .hero-card p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }

  .rules-card {
    border-color: rgba(52, 168, 83, 0.3);
  }

  .rules-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
  }

  .form-card {
    border-color: rgba(234, 67, 53, 0.3);
  }

  .form-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #FBBC05 0%, #EA4335 100%);
  }

  .participants-card {
    border-color: rgba(52, 168, 83, 0.3);
  }

  .participants-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
  }

  .approved-card {
    border-color: rgba(66, 133, 244, 0.3);
  }

  .approved-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
  }

  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
  }

  .rules-grid {
    display: grid;
    gap: 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 1.8;
  }

  .rules-grid p strong {
    color: #fff;
  }

  .rules-highlight {
    margin-top: 12px;
    padding: 16px;
    background: rgba(66, 133, 244, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(66, 133, 244, 0.3);
    color: #4285F4;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8px;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    font-size: 15px;
    color: #fff;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4285F4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .form-group textarea {
    resize: vertical;
  }

  .submit-btn {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(66, 133, 244, 0.3);
  }

  .participant-count {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20px;
  }

  .participants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .participant-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
  }

  .participant-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .participant-card.approved {
    border-color: rgba(52, 168, 83, 0.3);
  }

  .participant-number {
    width: 40px;
    height: 40px;
    background: #FBBC05;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
  }

  .participant-info {
    flex: 1;
  }

  .participant-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #fff;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-badge.approved {
    background: rgba(52, 168, 83, 0.15);
    color: #81c995;
  }

  .status-badge.pending {
    background: rgba(251, 188, 5, 0.15);
    color: #fde293;
  }

  .status-message {
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 14px;
  }

  .status-message.success {
    background: rgba(52, 168, 83, 0.15);
    border: 1px solid #34A853;
    color: #81c995;
  }

  .status-message.error {
    background: rgba(234, 67, 53, 0.15);
    border: 1px solid #EA4335;
    color: #f28b82;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: rgba(255, 255, 255, 0.6);
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    .card {
      padding: 22px;
      border-radius: 20px;
    }

    .hero-card h2 {
      font-size: 20px;
    }

    .section-title {
      font-size: 16px;
    }

    .trophy-icon {
      font-size: 48px;
    }

    .participants-grid {
      grid-template-columns: 1fr;
    }
  }
`;

interface Participant {
  id?: number;
  name: string;
  product_name?: string;
  approved: boolean;
  created_at?: string;
}

type StatusType = 'success' | 'error' | null;

function formatNameInitials(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase() + '.';
  return (
    parts[0].charAt(0).toUpperCase() +
    '.' +
    parts[parts.length - 1].charAt(0).toUpperCase() +
    '.'
  );
}

export function PromoteClient() {
  const [fullName, setFullName] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<StatusType>(null);
  const [submitting, setSubmitting] = useState(false);

  const showStatus = useCallback((message: string, type: StatusType) => {
    setStatusMsg(message);
    setStatusType(type);
    setTimeout(() => {
      setStatusMsg('');
      setStatusType(null);
    }, 5000);
  }, []);

  const loadParticipants = useCallback(async () => {
    try {
      const client = await getDevUserClient();

      let data: Participant[] | null = null;

      const publicResult = await client
        .from('promote_participants_public')
        .select('*')
        .order('created_at', { ascending: false });

      if ((publicResult.error as { code?: string } | null)?.code === 'PGRST205') {
        const mainResult = await client
          .from('promote_participants')
          .select('*')
          .order('created_at', { ascending: false });
        if (mainResult.error) throw mainResult.error;
        data = mainResult.data as Participant[];
      } else {
        if (publicResult.error) throw publicResult.error;
        data = publicResult.data as Participant[];
      }

      setParticipants(data ?? []);
    } catch {
      showStatus('Veri yüklenirken hata oluştu.', 'error');
    }
  }, [showStatus]);

  useEffect(() => {
    loadParticipants();

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const client = await getDevUserClient();
        const channel = client
          .channel('promote_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'promote_participants' }, () => {
            loadParticipants();
          })
          .subscribe();
        cleanup = () => { client.removeChannel(channel); };
      } catch {
        // subscription optional — page still works without realtime
      }
    })();

    return () => { cleanup?.(); };
  }, [loadParticipants]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedName = fullName.trim();
      const trimmedProduct = productName.trim();
      const trimmedDesc = productDesc.trim();
      const trimmedWa = whatsapp.trim();

      if (!trimmedName) { showStatus('Lütfen ad soyad girin.', 'error'); return; }
      if (!trimmedProduct) { showStatus('Lütfen ürün/proje adı girin.', 'error'); return; }
      if (!trimmedDesc) { showStatus('Lütfen ürün/proje açıklaması girin.', 'error'); return; }
      if (!trimmedWa) { showStatus('Lütfen WhatsApp numarası girin.', 'error'); return; }

      setSubmitting(true);

      try {
        const client = await getDevUserClient();

        const publicCheck = await client
          .from('promote_participants_public')
          .select('name')
          .ilike('name', trimmedName)
          .maybeSingle();

        let existing: { name: string } | null = null;
        if ((publicCheck.error as { code?: string } | null)?.code === 'PGRST205') {
          const mainCheck = await client
            .from('promote_participants')
            .select('name')
            .ilike('name', trimmedName)
            .maybeSingle();
          existing = mainCheck.data as { name: string } | null;
        } else {
          existing = publicCheck.data as { name: string } | null;
        }

        if (existing) {
          showStatus('Bu isimle zaten kayıtlı!', 'error');
          return;
        }

        const { error } = await client.from('promote_participants').insert([
          {
            name: trimmedName,
            product_name: trimmedProduct,
            product_desc: trimmedDesc,
            whatsapp: trimmedWa,
            approved: false,
          },
        ]);

        if (error) throw error;

        showStatus(`Tebrikler ${trimmedName}! Promote Your Product'a başarıyla kayıt oldunuz.`, 'success');
        setFullName('');
        setProductName('');
        setProductDesc('');
        setWhatsapp('');
        loadParticipants();
      } catch (err) {
        const error = err as Error;
        showStatus(error.message || 'Kayıt olurken hata oluştu.', 'error');
      } finally {
        setSubmitting(false);
      }
    },
    [fullName, productName, productDesc, whatsapp, showStatus, loadParticipants]
  );

  const approvedParticipants = participants.filter((p) => p.approved);
  const approvedCount = approvedParticipants.length;
  const pendingCount = participants.length - approvedCount;

  let countText = participants.length === 0 ? 'Henüz kayıtlı kimse yok' : `${participants.length} kayıtlı katılımcı`;
  if (approvedCount > 0) countText += ` (${approvedCount} onaylı)`;
  if (pendingCount > 0) countText += ` (${pendingCount} onay bekliyor)`;

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <main className="promote-main">
          <div className="card hero-card">
            <div className="hero-domain">almanya101.de</div>
            <div className="trophy-icon">📢</div>
            <h2>Promote Your Product</h2>
          </div>

          <div className="card rules-card">
            <h3 className="section-title">📋 Promote Your Product Nedir?</h3>
            <div className="rules-grid">
              <p><strong>🎤 Sunum:</strong> Her katılımcı 5 dakika boyunca ürününü/projesini tanıtır.</p>
              <p><strong>💬 Anonim Yorumlar:</strong> Sunum sırasında izleyiciler canlı olarak anonim yorumlar yapabilir (roasting tarzı).</p>
              <p><strong>⭐ Puanlama:</strong> Sunum sonunda katılımcılar ve izleyiciler ürünleri puanlar.</p>
              <p><strong>⏰ Süre:</strong> 5 ürün × 5 dakika + 1 dakika geçiş = <strong>~30-45 dakika</strong></p>
              <p><strong style={{ color: '#FBBC05' }}>📅 Tarih:</strong> Katılımcıların uygunluğuna göre oylama ile belirlenecektir.</p>
              <div className="rules-highlight">
                🚀 İlk etkinlik için 5 slot açılacaktır!
              </div>
            </div>
          </div>

          <div className="card form-card">
            <h3 className="section-title">🚀 Promote Your Product&apos;a Kayıt Ol</h3>
            {statusMsg && statusType && (
              <div className={`status-message ${statusType}`}>{statusMsg}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Ad Soyad *</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="productName">Ürün/Proje Adı *</label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Örn: TaskMaster Pro"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="productDesc">Ürün/Proje Açıklaması *</label>
                <textarea
                  id="productDesc"
                  rows={3}
                  placeholder="Ürününüzü kısaca tanıtın..."
                  required
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp Numarası *</label>
                <input
                  type="tel"
                  id="whatsapp"
                  placeholder="Örn: +49 171 1234567"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Kaydediliyor...' : '🚀 Kayıt Ol'}
              </button>
            </form>
          </div>

          <div className="card participants-card">
            <h3 className="section-title">👥 Katılımcılar</h3>
            <p className="participant-count">{countText}</p>
            <div className="participants-grid">
              {participants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🎲</div>
                  <p>İlk kayıt olan sen ol!</p>
                </div>
              ) : (
                participants.map((p, index) => (
                  <div key={p.id ?? index} className={`participant-card${p.approved ? ' approved' : ''}`}>
                    <div className="participant-number">{index + 1}</div>
                    <div className="participant-info">
                      <div className="participant-name">{formatNameInitials(p.name)}</div>
                      <div>
                        {p.approved ? (
                          <span className="status-badge approved">✓ Onaylı</span>
                        ) : (
                          <span className="status-badge pending">⏳ Onay Bekliyor</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card approved-card">
            <h3 className="section-title">✅ Onaylı Sunumlar</h3>
            <p className="participant-count">
              {approvedCount === 0 ? 'Henüz onaylı sunum yok' : `${approvedCount} onaylı katılımcı`}
            </p>
            <div>
              {approvedParticipants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔜</div>
                  <p>Onaylı sunumlar yakında burada listelenecek.</p>
                </div>
              ) : (
                approvedParticipants.map((p, index) => (
                  <div key={p.id ?? index} className="participant-card approved" style={{ marginBottom: 12 }}>
                    <div className="participant-number">{index + 1}</div>
                    <div className="participant-info">
                      <div className="participant-name">{formatNameInitials(p.name)}</div>
                      <div>
                        <span className="status-badge approved">✓ Onaylı</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </DevUserShell>
    </>
  );
}
