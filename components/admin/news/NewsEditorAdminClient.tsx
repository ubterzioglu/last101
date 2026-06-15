'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from '@/components/MarkdownPreview';
import { adminJsonFetch, toDateTimeLocalValue } from '@/components/admin/news/api';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { NEWS_CATEGORIES, getNewsCategoryLabel } from '@/lib/news/shared';
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
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-white/60">
          Haber yükleniyor...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">{postId ? 'Editör Formu' : 'Yeni Kayıt'}</h2>
                <p className="mt-2 text-sm text-white/60">Slug, görsel, kaynak ve içerik alanlarını yönetin.</p>
              </div>
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Başlık">
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Slug">
                <input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Kategori">
                <select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} className={inputClass}>
                  {NEWS_CATEGORIES.map((item) => (
                    <option key={item} value={item} className="bg-black">
                      {getNewsCategoryLabel(item)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Durum">
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className={inputClass}>
                  <option value="pending_review" className="bg-black">İnceleme Bekliyor</option>
                  <option value="draft" className="bg-black">Taslak</option>
                  <option value="published" className="bg-black">Yayında</option>
                  <option value="rejected" className="bg-black">Reddedildi</option>
                  <option value="archived" className="bg-black">Arşiv</option>
                </select>
              </Field>
            </div>

            <Field label="Kısa Özet" className="mt-4">
              <textarea value={form.summary} onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))} className={`${inputClass} min-h-28`} />
            </Field>

            <Field label="İçerik" className="mt-4">
              <div className="grid gap-4 xl:grid-cols-2">
                <textarea value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} className={`${inputClass} min-h-96 font-mono`} />
                <div className="min-h-96 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/45">Önizleme</div>
                  <MarkdownPreview content={form.content} />
                </div>
              </div>
            </Field>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Kapak Görseli URL">
                <input value={form.cover_image_url} onChange={(e) => setForm((s) => ({ ...s, cover_image_url: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Görsel Yükle">
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileUpload(file);
                }} className={inputClass} />
              </Field>
              <Field label="Kapak Alt Metni">
                <input value={form.cover_image_alt} onChange={(e) => setForm((s) => ({ ...s, cover_image_alt: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Görsel Kredisi">
                <input value={form.cover_image_credit} onChange={(e) => setForm((s) => ({ ...s, cover_image_credit: e.target.value }))} className={inputClass} />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Kaynak Adı">
                <input value={form.source_name} onChange={(e) => setForm((s) => ({ ...s, source_name: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Kaynak URL">
                <input value={form.source_url} onChange={(e) => setForm((s) => ({ ...s, source_url: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Kaynak Tarihi">
                <input type="datetime-local" value={form.source_published_at} onChange={(e) => setForm((s) => ({ ...s, source_published_at: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Yayın Tarihi">
                <input type="datetime-local" value={form.published_at} onChange={(e) => setForm((s) => ({ ...s, published_at: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Okuma Süresi (dk)">
                <input type="number" min={1} max={60} value={form.reading_minutes} onChange={(e) => setForm((s) => ({ ...s, reading_minutes: Number(e.target.value) || 3 }))} className={inputClass} />
              </Field>
              <Field label="Relevance Skoru">
                <input type="number" min={0} max={100} value={form.relevance_score} onChange={(e) => setForm((s) => ({ ...s, relevance_score: Number(e.target.value) || 0 }))} className={inputClass} />
              </Field>
            </div>

            <Field label="Relevance Gerekçesi" className="mt-4">
              <textarea value={form.relevance_reason} onChange={(e) => setForm((s) => ({ ...s, relevance_reason: e.target.value }))} className={`${inputClass} min-h-24`} />
            </Field>

            <Field label="WhatsApp Paylaşım Metni" className="mt-4">
              <textarea value={form.whatsapp_share_text} onChange={(e) => setForm((s) => ({ ...s, whatsapp_share_text: e.target.value }))} className={`${inputClass} min-h-24`} />
            </Field>

            <Field label="Editör Notu" className="mt-4">
              <textarea value={form.editor_notes} onChange={(e) => setForm((s) => ({ ...s, editor_notes: e.target.value }))} className={`${inputClass} min-h-24`} />
            </Field>

            <div className="mt-4 flex flex-wrap gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <label className="flex items-center gap-3 text-sm text-white/72">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))} />
                Hero olarak göster
              </label>
              <label className="flex items-center gap-3 text-sm text-white/72">
                <input type="checkbox" checked={form.show_in_carousel} onChange={(e) => setForm((s) => ({ ...s, show_in_carousel: e.target.checked }))} />
                Ana sayfa carousel
              </label>
              <label className="flex items-center gap-3 text-sm text-white/72">
                Featured sıra
                <input type="number" min={1} max={999} value={form.featured_rank} onChange={(e) => setForm((s) => ({ ...s, featured_rank: Number(e.target.value) || 1 }))} className="w-24 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-white outline-none" />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" disabled={saving} onClick={() => void save('draft')} className={primaryButton}>
                {saving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
              </button>
              <button type="button" disabled={saving} onClick={() => void save('publish')} className={accentButton}>
                Yayınla
              </button>
              {postId ? (
                <>
                  <button type="button" disabled={saving} onClick={() => void runAction('feature')} className={neutralButton}>
                    {form.is_featured ? 'Hero Kaldır' : 'Hero Yap'}
                  </button>
                  <button type="button" disabled={saving} onClick={() => void runAction('reject')} className={dangerButton}>
                    Reddet
                  </button>
                  <button type="button" disabled={saving} onClick={() => void runAction('archive')} className={neutralButton}>
                    Arşivle
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <aside className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">Ön Bilgiler</div>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div><span className="text-white/45">Başlık:</span> {previewTitle}</div>
                <div><span className="text-white/45">Kategori:</span> {getNewsCategoryLabel(form.category as any)}</div>
                <div><span className="text-white/45">Durum:</span> {form.status}</div>
                <div><span className="text-white/45">Yayın:</span> {form.published_at || '-'}</div>
              </div>
            </aside>

            <aside className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">Ham RSS / Raw Item</div>
              {detail?.rawItem ? (
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div>
                    <div className="text-white/45">Ham Başlık</div>
                    <div className="mt-1">{String(detail.rawItem.original_title || '-')}</div>
                  </div>
                  <div>
                    <div className="text-white/45">Ham Açıklama</div>
                    <div className="mt-1 whitespace-pre-wrap">{String(detail.rawItem.original_description || '-')}</div>
                  </div>
                  <div>
                    <div className="text-white/45">Canonical URL</div>
                    <div className="mt-1 break-all">{String(detail.rawItem.canonical_url || '-')}</div>
                  </div>
                  <div>
                    <div className="text-white/45">Duplicate</div>
                    <div className="mt-1">{String(detail.rawItem.is_duplicate || false)}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/58">Bu kayıt için ham RSS verisi bağlı değil.</p>
              )}
            </aside>

            <aside className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">İşlem Geçmişi</div>
              <div className="mt-4 space-y-3">
                {detail?.actions?.length ? (
                  detail.actions.map((action) => (
                    <div key={action.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-sm">
                      <div className="font-semibold">{action.action_type}</div>
                      <div className="mt-1 text-white/60">{action.actor_user_id || 'admin'}</div>
                      <div className="mt-1 text-white/45">{formatDate(action.created_at)}</div>
                      {action.note ? <div className="mt-2 text-white/70">{action.note}</div> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/58">Henüz işlem kaydı yok.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue';
const primaryButton = 'rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-60';
const accentButton = 'rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60';
const neutralButton = 'rounded-full border border-yellow-300/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-500/20 disabled:opacity-60';
const dangerButton = 'rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:opacity-60';
