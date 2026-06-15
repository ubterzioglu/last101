'use client';

import { useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { NEWS_CATEGORIES, getNewsCategoryLabel } from '@/lib/news/shared';
import type { NewsSourceRecord } from '@/types/news';

interface SourcesResponse {
  items: NewsSourceRecord[];
}

const emptyForm = {
  name: '',
  source_type: 'rss',
  feed_url: '',
  homepage_url: '',
  default_category: 'almanya',
  usage_mode: 'signal_only',
  priority: 50,
  fetch_limit: 10,
  is_active: true,
};

export function NewsSourcesAdminClient() {
  const [items, setItems] = useState<NewsSourceRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  async function loadSources() {
    setLoading(true);
    setError('');
    try {
      const payload = await adminJsonFetch<SourcesResponse>('/api/admin/news/sources');
      setItems(payload.items);
    } catch (err) {
      setError((err as Error).message || 'Kaynaklar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSources();
  }, []);

  async function handleSubmit() {
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await adminJsonFetch(`/api/admin/news/sources/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMessage('Kaynak güncellendi.');
      } else {
        await adminJsonFetch('/api/admin/news/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMessage('Kaynak oluşturuldu.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadSources();
    } catch (err) {
      setError((err as Error).message || 'Kaynak kaydedilemedi.');
    }
  }

  async function testSource(id: string) {
    setTesting(id);
    setError('');
    try {
      const payload = await adminJsonFetch<{ ok: boolean; status: number; preview: Array<{ title: string }> }>(`/api/admin/news/sources/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setMessage(`Kaynak test edildi (${payload.status}). İlk kayıt: ${payload.preview?.[0]?.title || 'bulunamadı'}`);
    } catch (err) {
      setError((err as Error).message || 'Kaynak test edilemedi.');
    } finally {
      setTesting(null);
    }
  }

  async function runSource(id: string) {
    setTesting(id);
    setError('');
    try {
      await adminJsonFetch(`/api/admin/news/sources/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setMessage('Kaynak çalıştırma tetiklendi.');
      await loadSources();
    } catch (err) {
      setError((err as Error).message || 'Kaynak çalıştırılamadı.');
    } finally {
      setTesting(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-2xl font-bold">{editingId ? 'Kaynağı Düzenle' : 'Yeni Kaynak'}</h2>
          <p className="mt-2 text-sm text-white/60">Feed URL, kategori ve öncelik alanlarını doldurun.</p>

          {message ? <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
          {error ? <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <div className="mt-5 space-y-4">
            <Input label="Kaynak Adı" value={form.name} onChange={(value) => setForm((s) => ({ ...s, name: value }))} />
            <Input label="Feed URL" value={form.feed_url} onChange={(value) => setForm((s) => ({ ...s, feed_url: value }))} />
            <Input label="Homepage URL" value={form.homepage_url} onChange={(value) => setForm((s) => ({ ...s, homepage_url: value }))} />
            <Select label="Tür" value={form.source_type} onChange={(value) => setForm((s) => ({ ...s, source_type: value }))} options={['rss', 'mrss', 'api', 'manual']} />
            <Select label="Kategori" value={form.default_category} onChange={(value) => setForm((s) => ({ ...s, default_category: value }))} options={NEWS_CATEGORIES} labels={Object.fromEntries(NEWS_CATEGORIES.map((item) => [item, getNewsCategoryLabel(item)]))} />
            <Select label="Usage Mode" value={form.usage_mode} onChange={(value) => setForm((s) => ({ ...s, usage_mode: value }))} options={['signal_only', 'short_excerpt_allowed', 'licensed', 'manual_only']} />
            <Input label="Öncelik" type="number" value={String(form.priority)} onChange={(value) => setForm((s) => ({ ...s, priority: Number(value) || 50 }))} />
            <Input label="Fetch Limit" type="number" value={String(form.fetch_limit)} onChange={(value) => setForm((s) => ({ ...s, fetch_limit: Number(value) || 10 }))} />
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />
              Aktif
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => void handleSubmit()} className="rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              {editingId ? 'Kaynağı Güncelle' : 'Kaynağı Oluştur'}
            </button>
            {editingId ? (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
                İptal
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-2xl font-bold">Aktif Kaynaklar</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-white/48">
                <tr>
                  <th className="px-4">Kaynak</th>
                  <th className="px-4">Tür</th>
                  <th className="px-4">Kategori</th>
                  <th className="px-4">Son Başarı</th>
                  <th className="px-4">Hata</th>
                  <th className="px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-white/60">Kaynaklar yükleniyor...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-white/60">Henüz kaynak yok.</td></tr>
                ) : items.map((item) => (
                  <tr key={item.id}>
                    <td className="rounded-l-[1.4rem] bg-white/[0.02] px-4 py-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="mt-1 max-w-sm break-all text-xs text-white/58">{item.feed_url || '-'}</div>
                    </td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{item.source_type}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{getNewsCategoryLabel(item.default_category)}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{item.last_success_at || '-'}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/60">{item.last_error || '-'}</td>
                    <td className="rounded-r-[1.4rem] bg-white/[0.02] px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => { setEditingId(item.id); setForm({ ...item, feed_url: item.feed_url || '', homepage_url: item.homepage_url || '' } as any); }} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]">
                          Düzenle
                        </button>
                        <button type="button" onClick={() => void testSource(item.id)} className="rounded-full border border-yellow-300/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20" disabled={testing === item.id}>
                          Test Et
                        </button>
                        <button type="button" onClick={() => void runSource(item.id)} className="rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500" disabled={testing === item.id}>
                          Şimdi Çek
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue" />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue">
        {options.map((option) => (
          <option key={option} value={option} className="bg-black">
            {labels?.[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}
