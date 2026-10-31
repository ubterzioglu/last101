'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownPreview from '@/components/MarkdownPreview';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import {
  clearAdminAuth,
  getAdminHeaders,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';

type NewsStatus = 'all' | 'draft' | 'published';
type NewsCategory = 'Almanya' | 'Türkiye' | 'Avrupa' | 'Dünya' | 'Duyuru';

interface NewsRow {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  show_in_carousel: boolean | null;
  status: 'draft' | 'published';
}

interface NewsStats {
  total: number;
  draft: number;
  published: number;
}

const NEWS_API_URL = '/api/news-admin-list';
const NEWS_ACTION_API_URL = '/api/news-admin-action';
const CATEGORIES: NewsCategory[] = ['Almanya', 'Türkiye', 'Avrupa', 'Dünya', 'Duyuru'];

const initialForm = {
  title: '',
  summary: '',
  content: '',
  coverImageUrl: 'https://ldptefnpiudquipdsezr.supabase.co/storage/v1/object/public/news/ansgar-scheffold-mtfTz0FnwBw-unsplash.jpg',
  sourceName: '',
  sourceUrl: '',
  category: 'Almanya' as NewsCategory,
  readingMinutes: '3',
  showInCarousel: true,
  status: 'draft' as 'draft' | 'published',
};

function formatDate(dateValue: string | null) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeStatus(value: string): 'draft' | 'published' {
  return value === 'published' ? 'published' : 'draft';
}

export default function HomeNewsAdminClient() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [rows, setRows] = useState<NewsRow[]>([]);
  const [stats, setStats] = useState<NewsStats>({ total: 0, draft: 0, published: 0 });
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<NewsStatus>('all');

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const saved = loadAdminAuth();
    if (!saved.password) return;

    verifyAdminKey(saved.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth());
  }, []);

  const loadNews = useCallback(async (status = statusFilter, query = search) => {
    setListLoading(true);
    setListError('');

    try {
      const params = new URLSearchParams();
      params.set('status', status);
      params.set('limit', '200');
      if (query.trim()) params.set('q', query.trim());

      const response = await fetch(`${NEWS_API_URL}?${params.toString()}`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        clearAdminAuth();
        setAuthed(false);
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (!response.ok) throw new Error(payload.error || 'Haberler yüklenemedi.');

      setRows(Array.isArray(payload.items) ? payload.items : []);
      setStats({
        total: Number(payload?.stats?.total || 0),
        draft: Number(payload?.stats?.draft || 0),
        published: Number(payload?.stats?.published || 0),
      });
    } catch (error) {
      setListError((error as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setListLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (!authed) return;
    void loadNews();
  }, [authed, loadNews]);

  const filteredCountLabel = useMemo(() => `${rows.length} kayıt`, [rows.length]);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyAdminKey(authPassword);
      saveAdminAuth(authPassword);
      setAuthed(true);
    } catch (error) {
      setAuthError((error as Error).message || 'Giriş başarısız.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function runNewsAction(body: Record<string, unknown>) {
    const response = await fetch(NEWS_ACTION_API_URL, {
      method: 'POST',
      headers: getAdminHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 401) {
      clearAdminAuth();
      setAuthed(false);
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }

    if (!response.ok) throw new Error(payload.error || 'İşlem başarısız.');

    return payload;
  }

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      const isEditing = Boolean(editingId);
      await runNewsAction({
        action: isEditing ? 'update' : 'create',
        ...(editingId ? { id: editingId } : {}),
        title: form.title,
        summary: form.summary,
        content: form.content,
        coverImageUrl: form.coverImageUrl,
        sourceName: form.sourceName,
        sourceUrl: form.sourceUrl,
        category: form.category,
        readingMinutes: form.readingMinutes,
        showInCarousel: form.showInCarousel,
        status: form.status,
      });

      if (isEditing) {
        setSubmitMessage('Haber başarıyla güncellendi.');
      } else {
        setSubmitMessage(
          form.status === 'published'
            ? 'Haber oluşturuldu ve yayına alındı.'
            : 'Haber taslak olarak oluşturuldu.'
        );
      }
      setEditingId(null);
      setForm(initialForm);
      await loadNews();
    } catch (error) {
      setSubmitError((error as Error).message || 'Kayıt kaydedilemedi.');
    } finally {
      setSubmitLoading(false);
    }
  }

  function handleStartEdit(item: NewsRow) {
    setEditingId(item.id);
    setSubmitError('');
    setSubmitMessage('');
    setForm({
      title: item.title || '',
      summary: item.summary || '',
      content: item.content || '',
      coverImageUrl: item.cover_image_url || '',
      sourceName: item.source_name || '',
      sourceUrl: item.source_url || '',
      category: item.category,
      readingMinutes: String(item.reading_minutes ?? 3),
      showInCarousel: Boolean(item.show_in_carousel),
      status: item.status,
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setSubmitError('');
    setSubmitMessage('');
    setForm(initialForm);
  }

  async function handleStatusChange(item: NewsRow, status: 'draft' | 'published') {
    await runNewsAction({ action: 'set_status', id: item.id, status });
    await loadNews();
  }

  async function handleCategorySave(item: NewsRow, category: NewsCategory) {
    await runNewsAction({ action: 'set_category', id: item.id, category });
    await loadNews();
  }

  async function handleCarouselToggle(item: NewsRow, showInCarousel: boolean) {
    await runNewsAction({ action: 'set_carousel', id: item.id, showInCarousel });
    await loadNews();
  }

  async function handleDelete(item: NewsRow) {
    const confirmed = window.confirm(`"${item.title}" haberini silmek istediğinize emin misiniz?`);
    if (!confirmed) return;
    await runNewsAction({ action: 'delete', id: item.id });
    if (editingId === item.id) handleCancelEdit();
    await loadNews();
  }

  if (!authed) {
    return (
      <div className="bg-page text-ink">
        <div className="container flex min-h-[70vh] items-center justify-center py-12">
          <Card className="w-full max-w-md p-8">
            <div className="mb-6 flex justify-center">
              <Image
                src="/almanya101lragetransparent.png"
                alt="almanya101"
                width={280}
                height={90}
                priority
                className="h-auto w-[220px]"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-[0.13em] text-brand-700">
                Ana Sayfa Admin
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Haber Yönetimi Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-muted">
                Haberler ve duyurular modülüne erişmek için admin şifresini girin.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleAuthSubmit}>
              <AdminField label="Şifre">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className={ADMIN_CONTROL_CLASS}
                  placeholder="••••••••"
                />
              </AdminField>

              {authError ? (
                <div role="alert" className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>
                  {authError}
                </div>
              ) : null}

              <Button type="submit" disabled={authLoading} className="w-full">
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>

              <Link
                href="/admin/home"
                className="block text-center text-sm text-muted transition-colors hover:text-brand-700"
              >
                Ana Sayfa Admin modüllerine geri dön
              </Link>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-page text-ink">
      <AdminPageHeader
        title="Haber Yönetimi"
        description="Yeni kayıt oluştur, taslakları yayına al ve mevcut akışı yönet."
        actions={
          <>
            <Button href="/admin/home" variant="outline" size="sm">
              ← Geri
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                clearAdminAuth();
                setAuthed(false);
              }}
            >
              Çıkış Yap
            </Button>
          </>
        }
      />

      <section className="space-y-6 px-4 py-8 sm:px-6 lg:px-9">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">{editingId ? 'Düzenle' : 'Yeni haber / duyuru ekle'}</h2>
              <p className="mt-2 text-xs text-muted">
                {editingId
                  ? 'Düzenlemeyi bitirince güncelleyin, vazgeçerseniz düzenlemeyi iptal edin.'
                  : 'Başlangıç sürümünde temel alanları kaydediyoruz.'}
              </p>
            </div>
            {editingId ? (
              <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                İptal
              </Button>
            ) : null}
          </div>

          <form className="space-y-3" onSubmit={handleCreateSubmit}>
            <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
              <AdminField label="Başlık">
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  placeholder="Haber başlığı"
                />
              </AdminField>

              <AdminField label="Kategori">
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value as NewsCategory }))
                  }
                  className={ADMIN_CONTROL_CLASS}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField label="Durum">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: normalizeStatus(event.target.value),
                    }))
                  }
                  className={ADMIN_CONTROL_CLASS}
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </AdminField>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">Özet (kısa açıklama)</span>
              <textarea
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                className={cn(ADMIN_CONTROL_CLASS, 'min-h-20 py-2')}
                placeholder="Listelerde görünecek kısa özet (150-200 karakter)"
                maxLength={500}
              />
              <div className="mt-1 text-[11px] text-muted">{form.summary.length}/500 karakter</div>
            </label>

            <label className="block !mt-4">
              <span className="mb-2 block text-sm font-semibold text-ink">İçerik (tam metin - Markdown destekli)</span>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <textarea
                    value={form.content}
                    onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                    className={cn(ADMIN_CONTROL_CLASS, 'min-h-80 py-2 font-mono')}
                    placeholder="Haber içeriğini buraya yazın. Markdown desteklenir.

Örnek:
## Başlık
Alt metin...

### Alt başlık
- Madde 1
- Madde 2

**Kalın** ve *italik* metin kullanabilirsiniz."
                  />
                  <div className="mt-1 text-[11px] text-muted">Markdown formatında yazın</div>
                </div>
                <div>
                  <span className="mb-2 block text-xs text-muted">Önizleme</span>
                  <div className="min-h-80 rounded-btn border border-line bg-band p-4">
                    <MarkdownPreview content={form.content} />
                  </div>
                </div>
              </div>
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <AdminField label="Kapak görseli URL">
                <input
                  value={form.coverImageUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  placeholder="https://..."
                />
              </AdminField>

              <AdminField label="Kaynak adı">
                <input
                  value={form.sourceName}
                  onChange={(event) => setForm((prev) => ({ ...prev, sourceName: event.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  placeholder="almanya101"
                />
              </AdminField>

              <AdminField label="Okuma süresi (dk)">
                <input
                  value={form.readingMinutes}
                  onChange={(event) => setForm((prev) => ({ ...prev, readingMinutes: event.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  placeholder="3"
                  inputMode="numeric"
                />
              </AdminField>
            </div>

            <label className="!mt-4 flex items-start gap-3 rounded-btn border border-line bg-band p-3">
              <input
                type="checkbox"
                checked={form.showInCarousel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, showInCarousel: event.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded-tile border-line accent-brand-700"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  Ana sayfa carousel'de göster
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  Haber yayında olsa bile yalnızca bu seçenek açıksa carousel'de görünür.
                </span>
              </span>
            </label>

            {submitMessage ? (
              <div className={cn('!mt-4 rounded-btn border px-3 py-2 text-xs', TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text)}>
                {submitMessage}
              </div>
            ) : null}

            {submitError ? (
              <div role="alert" className={cn('!mt-4 rounded-btn border px-3 py-2 text-xs', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>
                {submitError}
              </div>
            ) : null}

            <div className="!mt-4 flex items-center gap-2">
              <Button type="submit" disabled={submitLoading} className="flex-1">
                {submitLoading
                  ? 'Kaydediliyor...'
                  : editingId
                    ? 'Düzenlemeyi Kaydet'
                    : 'Kaydı Oluştur'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted">Toplam</div>
            <div className="mt-1 text-2xl font-extrabold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted">Taslak</div>
            <div className="mt-1 text-2xl font-extrabold">{stats.draft}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted">Yayında</div>
            <div className="mt-1 text-2xl font-extrabold">{stats.published}</div>
          </Card>
        </div>

        {editingId ? (() => {
          const editingItem = rows.find((item) => item.id === editingId);
          if (!editingItem) return null;
          const effectiveDate = editingItem.published_at || editingItem.created_at;

          return (
            <div className={cn('rounded-card border p-5', TONE_STYLES.yellow.wash, TONE_STYLES.yellow.border)}>
              <div className="mb-4 flex items-center gap-2">
                <Chip tone="yellow">Düzenleniyor</Chip>
                <span className="text-xs text-muted">{formatDate(effectiveDate)}</span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-xl">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider text-muted">
                    <span className={editingItem.category === 'Duyuru' ? TONE_STYLES.yellow.text : ''}>{editingItem.category}</span>
                    <span>{editingItem.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-ink">{editingItem.title}</h3>
                  {editingItem.summary ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {editingItem.summary}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>Okuma: {editingItem.reading_minutes || 0} dk</span>
                {editingItem.source_name ? <span>Kaynak: {editingItem.source_name}</span> : null}
                <span>Carousel: {editingItem.show_in_carousel ? 'Açık' : 'Kapalı'}</span>
              </div>
            </div>
          );
        })() : null}

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">Haber akışı</h2>
            <div className="text-xs text-muted">{filteredCountLabel}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['all', 'draft', 'published'] as NewsStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  void loadNews(status, search);
                }}
                className={cn(
                  'min-h-[44px] rounded-full px-4 text-sm font-semibold transition-colors',
                  statusFilter === status
                    ? 'bg-brand-50 text-brand-800'
                    : 'border border-line bg-white text-ink hover:border-ink'
                )}
              >
                {status === 'all' ? 'Tümü' : status === 'draft' ? 'Taslak' : 'Yayında'}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Başlıkta ara..."
              aria-label="Başlıkta ara"
              className={cn(ADMIN_CONTROL_CLASS, 'min-w-[200px] flex-1')}
            />
            <Button type="button" variant="outline" onClick={() => void loadNews(statusFilter, search)}>
              Filtrele
            </Button>
          </div>

          {listError ? (
            <div role="alert" className={cn('mt-4 rounded-btn border px-3 py-2 text-xs', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>
              {listError}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {listLoading ? (
              <div className="rounded-card border border-line bg-band px-5 py-6 text-center text-xs text-muted">
                Haberler yükleniyor...
              </div>
            ) : rows.length === 0 ? (
              <AdminEmptyState title="Bu filtre için kayıt bulunamadı." />
            ) : (
              rows.map((item) => {
                const effectiveDate = item.published_at || item.created_at;

                return (
                  <div key={item.id} className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="max-w-xl">
                        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider text-muted">
                          <span className={item.category === 'Duyuru' ? TONE_STYLES.yellow.text : ''}>{item.category}</span>
                          <span>{item.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                          <span>{formatDate(effectiveDate)}</span>
                        </div>
                        <h3 className="mt-2 text-base font-extrabold text-ink">{item.title}</h3>
                        {item.summary ? (
                          <p className="mt-2 text-xs leading-relaxed text-muted">
                            {item.summary}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          defaultValue={item.category}
                          aria-label="Kategori"
                          onChange={(event) =>
                            void handleCategorySave(item, event.target.value as NewsCategory)
                          }
                          className={cn(ADMIN_CONTROL_CLASS, 'w-auto')}
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>Okuma: {item.reading_minutes || 0} dk</span>
                      {item.source_name ? <span>Kaynak: {item.source_name}</span> : null}
                      <span>
                        Carousel: {item.show_in_carousel ? 'Açık' : 'Kapalı'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => handleStartEdit(item)}>
                        Düzenle
                      </Button>

                      {item.show_in_carousel ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => void handleCarouselToggle(item, false)}>
                          Carousel'den Kaldır
                        </Button>
                      ) : (
                        <Button type="button" variant="success" size="sm" onClick={() => void handleCarouselToggle(item, true)}>
                          Carousel'e Ekle
                        </Button>
                      )}

                      {item.status === 'published' ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => void handleStatusChange(item, 'draft')}>
                          Taslağa Al
                        </Button>
                      ) : (
                        <Button type="button" size="sm" onClick={() => void handleStatusChange(item, 'published')}>
                          Yayınla
                        </Button>
                      )}

                      <Button type="button" variant="danger" size="sm" onClick={() => void handleDelete(item)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
