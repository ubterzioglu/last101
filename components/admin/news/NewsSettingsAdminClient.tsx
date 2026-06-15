'use client';

import { useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import type { NewsPipelineSettingsRecord } from '@/types/news';

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

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = await adminJsonFetch<{ item: NewsPipelineSettingsRecord }>('/api/admin/news/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-white/60">
          Ayarlar yükleniyor...
        </div>
      ) : settings ? (
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          {message ? <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
          {error ? <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

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

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Hariç Kelimeler</span>
            <textarea value={settings.excluded_keywords.join('\n')} onChange={(e) => setSettings((s) => s ? ({ ...s, excluded_keywords: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }) : s)} className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue" />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Yüksek Öncelikli Kelimeler</span>
            <textarea value={settings.high_priority_keywords.join('\n')} onChange={(e) => setSettings((s) => s ? ({ ...s, high_priority_keywords: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }) : s)} className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue" />
          </label>

          <div className="mt-6">
            <button type="button" onClick={() => void saveSettings()} disabled={saving} className="rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
              {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-white/60">
          Ayar kaydı bulunamadı.
        </div>
      )}
    </>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/75">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue" />
    </label>
  );
}
