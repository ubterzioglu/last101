'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
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
  'w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#01A1F1]';

export default function HizmetOnerClient() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

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
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] text-white">
        <Section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(246,83,20,0.14),_transparent_34%),linear-gradient(180deg,#0b0b0c_0%,#050505_100%)] py-14 md:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/72">
                  Hizmet Rehberi / Kayıt Öner
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
                  Eksik bir hizmet varsa bize bırak, birlikte rehberi büyütelim.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                  Bildiğiniz Türkçe hizmet veren bir uzmanı kısa bilgilerle önerin. Ekibimiz kontrol edip uygun
                  kaydı rehbere eklesin.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild href="/hizmet-rehberi" size="lg" className="rounded-full">
                    Hizmet ara
                  </Button>
                  <Link
                    href="#oner-formu"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.1]"
                  >
                    Forma git
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <InfoCard
                  title="Hızlı gönderim"
                  description="Ad, şehir ve tür yeterli. Elinizde fazlası varsa adres, telefon ve link de ekleyin."
                />
                <InfoCard
                  title="Admin onayı"
                  description="Öneriler önce kontrol edilir, sonra rehbere aktif kayıt olarak eklenir."
                />
                <InfoCard
                  title="Düşük sürtünme"
                  description="Uzun form yok. Eksik bilgiler sonradan admin tarafında tamamlanabilir."
                />
              </div>
            </div>
          </Container>
        </Section>

        <Section contained className="py-10 md:py-14">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)]">
            <section
              id="oner-formu"
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7fd5ff]">
                    Öneri Formu
                  </div>
                  <h2 className="mt-3 text-3xl font-black">Yeni hizmet öner</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/55">
                  1-2 dakika
                </div>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Tür *">
                    <select
                      value={form.type}
                      onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                      className={inputClassName}
                    >
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-black">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Şehir *">
                    <input
                      value={form.city}
                      onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                      className={inputClassName}
                      placeholder="Berlin"
                    />
                  </Field>
                </div>

                <Field label="Ad soyad / kurum adı *">
                  <input
                    value={form.displayName}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, displayName: event.target.value }))
                    }
                    className={inputClassName}
                    placeholder="Örn. Ahmet Yılmaz veya Yılmaz Hukuk Bürosu"
                  />
                </Field>

                <Field label="Adres">
                  <input
                    value={form.address}
                    onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                    className={inputClassName}
                    placeholder="Sokak, posta kodu, şehir"
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Telefon">
                    <input
                      value={form.phone}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className={inputClassName}
                      placeholder="030 123 45 67"
                    />
                  </Field>

                  <Field label="Website">
                    <input
                      value={form.website}
                      onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                      className={inputClassName}
                      placeholder="https://..."
                    />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Uzmanlık / etiket">
                    <input
                      value={form.tagLabels}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, tagLabels: event.target.value }))
                      }
                      className={inputClassName}
                      placeholder="Aile hukuku, çocuk doktoru, tesisat..."
                    />
                  </Field>

                  <Field label="Google Maps linki">
                    <input
                      value={form.googleMapsUrl}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, googleMapsUrl: event.target.value }))
                      }
                      className={inputClassName}
                      placeholder="https://maps.google.com/..."
                    />
                  </Field>
                </div>

                <Field label="Not">
                  <textarea
                    value={form.note}
                    onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                    className={cn(inputClassName, 'min-h-32 resize-y')}
                    placeholder="Bildikleriniz, neden önerdiğiniz veya adminin bilmesini istediğiniz notlar..."
                  />
                </Field>

                {submitMessage ? (
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {submitMessage}
                  </div>
                ) : null}

                {submitError ? (
                  <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {submitError}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center rounded-full bg-[#F65314] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c35] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Öneriyi gönder'}
                  </button>
                  <Link
                    href="/hizmet-rehberi"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/82 transition hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    Rehbere dön
                  </Link>
                </div>
              </form>
            </section>

            <aside className="space-y-4">
              <SideCard title="Nasıl işliyor?">
                Form gönderilir, admin öneriyi inceler, gerekli görürse kaydı rehbere aktif olarak ekler.
              </SideCard>
              <SideCard title="Hangi bilgiler faydalı?">
                İsim, şehir, telefon, website, uzmanlık ve varsa Google Maps linki onay sürecini hızlandırır.
              </SideCard>
              <SideCard title="Eksik bilgi sorun değil">
                Elinizde sadece isim ve şehir varsa da gönderebilirsiniz. Kalan detaylar daha sonra tamamlanabilir.
              </SideCard>
            </aside>
          </div>
        </Section>
      </main>
      <Footer />
    </>
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
      <span className="mb-2 block text-sm font-medium text-white/72">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/68">{description}</p>
    </div>
  );
}

function SideCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">{title}</div>
      <p className="mt-3 text-sm leading-7 text-white/68">{children}</p>
    </div>
  );
}
