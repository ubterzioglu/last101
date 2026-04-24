'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownPreview from '@/components/MarkdownPreview';
import { cn } from '@/lib/utils/cn';

type CornerStatus = 'all' | 'draft' | 'published';
type PostStatus = 'draft' | 'published';

interface CornerPostRow {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  status: PostStatus;
}

interface CornerProfileRow {
  id: string;
  display_name: string | null;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
}

interface CornerStats {
  total: number;
  draft: number;
  published: number;
}

const AUTH_KEY = 'corner_admin_auth_v1';
const LIST_URL = '/api/corner-admin-list';
const ACTION_URL = '/api/corner-admin-action';
const UPLOAD_URL = '/api/corner-admin-upload';
const VERIFY_URL = '/api/corner-admin-verify';

const initialPostForm = {
  title: '',
  summary: '',
  content: '',
  coverImageUrl: '',
  readingMinutes: '3',
  status: 'draft' as PostStatus,
};

const initialProfileForm = {
  displayName: 'Arkadaşın Köşesi',
  shortBio: '',
  bioContent: '',
  avatarImageUrl: '',
};

function saveCornerAuth(password: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_KEY, String(password || ''));
}

function loadCornerAuth() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(AUTH_KEY) || '';
}

function clearCornerAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_KEY);
}

function getCornerHeaders(extra: Record<string, string> = {}) {
  return {
    ...extra,
    'x-corner-admin-key': loadCornerAuth(),
  };
}

async function verifyCornerKey(password: string) {
  const response = await fetch(VERIFY_URL, {
    headers: { Accept: 'application/json', 'x-corner-admin-key': String(password || '').trim() },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('Şifre hatalı.');
    throw new Error(String(payload?.error || 'Köşe admin doğrulaması başarısız.'));
  }
}

function formatDate(value: string | null) {
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

function normalizeStatus(value: string): PostStatus {
  return value === 'published' ? 'published' : 'draft';
}

export default function CornerAdminClient() {
  const [authed, setAuthed] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [rows, setRows] = useState<CornerPostRow[]>([]);
  const [stats, setStats] = useState<CornerStats>({ total: 0, draft: 0, published: 0 });
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [statusFilter, setStatusFilter] = useState<CornerStatus>('all');
  const [search, setSearch] = useState('');

  const [postForm, setPostForm] = useState(initialPostForm);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [postUploadLoading, setPostUploadLoading] = useState(false);
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const filteredCountLabel = useMemo(() => `${rows.length} kayıt`, [rows.length]);

  const loadCorner = useCallback(async (status = statusFilter, query = search) => {
    setListLoading(true);
    setListError('');

    try {
      const params = new URLSearchParams();
      params.set('status', status);
      params.set('limit', '200');
      if (query.trim()) params.set('q', query.trim());

      const response = await fetch(`${LIST_URL}?${params.toString()}`, {
        headers: getCornerHeaders({ Accept: 'application/json' }),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        clearCornerAuth();
        setAuthed(false);
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (!response.ok) throw new Error(String(payload?.error || 'Köşe kayıtları yüklenemedi.'));

      setRows(Array.isArray(payload.items) ? payload.items : []);
      setStats({
        total: Number(payload?.stats?.total || 0),
        draft: Number(payload?.stats?.draft || 0),
        published: Number(payload?.stats?.published || 0),
      });

      const profile = payload.profile as CornerProfileRow | null;
      if (profile) {
        setProfileForm({
          displayName: profile.display_name || 'Arkadaşın Köşesi',
          shortBio: profile.short_bio || '',
          bioContent: profile.bio_content || '',
          avatarImageUrl: profile.avatar_image_url || '',
        });
      }
    } catch (loadError) {
      setListError((loadError as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setListLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const saved = loadCornerAuth();
    if (!saved) return;

    verifyCornerKey(saved)
      .then(() => setAuthed(true))
      .catch(() => clearCornerAuth());
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadCorner();
  }, [authed, loadCorner]);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyCornerKey(authPassword);
      saveCornerAuth(authPassword);
      setAuthed(true);
    } catch (authSubmitError) {
      setAuthError((authSubmitError as Error).message || 'Giriş başarısız.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function runAction(body: Record<string, unknown>) {
    const response = await fetch(ACTION_URL, {
      method: 'POST',
      headers: getCornerHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 401) {
      clearCornerAuth();
      setAuthed(false);
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }

    if (!response.ok) throw new Error(String(payload?.error || 'İşlem başarısız.'));
    return payload;
  }

  async function uploadImage(file: File, folder: 'posts' | 'profile') {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('folder', folder);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: getCornerHeaders(),
      body: formData,
    });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 401) {
      clearCornerAuth();
      setAuthed(false);
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }

    if (!response.ok) throw new Error(String(payload?.error || 'Görsel yüklenemedi.'));
    return String(payload.url || '');
  }

  async function handlePostUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPostUploadLoading(true);
    setError('');
    setMessage('');

    try {
      const url = await uploadImage(file, 'posts');
      setPostForm((prev) => ({ ...prev, coverImageUrl: url }));
      setMessage('Kapak görseli yüklendi.');
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Görsel yüklenemedi.');
    } finally {
      setPostUploadLoading(false);
      event.target.value = '';
    }
  }

  async function handleProfileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileUploadLoading(true);
    setError('');
    setMessage('');

    try {
      const url = await uploadImage(file, 'profile');
      setProfileForm((prev) => ({ ...prev, avatarImageUrl: url }));
      setMessage('Profil görseli yüklendi.');
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Görsel yüklenemedi.');
    } finally {
      setProfileUploadLoading(false);
      event.target.value = '';
    }
  }

  async function handlePostSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitLoading(true);
    setError('');
    setMessage('');

    try {
      await runAction({
        action: editingId ? 'update' : 'create',
        ...(editingId ? { id: editingId } : {}),
        title: postForm.title,
        summary: postForm.summary,
        content: postForm.content,
        coverImageUrl: postForm.coverImageUrl,
        readingMinutes: postForm.readingMinutes,
        status: postForm.status,
      });

      setMessage(editingId ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.');
      setEditingId(null);
      setPostForm(initialPostForm);
      await loadCorner();
    } catch (submitError) {
      setError((submitError as Error).message || 'Yazı kaydedilemedi.');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileLoading(true);
    setError('');
    setMessage('');

    try {
      await runAction({
        action: 'update_profile',
        displayName: profileForm.displayName,
        shortBio: profileForm.shortBio,
        bioContent: profileForm.bioContent,
        avatarImageUrl: profileForm.avatarImageUrl,
      });
      setMessage('Profil bilgileri güncellendi.');
      await loadCorner();
    } catch (profileError) {
      setError((profileError as Error).message || 'Profil kaydedilemedi.');
    } finally {
      setProfileLoading(false);
    }
  }

  function handleStartEdit(item: CornerPostRow) {
    setEditingId(item.id);
    setError('');
    setMessage('');
    setPostForm({
      title: item.title || '',
      summary: item.summary || '',
      content: item.content || '',
      coverImageUrl: item.cover_image_url || '',
      readingMinutes: String(item.reading_minutes ?? 3),
      status: item.status,
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setError('');
    setMessage('');
    setPostForm(initialPostForm);
  }

  async function handleStatusChange(item: CornerPostRow, status: PostStatus) {
    try {
      await runAction({ action: 'set_status', id: item.id, status });
      await loadCorner();
    } catch (statusError) {
      setError((statusError as Error).message || 'Durum değiştirilemedi.');
    }
  }

  async function handleDelete(item: CornerPostRow) {
    const confirmed = window.confirm(`"${item.title}" yazısını silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    try {
      await runAction({ action: 'delete', id: item.id });
      if (editingId === item.id) handleCancelEdit();
      await loadCorner();
    } catch (deleteError) {
      setError((deleteError as Error).message || 'Yazı silinemedi.');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40">
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
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">
                Arkadaşın Köşesi
              </div>
              <h1 className="mt-3 text-3xl font-bold">Köşe Admin Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Yazıları ve profil alanını yönetmek için köşe şifresini girin.
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
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-google-blue"
                  placeholder="••••••••"
                />
              </label>

              {authError ? (
                <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {authError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-google-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="container py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Arkadaşın Köşesi Yönetimi</h1>
              <p className="mt-2 text-sm text-white/72">Profilini düzenle, yazılarını oluştur ve yayına al.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs hover:bg-white/10">
                Admin Paneli
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearCornerAuth();
                  setAuthed(false);
                }}
                className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-100 hover:bg-red-500/20"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8">
        {(message || error || listError) ? (
          <div
            className={cn(
              'rounded-xl border px-4 py-3 text-sm',
              error || listError
                ? 'border-red-400/25 bg-red-500/10 text-red-100'
                : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'
            )}
          >
            {error || listError || message}
          </div>
        ) : null}

        <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Ben kimim?</h2>
              <p className="mt-2 text-xs text-white/60">Public profil alanında görünecek bilgiler.</p>
            </div>
            {profileForm.avatarImageUrl ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10">
                <Image src={profileForm.avatarImageUrl} alt="Profil görseli" fill unoptimized className="object-cover" />
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Köşe/Yazar adı</span>
              <input
                value={profileForm.displayName}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, displayName: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Profil görseli</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => void handleProfileUpload(event)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm"
              />
              <span className="mt-1 block text-[10px] text-white/40">
                {profileUploadLoading ? 'Yükleniyor...' : 'JPG, PNG, WEBP veya GIF; en fazla 5 MB.'}
              </span>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs text-white/70">Kısa “Ben kimim?” metni</span>
            <textarea
              value={profileForm.shortBio}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, shortBio: event.target.value }))}
              className="min-h-24 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
              maxLength={700}
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs text-white/70">Detay bio (Markdown)</span>
            <textarea
              value={profileForm.bioContent}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, bioContent: event.target.value }))}
              className="min-h-44 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 font-mono text-sm outline-none focus:border-google-blue"
            />
          </label>

          <button
            type="submit"
            disabled={profileLoading || profileUploadLoading}
            className="mt-4 rounded-lg bg-google-yellow px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {profileLoading ? 'Kaydediliyor...' : 'Profili Kaydet'}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{editingId ? 'Yazıyı düzenle' : 'Yeni yazı ekle'}</h2>
              <p className="mt-2 text-xs text-white/60">Markdown destekli içerik ve canlı önizleme.</p>
            </div>
            {editingId ? (
              <button type="button" onClick={handleCancelEdit} className="rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 text-xs">
                İptal
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={handlePostSubmit}>
            <div className="grid gap-3 md:grid-cols-[1fr_170px_170px]">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Başlık</span>
                <input
                  value={postForm.title}
                  onChange={(event) => setPostForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Okuma süresi</span>
                <input
                  value={postForm.readingMinutes}
                  onChange={(event) => setPostForm((prev) => ({ ...prev, readingMinutes: event.target.value }))}
                  inputMode="numeric"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Durum</span>
                <select
                  value={postForm.status}
                  onChange={(event) => setPostForm((prev) => ({ ...prev, status: normalizeStatus(event.target.value) }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
                >
                  <option value="draft" className="bg-black">Taslak</option>
                  <option value="published" className="bg-black">Yayında</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Özet</span>
              <textarea
                value={postForm.summary}
                onChange={(event) => setPostForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="min-h-24 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
                maxLength={700}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-[260px_1fr]">
              <div>
                <span className="mb-1.5 block text-xs text-white/70">Kapak görseli</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => void handlePostUpload(event)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm"
                />
                <div className="mt-2 text-[10px] text-white/40">
                  {postUploadLoading ? 'Yükleniyor...' : 'JPG, PNG, WEBP veya GIF; en fazla 5 MB.'}
                </div>
                {postForm.coverImageUrl ? (
                  <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                    <Image src={postForm.coverImageUrl} alt="Kapak görseli" fill unoptimized className="object-cover" />
                  </div>
                ) : null}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Kapak görseli URL</span>
                <input
                  value={postForm.coverImageUrl}
                  onChange={(event) => setPostForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
                  placeholder="Upload sonrası otomatik dolar"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">İçerik (Markdown)</span>
                <textarea
                  value={postForm.content}
                  onChange={(event) => setPostForm((prev) => ({ ...prev, content: event.target.value }))}
                  className="min-h-96 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 font-mono text-sm outline-none focus:border-google-blue"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-xs text-white/70">Önizleme</span>
                <div className="min-h-96 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <MarkdownPreview content={postForm.content} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading || postUploadLoading}
              className="w-full rounded-lg bg-google-yellow px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
            >
              {submitLoading ? 'Kaydediliyor...' : editingId ? 'Düzenlemeyi Kaydet' : 'Yazıyı Oluştur'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
            <h2 className="text-xl font-bold">Yazı akışı</h2>
            <div className="text-xs text-white/55">{filteredCountLabel}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['all', 'draft', 'published'] as CornerStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  void loadCorner(status, search);
                }}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs transition',
                  statusFilter === status
                    ? 'bg-google-blue text-white'
                    : 'border border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08]'
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
              className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue"
            />
            <button type="button" onClick={() => void loadCorner(statusFilter, search)} className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold">
              Filtrele
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {listLoading ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-xs text-white/60">
                Yazılar yükleniyor...
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center text-xs text-white/60">
                Bu filtre için kayıt bulunamadı.
              </div>
            ) : (
              rows.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-white/45">
                        <span>{item.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                        <span>{formatDate(item.published_at || item.created_at)}</span>
                        <span>{item.reading_minutes || 0} dk</span>
                      </div>
                      <h3 className="mt-2 text-base font-bold">{item.title}</h3>
                      {item.summary ? <p className="mt-2 text-xs leading-relaxed text-white/60">{item.summary}</p> : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleStartEdit(item)} className="rounded-full border border-google-yellow/25 bg-google-yellow/10 px-3 py-1.5 text-xs font-semibold text-google-yellow">
                      Düzenle
                    </button>
                    {item.status === 'published' ? (
                      <button type="button" onClick={() => void handleStatusChange(item, 'draft')} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold">
                        Taslağa Al
                      </button>
                    ) : (
                      <button type="button" onClick={() => void handleStatusChange(item, 'published')} className="rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold text-white">
                        Yayınla
                      </button>
                    )}
                    <button type="button" onClick={() => void handleDelete(item)} className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100">
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
