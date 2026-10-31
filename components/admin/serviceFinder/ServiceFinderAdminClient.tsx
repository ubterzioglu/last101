'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import type { ServiceFinderCandidateRecord, ServiceFinderJobRecord } from '@/lib/serviceFinder/admin';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface Template {
  id: string;
  template_key: string;
  label: string;
  provider_type: string;
  category_group: string;
}

interface JobDetail {
  job: ServiceFinderJobRecord;
  candidates: ServiceFinderCandidateRecord[];
  events: Array<{ id: number; event_type: string; event_level: string; message: string; created_at: string }>;
  sources: Array<{ id: string; source_url: string; source_domain: string; fetch_status: string; crawl_allowed: boolean | null }>;
}

const emptyForm = {
  template_id: '',
  provider_type: '',
  city: '',
  location_label: '',
  max_candidates: 10,
  soft_cap_usd: 1,
  hard_cap_usd: 2,
};

export function ServiceFinderAdminClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [jobs, setJobs] = useState<ServiceFinderJobRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const payload = await adminJsonFetch<{ items: ServiceFinderJobRecord[] }>('/api/admin/service-finder/jobs');
      setJobs(payload.items);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    try {
      const payload = await adminJsonFetch<{ items: Template[] }>('/api/admin/service-finder/templates');
      setTemplates(payload.items);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const payload = await adminJsonFetch<JobDetail>(`/api/admin/service-finder/jobs/${id}`);
      setDetail(payload);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
    void loadTemplates();
  }, [loadJobs, loadTemplates]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  function applyTemplate(templateId: string) {
    const tpl = templates.find((t) => t.id === templateId);
    setForm((s) => ({
      ...s,
      template_id: templateId,
      provider_type: tpl?.provider_type ?? s.provider_type,
    }));
  }

  async function createJob() {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await adminJsonFetch('/api/admin/service-finder/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, location_label: form.location_label || form.city }),
      });
      setMessage('İş oluşturuldu.');
      setForm(emptyForm);
      await loadJobs();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function runJob(id: string) {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const res = await adminJsonFetch<{ status?: string; candidates?: number }>(`/api/admin/service-finder/jobs/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setMessage(`Tarama çalıştı: ${res.status ?? 'tamam'}${res.candidates != null ? ` (${res.candidates} aday)` : ''}`);
      await loadJobs();
      if (selectedId === id) await loadDetail(id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function reviewCandidate(candidateId: string, action: 'approve' | 'reject') {
    setError('');
    setBusy(true);
    try {
      await adminJsonFetch(`/api/admin/service-finder/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setMessage(action === 'approve' ? 'Aday onaylandı ve rehbere eklendi.' : 'Aday reddedildi.');
      if (selectedId) await loadDetail(selectedId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-5">
        <Card>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">Yeni Tarama İşi</h2>
          {message ? (
            <div className={cn('mt-3 rounded-btn border px-4 py-3 text-sm', TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text)}>{message}</div>
          ) : null}
          {error ? (
            <div role="alert" className={cn('mt-3 rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>{error}</div>
          ) : null}

          <div className="mt-4 space-y-4">
            <AdminField label="Meslek Şablonu">
              <select
                value={form.template_id}
                onChange={(e) => applyTemplate(e.target.value)}
                className={ADMIN_CONTROL_CLASS}
              >
                <option value="">— Şablon seç —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.label} ({t.provider_type})</option>
                ))}
              </select>
            </AdminField>
            <Input label="Provider Type" value={form.provider_type} onChange={(v) => setForm((s) => ({ ...s, provider_type: v }))} placeholder="doctor, lawyer..." />
            <Input label="Şehir" value={form.city} onChange={(v) => setForm((s) => ({ ...s, city: v, location_label: v }))} placeholder="Dortmund" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Maks. Aday" type="number" value={String(form.max_candidates)} onChange={(v) => setForm((s) => ({ ...s, max_candidates: Number(v) || 10 }))} />
              <Input label="Soft $" type="number" value={String(form.soft_cap_usd)} onChange={(v) => setForm((s) => ({ ...s, soft_cap_usd: Number(v) || 1 }))} />
              <Input label="Hard $" type="number" value={String(form.hard_cap_usd)} onChange={(v) => setForm((s) => ({ ...s, hard_cap_usd: Number(v) || 2 }))} />
            </div>
            <Button type="button" disabled={busy} onClick={createJob} className="w-full">
              İş Oluştur
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-extrabold text-ink">İşler</h3>
          <div className="mt-3 space-y-2">
            {jobs.length === 0 ? <p className="text-sm text-muted">Henüz iş yok.</p> : null}
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedId(job.id)}
                className={cn(
                  'flex min-h-[44px] w-full flex-col gap-1 rounded-btn border px-3 py-2.5 text-left text-sm transition-colors',
                  selectedId === job.id ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-line bg-white hover:bg-band'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink">{job.title}</span>
                  <Chip className="px-2 py-0.5 text-[10px] uppercase tracking-wide">{job.status}</Chip>
                </div>
                <span className="text-xs text-muted">${Number(job.cost_total_usd).toFixed(3)} / ${Number(job.hard_cap_usd).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        {!detail ? (
          <p className="text-sm text-muted">Detay için soldan bir iş seçin.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-ink">{detail.job.title}</h3>
                <p className="text-sm text-muted">
                  {detail.job.status} • {detail.job.search_requests} arama / {detail.job.extract_requests} extract / {detail.job.classify_requests} sınıf •
                  ${Number(detail.job.cost_total_usd).toFixed(3)}
                </p>
              </div>
              <Button type="button" variant="success" disabled={busy} onClick={() => runJob(detail.job.id)}>
                Taramayı Çalıştır
              </Button>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Adaylar ({detail.candidates.length})</h4>
              <div className="space-y-3">
                {detail.candidates.map((c) => (
                  <div key={c.id} className="rounded-card border border-line bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-ink">{c.canonical_name}</span>
                          <Chip className="px-2 py-0.5 text-[10px]">{c.provider_type}</Chip>
                          <Chip tone="brand" className="px-2 py-0.5 text-[10px]">%{Number(c.confidence_score).toFixed(0)}</Chip>
                          <Chip className="px-2 py-0.5 text-[10px] text-muted">{c.review_status}</Chip>
                        </div>
                        <div className="mt-1 text-xs text-muted">
                          {c.city} {c.profession_label ? `• ${c.profession_label}` : ''} {c.website_url ? `• ${c.website_url}` : ''}
                        </div>
                        {c.contacts?.length ? (
                          <div className="mt-1 text-xs text-muted">
                            {c.contacts.map((ct) => `${ct.type}: ${ct.value}`).join(' · ')}
                          </div>
                        ) : null}
                      </div>
                      {c.review_status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="success" onClick={() => reviewCandidate(c.id, 'approve')} disabled={busy}>Onayla</Button>
                          <Button size="sm" variant="danger" onClick={() => reviewCandidate(c.id, 'reject')} disabled={busy}>Reddet</Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {detail.candidates.length === 0 ? <p className="text-sm text-muted">Henüz aday yok. Taramayı çalıştırın.</p> : null}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Olaylar</h4>
              <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
                {detail.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={cn(
                      'rounded-tile px-2 py-1',
                      ev.event_level === 'warn' || ev.event_level === 'error'
                        ? cn(TONE_STYLES.red.tint, TONE_STYLES.red.text)
                        : 'bg-band text-muted'
                    )}
                  >
                    <span className="font-mono text-muted">{ev.event_type}</span> — {ev.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <AdminField label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={ADMIN_CONTROL_CLASS}
      />
    </AdminField>
  );
}
