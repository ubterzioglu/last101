'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CORNER_ADMIN_KEY_HEADER } from '@/lib/admin/headers';
import { cn } from '@/lib/utils/cn';

type Tab = 'authors' | 'new' | 'posts';

const LINK_PILL_CLASS =
  'inline-flex min-h-[40px] items-center justify-center rounded-btn border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink';

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
  return { ...extra, [CORNER_ADMIN_KEY_HEADER]: loadAuth() };
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
    fetch(VERIFY_URL, { headers: { [CORNER_ADMIN_KEY_HEADER]: saved } })
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
      const response = await fetch(VERIFY_URL, { headers: { [CORNER_ADMIN_KEY_HEADER]: password } });
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
      <div className="min-h-screen bg-page text-ink">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <Card className="w-full max-w-md p-8">
            <div className="mb-6 flex justify-center">
              <Image src="/almanya101lragetransparent.png" alt="almanya101" width={280} height={90} priority className="h-auto w-[220px]" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Arkadaşın Köşesi</div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Yönetici Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-muted">Yazarları ve köşe panellerini yönetmek için şifrenizi girin.</p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={verify}>
              <AdminField label="Şifre">
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              {authError ? <div role="alert" className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>{authError}</div> : null}
              <Button disabled={authLoading} className="w-full">
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  const stat = (label: string, value: number) => (
    <Card key={label} className="p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-ink">{value}</div>
    </Card>
  );

  const tabItems = [
    { key: 'authors', label: 'Yazarlar' },
    { key: 'new', label: editingId ? 'Yazarı Düzenle' : 'Yeni Yazar' },
    { key: 'posts', label: 'Yazılar' },
  ];

  return (
    <div className="min-h-screen bg-page text-ink">
      <section className="border-b border-line">
        <div className="container py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink">Arkadaşın Köşesi Yönetimi</h1>
              <p className="mt-2 text-sm text-muted">Yazar aç, linklerini yönet ve yayın durumlarını takip et.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { clearAuth(); setAuthed(false); }}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8">
        {(message || error) ? (
          <div
            role={error ? 'alert' : 'status'}
            className={cn(
              'rounded-btn border px-4 py-3 text-sm',
              error
                ? cn(TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)
                : cn(TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text),
            )}
          >
            {error || message}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stat('Yazar', stats.totalAuthors)}
          {stat('Aktif', stats.activeAuthors)}
          {stat('Yazı', stats.totalPosts)}
          {stat('Yayında', stats.publishedPosts)}
        </div>

        <AdminTabs tabs={tabItems} active={tab} onChange={(key) => setTab(key as Tab)} ariaLabel="Köşe yönetimi sekmeleri" />

        {tab === 'new' ? (
          <form onSubmit={submitAuthor}>
            <Card>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Yazar adı">
                  <input value={form.displayName} onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value, slug: prev.slug || slugify(event.target.value) }))} className={ADMIN_CONTROL_CLASS} />
                </AdminField>
                <AdminField label="Link slug" hint={`Public link: /${form.slug || 'user1'}`}>
                  <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }))} placeholder="user1" className={ADMIN_CONTROL_CLASS} />
                </AdminField>
                <AdminField label="5'li görünüm sırası">
                  <input type="number" min="1" max="9999" value={form.displayOrder} onChange={(event) => setForm((prev) => ({ ...prev, displayOrder: event.target.value }))} className={ADMIN_CONTROL_CLASS} />
                </AdminField>
                {!editingId ? (
                  <AdminField label="Yazar şifresi">
                    <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} className={ADMIN_CONTROL_CLASS} />
                  </AdminField>
                ) : null}
                <AdminField label="Profil görseli" hint={uploading ? 'Yükleniyor...' : 'En fazla 5 MB.'}>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleUpload(event)} className={cn(ADMIN_CONTROL_CLASS, 'py-2.5 text-sm')} />
                </AdminField>
              </div>
              {form.avatarImageUrl ? <div className="relative mt-4 h-20 w-20 overflow-hidden rounded-full border border-line"><Image src={form.avatarImageUrl} alt="Profil" fill unoptimized className="object-cover" /></div> : null}
              <AdminField label="Kısa bio" className="mt-4">
                <textarea value={form.shortBio} onChange={(event) => setForm((prev) => ({ ...prev, shortBio: event.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-24 py-2')} />
              </AdminField>
              <AdminField label="Profil metni" className="mt-4">
                <textarea value={form.bioContent} onChange={(event) => setForm((prev) => ({ ...prev, bioContent: event.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-36 py-2')} />
              </AdminField>
              <div className="mt-4 flex gap-2">
                <Button disabled={loading || uploading}>{loading ? 'Kaydediliyor...' : editingId ? 'Yazarı Güncelle' : 'Yazar Oluştur'}</Button>
                {editingId ? <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(initialAuthorForm); }}>İptal</Button> : null}
              </div>
            </Card>
          </form>
        ) : null}

        {tab === 'authors' ? (
          <div className="space-y-3">
            {authors.map((author) => (
              <Card key={author.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-band">
                      {author.avatar_image_url ? <Image src={author.avatar_image_url} alt={author.display_name} fill unoptimized className="object-cover" /> : null}
                    </div>
                    <div>
                      <h2 className="font-bold text-ink">{author.display_name}</h2>
                      <div className="text-xs text-muted">/{author.slug} · sıra {author.display_order ?? 1000} · {author.is_active ? 'Aktif' : 'Pasif'}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/${author.slug}`} target="_blank" className={LINK_PILL_CLASS}>Public</Link>
                    <Link href={`/authors/${author.slug}`} target="_blank" className={LINK_PILL_CLASS}>Giriş</Link>
                    <Button size="sm" variant="outline" onClick={() => editAuthor(author)}>Düzenle</Button>
                    <Button size="sm" variant="outline" onClick={() => void setAuthorActive(author, !author.is_active)}>{author.is_active ? 'Pasifleştir' : 'Aktifleştir'}</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={passwordAuthorId === author.id ? newPassword : ''}
                    onFocus={() => setPasswordAuthorId(author.id)}
                    onChange={(event) => { setPasswordAuthorId(author.id); setNewPassword(event.target.value); }}
                    placeholder="Yeni şifre"
                    className={cn(ADMIN_CONTROL_CLASS, 'w-auto text-sm')}
                  />
                  <Button size="sm" variant="outline" onClick={() => void resetPassword(author)}>Şifre Değiştir</Button>
                </div>
              </Card>
            ))}
            {!loading && authors.length === 0 ? <AdminEmptyState title="Henüz yazar yok." /> : null}
          </div>
        ) : null}

        {tab === 'posts' ? (
          <div className="space-y-3">
            {posts.map((post) => {
              const author = authorById.get(post.author_id);
              return (
                <Card key={post.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted">{author?.display_name || post.corner_authors?.display_name || 'Yazar'} · {formatDate(post.updated_at)}</div>
                      <h3 className="mt-1 font-bold text-ink">{post.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone={post.status === 'published' ? 'green' : 'neutral'}>{post.status === 'published' ? 'Yayında' : 'Taslak'}</Chip>
                      <Button size="sm" onClick={() => void runAction({ action: 'set_post_status', id: post.id, status: post.status === 'published' ? 'draft' : 'published' }).then(loadData)}>
                        {post.status === 'published' ? 'Taslağa Al' : 'Yayınla'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
