'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';

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

const SEVERITY_STYLE: Record<string, string> = {
  low: 'bg-white/10 text-white/70',
  medium: 'bg-google-blue/20 text-blue-200',
  high: 'bg-google-orange/20 text-orange-200',
  critical: 'bg-google-red/20 text-red-200',
};
const STATUS_STYLE: Record<string, string> = {
  open: 'bg-google-red/20 text-red-200',
  in_progress: 'bg-google-yellow/20 text-yellow-200',
  resolved: 'bg-google-green/20 text-green-200',
  wontfix: 'bg-white/10 text-white/50',
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
      <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
        <div className="text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Güvenlik Notları</h1>
            <div className="mt-2 flex gap-4 text-sm text-white/70">
              <span>Toplam: {stats.total}</span>
              <span className="text-red-300">Açık: {stats.open}</span>
              <span className="text-red-400">Kritik: {stats.critical}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-lg bg-google-blue px-4 py-2 font-semibold transition hover:bg-google-blue/90"
            >
              {showForm ? 'Formu Kapat' : '+ Yeni Not'}
            </button>
            <Link href="/admin" className="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">
              Admin Ana Sayfa
            </Link>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
            <input
              type="text"
              placeholder="Başlık"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/50 focus:border-google-blue focus:outline-none"
              required
            />
            <textarea
              placeholder="Açıklama"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/50 focus:border-google-blue focus:outline-none"
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white focus:border-google-blue focus:outline-none"
              >
                {SEVERITIES.map((s) => <option key={s} value={s} className="bg-black">{SEVERITY_LABEL[s]}</option>)}
              </select>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white focus:border-google-blue focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{CATEGORY_LABEL[c]}</option>)}
              </select>
              <input
                type="text"
                placeholder="İlgili dosya/alan (ops.)"
                value={form.related_path}
                onChange={(e) => setForm((f) => ({ ...f, related_path: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder-white/50 focus:border-google-blue focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-google-green px-5 py-2.5 font-semibold transition hover:bg-google-green/90 disabled:opacity-50"
            >
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}

        {/* Filtreler */}
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-48 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/50 focus:border-google-yellow focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white focus:border-google-blue focus:outline-none"
          >
            <option value="" className="bg-black">Tüm durumlar</option>
            {STATUSES.map((s) => <option key={s} value={s} className="bg-black">{STATUS_LABEL[s]}</option>)}
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white focus:border-google-blue focus:outline-none"
          >
            <option value="" className="bg-black">Tüm önemler</option>
            {SEVERITIES.map((s) => <option key={s} value={s} className="bg-black">{SEVERITY_LABEL[s]}</option>)}
          </select>
          <button
            onClick={() => loadNotes()}
            disabled={loading}
            className="rounded-lg bg-google-blue px-5 py-2.5 font-semibold transition hover:bg-google-blue/90 disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : 'Yenile'}
          </button>
        </div>

        {error && <div className="mb-4 text-red-400">Hata: {error}</div>}

        {/* Liste */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                'rounded-xl border bg-white/5 p-5',
                note.severity === 'critical' && note.status === 'open'
                  ? 'border-google-red/40'
                  : 'border-white/10',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={cn('rounded px-2 py-0.5 text-xs font-bold', SEVERITY_STYLE[note.severity])}>
                      {SEVERITY_LABEL[note.severity]}
                    </span>
                    <span className={cn('rounded px-2 py-0.5 text-xs font-bold', STATUS_STYLE[note.status])}>
                      {STATUS_LABEL[note.status]}
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                      {CATEGORY_LABEL[note.category]}
                    </span>
                    <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/40">
                      {SOURCE_LABEL[note.source]}
                    </span>
                  </div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-white/75">{note.description}</p>
                  {note.related_path && (
                    <p className="mt-2 font-mono text-xs text-google-blue/80">{note.related_path}</p>
                  )}
                  {note.resolution_note && (
                    <p className="mt-2 rounded bg-google-green/10 px-3 py-2 text-sm text-green-200/90">
                      <span className="font-semibold">Çözüm:</span> {note.resolution_note}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/40">
                    Oluşturma: {formatDate(note.created_at)}
                    {note.resolved_at ? ` · Çözüm: ${formatDate(note.resolved_at)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {note.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolve(note)}
                      className="rounded bg-google-green/20 px-3 py-1 text-sm text-green-300 transition hover:bg-google-green/30"
                    >
                      Çözüldü
                    </button>
                  )}
                  {note.status === 'open' && (
                    <button
                      onClick={() => updateNote(note.id, { status: 'in_progress' })}
                      className="rounded bg-google-yellow/20 px-3 py-1 text-sm text-yellow-200 transition hover:bg-google-yellow/30"
                    >
                      Devam ediyor
                    </button>
                  )}
                  {note.status === 'resolved' && (
                    <button
                      onClick={() => updateNote(note.id, { status: 'open' })}
                      className="rounded bg-white/10 px-3 py-1 text-sm text-white/70 transition hover:bg-white/20"
                    >
                      Tekrar aç
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="rounded bg-red-500/20 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/30"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && !loading && (
          <div className="py-12 text-center text-white/60">Henüz güvenlik notu yok.</div>
        )}
      </div>
    </div>
  );
}
