'use client';

import { useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { NewsNotice } from '@/components/admin/news/NewsNotice';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import {
  NEWS_CATEGORIES,
  NEWS_LANGUAGES,
  NEWS_LANGUAGE_LABELS,
  NEWS_SOURCE_TYPES,
  getNewsCategoryLabel,
  getNewsLanguageLabel,
} from '@/lib/news/shared';
import type { NewsCategory, NewsLanguage, NewsSourceRecord, NewsSourceType } from '@/types/news';

interface SourcesResponse {
  items: NewsSourceRecord[];
}

interface SourceForm {
  name: string;
  source_type: NewsSourceType;
  feed_url: string;
  homepage_url: string;
  default_category: NewsCategory;
  /** '' = karışık/bilinmiyor: dil yalnızca içerikten tespit edilir. */
  language_code: NewsLanguage | '';
  usage_mode: NewsSourceRecord['usage_mode'];
  priority: number;
  fetch_limit: number;
  is_active: boolean;
  config: Record<string, unknown>;
}

const USAGE_MODES: NewsSourceRecord['usage_mode'][] = ['signal_only', 'short_excerpt_allowed', 'licensed', 'manual_only'];
const SOURCE_LANGUAGE_OPTIONS: SourceForm['language_code'][] = [...NEWS_LANGUAGES, ''];
const SOURCE_LANGUAGE_LABELS: Record<string, string> = { ...NEWS_LANGUAGE_LABELS, '': 'Karışık / Bilinmiyor' };

const emptyForm: SourceForm = {
  name: '',
  source_type: 'rss',
  feed_url: '',
  homepage_url: '',
  default_category: 'almanya',
  language_code: 'tr',
  usage_mode: 'signal_only',
  priority: 50,
  fetch_limit: 10,
  is_active: true,
  config: {},
};

function toSourceForm(item: NewsSourceRecord): SourceForm {
  return {
    name: item.name,
    source_type: item.source_type,
    feed_url: item.feed_url || '',
    homepage_url: item.homepage_url || '',
    default_category: item.default_category,
    language_code: item.language_code ?? '',
    usage_mode: item.usage_mode,
    priority: item.priority,
    fetch_limit: item.fetch_limit,
    is_active: item.is_active,
    config: item.config || {},
  };
}

const GDELT_CONFIG_PLACEHOLDER = `{
  "query": "Turkish diaspora Germany",
  "timespan": "1d",
  "maxrecords": 100,
  "allowedLanguages": "Turkish,German"
}`;

export function NewsSourcesAdminClient() {
  const [items, setItems] = useState<NewsSourceRecord[]>([]);
  const [form, setForm] = useState<SourceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  async function loadSources() {
    setLoading(true);
    setError('');
    try {
      const payload = await adminJsonFetch<SourcesResponse>('/api/admin/news/sources');
      setItems(payload.items);
    } catch (err) {
      setError((err as Error).message || 'Kaynaklar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSources();
  }, []);

  async function handleSubmit() {
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await adminJsonFetch(`/api/admin/news/sources/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMessage('Kaynak güncellendi.');
      } else {
        await adminJsonFetch('/api/admin/news/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMessage('Kaynak oluşturuldu.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadSources();
    } catch (err) {
      setError((err as Error).message || 'Kaynak kaydedilemedi.');
    }
  }

  async function testSource(id: string) {
    setTesting(id);
    setError('');
    try {
      const payload = await adminJsonFetch<{ ok: boolean; status: number; preview: Array<{ title: string }> }>(`/api/admin/news/sources/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setMessage(`Kaynak test edildi (${payload.status}). İlk kayıt: ${payload.preview?.[0]?.title || 'bulunamadı'}`);
    } catch (err) {
      setError((err as Error).message || 'Kaynak test edilemedi.');
    } finally {
      setTesting(null);
    }
  }

  async function runSource(id: string) {
    setTesting(id);
    setError('');
    try {
      await adminJsonFetch(`/api/admin/news/sources/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setMessage('Kaynak çalıştırma tetiklendi.');
      await loadSources();
    } catch (err) {
      setError((err as Error).message || 'Kaynak çalıştırılamadı.');
    } finally {
      setTesting(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <Card>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">{editingId ? 'Kaynağı Düzenle' : 'Yeni Kaynak'}</h2>
        <p className="mt-2 text-sm text-muted">Feed URL, kategori ve öncelik alanlarını doldurun.</p>

        {message ? <NewsNotice tone="green" className="mt-4">{message}</NewsNotice> : null}
        {error ? <NewsNotice tone="red" className="mt-4">{error}</NewsNotice> : null}

        <div className="mt-5 space-y-4">
          <Input label="Kaynak Adı" value={form.name} onChange={(value) => setForm((s) => ({ ...s, name: value }))} />
          <Input label="Feed URL" value={form.feed_url} onChange={(value) => setForm((s) => ({ ...s, feed_url: value }))} />
          <Input label="Homepage URL" value={form.homepage_url} onChange={(value) => setForm((s) => ({ ...s, homepage_url: value }))} />
          <Select label="Tür" value={form.source_type} onChange={(value) => setForm((s) => ({ ...s, source_type: value as NewsSourceType }))} options={NEWS_SOURCE_TYPES} />
          <Select label="Dil" value={form.language_code} onChange={(value) => setForm((s) => ({ ...s, language_code: value as SourceForm['language_code'] }))} options={SOURCE_LANGUAGE_OPTIONS} labels={SOURCE_LANGUAGE_LABELS} />
          {form.language_code === 'en' ? (
            <NewsNotice tone="yellow" className="text-xs">
              İngilizce kaynaklardan haber alınmaz; içerikten açıkça Türkçe veya Almanca olduğu anlaşılan öğeler hariç.
            </NewsNotice>
          ) : null}
          {form.source_type === 'gdelt' ? (
            <ConfigTextarea
              key={editingId ?? 'new'}
              label="GDELT Config (JSON)"
              value={form.config}
              placeholder={GDELT_CONFIG_PLACEHOLDER}
              onChange={(value) => setForm((s) => ({ ...s, config: value }))}
            />
          ) : null}
          <Select label="Kategori" value={form.default_category} onChange={(value) => setForm((s) => ({ ...s, default_category: value as NewsCategory }))} options={NEWS_CATEGORIES} labels={Object.fromEntries(NEWS_CATEGORIES.map((item) => [item, getNewsCategoryLabel(item)]))} />
          <Select label="Usage Mode" value={form.usage_mode} onChange={(value) => setForm((s) => ({ ...s, usage_mode: value as SourceForm['usage_mode'] }))} options={USAGE_MODES} />
          <Input label="Öncelik" type="number" value={String(form.priority)} onChange={(value) => setForm((s) => ({ ...s, priority: Number(value) || 50 }))} />
          <Input label="Fetch Limit" type="number" value={String(form.fetch_limit)} onChange={(value) => setForm((s) => ({ ...s, fetch_limit: Number(value) || 10 }))} />
          <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-ink">
            <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.is_active} onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))} />
            Aktif
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={() => void handleSubmit()}>
            {editingId ? 'Kaynağı Güncelle' : 'Kaynağı Oluştur'}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              İptal
            </Button>
          ) : null}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Aktif Kaynaklar</h2>
        <div className="mt-5">
          <AdminTable caption="Haber kaynakları">
            <AdminThead>
              <AdminTr className="hover:bg-transparent">
                <AdminTh>Kaynak</AdminTh>
                <AdminTh>Tür</AdminTh>
                <AdminTh>Dil</AdminTh>
                <AdminTh>Kategori</AdminTh>
                <AdminTh>Son Başarı</AdminTh>
                <AdminTh>Hata</AdminTh>
                <AdminTh>İşlemler</AdminTh>
              </AdminTr>
            </AdminThead>
            <tbody>
              {loading ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={7} className="py-10 text-center text-muted">Kaynaklar yükleniyor...</AdminTd>
                </AdminTr>
              ) : items.length === 0 ? (
                <AdminTr className="hover:bg-transparent">
                  <AdminTd colSpan={7} className="py-10 text-center text-muted">Henüz kaynak yok.</AdminTd>
                </AdminTr>
              ) : items.map((item) => (
                <AdminTr key={item.id}>
                  <AdminTd>
                    <div className="font-semibold text-ink">{item.name}</div>
                    <div className="mt-1 max-w-sm break-all text-xs text-muted">{item.feed_url || '-'}</div>
                  </AdminTd>
                  <AdminTd className="text-muted">{item.source_type}</AdminTd>
                  <AdminTd className="text-muted">{getNewsLanguageLabel(item.language_code)}</AdminTd>
                  <AdminTd className="text-muted">{getNewsCategoryLabel(item.default_category)}</AdminTd>
                  <AdminTd className="text-muted">{item.last_success_at || '-'}</AdminTd>
                  <AdminTd className="text-muted">{item.last_error || '-'}</AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => { setEditingId(item.id); setForm(toSourceForm(item)); }}>
                        Düzenle
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => void testSource(item.id)} disabled={testing === item.id}>
                        Test Et
                      </Button>
                      <Button type="button" size="sm" onClick={() => void runSource(item.id)} disabled={testing === item.id}>
                        Şimdi Çek
                      </Button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </Card>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <AdminField label={label}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={ADMIN_CONTROL_CLASS} />
    </AdminField>
  );
}

function ConfigTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: Record<string, unknown>;
  placeholder?: string;
  onChange: (value: Record<string, unknown>) => void;
}) {
  const [text, setText] = useState(() => {
    const hasValue = value && Object.keys(value).length > 0;
    return hasValue ? JSON.stringify(value, null, 2) : '';
  });
  const [parseError, setParseError] = useState('');

  function handleChange(next: string) {
    setText(next);
    const trimmed = next.trim();
    if (!trimmed) {
      setParseError('');
      onChange({});
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        setParseError('');
        onChange(parsed as Record<string, unknown>);
      } else {
        setParseError('JSON bir nesne olmalı.');
      }
    } catch {
      setParseError('Geçersiz JSON.');
    }
  }

  return (
    <AdminField label={label} error={parseError || undefined}>
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className={cn(ADMIN_CONTROL_CLASS, 'py-3 font-mono text-xs')}
      />
    </AdminField>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  labels?: Record<string, string>;
}) {
  return (
    <AdminField label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={ADMIN_CONTROL_CLASS}>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] || option}
          </option>
        ))}
      </select>
    </AdminField>
  );
}
