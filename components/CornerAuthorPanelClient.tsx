'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownPreview from '@/components/MarkdownPreview';
import { cn } from '@/lib/utils/cn';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

interface Props {
  slug: string;
  mode: 'login' | 'panel';
}

interface PostRow {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const emptyPostForm = {
  id: '',
  title: '',
  summary: '',
  content: '',
  coverImageUrl: '',
  readingMinutes: '3',
  status: 'draft',
};

const emptyProfileForm = {
  displayName: '',
  shortBio: '',
  avatarImageUrl: '',
};

function authKey(slug: string) {
  return `corner_author_auth_${slug}`;
}

function loadPassword(slug: string) {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(authKey(slug)) || '';
}

function savePassword(slug: string, password: string) {
  if (typeof window !== 'undefined') sessionStorage.setItem(authKey(slug), password);
}

function clearPassword(slug: string) {
  if (typeof window !== 'undefined') sessionStorage.removeItem(authKey(slug));
}

function headers(slug: string, extra: Record<string, string> = {}) {
  return { ...extra, 'x-corner-author-key': loadPassword(slug) };
}

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function CornerAuthorPanelClient({ slug, mode }: Props) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const editing = Boolean(postForm.id);
  const publishedCount = useMemo(() => posts.filter((post) => post.status === 'published').length, [posts]);

  const loadPanel = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/corner-author-panel?slug=${encodeURIComponent(slug)}`, {
        headers: headers(slug, { Accept: 'application/json' }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) {
        clearPassword(slug);
        setAuthed(false);
        throw new Error('Oturum süresi doldu.');
      }
      if (!response.ok) throw new Error(String(payload?.error || 'Panel yüklenemedi.'));
      setAuthed(true);
      setProfileForm({
        displayName: payload.author?.display_name || '',
        shortBio: payload.author?.short_bio || '',
        avatarImageUrl: payload.author?.avatar_image_url || '',
      });
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
    } catch (loadError) {
      setError((loadError as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const saved = loadPassword(slug);
    if (!saved) return;
    void loadPanel();
  }, [slug, loadPanel]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/corner-author-verify?slug=${encodeURIComponent(slug)}`, {
        headers: { 'x-corner-author-key': password },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status === 401 ? 'Şifre hatalı.' : String(payload?.error || 'Giriş başarısız.'));
      savePassword(slug, password);
      setAuthed(true);
      if (mode === 'login') window.location.href = `/kose-panel/${slug}`;
      else await loadPanel();
    } catch (loginError) {
      setError((loginError as Error).message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  }

  async function upload(file: File, folder: 'profile' | 'posts') {
    const data = new FormData();
    data.set('file', file);
    data.set('folder', folder);
    const response = await fetch(`/api/corner-author-upload?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers: headers(slug),
      body: data,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(String(payload?.error || 'Görsel yüklenemedi.'));
    return String(payload.url || '');
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>, folder: 'profile' | 'posts') {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await upload(file, folder);
      if (folder === 'profile') setProfileForm((prev) => ({ ...prev, avatarImageUrl: url }));
      else setPostForm((prev) => ({ ...prev, coverImageUrl: url }));
      setMessage('Görsel yüklendi.');
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Görsel yüklenemedi.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function runAction(body: Record<string, unknown>) {
    const response = await fetch(`/api/corner-author-action?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers: headers(slug, { Accept: 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(String(payload?.error || 'Kaydedilemedi.'));
    return payload;
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await runAction({ action: 'update_profile', ...profileForm });
      setMessage('Profil kaydedildi.');
      await loadPanel();
    } catch (saveError) {
      setError((saveError as Error).message || 'Profil kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await runAction({
        action: editing ? 'update_post' : 'create_post',
        ...(editing ? { id: postForm.id } : {}),
        title: postForm.title,
        summary: postForm.summary,
        content: postForm.content,
        coverImageUrl: postForm.coverImageUrl,
        readingMinutes: postForm.readingMinutes,
        status: postForm.status,
      });
      setMessage(editing ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.');
      setPostForm(emptyPostForm);
      await loadPanel();
    } catch (saveError) {
      setError((saveError as Error).message || 'Yazı kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  }

  function editPost(post: PostRow) {
    setPostForm({
      id: post.id,
      title: post.title || '',
      summary: post.summary || '',
      content: post.content || '',
      coverImageUrl: post.cover_image_url || '',
      readingMinutes: String(post.reading_minutes ?? 3),
      status: post.status || 'draft',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deletePost(post: PostRow) {
    const ok = window.confirm(`"${post.title}" yazısı silinsin mi?`);
    if (!ok) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await runAction({ action: 'delete_post', id: post.id });
      if (postForm.id === post.id) setPostForm(emptyPostForm);
      setMessage('Yazı silindi.');
      await loadPanel();
    } catch (deleteError) {
      setError((deleteError as Error).message || 'Yazı silinemedi.');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'login' || !authed) {
    return (
      <AuthSplitLayout
        title="Köşe Girişi"
        subtitle={`/${slug} paneline giriş yapın ve yazılarınızı yönetin.`}
        accent="green"
        heroTitle="Arkadaşın Köşesi"
        heroSubtitle="Kendi köşende yazılarını yaz, kapak görselini yükle ve okuyucularınla buluş."
      >
        <form onSubmit={login} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Şifre</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-google-green focus-visible:ring-2 focus-visible:ring-google-green"
            />
          </label>
          {error ? (
            <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-google-green px-4 py-3 text-sm font-semibold text-white transition hover:bg-google-green/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </AuthSplitLayout>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-8">
          <div>
            <h1 className="text-3xl font-bold">Köşe Paneli</h1>
            <p className="mt-2 text-sm text-white/68">/{slug} sayfanız ve yazılarınız.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${slug}`} target="_blank" className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/80">Sayfayı aç</Link>
            <button onClick={() => { clearPassword(slug); setAuthed(false); }} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs text-red-100">Çıkış Yap</button>
          </div>
        </div>
      </section>
      <section className="container space-y-6 py-8">
        {(message || error) ? <div className={cn('rounded-xl border px-4 py-3 text-sm', error ? 'border-red-400/25 bg-red-500/10 text-red-100' : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100')}>{error || message}</div> : null}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Toplam yazı</div><div className="mt-1 text-2xl font-black">{posts.length}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Yayında</div><div className="mt-1 text-2xl font-black">{publishedCount}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-white/55">Taslak</div><div className="mt-1 text-2xl font-black">{posts.length - publishedCount}</div></div>
          <button type="button" onClick={() => setPostForm(emptyPostForm)} className="rounded-xl border border-google-yellow/25 bg-google-yellow/10 p-4 text-left text-google-yellow"><div className="text-xs">Yeni yazı</div><div className="mt-1 text-sm font-bold">Formu temizle</div></button>
        </div>

        <form onSubmit={saveProfile} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-xl font-bold">Profil</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
            <input value={profileForm.displayName} onChange={(event) => setProfileForm((prev) => ({ ...prev, displayName: event.target.value }))} placeholder="Profil adı" className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleUpload(event, 'profile')} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm" />
            {profileForm.avatarImageUrl ? <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10"><Image src={profileForm.avatarImageUrl} alt="Profil" fill unoptimized className="object-cover" /></div> : null}
          </div>
          <textarea value={profileForm.shortBio} onChange={(event) => setProfileForm((prev) => ({ ...prev, shortBio: event.target.value }))} placeholder="Kısa profil metni" className="mt-4 min-h-20 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
          <button disabled={loading || uploading} className="mt-4 rounded-lg bg-google-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Profili Kaydet</button>
        </form>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form onSubmit={savePost} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{editing ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
              {editing ? <button type="button" onClick={() => setPostForm(emptyPostForm)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Yeni yazı</button> : null}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_160px_120px]">
              <input value={postForm.title} onChange={(event) => setPostForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Başlık" className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
              <select value={postForm.status} onChange={(event) => setPostForm((prev) => ({ ...prev, status: event.target.value }))} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue">
                <option value="draft" className="bg-black">Taslak</option>
                <option value="published" className="bg-black">Yayında</option>
              </select>
              <input value={postForm.readingMinutes} onChange={(event) => setPostForm((prev) => ({ ...prev, readingMinutes: event.target.value }))} placeholder="Dakika" className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
            </div>
            <textarea value={postForm.summary} onChange={(event) => setPostForm((prev) => ({ ...prev, summary: event.target.value }))} placeholder="Kısa özet" className="mt-4 min-h-20 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-google-blue" />
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleUpload(event, 'posts')} className="mt-4 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm" />
            {postForm.coverImageUrl ? <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-xl border border-white/10"><Image src={postForm.coverImageUrl} alt="Kapak" fill unoptimized className="object-cover" /></div> : null}
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <textarea value={postForm.content} onChange={(event) => setPostForm((prev) => ({ ...prev, content: event.target.value }))} placeholder="Uzun yazı" className="min-h-96 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 font-mono text-sm outline-none focus:border-google-blue" />
              <div className="min-h-96 rounded-lg border border-white/10 bg-white/[0.02] p-4"><MarkdownPreview content={postForm.content} /></div>
            </div>
            <button disabled={loading || uploading} className="mt-4 w-full rounded-xl bg-google-yellow px-4 py-3 text-sm font-semibold text-black disabled:opacity-60">{loading ? 'Kaydediliyor...' : editing ? 'Yazıyı Güncelle' : 'Yazıyı Oluştur'}</button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-bold">Yazılarım</h2>
            <div className="mt-4 space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/45">{post.status === 'published' ? 'Yayında' : 'Taslak'} · {formatDate(post.published_at || post.created_at)}</div>
                      <h3 className="mt-1 font-bold leading-snug">{post.title}</h3>
                    </div>
                    <span className={cn('rounded-full px-2 py-1 text-[10px]', post.status === 'published' ? 'bg-emerald-500/15 text-emerald-100' : 'bg-white/10 text-white/65')}>{post.status === 'published' ? 'Yayında' : 'Taslak'}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => editPost(post)} className="rounded-full border border-google-yellow/25 bg-google-yellow/10 px-3 py-1.5 text-xs text-google-yellow">Düzenle</button>
                    <button type="button" onClick={() => void deletePost(post)} className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-100">Sil</button>
                  </div>
                </div>
              ))}
              {!loading && posts.length === 0 ? <div className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/60">Henüz yazı yok.</div> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
