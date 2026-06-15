'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { NEWS_CATEGORIES, NEWS_STATUSES, getNewsCategoryLabel, getNewsStatusLabel } from '@/lib/news/shared';
import type { NewsPostAdminRecord, NewsStatus } from '@/types/news';

interface PostsResponse {
  items: NewsPostAdminRecord[];
  stats: Record<string, number>;
}

function formatDate(value: string | null | undefined) {
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

interface NewsQueueAdminClientProps {
  onEdit?: (id: string) => void;
  onCreateNew?: () => void;
}

export function NewsQueueAdminClient({ onEdit, onCreateNew }: NewsQueueAdminClientProps = {}) {
  const [items, setItems] = useState<NewsPostAdminRecord[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<NewsStatus | 'all'>('all');
  const [category, setCategory] = useState<'all' | (typeof NEWS_CATEGORIES)[number]>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '120');
      if (status !== 'all') params.set('status', status);
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('q', search.trim());
      const payload = await adminJsonFetch<PostsResponse>(`/api/admin/news/posts?${params.toString()}`);
      setItems(payload.items);
      setStats(payload.stats);
    } catch (err) {
      setError((err as Error).message || 'Veri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [category, search, status]);

  async function runAction(id: string, action: 'publish' | 'reject' | 'archive' | 'feature', body?: Record<string, unknown>) {
    try {
      await adminJsonFetch(`/api/admin/news/posts/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
      });
      await loadItems();
    } catch (err) {
      setError((err as Error).message || 'İşlem başarısız.');
    }
  }

  async function updateStatus(id: string, nextStatus: NewsStatus) {
    try {
      await adminJsonFetch(`/api/admin/news/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadItems();
    } catch (err) {
      setError((err as Error).message || 'İşlem başarısız.');
    }
  }

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Toplam" value={stats.total || 0} />
          <StatCard label="İnceleme" value={stats.pending_review || 0} />
          <StatCard label="Taslak" value={stats.draft || 0} />
          <StatCard label="Yayında" value={stats.published || 0} />
          <StatCard label="Reddedildi" value={stats.rejected || 0} />
          <StatCard label="Arşiv" value={stats.archived || 0} />
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">İnceleme Kuyruğu</h2>
              <p className="mt-2 text-sm text-white/62">Filtreleri değiştirerek haber akışını daraltın.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void loadItems()}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium transition hover:bg-white/[0.1]"
              >
                Yenile
              </button>
              {onCreateNew ? (
                <button
                  type="button"
                  onClick={onCreateNew}
                  className="rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Yeni Haber
                </button>
              ) : (
                <Link
                  href="/admin/haberler/yeni"
                  className="rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Yeni Haber
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Başlık veya özet ara..."
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as NewsStatus | 'all')}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue"
            >
              <option value="all" className="bg-black">Tüm Durumlar</option>
              {NEWS_STATUSES.map((item) => (
                <option key={item} value={item} className="bg-black">
                  {getNewsStatusLabel(item)}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as typeof category)}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue"
            >
              <option value="all" className="bg-black">Tüm Kategoriler</option>
              {NEWS_CATEGORIES.map((item) => (
                <option key={item} value={item} className="bg-black">
                  {getNewsCategoryLabel(item)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void loadItems()}
              className="rounded-2xl bg-google-yellow px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
            >
              Filtreleri Uygula
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-white/48">
                <tr>
                  <th className="px-4">Başlık</th>
                  <th className="px-4">Kategori</th>
                  <th className="px-4">Durum</th>
                  <th className="px-4">Kaynak</th>
                  <th className="px-4">Tarih</th>
                  <th className="px-4">Hero</th>
                  <th className="px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/60">Yükleniyor...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/60">Bu filtre için kayıt bulunamadı.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03]">
                      <td className="rounded-l-[1.4rem] px-4 py-4 align-top">
                        <div className="font-semibold text-white">{item.title}</div>
                        {item.summary ? <div className="mt-2 max-w-md text-xs leading-6 text-white/58">{item.summary}</div> : null}
                      </td>
                      <td className="px-4 py-4 align-top text-white/78">{getNewsCategoryLabel(item.category)}</td>
                      <td className="px-4 py-4 align-top text-white/78">{getNewsStatusLabel(item.status)}</td>
                      <td className="px-4 py-4 align-top text-white/62">{item.source_name || 'Almanya101'}</td>
                      <td className="px-4 py-4 align-top text-white/62">
                        {formatDate(item.published_at || item.created_at)}
                      </td>
                      <td className="px-4 py-4 align-top text-white/62">
                        {item.is_featured ? `Evet${item.featured_rank ? ` (#${item.featured_rank})` : ''}` : 'Hayır'}
                      </td>
                      <td className="rounded-r-[1.4rem] px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          {onEdit ? (
                            <button
                              type="button"
                              onClick={() => onEdit(item.id)}
                              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            >
                              Düzenle
                            </button>
                          ) : (
                            <Link
                              href={`/admin/haberler/${item.id}`}
                              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                              Düzenle
                            </Link>
                          )}
                          {item.status !== 'published' ? (
                            <button
                              type="button"
                              onClick={() => void runAction(item.id, 'publish')}
                              className="rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                            >
                              Yayınla
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void updateStatus(item.id, 'draft')}
                              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                              Taslağa Al
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void runAction(item.id, 'feature', { isFeatured: !item.is_featured, featuredRank: item.featured_rank || 1 })}
                            className="rounded-full border border-yellow-300/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20"
                          >
                            {item.is_featured ? 'Hero Kaldır' : 'Hero Yap'}
                          </button>
                          <button
                            type="button"
                            onClick={() => void runAction(item.id, 'reject', { note: 'Admin kuyruğundan reddedildi' })}
                            className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
                          >
                            Reddet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/46">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}
