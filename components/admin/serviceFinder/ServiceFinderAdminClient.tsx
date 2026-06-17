'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminJsonFetch } from '@/components/admin/news/api';
import type { ServiceFinderCandidateRecord, ServiceFinderJobRecord } from '@/lib/serviceFinder/admin';

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
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-2xl font-bold">Yeni Tarama İşi</h2>
          {message ? <div className="mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
          {error ? <div className="mt-3 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <div className="mt-4 space-y-4">
            <Field label="Meslek Şablonu">
              <select
                value={form.template_id}
                onChange={(e) => applyTemplate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none focus:border-google-blue"
              >
                <option value="" className="bg-black">— Şablon seç —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id} className="bg-black">{t.label} ({t.provider_type})</option>
                ))}
              </select>
            </Field>
            <Input label="Provider Type" value={form.provider_type} onChange={(v) => setForm((s) => ({ ...s, provider_type: v }))} placeholder="doctor, lawyer..." />
            <Input label="Şehir" value={form.city} onChange={(v) => setForm((s) => ({ ...s, city: v, location_label: v }))} placeholder="Dortmund" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Maks. Aday" type="number" value={String(form.max_candidates)} onChange={(v) => setForm((s) => ({ ...s, max_candidates: Number(v) || 10 }))} />
              <Input label="Soft $" type="number" value={String(form.soft_cap_usd)} onChange={(v) => setForm((s) => ({ ...s, soft_cap_usd: Number(v) || 1 }))} />
              <Input label="Hard $" type="number" value={String(form.hard_cap_usd)} onChange={(v) => setForm((s) => ({ ...s, hard_cap_usd: Number(v) || 2 }))} />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={createJob}
              className="w-full rounded-full bg-google-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              İş Oluştur
            </button>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-bold">İşler</h3>
          <div className="mt-3 space-y-2">
            {jobs.length === 0 ? <p className="text-sm text-white/50">Henüz iş yok.</p> : null}
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedId(job.id)}
                className={`flex w-full flex-col gap-1 rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                  selectedId === job.id ? 'border-google-blue bg-blue-500/10' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{job.title}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">{job.status}</span>
                </div>
                <span className="text-xs text-white/50">${Number(job.cost_total_usd).toFixed(3)} / ${Number(job.hard_cap_usd).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
        {!detail ? (
          <p className="text-sm text-white/50">Detay için soldan bir iş seçin.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{detail.job.title}</h3>
                <p className="text-sm text-white/60">
                  {detail.job.status} • {detail.job.search_requests} arama / {detail.job.extract_requests} extract / {detail.job.classify_requests} sınıf •
                  ${Number(detail.job.cost_total_usd).toFixed(3)}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => runJob(detail.job.id)}
                className="rounded-full bg-google-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
              >
                Taramayı Çalıştır
              </button>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">Adaylar ({detail.candidates.length})</h4>
              <div className="space-y-3">
                {detail.candidates.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{c.canonical_name}</span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{c.provider_type}</span>
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-200">%{Number(c.confidence_score).toFixed(0)}</span>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">{c.review_status}</span>
                        </div>
                        <div className="mt-1 text-xs text-white/55">
                          {c.city} {c.profession_label ? `• ${c.profession_label}` : ''} {c.website_url ? `• ${c.website_url}` : ''}
                        </div>
                        {c.contacts?.length ? (
                          <div className="mt-1 text-xs text-white/45">
                            {c.contacts.map((ct) => `${ct.type}: ${ct.value}`).join(' · ')}
                          </div>
                        ) : null}
                      </div>
                      {c.review_status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => reviewCandidate(c.id, 'approve')} disabled={busy} className="rounded-full bg-google-green px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Onayla</button>
                          <button onClick={() => reviewCandidate(c.id, 'reject')} disabled={busy} className="rounded-full bg-google-red px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Reddet</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {detail.candidates.length === 0 ? <p className="text-sm text-white/45">Henüz aday yok. Taramayı çalıştırın.</p> : null}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">Olaylar</h4>
              <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
                {detail.events.map((ev) => (
                  <div key={ev.id} className={`rounded-lg px-2 py-1 ${ev.event_level === 'warn' || ev.event_level === 'error' ? 'bg-red-500/10 text-red-200' : 'bg-white/[0.02] text-white/60'}`}>
                    <span className="font-mono text-white/40">{ev.event_type}</span> — {ev.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue"
      />
    </label>
  );
}
