'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { GoogleIcon } from './GoogleIcon';

type Mode = 'login' | 'register';

const MODE_TABS: { mode: Mode; label: string }[] = [
  { mode: 'login', label: 'Giriş Yap' },
  { mode: 'register', label: 'Kayıt Ol' },
];

const TAB_CLASS = 'min-h-[40px] rounded-tile border px-3 py-2 text-sm font-semibold transition-colors';
const TAB_ACTIVE = 'border-brand-700 bg-brand-50 text-brand-800';
const TAB_IDLE = 'border-transparent text-muted hover:text-ink';
const LABEL_CLASS = 'mb-1.5 block text-sm font-semibold text-ink';
const INPUT_CLASS =
  'h-11 w-full rounded-btn border border-line bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-muted hover:border-ink/30 focus:border-brand-700';
const MESSAGE_CLASS = 'rounded-btn border px-3 py-2 text-sm leading-relaxed';

interface GirisClientProps {
  next: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'E-posta veya şifre hatalı.';
    if (msg.includes('user already registered')) return 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.';
    if (msg.includes('password should be at least')) return 'Şifre en az 6 karakter olmalı.';
    if (msg.includes('email not confirmed')) return 'E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin.';
    return error.message;
  }
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
}

export default function GirisClient({ next }: GirisClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'auth'
      ? 'Giriş tamamlanamadı. Lütfen tekrar deneyin.'
      : null
  );
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.push(next);
        router.refresh();
        return;
      }

      // register
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo },
      });
      if (signUpError) throw signUpError;

      // If email confirmation is required, no active session is returned.
      if (!data.session) {
        setInfo('Kaydınız alındı! Hesabınızı etkinleştirmek için e-postanıza gönderdiğimiz doğrulama bağlantısına tıklayın.');
      } else {
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (oauthError) throw oauthError;
      // On success the browser is redirected to Google; nothing more to do here.
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      tone="light"
      title={mode === 'login' ? 'Üye Girişi' : 'Ücretsiz Üye Ol'}
      subtitle={`Almanya101 araçlarını kullanmak için ${mode === 'login' ? 'giriş yapın' : 'ücretsiz hesap oluşturun'}.`}
      heroSubtitle="Maaş hesaplama, vize seçimi, şehir uyumu ve daha fazlası: ücretsiz hesabınla hepsine eriş."
    >
      {/* Mode toggle */}
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-btn border border-line bg-white p-1">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.mode}
            type="button"
            aria-pressed={mode === tab.mode}
            onClick={() => { setMode(tab.mode); setError(null); setInfo(null); }}
            className={cn(TAB_CLASS, mode === tab.mode ? TAB_ACTIVE : TAB_IDLE)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Google */}
      <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading} className="w-full gap-3">
        <GoogleIcon />
        Google ile devam et
      </Button>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-[0.13em] text-muted">veya</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={LABEL_CLASS}>
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT_CLASS}
            placeholder="••••••••"
          />
          {mode === 'register' && (
            <p className="mt-1.5 text-xs text-muted">En az 6 karakter.</p>
          )}
        </div>

        {error && (
          <p role="alert" className={cn(MESSAGE_CLASS, TONE_STYLES.red.border, TONE_STYLES.red.wash, TONE_STYLES.red.text)}>
            {error}
          </p>
        )}
        {info && (
          <p role="status" className={cn(MESSAGE_CLASS, TONE_STYLES.green.border, TONE_STYLES.green.wash, TONE_STYLES.green.text)}>
            {info}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Lütfen bekleyin…' : mode === 'login' ? 'Giriş Yap' : 'Üye Ol'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        Üyelik tamamen ücretsizdir. Devam ederek kullanım şartlarını kabul etmiş olursunuz.
      </p>
    </AuthSplitLayout>
  );
}
