'use client';

import { useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import { NewsNotice } from '@/components/admin/news/NewsNotice';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { DEFAULT_ALLOWED_NEWS_LANGUAGES, PUBLISHABLE_NEWS_LANGUAGES, getNewsLanguageLabel } from '@/lib/news/shared';
import type { NewsLanguage, NewsPipelineSettingsRecord } from '@/types/news';

function toggleLanguage(current: readonly NewsLanguage[], language: NewsLanguage, enabled: boolean): NewsLanguage[] {
  const next = enabled ? [...current, language] : current.filter((item) => item !== language);
  return PUBLISHABLE_NEWS_LANGUAGES.filter((item) => next.includes(item));
}

export function NewsSettingsAdminClient() {
  const [settings, setSettings] = useState<NewsPipelineSettingsRecord | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError('');
    try {
      const payload = await adminJsonFetch<{ item: NewsPipelineSettingsRecord | null }>('/api/admin/news/settings');
      setSettings(payload.item);
    } catch (err) {
      setError((err as Error).message || 'Ayarlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  const allowedLanguages = settings?.allowed_languages ?? DEFAULT_ALLOWED_NEWS_LANGUAGES;

  async function saveSettings() {
    if (!settings) return;
    if (allowedLanguages.length === 0) {
      setError('En az bir dil seçilmelidir.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = await adminJsonFetch<{ item: NewsPipelineSettingsRecord }>('/api/admin/news/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, allowed_languages: allowedLanguages }),
      });
      setSettings(payload.item);
      setMessage('Ayarlar kaydedildi.');
    } catch (err) {
      setError((err as Error).message || 'Ayarlar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {loading ? (
        <Card className="px-6 py-16 text-center text-sm text-muted">
          Ayarlar yükleniyor...
        </Card>
      ) : settings ? (
        <Card>
          {message ? <NewsNotice tone="green">{message}</NewsNotice> : null}
          {error ? <NewsNotice tone="red" className="mt-4">{error}</NewsNotice> : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Switch label="Pipeline aktif" checked={settings.pipeline_enabled} onChange={(checked) => setSettings((s) => s ? ({ ...s, pipeline_enabled: checked }) : s)} />
            <Switch label="AI aktif" checked={settings.ai_enabled} onChange={(checked) => setSettings((s) => s ? ({ ...s, ai_enabled: checked }) : s)} />
            <NumberField label="AI günlük limit" value={settings.ai_daily_limit} onChange={(value) => setSettings((s) => s ? ({ ...s, ai_daily_limit: value }) : s)} />
            <NumberField label="Kaynak başına max aday" value={settings.max_items_per_source} onChange={(value) => setSettings((s) => s ? ({ ...s, max_items_per_source: value }) : s)} />
            <NumberField label="Ham veri retention (gün)" value={settings.raw_retention_days} onChange={(value) => setSettings((s) => s ? ({ ...s, raw_retention_days: value }) : s)} />
            <NumberField label="Run retention (gün)" value={settings.ingest_run_retention_days} onChange={(value) => setSettings((s) => s ? ({ ...s, ingest_run_retention_days: value }) : s)} />
            <NumberField label="Rejected retention (gün)" value={settings.rejected_posts_retention_days} onChange={(value) => setSettings((s) => s ? ({ ...s, rejected_posts_retention_days: value }) : s)} />
            <Switch label="Otomatik pending_review üret" checked={settings.auto_create_pending_review} onChange={(checked) => setSettings((s) => s ? ({ ...s, auto_create_pending_review: checked }) : s)} />
          </div>

          <fieldset className="mt-4 rounded-card border border-line bg-band px-4 py-3">
            <legend className="px-1 text-sm font-semibold text-ink">İzin Verilen Diller</legend>
            <p className="text-xs text-muted">
              Bu diller dışındaki haberler çekilirken elenir ve kuyruğa düşmez. Site Türkçe olduğu için İngilizce seçilemez.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              {PUBLISHABLE_NEWS_LANGUAGES.map((language) => (
                <label key={language} className="flex min-h-[44px] items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-700"
                    checked={allowedLanguages.includes(language)}
                    onChange={(e) => setSettings((s) => s ? ({ ...s, allowed_languages: toggleLanguage(allowedLanguages, language, e.target.checked) }) : s)}
                  />
                  {getNewsLanguageLabel(language)}
                </label>
              ))}
            </div>
          </fieldset>

          <AdminField label="Hariç Kelimeler" className="mt-4">
            <textarea value={settings.excluded_keywords.join('\n')} onChange={(e) => setSettings((s) => s ? ({ ...s, excluded_keywords: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }) : s)} className={cn(ADMIN_CONTROL_CLASS, 'min-h-32 py-3')} />
          </AdminField>

          <AdminField label="Yüksek Öncelikli Kelimeler" className="mt-4">
            <textarea value={settings.high_priority_keywords.join('\n')} onChange={(e) => setSettings((s) => s ? ({ ...s, high_priority_keywords: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }) : s)} className={cn(ADMIN_CONTROL_CLASS, 'min-h-32 py-3')} />
          </AdminField>

          <div className="mt-6">
            <Button type="button" onClick={() => void saveSettings()} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="px-6 py-16 text-center text-sm text-muted">
          Ayar kaydı bulunamadı.
        </Card>
      )}
    </>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-[44px] items-center justify-between gap-4 rounded-card border border-line bg-band px-4 py-3 text-sm font-semibold text-ink">
      <span>{label}</span>
      <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <AdminField label={label}>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className={ADMIN_CONTROL_CLASS} />
    </AdminField>
  );
}
