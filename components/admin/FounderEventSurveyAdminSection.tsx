'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { cn } from '@/lib/utils/cn';
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

  const slots = payload?.slots || [];
  const votes = payload?.votes || [];
  const stats = [
    { label: 'Toplam Slot', value: payload?.stats.total_slots ?? 0 },
    { label: 'Aktif Slot', value: payload?.stats.active_slots ?? 0 },
    { label: 'Toplam Oy Kaydı', value: payload?.stats.total_votes ?? 0 },
    { label: 'Onaylı Founder', value: payload?.stats.approved_founders ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-line bg-white p-5">
            <div className="text-[28px] font-extrabold leading-none text-ink">{stat.value}</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-ink">🗓 Founder Event Survey</h3>
          <Button variant="outline" size="sm" onClick={onBack}>← Menüye Dön</Button>
        </div>

        {error ? (
          <div
            role="alert"
            className={cn('mb-4 rounded-btn border px-4 py-3 text-sm font-medium', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={submitSlot} className="mb-6 grid gap-3 rounded-card bg-band p-4">
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Slot başlığı (opsiyonel)"
              className={ADMIN_CONTROL_CLASS}
            />
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
              className={ADMIN_CONTROL_CLASS}
              required
            />
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
              className={ADMIN_CONTROL_CLASS}
            />
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
              placeholder="Sıra"
              className={ADMIN_CONTROL_CLASS}
            />
          </div>

          <label className="inline-flex min-h-[44px] items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
              className="h-4 w-4 accent-brand-700"
            />
            Slot aktif olsun
          </label>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {editingSlotId ? 'Slotu Güncelle' : 'Yeni Slot Ekle'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={resetForm} disabled={saving}>
              Formu Temizle
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadData()} disabled={loading || saving}>
              Yenile
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-muted" role="status">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-700" />
            <p>Founder survey verileri yükleniyor...</p>
          </div>
        ) : (
          <>
            <h4 className="mb-3.5 text-base font-bold text-ink">Slot Yönetimi</h4>
            <div className="mb-6 grid gap-2.5">
              {slots.length === 0 ? (
                <AdminEmptyState title="Henüz slot eklenmedi." />
              ) : (
                slots.map((slot) => {
                  const voteCount = payload?.slot_vote_stats.find((stat) => stat.slot_id === slot.id)?.vote_count || 0;
                  return (
                    <div
                      key={slot.id}
                      className="flex flex-wrap justify-between gap-3 rounded-card border border-line bg-white px-4 py-3.5"
                    >
                      <div>
                        <div className="mb-1.5 font-semibold text-ink">{formatFounderSlotLabel(slot)}</div>
                        <div className="text-[13px] text-muted">
                          {slot.is_active ? 'Aktif' : 'Pasif'} • {voteCount} oy • Sıra {slot.sort_order}
                        </div>
                        <div className="mt-1 text-xs text-muted">
                          Oluşturma: {formatDateTime(slot.created_at || null)} • Güncelleme: {formatDateTime(slot.updated_at || null)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(slot)}>Düzenle</Button>
                        <Button variant="success" size="sm" onClick={() => void runSlotAction('toggle_active', slot)} disabled={saving}>
                          {slot.is_active ? 'Pasife Al' : 'Aktif Et'}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => void runSlotAction('delete', slot)} disabled={saving}>
                          Sil
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <h4 className="mb-3.5 text-base font-bold text-ink">Founder Oyları</h4>
            <AdminTable caption="Founder oyları">
              <AdminThead>
                <AdminTr>
                  <AdminTh>Founder</AdminTh>
                  <AdminTh>Proje</AdminTh>
                  <AdminTh>WhatsApp</AdminTh>
                  <AdminTh>Seçilen Slotlar</AdminTh>
                  <AdminTh>Son Güncelleme</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {votes.length === 0 ? (
                  <tr>
                    <AdminTd colSpan={5}>
                      <AdminEmptyState title="Henüz oy kaydı yok." />
                    </AdminTd>
                  </tr>
                ) : (
                  votes.map((vote) => (
                    <AdminTr key={vote.id}>
                      <AdminTd>{vote.founder_full_name}</AdminTd>
                      <AdminTd>{vote.founder_project_name}</AdminTd>
                      <AdminTd>{vote.founder_whatsapp || '-'}</AdminTd>
                      <AdminTd>
                        {vote.selected_slot_ids.length === 0
                          ? '-'
                          : vote.selected_slot_ids
                              .map((slotId) => {
                                const slot = slotMap.get(slotId);
                                return slot ? formatFounderSlotLabel(slot) : `Silinmiş slot (${slotId})`;
                              })
                              .join(', ')}
                      </AdminTd>
                      <AdminTd>{formatDateTime(vote.updated_at || vote.created_at)}</AdminTd>
                    </AdminTr>
                  ))
                )}
              </tbody>
            </AdminTable>
          </>
        )}
      </Card>
    </div>
  );
}
