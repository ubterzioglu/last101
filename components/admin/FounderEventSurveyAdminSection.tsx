'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { formatFounderSlotLabel, type FounderEventSlot } from '@/lib/founder';

interface VoteRow {
  id: string;
  founder_submission_id: string;
  founder_full_name: string;
  founder_project_name: string;
  founder_whatsapp: string;
  founder_status: string;
  selected_slot_ids: string[];
  created_at: string | null;
  updated_at: string | null;
}

interface SurveyPayload {
  slots: FounderEventSlot[];
  slot_vote_stats: Array<{ slot_id: string; vote_count: number }>;
  votes: VoteRow[];
  stats: {
    total_slots: number;
    active_slots: number;
    total_votes: number;
    approved_founders: number;
  };
}

const LIST_API_URL = '/api/founder-event-admin-list';
const ACTION_API_URL = '/api/founder-event-admin-action';

function formatDateTime(value: string | null) {
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

function toDateTimeLocalValue(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (input: number) => String(input).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function FounderEventSurveyAdminSection({
  active,
  onBack,
}: {
  active: boolean;
  onBack: () => void;
}) {
  const [payload, setPayload] = useState<SurveyPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState('');
  const [form, setForm] = useState({
    title: '',
    startsAt: '',
    endsAt: '',
    sortOrder: '100',
    isActive: true,
  });

  const loadData = useCallback(async () => {
    if (!active) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(LIST_API_URL, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((result as { error?: string }).error || 'Founder survey verileri yüklenemedi.');
      }
      setPayload(result as SurveyPayload);
    } catch (loadError) {
      setError((loadError as Error)?.message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    void loadData();
  }, [active, loadData]);

  const slotMap = useMemo(() => {
    const map = new Map<string, FounderEventSlot>();
    for (const slot of payload?.slots || []) map.set(slot.id, slot);
    return map;
  }, [payload?.slots]);

  function resetForm() {
    setEditingSlotId('');
    setForm({
      title: '',
      startsAt: '',
      endsAt: '',
      sortOrder: '100',
      isActive: true,
    });
  }

  function startEdit(slot: FounderEventSlot) {
    setEditingSlotId(slot.id);
    setForm({
      title: slot.title || '',
      startsAt: toDateTimeLocalValue(slot.starts_at),
      endsAt: toDateTimeLocalValue(slot.ends_at),
      sortOrder: String(slot.sort_order ?? 100),
      isActive: Boolean(slot.is_active),
    });
  }

  async function submitSlot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(ACTION_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          action: editingSlotId ? 'update' : 'create',
          id: editingSlotId || undefined,
          title: form.title,
          starts_at: form.startsAt,
          ends_at: form.endsAt || null,
          sort_order: form.sortOrder,
          is_active: form.isActive,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((result as { error?: string }).error || 'Slot kaydedilemedi.');
      }

      resetForm();
      await loadData();
    } catch (saveError) {
      setError((saveError as Error)?.message || 'İşlem başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function runSlotAction(action: 'delete' | 'toggle_active', slot: FounderEventSlot) {
    if (action === 'delete' && !window.confirm('Bu slotu silmek istediğinize emin misiniz? Mevcut oylardan da kaldırılacak.')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(ACTION_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          action,
          id: slot.id,
          is_active: action === 'toggle_active' ? !slot.is_active : undefined,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((result as { error?: string }).error || 'İşlem başarısız.');
      }

      if (editingSlotId === slot.id) resetForm();
      await loadData();
    } catch (actionError) {
      setError((actionError as Error)?.message || 'İşlem başarısız.');
    } finally {
      setSaving(false);
    }
  }

  if (!active) return null;

  return (
    <div className="section active">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{payload?.stats.total_slots ?? 0}</div><div className="stat-label">Toplam Slot</div></div>
        <div className="stat-card"><div className="stat-value">{payload?.stats.active_slots ?? 0}</div><div className="stat-label">Aktif Slot</div></div>
        <div className="stat-card"><div className="stat-value">{payload?.stats.total_votes ?? 0}</div><div className="stat-label">Toplam Oy Kaydı</div></div>
        <div className="stat-card"><div className="stat-value">{payload?.stats.approved_founders ?? 0}</div><div className="stat-label">Onaylı Founder</div></div>
      </div>

      <div className="card">
        <div className="section-header">
          <h3 className="section-title">🗓 Founder Event Survey</h3>
          <button className="back-btn" onClick={onBack}>← Menüye Dön</button>
        </div>

        {error ? <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div> : null}

        <form onSubmit={submitSlot} style={{ display: 'grid', gap: 12, marginBottom: 22 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Slot başlığı (opsiyonel)"
              style={{ padding: '12px 14px', border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none' }}
            />
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
              style={{ padding: '12px 14px', border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none' }}
              required
            />
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
              style={{ padding: '12px 14px', border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none' }}
            />
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
              placeholder="Sıra"
              style={{ padding: '12px 14px', border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none' }}
            />
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Slot aktif olsun
          </label>

          <div className="action-btns">
            <button type="submit" className="action-btn approve" disabled={saving}>
              {editingSlotId ? 'Slotu Güncelle' : 'Yeni Slot Ekle'}
            </button>
            <button type="button" className="action-btn view" onClick={resetForm} disabled={saving}>
              Formu Temizle
            </button>
            <button type="button" className="action-btn view" onClick={() => void loadData()} disabled={loading || saving}>
              Yenile
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading"><div className="loading-spinner" /><p>Founder survey verileri yükleniyor...</p></div>
        ) : (
          <>
            <h4 style={{ fontSize: 16, marginBottom: 14 }}>Slot Yönetimi</h4>
            <div style={{ display: 'grid', gap: 10, marginBottom: 26 }}>
              {(payload?.slots || []).length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">🗓</div><p>Henüz slot eklenmedi.</p></div>
              ) : (
                (payload?.slots || []).map((slot) => {
                  const voteCount = payload?.slot_vote_stats.find((stat) => stat.slot_id === slot.id)?.vote_count || 0;
                  return (
                    <div
                      key={slot.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '14px 16px',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>{formatFounderSlotLabel(slot)}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {slot.is_active ? 'Aktif' : 'Pasif'} • {voteCount} oy • Sıra {slot.sort_order}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>
                          Oluşturma: {formatDateTime(slot.created_at || null)} • Güncelleme: {formatDateTime(slot.updated_at || null)}
                        </div>
                      </div>

                      <div className="action-btns">
                        <button className="action-btn view" onClick={() => startEdit(slot)}>Düzenle</button>
                        <button className="action-btn approve" onClick={() => void runSlotAction('toggle_active', slot)} disabled={saving}>
                          {slot.is_active ? 'Pasife Al' : 'Aktif Et'}
                        </button>
                        <button className="action-btn reject" onClick={() => void runSlotAction('delete', slot)} disabled={saving}>
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <h4 style={{ fontSize: 16, marginBottom: 14 }}>Founder Oyları</h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Founder</th>
                    <th>Proje</th>
                    <th>WhatsApp</th>
                    <th>Seçilen Slotlar</th>
                    <th>Son Güncelleme</th>
                  </tr>
                </thead>
                <tbody>
                  {(payload?.votes || []).length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state"><div className="empty-state-icon">📭</div><p>Henüz oy kaydı yok.</p></div>
                      </td>
                    </tr>
                  ) : (
                    (payload?.votes || []).map((vote) => (
                      <tr key={vote.id}>
                        <td>{vote.founder_full_name}</td>
                        <td>{vote.founder_project_name}</td>
                        <td>{vote.founder_whatsapp || '-'}</td>
                        <td>
                          {vote.selected_slot_ids.length === 0
                            ? '-'
                            : vote.selected_slot_ids
                                .map((slotId) => {
                                  const slot = slotMap.get(slotId);
                                  return slot ? formatFounderSlotLabel(slot) : `Silinmiş slot (${slotId})`;
                                })
                                .join(', ')}
                        </td>
                        <td>{formatDateTime(vote.updated_at || vote.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
