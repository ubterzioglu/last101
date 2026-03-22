'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDevUserClient } from '@/lib/supabase/devuser';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Participant {
  id: string;
  name: string;
  approved: boolean;
  created_at: string;
}

function formatNameInitials(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase() + '.';
  return parts[0].charAt(0).toUpperCase() + '.' + parts[parts.length - 1].charAt(0).toUpperCase() + '.';
}

function isRlsInsertError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = String(error.code ?? '').trim();
  const message = String(error.message ?? '').toLowerCase();
  return code === '42501' || message.includes('row-level security');
}

export default function VctClient() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showStatus(text: string, type: 'success' | 'error') {
    setStatusMsg({ text, type });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMsg(null), 5000);
  }

  const loadParticipants = useCallback(async () => {
    try {
      const client = await getDevUserClient();

      let participantsData: Participant[] | null = null;
      const publicResult = await client
        .from('vct_participants_public')
        .select('*')
        .order('created_at', { ascending: false });
      if ((publicResult.error as { code?: string } | null)?.code === 'PGRST205') {
        const mainResult = await client
          .from('vct_participants')
          .select('*')
          .order('created_at', { ascending: false });
        if (mainResult.error) throw mainResult.error;
        participantsData = mainResult.data as Participant[];
      } else {
        if (publicResult.error) throw publicResult.error;
        participantsData = publicResult.data as Participant[];
      }

      setParticipants(participantsData ?? []);
    } catch {
      showStatus('Veri yüklenirken hata oluştu.', 'error');
    }
  }, []);

  useEffect(() => {
    loadParticipants();

    let supabase: SupabaseClient | null = null;
    let cancelled = false;

    getDevUserClient().then(client => {
      if (cancelled) return;
      supabase = client;
      client
        .channel('vct_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vct_participants' }, () => { loadParticipants(); })
        .subscribe();
    }).catch(() => {/* ignore */});

    return () => {
      cancelled = true;
      if (supabase) {
        supabase.channel('vct_changes').unsubscribe().catch(() => {/* ignore */});
      }
    };
  }, [loadParticipants]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = fullName.trim();
    const wa = whatsapp.trim();
    if (!name) { showStatus('Lütfen ad soyad girin.', 'error'); return; }
    if (!wa) { showStatus('Lütfen WhatsApp numarası girin.', 'error'); return; }
    setSubmitting(true);
    try {
      const client = await getDevUserClient();

      let existing: { name: string } | null = null;
      const publicCheck = await client
        .from('vct_participants_public')
        .select('name')
        .ilike('name', name)
        .maybeSingle();
      if ((publicCheck.error as { code?: string } | null)?.code === 'PGRST205') {
        const mainCheck = await client
          .from('vct_participants')
          .select('name')
          .ilike('name', name)
          .maybeSingle();
        existing = mainCheck.data as { name: string } | null;
      } else {
        existing = publicCheck.data as { name: string } | null;
      }

      if (existing) { showStatus('Bu isimle zaten kayıtlı!', 'error'); return; }

      const { error } = await client
        .from('vct_participants')
        .insert([{ name, whatsapp: wa, approved: false }]);

      if (isRlsInsertError(error as { code?: string; message?: string } | null)) {
        const response = await fetch('/api/vct-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, whatsapp: wa }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'Kayıt API hatası');
      } else if (error) {
        throw error;
      }

      showStatus(`🎉 Tebrikler ${name}! Vibecoding Tournament'a başarıyla kayıt oldunuz.`, 'success');
      setFullName('');
      setWhatsapp('');
      loadParticipants();
    } catch {
      showStatus('Kayıt olurken hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const approvedCount = participants.filter(p => p.approved).length;
  const pendingCount = participants.length - approvedCount;
  const approvedList = participants.filter(p => p.approved);

  const css = `
    :root {
      --google-blue: #4285F4; --google-red: #EA4335; --google-yellow: #FBBC05; --google-green: #34A853;
      --card-bg: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.08);
      --text-primary: #ffffff; --text-secondary: rgba(255,255,255,0.6);
      --gradient-1: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
      --gradient-2: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
      --gradient-3: linear-gradient(135deg, #FBBC05 0%, #EA4335 100%);
    }
    .vct-wrap { max-width: 1200px; margin: 0 auto; padding: 0 4px 32px; display: flex; flex-direction: column; gap: 24px; }
    .card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 28px; backdrop-filter: blur(20px); position: relative; overflow: hidden; }
    .hero-card { border-color: rgba(251,188,5,0.3); text-align: center; }
    .hero-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-3); }
    .hero-domain { font-size: 14px; font-weight: 600; color: var(--google-yellow); text-transform: lowercase; margin-bottom: 8px; }
    .trophy-icon { font-size: 64px; margin: 16px 0; animation: float 3s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .hero-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; margin: 0; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; margin: 0 0 24px; display: flex; align-items: center; gap: 10px; }
    .rules-card { border-color: rgba(52,168,83,0.3); }
    .rules-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-2); }
    .coming-soon { text-align: center; padding: 40px 20px; color: var(--text-secondary); }
    .coming-soon-icon { font-size: 48px; margin-bottom: 16px; }
    .coming-soon p { margin: 0; }
    .form-card { border-color: rgba(234,67,53,0.3); }
    .form-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-3); }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 14px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; font-size: 15px; color: #fff; font-family: inherit; transition: all 0.3s ease; }
    .form-group input:focus { outline: none; border-color: var(--google-blue); box-shadow: 0 0 0 3px rgba(66,133,244,0.2); }
    .form-group input::placeholder { color: rgba(255,255,255,0.3); }
    .submit-btn { width: 100%; padding: 16px 24px; font-size: 16px; font-weight: 600; background: var(--gradient-1); border: none; border-radius: 12px; color: #fff; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
    .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(66,133,244,0.3); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .status-message { padding: 14px 18px; border-radius: 12px; margin-bottom: 20px; font-weight: 500; font-size: 14px; }
    .status-message.success { background: rgba(52,168,83,0.15); border: 1px solid var(--google-green); color: #81c995; }
    .status-message.error { background: rgba(234,67,53,0.15); border: 1px solid var(--google-red); color: #f28b82; }
    .participants-card { border-color: rgba(52,168,83,0.3); }
    .participants-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-2); }
    .approved-card { border-color: rgba(66,133,244,0.3); }
    .approved-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-1); }
    .participant-count { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
    .participants-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .participant-card { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.3s ease; }
    .participant-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); }
    .participant-card.approved { border-color: rgba(52,168,83,0.3); }
    .approved-list-item { margin-bottom: 12px; }
    .participant-number { width: 40px; height: 40px; background: var(--google-yellow); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
    .participant-info { flex: 1; }
    .participant-name { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .status-badge.approved { background: rgba(52,168,83,0.15); color: #81c995; }
    .status-badge.pending { background: rgba(251,188,5,0.15); color: #fde293; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-secondary); }
    .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
    @media (max-width: 768px) {
      .hero-card h2 { font-size: 24px; }
      .trophy-icon { font-size: 48px; }
      .participants-grid { grid-template-columns: 1fr; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="vct-wrap">
        <div className="card hero-card">
          <div className="hero-domain">almanya101.de</div>
          <div className="trophy-icon">🏆</div>
          <h2>Vibecoding Tournament</h2>
        </div>

        <div className="card rules-card">
          <h3 className="section-title">📋 Vibecoding Tournament Kuralları</h3>
          <div className="coming-soon">
            <div className="coming-soon-icon">🔜</div>
            <p style={{ fontSize: 18, color: 'var(--text-primary)' }}><strong>Yakında açıklanacaktır!</strong></p>
            <p style={{ marginTop: 8 }}>Vibecoding Tournament kuralları ve detayları çok yakında burada olacak.</p>
          </div>
        </div>

        <div className="card form-card">
          <h3 className="section-title">🚀 Vibecoding Tournament&apos;a Kayıt Ol</h3>
          {statusMsg && <div className={`status-message ${statusMsg.type}`}>{statusMsg.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="vct-fullName">Ad Soyad *</label>
              <input type="text" id="vct-fullName" placeholder="Örn: Ahmet Yılmaz" required value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="vct-whatsapp">WhatsApp Numarası *</label>
              <input type="tel" id="vct-whatsapp" placeholder="Örn: +49 171 1234567" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>🚀 Kayıt Ol</button>
          </form>
        </div>

        <div className="card participants-card">
          <h3 className="section-title">👥 Katılımcılar</h3>
          <p className="participant-count">
            {participants.length === 0
              ? 'Henüz kayıtlı kimse yok'
              : `${participants.length} kayıtlı katılımcı${approvedCount > 0 ? ` (${approvedCount} onaylı)` : ''}${pendingCount > 0 ? ` (${pendingCount} onay bekliyor)` : ''}`}
          </p>
          <div className="participants-grid">
            {participants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎲</div>
                <p>İlk kayıt olan sen ol!</p>
              </div>
            ) : (
              participants.map((p, index) => (
                <div key={p.id} className={`participant-card${p.approved ? ' approved' : ''}`}>
                  <div className="participant-number">{index + 1}</div>
                  <div className="participant-info">
                    <div className="participant-name">{formatNameInitials(p.name)}</div>
                    <div>
                      {p.approved
                        ? <span className="status-badge approved">✓ Onaylı</span>
                        : <span className="status-badge pending">⏳ Onay Bekliyor</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card approved-card">
          <h3 className="section-title">✅ Onaylı Katılımcılar</h3>
          <p className="participant-count">
            {approvedList.length === 0 ? 'Henüz onaylı katılımcı yok' : `${approvedList.length} onaylı katılımcı`}
          </p>
          {approvedList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔜</div>
              <p>Onaylı katılımcılar yakında burada listelenecek.</p>
            </div>
          ) : (
            approvedList.map((p, index) => (
              <div key={p.id} className="participant-card approved approved-list-item">
                <div className="participant-number">{index + 1}</div>
                <div className="participant-info">
                  <div className="participant-name">{formatNameInitials(p.name)}</div>
                  <div><span className="status-badge approved">✓ Onaylı</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
