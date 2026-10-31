'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import type { AdminStatusTone } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import {
  NEWS_CATEGORIES,
  NEWS_LANGUAGES,
  NEWS_STATUSES,
  getNewsCategoryLabel,
  getNewsLanguageLabel,
  getNewsStatusLabel,
} from '@/lib/news/shared';
import type { NewsLanguage, NewsPostAdminRecord, NewsStatus } from '@/types/news';

type LanguageFilter = NewsLanguage | 'unknown' | 'all';

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
  const [language, setLanguage] = useState<LanguageFilter>('all');
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
      if (language !== 'all') params.set('language', language);
      if (search.trim()) params.set('q', search.trim());
      const payload = await adminJsonFetch<PostsResponse>(`/api/admin/news/posts?${params.toString()}`);
      setItems(payload.items);
      setStats(payload.stats);
    } catch (err) {
      setError((err as Error).message || 'Veri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [category, language, search, status]);

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

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">İnceleme Kuyruğu</h2>
            <p className="mt-2 text-sm text-muted">Filtreleri değiştirerek haber akışını daraltın.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => void loadItems()}>
              Yenile
            </Button>
            {onCreateNew ? (
              <Button type="button" onClick={onCreateNew}>
                Yeni Haber
              </Button>
            ) : (
              <Button href="/admin/haberler/yeni">Yeni Haber</Button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-card bg-band p-4 md:grid-cols-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Başlık veya özet ara..."
            aria-label="Başlık veya özet ara"
            className={ADMIN_CONTROL_CLASS}
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as NewsStatus | 'all')}
            aria-label="Durum filtresi"
            className={ADMIN_CONTROL_CLASS}
          >
            <option value="all">Tüm Durumlar</option>
            {NEWS_STATUSES.map((item) => (
              <option key={item} value={item}>
                {getNewsStatusLabel(item)}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            aria-label="Kategori filtresi"
            className={ADMIN_CONTROL_CLASS}
          >
            <option value="all">Tüm Kategoriler</option>
            {NEWS_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {getNewsCategoryLabel(item)}
              </option>
            ))}
          </select>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageFilter)}
            aria-label="Dil filtresi"
            className={ADMIN_CONTROL_CLASS}
          >
            <option value="all">Tüm Diller</option>
            {NEWS_LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {getNewsLanguageLabel(item)}
              </option>
            ))}
            <option value="unknown">Dili Bilinmeyen</option>
          </select>
          <Button type="button" onClick={() => void loadItems()}>
            Filtreleri Uygula
          </Button>
        </div>

        {error ? (
          <div
            role="alert"
            className={cn(
              'mt-4 rounded-btn border px-4 py-3 text-sm',
              TONE_STYLES.red.tint,
              TONE_STYLES.red.border,
              TONE_STYLES.red.text,
            )}
          >
            {error}
          </div>
        ) : null}

        <div className="mt-6">
          <AdminTable caption="Haber kuyruğu">
            <AdminThead>
              <AdminTr className="hover:bg-transparent">
                <AdminTh>Başlık</AdminTh>
                <AdminTh>Kategori</AdminTh>
                <AdminTh>Durum</AdminTh>
                <AdminTh>Kaynak</AdminTh>
                <AdminTh>Tarih</AdminTh>
                <AdminTh>Hero</AdminTh>
                <AdminTh>İşlemler</AdminTh>
              </AdminTr>
            </AdminThead>
            <tbody>
              {loading ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={7} className="py-10 text-center text-muted">Yükleniyor...</AdminTd>
                </AdminTr>
              ) : items.length === 0 ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={7} className="py-10 text-center text-muted">Bu filtre için kayıt bulunamadı.</AdminTd>
                </AdminTr>
              ) : (
                items.map((item) => (
                  <AdminTr key={item.id}>
                    <AdminTd>
                      <div className="flex items-start gap-2">
                        <Chip
                          tone={item.language_code === 'en' ? 'red' : 'neutral'}
                          className="mt-0.5 shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <span title={getNewsLanguageLabel(item.language_code)}>{item.language_code || '?'}</span>
                        </Chip>
                        <div className="font-semibold text-ink">{item.title}</div>
                      </div>
                      {item.summary ? <div className="mt-2 max-w-md text-xs leading-6 text-muted">{item.summary}</div> : null}
                    </AdminTd>
                    <AdminTd>{getNewsCategoryLabel(item.category)}</AdminTd>
                    <AdminTd>
                      <AdminStatusBadge
                        status={item.status}
                        label={getNewsStatusLabel(item.status)}
                        tone={STATUS_BADGE_TONES[item.status] ?? 'neutral'}
                      />
                    </AdminTd>
                    <AdminTd className="text-muted">{item.source_name || 'Almanya101'}</AdminTd>
                    <AdminTd className="text-muted">
                      {formatDate(item.published_at || item.created_at)}
                    </AdminTd>
                    <AdminTd className="text-muted">
                      {item.is_featured ? `Evet${item.featured_rank ? ` (#${item.featured_rank})` : ''}` : 'Hayır'}
                    </AdminTd>
                    <AdminTd>
                      <div className="flex flex-wrap gap-2">
                        {onEdit ? (
                          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item.id)}>
                            Düzenle
                          </Button>
                        ) : (
                          <Button href={`/admin/haberler/${item.id}`} variant="outline" size="sm">
                            Düzenle
                          </Button>
                        )}
                        {item.status !== 'published' ? (
                          <Button type="button" size="sm" onClick={() => void runAction(item.id, 'publish')}>
                            Yayınla
                          </Button>
                        ) : (
                          <Button type="button" variant="outline" size="sm" onClick={() => void updateStatus(item.id, 'draft')}>
                            Taslağa Al
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void runAction(item.id, 'feature', { isFeatured: !item.is_featured, featuredRank: item.featured_rank || 1 })}
                        >
                          {item.is_featured ? 'Hero Kaldır' : 'Hero Yap'}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => void runAction(item.id, 'reject', { note: 'Admin kuyruğundan reddedildi' })}
                        >
                          Reddet
                        </Button>
                      </div>
                    </AdminTd>
                  </AdminTr>
                ))
              )}
            </tbody>
          </AdminTable>
        </div>
      </Card>
    </div>
  );
}

const STATUS_BADGE_TONES: Readonly<Record<string, AdminStatusTone>> = {
  published: 'green',
  pending_review: 'yellow',
  rejected: 'red',
  draft: 'neutral',
  archived: 'neutral',
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-line bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-ink">{value}</div>
    </div>
  );
}
