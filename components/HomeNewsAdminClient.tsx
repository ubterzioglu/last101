'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  clearAdminAuth,
  getAdminHeaders,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';

type NewsStatus = 'all' | 'draft' | 'published';
type NewsCategory = 'Almanya' | 'Türkiye' | 'Avrupa' | 'Dünya';

interface NewsRow {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string | null;
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
const CATEGORIES: NewsCategory[] = ['Almanya', 'Türkiye', 'Avrupa', 'Dünya'];

const initialForm = {
  title: '',
  summary: '',
  coverImageUrl: '',
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
      <div className="min-h-screen bg-black text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40">
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
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">
                Ana Sayfa Admin
              </div>
              <h1 className="mt-3 text-3xl font-bold">Haber Yönetimi Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Haberler ve duyurular modülüne erişmek için admin şifresini girin.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleAuthSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Şifre</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                  placeholder="••••••••"
                />
              </label>

              {authError ? (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {authError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-2xl bg-[#01A1F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>

              <Link
                href="/admin/home"
                className="block text-center text-sm text-white/55 transition hover:text-white"
              >
                Ana Sayfa Admin modüllerine geri dön
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-black text-white">
      <section className="relative border-b border-white/10">
        <div className="container relative py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Haber Yönetimi</h1>
              <p className="mt-2 text-sm text-white/72">
                Yeni kayıt oluştur, taslakları yayına al ve mevcut akışı yönet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/home"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs transition hover:bg-white/10"
              >
                ← Geri
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAdminAuth();
                  setAuthed(false);
                }}
                className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-100 transition hover:bg-red-500/20"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-6 py-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xl font-bold">{editingId ? 'Haberi düzenle' : 'Yeni haber ekle'}</h2>
          <p className="mt-2 text-xs text-white/60">
            {editingId
              ? 'Düzenlemeyi bitirince güncelleyin, vazgeçerseniz düzenlemeyi iptal edin.'
              : 'Başlangıç sürümünde temel alanları kaydediyoruz.'}
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleCreateSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Başlık</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                placeholder="Haber başlığı"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Özet</span>
              <textarea
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="min-h-24 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                placeholder="Kısa özet"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Kategori</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value as NewsCategory }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-black">
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Durum</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: normalizeStatus(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                >
                  <option value="draft" className="bg-black">
                    Taslak
                  </option>
                  <option value="published" className="bg-black">
                    Yayında
                  </option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Kapak görseli URL</span>
              <input
                value={form.coverImageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                placeholder="https://..."
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Kaynak adı</span>
                <input
                  value={form.sourceName}
                  onChange={(event) => setForm((prev) => ({ ...prev, sourceName: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                  placeholder="almanya101"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Okuma süresi (dk)</span>
                <input
                  value={form.readingMinutes}
                  onChange={(event) => setForm((prev) => ({ ...prev, readingMinutes: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
                  placeholder="3"
                  inputMode="numeric"
                />
              </label>
            </div>

            <label className="!mt-4 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <input
                type="checkbox"
                checked={form.showInCarousel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, showInCarousel: event.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black"
              />
              <span>
                <span className="block text-xs font-semibold text-white">
                  Ana sayfa carousel'de göster
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-white/60">
                  Haber yayında olsa bile yalnızca bu seçenek açıksa carousel'de görünür.
                </span>
              </span>
            </label>

            {submitMessage ? (
              <div className="!mt-4 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                {submitMessage}
              </div>
            ) : null}

            {submitError ? (
              <div className="!mt-4 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                {submitError}
              </div>
            ) : null}

            <div className="!mt-4 flex items-center gap-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 rounded-lg bg-google-yellow px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLoading
                  ? 'Kaydediliyor...'
                  : editingId
                    ? 'Düzenlemeyi Kaydet'
                    : 'Kaydı Oluştur'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  İptal
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-white/55">Toplam</div>
              <div className="mt-1 text-2xl font-black">{stats.total}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-white/55">Taslak</div>
              <div className="mt-1 text-2xl font-black">{stats.draft}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-white/55">Yayında</div>
              <div className="mt-1 text-2xl font-black">{stats.published}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Haber akışı</h2>
              <div className="text-xs text-white/55">{filteredCountLabel}</div>
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
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    statusFilter === status
                      ? 'bg-google-blue text-white'
                      : 'border border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08]'
                  }`}
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
                className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-google-blue"
              />
              <button
                type="button"
                onClick={() => void loadNews(statusFilter, search)}
                className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold transition hover:bg-white/[0.1]"
              >
                Filtrele
              </button>
            </div>

            {listError ? (
              <div className="mt-4 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                {listError}
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {listLoading ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-xs text-white/60">
                  Haberler yükleniyor...
                </div>
              ) : rows.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-xs text-white/60">
                  Bu filtre için kayıt bulunamadı.
                </div>
              ) : (
                rows.map((item) => {
                  const effectiveDate = item.published_at || item.created_at;

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-xl">
                          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-white/45">
                            <span>{item.category}</span>
                            <span>{item.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                            <span>{formatDate(effectiveDate)}</span>
                          </div>
                          <h3 className="mt-2 text-base font-bold">{item.title}</h3>
                          {item.summary ? (
                            <p className="mt-2 text-xs leading-relaxed text-white/60">
                              {item.summary}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            defaultValue={item.category}
                            onChange={(event) =>
                              void handleCategorySave(item, event.target.value as NewsCategory)
                            }
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white outline-none"
                          >
                            {CATEGORIES.map((category) => (
                              <option key={category} value={category} className="bg-black">
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
                        <span>Okuma: {item.reading_minutes || 0} dk</span>
                        {item.source_name ? <span>Kaynak: {item.source_name}</span> : null}
                        <span>
                          Carousel: {item.show_in_carousel ? 'Açık' : 'Kapalı'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="rounded-full border border-google-yellow/25 bg-google-yellow/10 px-3 py-1.5 text-xs font-semibold text-google-yellow transition hover:bg-google-yellow/20"
                        >
                          Düzenle
                        </button>

                        {item.show_in_carousel ? (
                          <button
                            type="button"
                            onClick={() => void handleCarouselToggle(item, false)}
                            className="rounded-full border border-yellow-300/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20"
                          >
                            Carousel'den Kaldır
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleCarouselToggle(item, true)}
                            className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                          >
                            Carousel'e Ekle
                          </button>
                        )}

                        {item.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => void handleStatusChange(item, 'draft')}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                          >
                            Taslağa Al
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleStatusChange(item, 'published')}
                            className="rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                          >
                            Yayınla
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
