'use client';

import { useState } from 'react';
import { Chip } from '@/components/site/Chip';
import { Eyebrow } from '@/components/site/Eyebrow';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const SERVICE_OPTIONS = [
  { value: 'doctor', label: 'Doktor' },
  { value: 'lawyer', label: 'Avukat' },
  { value: 'terapist', label: 'Terapist / Psikolog' },
  { value: 'ebe', label: 'Ebe / Kadın Doğum' },
  { value: 'tamirci_otomobil', label: 'Tamirci / Otomobil' },
  { value: 'tamirci_tesisat', label: 'Tamirci / Tesisat' },
  { value: 'tamirci_boyaci', label: 'Tamirci / Boyacı' },
  { value: 'nakliyat', label: 'Nakliyat' },
  { value: 'sigorta', label: 'Sigorta' },
  { value: 'vergi_danismani', label: 'Vergi Danışmanı' },
  { value: 'berber', label: 'Berber' },
  { value: 'kuafor', label: 'Kuaför' },
  { value: 'surucu_kursu', label: 'Sürücü Kursu' },
] as const;

const initialState = {
  type: 'doctor',
  displayName: '',
  city: '',
  address: '',
  phone: '',
  website: '',
  tagLabels: '',
  googleMapsUrl: '',
  note: '',
};

const inputClassName =
  'h-11 w-full rounded-btn border border-line bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-muted hover:border-ink/30 focus:border-brand-700';

const MESSAGE_CLASS = 'rounded-btn border px-4 py-3 text-sm leading-relaxed';

type FormKey = keyof typeof initialState;
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** The suggestion form card; the page around it (head, steps) is server-rendered in page.tsx. */
export default function HizmetOnerClient() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  /** Controlled-field wiring: value plus an immutable update of that one key. */
  const bind = (key: FormKey) => ({
    value: form[key],
    onChange: (event: React.ChangeEvent<FieldElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value })),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/provider-submissions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Öneri gönderilemedi.');
      }

      setSubmitMessage(payload.message || 'Öneriniz alındı.');
      setForm(initialState);
    } catch (error) {
      setSubmitError((error as Error).message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="oner-formu"
      aria-labelledby="oner-formu-title"
      className="min-w-0 scroll-mt-28 rounded-card border border-line bg-white p-6 shadow-float md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>Öneri Formu</Eyebrow>
          <h2
            id="oner-formu-title"
            className="mt-3 text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-ink"
          >
            Yeni hizmet öner
          </h2>
        </div>
        <Chip>1-2 dakika</Chip>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tür *">
            <select {...bind('type')} className={inputClassName}>
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Şehir *">
            <input {...bind('city')} className={inputClassName} placeholder="Berlin" />
          </Field>
        </div>

        <Field label="Ad soyad / kurum adı *">
          <input
            {...bind('displayName')}
            className={inputClassName}
            placeholder="Örn. Ahmet Yılmaz veya Yılmaz Hukuk Bürosu"
          />
        </Field>

        <Field label="Adres">
          <input {...bind('address')} className={inputClassName} placeholder="Sokak, posta kodu, şehir" />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Telefon">
            <input {...bind('phone')} className={inputClassName} placeholder="030 123 45 67" />
          </Field>

          <Field label="Website">
            <input {...bind('website')} className={inputClassName} placeholder="https://..." />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Uzmanlık / etiket">
            <input
              {...bind('tagLabels')}
              className={inputClassName}
              placeholder="Aile hukuku, çocuk doktoru, tesisat..."
            />
          </Field>

          <Field label="Google Maps linki">
            <input
              {...bind('googleMapsUrl')}
              className={inputClassName}
              placeholder="https://maps.google.com/..."
            />
          </Field>
        </div>

        <Field label="Not">
          <textarea
            {...bind('note')}
            className={cn(inputClassName, 'h-auto min-h-32 resize-y py-3')}
            placeholder="Bildikleriniz, neden önerdiğiniz veya adminin bilmesini istediğiniz notlar..."
          />
        </Field>

        {submitMessage ? (
          <div
            role="status"
            className={cn(MESSAGE_CLASS, TONE_STYLES.green.border, TONE_STYLES.green.wash, TONE_STYLES.green.text)}
          >
            {submitMessage}
          </div>
        ) : null}

        {submitError ? (
          <div
            role="alert"
            className={cn(MESSAGE_CLASS, TONE_STYLES.red.border, TONE_STYLES.red.wash, TONE_STYLES.red.text)}
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Gönderiliyor...' : 'Öneriyi gönder'}
          </Button>
          <Button href="/hizmet-rehberi" variant="outline">
            Listeye dön
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
