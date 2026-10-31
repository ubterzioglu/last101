'use client';

import { useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { NewsNotice } from '@/components/admin/news/NewsNotice';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
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
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            aria-label="Kaynak seç"
            className={cn(ADMIN_CONTROL_CLASS, 'w-auto min-w-[240px]')}
          >
            <option value="">Tüm aktif kaynaklar</option>
            {sources.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <Button type="button" onClick={() => void runPipeline()} disabled={running}>
            {running ? 'Çalıştırılıyor...' : 'Pipeline’ı Şimdi Çalıştır'}
          </Button>
          <Button type="button" variant="outline" onClick={() => void loadData()}>
            Yenile
          </Button>
        </div>

        {message ? <NewsNotice tone="green" className="mt-4">{message}</NewsNotice> : null}
        {error ? <NewsNotice tone="red" className="mt-4">{error}</NewsNotice> : null}
      </Card>

      <Card>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Son Çalışmalar</h2>
        <div className="mt-5">
          <AdminTable caption="Son pipeline çalışmaları">
            <AdminThead>
              <AdminTr className="hover:bg-transparent">
                <AdminTh>Başlangıç</AdminTh>
                <AdminTh>Tetikleyici</AdminTh>
                <AdminTh>Durum</AdminTh>
                <AdminTh>Yeni Aday</AdminTh>
                <AdminTh>Duplicate</AdminTh>
                <AdminTh>Hata</AdminTh>
              </AdminTr>
            </AdminThead>
            <tbody>
              {loading ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={6} className="py-10 text-center text-muted">Yükleniyor...</AdminTd>
                </AdminTr>
              ) : runs.length === 0 ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={6} className="py-10 text-center text-muted">Henüz ingest run yok.</AdminTd>
                </AdminTr>
              ) : runs.map((run) => (
                <AdminTr key={run.id}>
                  <AdminTd className="text-muted">{new Date(run.started_at).toLocaleString('tr-TR')}</AdminTd>
                  <AdminTd className="text-muted">{run.trigger_type}</AdminTd>
                  <AdminTd className="text-muted">{run.status}</AdminTd>
                  <AdminTd className="text-muted">{run.inserted_count}</AdminTd>
                  <AdminTd className="text-muted">{run.duplicate_count}</AdminTd>
                  <AdminTd className="text-muted">{run.error_count}</AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </Card>
    </div>
  );
}
