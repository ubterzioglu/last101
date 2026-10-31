'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';
import { TONE_STYLES } from '@/components/site/tones';
import { Chip } from '@/components/site/Chip';
import type { ChipTone } from '@/components/site/Chip';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import type { AdminStatusTone } from '@/components/admin/ui/AdminStatusBadge';

interface SecurityNote {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'secret' | 'auth' | 'rls' | 'validation' | 'dependency' | 'config' | 'general';
  status: 'open' | 'in_progress' | 'resolved' | 'wontfix';
  related_path: string | null;
  source: 'manual' | 'agent' | 'system';
  resolution_note: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface NoteStats {
  total: number;
  open: number;
  critical: number;
}

const API_URL = '/api/admin/security-notes';

const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
const CATEGORIES = ['secret', 'auth', 'rls', 'validation', 'dependency', 'config', 'general'] as const;
const STATUSES = ['open', 'in_progress', 'resolved', 'wontfix'] as const;

const SEVERITY_LABEL: Record<string, string> = {
  low: 'Düşük', medium: 'Orta', high: 'Yüksek', critical: 'Kritik',
};
const CATEGORY_LABEL: Record<string, string> = {
  secret: 'Secret', auth: 'Yetki', rls: 'RLS', validation: 'Doğrulama',
  dependency: 'Bağımlılık', config: 'Konfig', general: 'Genel',
};
const STATUS_LABEL: Record<string, string> = {
  open: 'Açık', in_progress: 'Devam ediyor', resolved: 'Çözüldü', wontfix: 'Yapılmayacak',
};
const SOURCE_LABEL: Record<string, string> = {
  manual: 'Manuel', agent: 'Agent', system: 'Sistem',
};

const SEVERITY_TONE: Record<string, ChipTone> = {
  low: 'neutral',
  medium: 'brand',
  high: 'orange',
  critical: 'red',
};
const STATUS_TONE: Record<string, AdminStatusTone> = {
  open: 'red',
  in_progress: 'yellow',
  resolved: 'green',
  wontfix: 'neutral',
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function SecurityNotesAdminClient() {
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

  const [notes, setNotes] = useState<SecurityNote[]>([]);
  const [stats, setStats] = useState<NoteStats>({ total: 0, open: 0, critical: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', severity: 'medium', category: 'general', related_path: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (severityFilter) params.append('severity', severityFilter);
      if (search.trim()) params.append('search', search.trim());

      const response = await fetch(`${API_URL}?${params}`, { headers: getAdminHeaders() });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setNotes(data.notes || []);
      setStats(data.stats || { total: 0, open: 0, critical: 0 });
    } catch (err) {
      console.error('Load notes error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, severityFilter, search]);

  useEffect(() => {
    if (authed) loadNotes();
  }, [authed, loadNotes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'manual' }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setForm({ title: '', description: '', severity: 'medium', category: 'general', related_path: '' });
      setShowForm(false);
      await loadNotes();
    } catch (err) {
      alert('Oluşturma hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setSubmitting(false);
    }
  };

  const updateNote = async (id: string, patch: Record<string, unknown>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await loadNotes();
    } catch (err) {
      alert('Güncelleme hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    }
  };

  const handleResolve = (note: SecurityNote) => {
    const resolution = prompt('Çözüm notu (opsiyonel):', note.resolution_note || '');
    if (resolution === null) return;
    updateNote(note.id, { status: 'resolved', resolution_note: resolution });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu not silinecek. Emin misiniz?')) return;
    try {
      const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert('Silme hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4 text-ink">
        <div className="text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        title="Güvenlik Notları"
        actions={
          <>
            <Button type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? 'Formu Kapat' : '+ Yeni Not'}
            </Button>
            <Button href="/admin" variant="outline">
              Admin Ana Sayfa
            </Button>
          </>
        }
      />

      <div className="px-4 py-8 sm:px-6 lg:px-9">
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
          <span>Toplam: {stats.total}</span>
          <span className={cn('font-semibold', TONE_STYLES.red.text)}>Açık: {stats.open}</span>
          <span className={cn('font-semibold', TONE_STYLES.red.text)}>Kritik: {stats.critical}</span>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 space-y-3 rounded-card border border-line bg-white p-5">
            <input
              type="text"
              placeholder="Başlık"
              aria-label="Başlık"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={ADMIN_CONTROL_CLASS}
              required
            />
            <textarea
              placeholder="Açıklama"
              aria-label="Açıklama"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={cn(ADMIN_CONTROL_CLASS, 'py-2.5')}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select
                aria-label="Önem"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                className={ADMIN_CONTROL_CLASS}
              >
                {SEVERITIES.map((s) => <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>)}
              </select>
              <select
                aria-label="Kategori"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={ADMIN_CONTROL_CLASS}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
              </select>
              <input
                type="text"
                placeholder="İlgili dosya/alan (ops.)"
                aria-label="İlgili dosya veya alan"
                value={form.related_path}
                onChange={(e) => setForm((f) => ({ ...f, related_path: e.target.value }))}
                className={ADMIN_CONTROL_CLASS}
              />
            </div>
            <Button type="submit" variant="success" disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </form>
        )}

        {/* Filtreler */}
        <AdminFilterBar className="mb-6">
          <input
            type="text"
            placeholder="Ara..."
            aria-label="Not ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(ADMIN_CONTROL_CLASS, 'min-w-48 flex-1')}
          />
          <select
            aria-label="Durum filtresi"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(ADMIN_CONTROL_CLASS, 'sm:w-auto')}
          >
            <option value="">Tüm durumlar</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <select
            aria-label="Önem filtresi"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={cn(ADMIN_CONTROL_CLASS, 'sm:w-auto')}
          >
            <option value="">Tüm önemler</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>)}
          </select>
          <Button type="button" onClick={() => loadNotes()} disabled={loading}>
            {loading ? 'Yükleniyor...' : 'Yenile'}
          </Button>
        </AdminFilterBar>

        {error && (
          <div
            role="alert"
            className={cn(
              'mb-4 rounded-card border px-4 py-3 text-sm',
              TONE_STYLES.red.tint,
              TONE_STYLES.red.border,
              TONE_STYLES.red.text,
            )}
          >
            Hata: {error}
          </div>
        )}

        {/* Liste */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                'rounded-card border bg-white p-5',
                note.severity === 'critical' && note.status === 'open'
                  ? cn(TONE_STYLES.red.border, TONE_STYLES.red.wash)
                  : 'border-line',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Chip tone={SEVERITY_TONE[note.severity] ?? 'neutral'}>{SEVERITY_LABEL[note.severity]}</Chip>
                    <AdminStatusBadge
                      status={note.status}
                      label={STATUS_LABEL[note.status]}
                      tone={STATUS_TONE[note.status] ?? 'neutral'}
                    />
                    <Chip tone="neutral">{CATEGORY_LABEL[note.category]}</Chip>
                    <Chip tone="neutral" className="text-muted">
                      {SOURCE_LABEL[note.source]}
                    </Chip>
                  </div>
                  <h3 className="font-semibold text-ink">{note.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{note.description}</p>
                  {note.related_path && (
                    <p className="mt-2 font-mono text-xs text-brand-700">{note.related_path}</p>
                  )}
                  {note.resolution_note && (
                    <p
                      className={cn(
                        'mt-2 rounded-tile px-3 py-2 text-sm',
                        TONE_STYLES.green.tint,
                        TONE_STYLES.green.text,
                      )}
                    >
                      <span className="font-semibold">Çözüm:</span> {note.resolution_note}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Oluşturma: {formatDate(note.created_at)}
                    {note.resolved_at ? ` · Çözüm: ${formatDate(note.resolved_at)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {note.status !== 'resolved' && (
                    <Button type="button" size="sm" variant="success" onClick={() => handleResolve(note)}>
                      Çözüldü
                    </Button>
                  )}
                  {note.status === 'open' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateNote(note.id, { status: 'in_progress' })}
                    >
                      Devam ediyor
                    </Button>
                  )}
                  {note.status === 'resolved' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateNote(note.id, { status: 'open' })}
                    >
                      Tekrar aç
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="danger" onClick={() => handleDelete(note.id)}>
                    Sil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && !loading && <AdminEmptyState title="Henüz güvenlik notu yok." />}
      </div>
    </div>
  );
}
