'use client';

import { useEffect, useState } from 'react';
import { NewsAdminShell } from '@/components/admin/news/NewsAdminShell';
import { adminJsonFetch } from '@/components/admin/news/api';
import type { NewsIngestRunRecord, NewsSourceRecord } from '@/types/news';

export function NewsPipelineAdminClient() {
  const [runs, setRuns] = useState<NewsIngestRunRecord[]>([]);
  const [sources, setSources] = useState<NewsSourceRecord[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [runsPayload, sourcesPayload] = await Promise.all([
        adminJsonFetch<{ items: NewsIngestRunRecord[] }>('/api/admin/news/pipeline/runs'),
        adminJsonFetch<{ items: NewsSourceRecord[] }>('/api/admin/news/sources'),
      ]);
      setRuns(runsPayload.items);
      setSources(sourcesPayload.items);
    } catch (err) {
      setError((err as Error).message || 'Pipeline verisi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function runPipeline() {
    setRunning(true);
    setError('');
    setMessage('');
    try {
      await adminJsonFetch('/api/admin/news/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: selectedSourceId || null }),
      });
      setMessage('Pipeline tetiklendi.');
      await loadData();
    } catch (err) {
      setError((err as Error).message || 'Pipeline tetiklenemedi.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <NewsAdminShell
      title="Pipeline"
      description="Manuel tetikleme, son ingest çalışmaları ve kaynak bazlı operasyon durumu burada görünür."
    >
      <div className="space-y-6">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <select value={selectedSourceId} onChange={(e) => setSelectedSourceId(e.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue">
              <option value="" className="bg-black">Tüm aktif kaynaklar</option>
              {sources.map((item) => (
                <option key={item.id} value={item.id} className="bg-black">
                  {item.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => void runPipeline()} disabled={running} className="rounded-full bg-google-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
              {running ? 'Çalıştırılıyor...' : 'Pipeline’ı Şimdi Çalıştır'}
            </button>
            <button type="button" onClick={() => void loadData()} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
              Yenile
            </button>
          </div>

          {message ? <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
          {error ? <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-2xl font-bold">Son Çalışmalar</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-white/48">
                <tr>
                  <th className="px-4">Başlangıç</th>
                  <th className="px-4">Tetikleyici</th>
                  <th className="px-4">Durum</th>
                  <th className="px-4">Yeni Aday</th>
                  <th className="px-4">Duplicate</th>
                  <th className="px-4">Hata</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-white/60">Yükleniyor...</td></tr>
                ) : runs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-white/60">Henüz ingest run yok.</td></tr>
                ) : runs.map((run) => (
                  <tr key={run.id}>
                    <td className="rounded-l-[1.4rem] bg-white/[0.02] px-4 py-4 text-white/70">{new Date(run.started_at).toLocaleString('tr-TR')}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{run.trigger_type}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{run.status}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{run.inserted_count}</td>
                    <td className="bg-white/[0.02] px-4 py-4 text-white/70">{run.duplicate_count}</td>
                    <td className="rounded-r-[1.4rem] bg-white/[0.02] px-4 py-4 text-white/60">{run.error_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NewsAdminShell>
  );
}
