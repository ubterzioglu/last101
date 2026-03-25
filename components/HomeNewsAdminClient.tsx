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
      await runNewsAction({
        action: 'create',
        title: form.title,
        summary: form.summary,
        coverImageUrl: form.coverImageUrl,
        sourceName: form.sourceName,
        sourceUrl: form.sourceUrl,
        category: form.category,
        readingMinutes: form.readingMinutes,
        status: form.status,
      });

      setSubmitMessage(
        form.status === 'published'
          ? 'Haber oluşturuldu ve yayına alındı.'
          : 'Haber taslak olarak oluşturuldu.'
      );
      setForm(initialForm);
      await loadNews();
    } catch (error) {
      setSubmitError((error as Error).message || 'Kayıt oluşturulamadı.');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleStatusChange(item: NewsRow, status: 'draft' | 'published') {
    await runNewsAction({ action: 'set_status', id: item.id, status });
    await loadNews();
  }

  async function handleCategorySave(item: NewsRow, category: NewsCategory) {
    await runNewsAction({ action: 'set_category', id: item.id, category });
    await loadNews();
  }

  async function handleDelete(item: NewsRow) {
    const confirmed = window.confirm(`"${item.title}" haberini silmek istediğinize emin misiniz?`);
    if (!confirmed) return;
    await runNewsAction({ action: 'delete', id: item.id });
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
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,187,0,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(1,161,241,0.15),_transparent_34%)]" />
        <div className="container relative py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">
                Ana Sayfa Admin / Haberler
              </div>
              <h1 className="mt-3 text-4xl font-black leading-tight">Haberler ve duyurular yönetimi</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
                Yeni kayıt oluştur, taslakları yayına al, kategorileri güncelle ve mevcut akışı tek panelden yönet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/home"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Modüllere dön
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAdminAuth();
                  setAuthed(false);
                }}
                className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:border-red-300/35 hover:bg-red-500/20"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-10 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7fd5ff]">
            Yeni kayıt
          </div>
          <h2 className="mt-3 text-2xl font-bold">Yeni haber / duyuru ekle</h2>
          <p className="mt-3 text-sm leading-7 text-white/68">
            Başlangıç sürümünde temel alanları kaydediyoruz. Sonraki adımda detay içerik ve slug düzenini de aynı akışa bağlayacağız.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreateSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Başlık</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                placeholder="Haber başlığı"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Özet</span>
              <textarea
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                placeholder="Kısa özet"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Kategori</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value as NewsCategory }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-black">
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Durum</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: normalizeStatus(event.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                >
                  <option value="draft" className="bg-black">Taslak</option>
                  <option value="published" className="bg-black">Yayında</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Kapak görseli URL</span>
              <input
                value={form.coverImageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                placeholder="https://..."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Kaynak adı</span>
                <input
                  value={form.sourceName}
                  onChange={(event) => setForm((prev) => ({ ...prev, sourceName: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                  placeholder="almanya101 editör ekibi"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Kaynak linki</span>
                <input
                  value={form.sourceUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, sourceUrl: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Okuma süresi (dk)</span>
              <input
                value={form.readingMinutes}
                onChange={(event) => setForm((prev) => ({ ...prev, readingMinutes: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                placeholder="3"
                inputMode="numeric"
              />
            </label>

            {submitMessage ? (
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {submitMessage}
              </div>
            ) : null}

            {submitError ? (
              <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full rounded-2xl bg-[#FFBB00] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ffca39] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLoading ? 'Kaydediliyor...' : 'Kaydı Oluştur'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm text-white/55">Toplam</div>
              <div className="mt-2 text-3xl font-black">{stats.total}</div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm text-white/55">Taslak</div>
              <div className="mt-2 text-3xl font-black">{stats.draft}</div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm text-white/55">Yayında</div>
              <div className="mt-2 text-3xl font-black">{stats.published}</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                  Mevcut kayıtlar
                </div>
                <h2 className="mt-2 text-2xl font-bold">Haber akışı</h2>
              </div>
              <div className="text-sm text-white/55">{filteredCountLabel}</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {(['all', 'draft', 'published'] as NewsStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setStatusFilter(status);
                    void loadNews(status, search);
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    statusFilter === status
                      ? 'bg-[#01A1F1] text-white'
                      : 'border border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08] hover:text-white'
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
                className="min-w-[220px] flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
              />
              <button
                type="button"
                onClick={() => void loadNews(statusFilter, search)}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.1]"
              >
                Filtrele
              </button>
            </div>

            {listError ? (
              <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {listError}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              {listLoading ? (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/60">
                  Haberler yükleniyor...
                </div>
              ) : rows.length === 0 ? (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/60">
                  Bu filtre için kayıt bulunamadı.
                </div>
              ) : (
                rows.map((item) => {
                  const effectiveDate = item.published_at || item.created_at;

                  return (
                    <div
                      key={item.id}
                      className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/45">
                            <span>{item.category}</span>
                            <span>{item.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                            <span>{formatDate(effectiveDate)}</span>
                          </div>
                          <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                          {item.summary ? (
                            <p className="mt-3 text-sm leading-7 text-white/68">{item.summary}</p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <select
                            defaultValue={item.category}
                            onChange={(event) =>
                              void handleCategorySave(item, event.target.value as NewsCategory)
                            }
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none"
                          >
                            {CATEGORIES.map((category) => (
                              <option key={category} value={category} className="bg-black">
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/58">
                        <span>Okuma: {item.reading_minutes || 0} dk</span>
                        {item.source_name ? <span>Kaynak: {item.source_name}</span> : null}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {item.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => void handleStatusChange(item, 'draft')}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                          >
                            Taslağa Al
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleStatusChange(item, 'published')}
                            className="rounded-full bg-[#01A1F1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#139ce6]"
                          >
                            Yayınla
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
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
