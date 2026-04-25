'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type Tab = 'authors' | 'new' | 'posts';

interface AuthorRow {
  id: string;
  display_name: string;
  slug: string;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
  display_order: number | null;
  is_active: boolean;
}

interface PostRow {
  id: string;
  author_id: string;
  title: string;
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string | null;
  corner_authors?: { display_name?: string; slug?: string } | null;
}

const AUTH_KEY = 'corner_admin_auth_v1';
const VERIFY_URL = '/api/corner-admin-verify';
const LIST_URL = '/api/corner-admin-list';
const ACTION_URL = '/api/corner-admin-action';
const UPLOAD_URL = '/api/corner-admin-upload';

const initialAuthorForm = {
  displayName: '',
  slug: '',
  password: '',
  shortBio: '',
  bioContent: '',
  avatarImageUrl: '',
  displayOrder: '1000',
};

function saveAuth(password: string) {
  if (typeof window !== 'undefined') sessionStorage.setItem(AUTH_KEY, password);
}

function loadAuth() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(AUTH_KEY) || '';
}

function clearAuth() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_KEY);
}

function headers(extra: Record<string, string> = {}) {
  return { ...extra, 'x-corner-admin-key': loadAuth() };
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CornerAdminClient() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('authors');
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [stats, setStats] = useState({ totalAuthors: 0, activeAuthors: 0, totalPosts: 0, publishedPosts: 0 });
  const [form, setForm] = useState(initialAuthorForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordAuthorId, setPasswordAuthorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const authorById = useMemo(() => new Map(authors.map((author) => [author.id, author])), [authors]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(LIST_URL, { headers: headers({ Accept: 'application/json' }) });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) {
        clearAuth();
        setAuthed(false);
        throw new Error('Oturum süresi doldu.');
      }
      if (!response.ok) throw new Error(String(payload?.error || 'Kayıtlar yüklenemedi.'));
      setAuthors(Array.isArray(payload.authors) ? payload.authors : []);
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
      setStats({
        totalAuthors: Number(payload?.stats?.totalAuthors || 0),
        activeAuthors: Number(payload?.stats?.activeAuthors || 0),
        totalPosts: Number(payload?.stats?.totalPosts || 0),
        publishedPosts: Number(payload?.stats?.publishedPosts || 0),
      });
    } catch (loadError) {
      setError((loadError as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = loadAuth();
    if (!saved) return;
    fetch(VERIFY_URL, { headers: { 'x-corner-admin-key': saved } })
      .then((response) => {
        if (!response.ok) throw new Error();
        setAuthed(true);
      })
      .catch(() => clearAuth());
  }, []);

  useEffect(() => {
    if (authed) void loadData();
  }, [authed, loadData]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await fetch(VERIFY_URL, { headers: { 'x-corner-admin-key': password } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 503) throw new Error('Köşe admin şifresi tanımlı değil. CORNER_ADMIN_PASSWORD env değerini ekleyin.');
        if (response.status === 401) throw new Error('Şifre hatalı.');
        throw new Error(String(payload?.error || 'Giriş başarısız.'));
      }
      saveAuth(password);
      setAuthed(true);
    } catch (verifyError) {
      setAuthError((verifyError as Error).message || 'Giriş başarısız.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function runAction(body: Record<string, unknown>) {
    const response = await fetch(ACTION_URL, {
      method: 'POST',
      headers: headers({ Accept: 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(String(payload?.error || 'İşlem başarısız.'));
    return payload;
  }

  async function uploadImage(file: File, authorSlug: string) {
    const data = new FormData();
    data.set('file', file);
    data.set('folder', 'profile');
    data.set('authorSlug', authorSlug || form.slug || 'new-author');
    const response = await fetch(UPLOAD_URL, { method: 'POST', headers: headers(), body: data });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(String(payload?.error || 'Görsel yüklenemedi.'));
    return String(payload.url || '');
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, form.slug);
      setForm((prev) => ({ ...prev, avatarImageUrl: url }));
      setMessage('Profil görseli yüklendi.');
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Görsel yüklenemedi.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function submitAuthor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await runAction({
        action: editingId ? 'update_author' : 'create_author',
        ...(editingId ? { id: editingId } : {}),
        ...form,
      });
      setMessage(editingId ? 'Yazar güncellendi.' : 'Yazar oluşturuldu.');
      setForm(initialAuthorForm);
      setEditingId(null);
      setTab('authors');
      await loadData();
    } catch (submitError) {
      setError((submitError as Error).message || 'Yazar kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  }

  function editAuthor(author: AuthorRow) {
    setEditingId(author.id);
    setForm({
      displayName: author.display_name || '',
      slug: author.slug || '',
      password: '',
      shortBio: author.short_bio || '',
      bioContent: author.bio_content || '',
        avatarImageUrl: author.avatar_image_url || '',
        displayOrder: String(author.display_order ?? 1000),
    });
    setTab('new');
  }

  async function setAuthorActive(author: AuthorRow, isActive: boolean) {
    await runAction({ action: 'set_author_active', id: author.id, isActive });
    await loadData();
  }

  async function resetPassword(author: AuthorRow) {
    if (passwordAuthorId !== author.id || !newPassword.trim()) {
      setError('Yeni şifre girin.');
      return;
    }
    await runAction({ action: 'reset_author_password', id: author.id, password: newPassword });
    setNewPassword('');
    setPasswordAuthorId('');
    setMessage(`${author.display_name} için şifre değiştirildi.`);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <div className="mb-6 flex justify-center">
              <Image src="/almanya101lragetransparent.png" alt="almanya101" width={280} height={90} priority className="h-auto w-[220px]" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">Arkadaşın Köşesi</div>
              <h1 className="mt-3 text-3xl font-bold">Yönetici Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">Yazarları ve köşe panellerini yönetmek için şifrenizi girin.</p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={verify}>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Şifre</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none focus:border-google-blue" />
              </label>
              {authError ? <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{authError}</div> : null}
              <button disabled={authLoading} className="w-full rounded-xl bg-google-blue px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
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
              <p className="mt-2 text-sm text-white/72">Yazar aç, linklerini yönet ve yayın durumlarını takip et.</p>
            </div>
            <button onClick={() => { clearAuth(); setAuthed(false); }} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-100">
              Çıkış Yap
            </button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8">
        {(message || error) ? (
          <div className={cn('rounded-xl border px-4 py-3 text-sm', error ? 'border-red-400/25 bg-red-500/10 text-red-100' : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100')}>
            {error || message}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Yazar</div><div className="mt-1 text-2xl font-black">{stats.totalAuthors}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Aktif</div><div className="mt-1 text-2xl font-black">{stats.activeAuthors}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Yazı</div><div className="mt-1 text-2xl font-black">{stats.totalPosts}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Yayında</div><div className="mt-1 text-2xl font-black">{stats.publishedPosts}</div></div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ['authors', 'Yazarlar'],
            ['new', editingId ? 'Yazarı Düzenle' : 'Yeni Yazar'],
            ['posts', 'Yazılar'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as Tab)} className={cn('rounded-full px-4 py-2 text-sm', tab === key ? 'bg-google-blue text-white' : 'border border-white/10 bg-white/[0.04] text-white/72')}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'new' ? (
          <form onSubmit={submitAuthor} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Yazar adı</span>
                <input value={form.displayName} onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value, slug: prev.slug || slugify(event.target.value) }))} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Link slug</span>
                <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }))} placeholder="user1" className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
                <span className="mt-1 block text-[10px] text-white/45">Public link: /{form.slug || 'user1'}</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">5'li görünüm sırası</span>
                <input type="number" min="1" max="9999" value={form.displayOrder} onChange={(event) => setForm((prev) => ({ ...prev, displayOrder: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
              </label>
              {!editingId ? (
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/70">Yazar şifresi</span>
                  <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/70">Profil görseli</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleUpload(event)} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm" />
                <span className="mt-1 block text-[10px] text-white/45">{uploading ? 'Yükleniyor...' : 'En fazla 5 MB.'}</span>
              </label>
            </div>
            {form.avatarImageUrl ? <div className="relative mt-4 h-20 w-20 overflow-hidden rounded-full border border-white/10"><Image src={form.avatarImageUrl} alt="Profil" fill unoptimized className="object-cover" /></div> : null}
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs text-white/70">Kısa bio</span>
              <textarea value={form.shortBio} onChange={(event) => setForm((prev) => ({ ...prev, shortBio: event.target.value }))} className="min-h-24 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs text-white/70">Profil metni</span>
              <textarea value={form.bioContent} onChange={(event) => setForm((prev) => ({ ...prev, bioContent: event.target.value }))} className="min-h-36 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
            </label>
            <div className="mt-4 flex gap-2">
              <button disabled={loading || uploading} className="rounded-lg bg-google-yellow px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60">{loading ? 'Kaydediliyor...' : editingId ? 'Yazarı Güncelle' : 'Yazar Oluştur'}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialAuthorForm); }} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm">İptal</button> : null}
            </div>
          </form>
        ) : null}

        {tab === 'authors' ? (
          <div className="space-y-3">
            {authors.map((author) => (
              <div key={author.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
                      {author.avatar_image_url ? <Image src={author.avatar_image_url} alt={author.display_name} fill unoptimized className="object-cover" /> : null}
                    </div>
                    <div>
                      <h2 className="font-bold">{author.display_name}</h2>
                      <div className="text-xs text-white/55">/{author.slug} · sıra {author.display_order ?? 1000} · {author.is_active ? 'Aktif' : 'Pasif'}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/${author.slug}`} target="_blank" className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Public</Link>
                    <Link href={`/kose-giris/${author.slug}`} target="_blank" className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Giriş</Link>
                    <button onClick={() => editAuthor(author)} className="rounded-full border border-google-yellow/25 bg-google-yellow/10 px-3 py-1.5 text-xs text-google-yellow">Düzenle</button>
                    <button onClick={() => void setAuthorActive(author, !author.is_active)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs">{author.is_active ? 'Pasifleştir' : 'Aktifleştir'}</button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={passwordAuthorId === author.id ? newPassword : ''}
                    onFocus={() => setPasswordAuthorId(author.id)}
                    onChange={(event) => { setPasswordAuthorId(author.id); setNewPassword(event.target.value); }}
                    placeholder="Yeni şifre"
                    className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs outline-none"
                  />
                  <button onClick={() => void resetPassword(author)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Şifre Değiştir</button>
                </div>
              </div>
            ))}
            {!loading && authors.length === 0 ? <div className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/60">Henüz yazar yok.</div> : null}
          </div>
        ) : null}

        {tab === 'posts' ? (
          <div className="space-y-3">
            {posts.map((post) => {
              const author = authorById.get(post.author_id);
              return (
                <div key={post.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/45">{author?.display_name || post.corner_authors?.display_name || 'Yazar'} · {formatDate(post.updated_at)}</div>
                      <h3 className="mt-1 font-bold">{post.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs">{post.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                      <button onClick={() => void runAction({ action: 'set_post_status', id: post.id, status: post.status === 'published' ? 'draft' : 'published' }).then(loadData)} className="rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold">
                        {post.status === 'published' ? 'Taslağa Al' : 'Yayınla'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
