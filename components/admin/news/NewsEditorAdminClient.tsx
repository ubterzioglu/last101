'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from '@/components/MarkdownPreview';
import { adminJsonFetch, toDateTimeLocalValue } from '@/components/admin/news/api';
import { NewsNotice } from '@/components/admin/news/NewsNotice';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { NEWS_CATEGORIES, getNewsCategoryLabel, normalizeNewsCategory } from '@/lib/news/shared';
import type { NewsPostAdminRecord } from '@/types/news';

interface PostDetailResponse {
  post: NewsPostAdminRecord;
  rawItem: Record<string, unknown> | null;
  actions: Array<{
    id: string;
    actor_user_id: string | null;
    action_type: string;
    note: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
  }>;
}

const initialForm = {
  title: '',
  slug: '',
  category: 'almanya',
  summary: '',
  content: '',
  cover_image_url: '',
  cover_image_alt: '',
  cover_image_credit: '',
  source_name: '',
  source_url: '',
  source_published_at: '',
  status: 'draft',
  is_featured: false,
  featured_rank: 1,
  reading_minutes: 3,
  whatsapp_share_text: '',
  relevance_score: 0,
  relevance_reason: '',
  editor_notes: '',
  published_at: '',
  show_in_carousel: true,
};

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

interface NewsEditorAdminClientProps {
  postId?: string;
  /**
   * SPA hook: when provided, a successful create calls this with the new post
   * id instead of navigating to `/admin/haberler/[id]`. When omitted, the
   * standalone route behavior (router.push) is preserved.
   */
  onCreated?: (id: string) => void;
}

export function NewsEditorAdminClient({ postId, onCreated }: NewsEditorAdminClientProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [detail, setDetail] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const previewTitle = useMemo(() => form.title.trim() || 'Başlıksız haber', [form.title]);

  useEffect(() => {
    if (!postId) return;
    void loadDetail(postId);
  }, [postId]);

  async function loadDetail(id: string) {
    setLoading(true);
    setError('');
    try {
      const payload = await adminJsonFetch<PostDetailResponse>(`/api/admin/news/posts/${id}`);
      setDetail(payload);
      setForm({
        title: payload.post.title,
        slug: payload.post.slug,
        category: payload.post.category,
        summary: payload.post.summary || '',
        content: payload.post.content || '',
        cover_image_url: payload.post.cover_image_url || '',
        cover_image_alt: payload.post.cover_image_alt || '',
        cover_image_credit: payload.post.cover_image_credit || '',
        source_name: payload.post.source_name || '',
        source_url: payload.post.source_url || '',
        source_published_at: toDateTimeLocalValue(payload.post.source_published_at),
        status: payload.post.status,
        is_featured: payload.post.is_featured,
        featured_rank: payload.post.featured_rank || 1,
        reading_minutes: payload.post.reading_minutes || 3,
        whatsapp_share_text: payload.post.whatsapp_share_text || '',
        relevance_score: payload.post.relevance_score || 0,
        relevance_reason: payload.post.relevance_reason || '',
        editor_notes: payload.post.editor_notes || '',
        published_at: toDateTimeLocalValue(payload.post.published_at),
        show_in_carousel: Boolean(payload.post.show_in_carousel),
      });
    } catch (err) {
      setError((err as Error).message || 'Detay yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File) {
    setSaving(true);
    setError('');
    try {
      const data = new FormData();
      data.set('file', file);
      data.set('slug', form.slug || form.title || 'haber');

      const response = await fetch('/api/admin/news/upload', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: data,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Yükleme başarısız.');

      setForm((current) => ({
        ...current,
        cover_image_url: payload.publicUrl,
      }));
      setMessage('Görsel yüklendi.');
    } catch (err) {
      setError((err as Error).message || 'Yükleme başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function save(mode?: 'publish' | 'draft') {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        status: mode === 'publish' ? 'published' : mode === 'draft' ? 'draft' : form.status,
        source_published_at: form.source_published_at ? new Date(form.source_published_at).toISOString() : null,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      };

      if (postId) {
        await adminJsonFetch<{ item: NewsPostAdminRecord }>(`/api/admin/news/posts/${postId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (mode === 'publish') {
          await adminJsonFetch(`/api/admin/news/posts/${postId}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
        }
        await loadDetail(postId);
      } else {
        const created = await adminJsonFetch<{ item: NewsPostAdminRecord }>('/api/admin/news/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (mode === 'publish') {
          await adminJsonFetch(`/api/admin/news/posts/${created.item.id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
        }
        if (onCreated) {
          onCreated(created.item.id);
        } else {
          router.push(`/admin/haberler/${created.item.id}`);
        }
        return;
      }
      setMessage(mode === 'publish' ? 'Haber yayına alındı.' : 'Haber kaydedildi.');
    } catch (err) {
      setError((err as Error).message || 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  async function runAction(action: 'reject' | 'archive' | 'feature') {
    if (!postId) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const body = action === 'feature'
        ? { isFeatured: !form.is_featured, featuredRank: form.featured_rank || 1 }
        : { note: form.editor_notes || undefined };
      await adminJsonFetch(`/api/admin/news/posts/${postId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await loadDetail(postId);
      setMessage(
        action === 'feature'
          ? (form.is_featured ? 'Hero kaldırıldı.' : 'Hero seçildi.')
          : action === 'reject'
            ? 'Haber reddedildi.'
            : 'Haber arşivlendi.'
      );
    } catch (err) {
      setError((err as Error).message || 'İşlem başarısız.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {loading ? (
        <Card className="px-6 py-16 text-center text-sm text-muted">
          Haber yükleniyor...
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink">{postId ? 'Editör Formu' : 'Yeni Kayıt'}</h2>
                <p className="mt-2 text-sm text-muted">Slug, görsel, kaynak ve içerik alanlarını yönetin.</p>
              </div>
            </div>

            {message ? <NewsNotice tone="green" className="mt-4">{message}</NewsNotice> : null}
            {error ? <NewsNotice tone="red" className="mt-4">{error}</NewsNotice> : null}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AdminField label="Başlık">
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Slug">
                <input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Kategori">
                <select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} className={ADMIN_CONTROL_CLASS}>
                  {NEWS_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {getNewsCategoryLabel(item)}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Durum">
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className={ADMIN_CONTROL_CLASS}>
                  <option value="pending_review">İnceleme Bekliyor</option>
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="archived">Arşiv</option>
                </select>
              </AdminField>
            </div>

            <AdminField label="Kısa Özet" className="mt-4">
              <textarea value={form.summary} onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-28 py-3')} />
            </AdminField>

            <AdminField label="İçerik" className="mt-4">
              <div className="grid gap-4 xl:grid-cols-2">
                <textarea value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-96 py-3 font-mono')} />
                <div className="min-h-96 rounded-card border border-line bg-white p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Önizleme</div>
                  <MarkdownPreview content={form.content} tone="light" />
                </div>
              </div>
            </AdminField>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminField label="Kapak Görseli URL">
                <input value={form.cover_image_url} onChange={(e) => setForm((s) => ({ ...s, cover_image_url: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Görsel Yükle">
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileUpload(file);
                }} className={cn(ADMIN_CONTROL_CLASS, 'py-2')} />
              </AdminField>
              <AdminField label="Kapak Alt Metni">
                <input value={form.cover_image_alt} onChange={(e) => setForm((s) => ({ ...s, cover_image_alt: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Görsel Kredisi">
                <input value={form.cover_image_credit} onChange={(e) => setForm((s) => ({ ...s, cover_image_credit: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminField label="Kaynak Adı">
                <input value={form.source_name} onChange={(e) => setForm((s) => ({ ...s, source_name: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Kaynak URL">
                <input value={form.source_url} onChange={(e) => setForm((s) => ({ ...s, source_url: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Kaynak Tarihi">
                <input type="datetime-local" value={form.source_published_at} onChange={(e) => setForm((s) => ({ ...s, source_published_at: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Yayın Tarihi">
                <input type="datetime-local" value={form.published_at} onChange={(e) => setForm((s) => ({ ...s, published_at: e.target.value }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Okuma Süresi (dk)">
                <input type="number" min={1} max={60} value={form.reading_minutes} onChange={(e) => setForm((s) => ({ ...s, reading_minutes: Number(e.target.value) || 3 }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
              <AdminField label="Relevance Skoru">
                <input type="number" min={0} max={100} value={form.relevance_score} onChange={(e) => setForm((s) => ({ ...s, relevance_score: Number(e.target.value) || 0 }))} className={ADMIN_CONTROL_CLASS} />
              </AdminField>
            </div>

            <AdminField label="Relevance Gerekçesi" className="mt-4">
              <textarea value={form.relevance_reason} onChange={(e) => setForm((s) => ({ ...s, relevance_reason: e.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-24 py-3')} />
            </AdminField>

            <AdminField label="WhatsApp Paylaşım Metni" className="mt-4">
              <textarea value={form.whatsapp_share_text} onChange={(e) => setForm((s) => ({ ...s, whatsapp_share_text: e.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-24 py-3')} />
            </AdminField>

            <AdminField label="Editör Notu" className="mt-4">
              <textarea value={form.editor_notes} onChange={(e) => setForm((s) => ({ ...s, editor_notes: e.target.value }))} className={cn(ADMIN_CONTROL_CLASS, 'min-h-24 py-3')} />
            </AdminField>

            <div className="mt-4 flex flex-wrap items-center gap-6 rounded-card border border-line bg-band p-4">
              <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-ink">
                <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.is_featured} onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))} />
                Hero olarak göster
              </label>
              <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-ink">
                <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.show_in_carousel} onChange={(e) => setForm((s) => ({ ...s, show_in_carousel: e.target.checked }))} />
                Ana sayfa carousel
              </label>
              <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-ink">
                Featured sıra
                <input type="number" min={1} max={999} value={form.featured_rank} onChange={(e) => setForm((s) => ({ ...s, featured_rank: Number(e.target.value) || 1 }))} className={cn(ADMIN_CONTROL_CLASS, 'w-24')} />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={saving} onClick={() => void save('draft')}>
                {saving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
              </Button>
              <Button type="button" disabled={saving} onClick={() => void save('publish')}>
                Yayınla
              </Button>
              {postId ? (
                <>
                  <Button type="button" variant="outline" disabled={saving} onClick={() => void runAction('feature')}>
                    {form.is_featured ? 'Hero Kaldır' : 'Hero Yap'}
                  </Button>
                  <Button type="button" variant="danger" disabled={saving} onClick={() => void runAction('reject')}>
                    Reddet
                  </Button>
                  <Button type="button" variant="outline" disabled={saving} onClick={() => void runAction('archive')}>
                    Arşivle
                  </Button>
                </>
              ) : null}
            </div>
          </Card>

          <div className="space-y-6">
            <aside className="rounded-card border border-line bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">Ön Bilgiler</div>
              <div className="mt-4 space-y-3 text-sm text-ink">
                <div><span className="text-muted">Başlık:</span> {previewTitle}</div>
                <div><span className="text-muted">Kategori:</span> {getNewsCategoryLabel(normalizeNewsCategory(form.category))}</div>
                <div><span className="text-muted">Durum:</span> {form.status}</div>
                <div><span className="text-muted">Yayın:</span> {form.published_at || '-'}</div>
              </div>
            </aside>

            <aside className="rounded-card border border-line bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">Ham RSS / Raw Item</div>
              {detail?.rawItem ? (
                <div className="mt-4 space-y-3 text-sm text-ink">
                  <div>
                    <div className="text-muted">Ham Başlık</div>
                    <div className="mt-1">{String(detail.rawItem.original_title || '-')}</div>
                  </div>
                  <div>
                    <div className="text-muted">Ham Açıklama</div>
                    <div className="mt-1 whitespace-pre-wrap">{String(detail.rawItem.original_description || '-')}</div>
                  </div>
                  <div>
                    <div className="text-muted">Canonical URL</div>
                    <div className="mt-1 break-all">{String(detail.rawItem.canonical_url || '-')}</div>
                  </div>
                  <div>
                    <div className="text-muted">Duplicate</div>
                    <div className="mt-1">{String(detail.rawItem.is_duplicate || false)}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Bu kayıt için ham RSS verisi bağlı değil.</p>
              )}
            </aside>

            <aside className="rounded-card border border-line bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">İşlem Geçmişi</div>
              <div className="mt-4 space-y-3">
                {detail?.actions?.length ? (
                  detail.actions.map((action) => (
                    <div key={action.id} className="rounded-card border border-line bg-band p-3 text-sm">
                      <div className="font-semibold text-ink">{action.action_type}</div>
                      <div className="mt-1 text-muted">{action.actor_user_id || 'admin'}</div>
                      <div className="mt-1 text-muted">{formatDate(action.created_at)}</div>
                      {action.note ? <div className="mt-2 text-ink">{action.note}</div> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Henüz işlem kaydı yok.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
