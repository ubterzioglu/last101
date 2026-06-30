'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

type Mode = 'login' | 'register';

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
      title={mode === 'login' ? 'Üye Girişi' : 'Ücretsiz Üye Ol'}
      subtitle={`Almanya101 araçlarını kullanmak için ${mode === 'login' ? 'giriş yapın' : 'ücretsiz hesap oluşturun'}.`}
      accent="blue"
      heroSubtitle="Maaş hesaplama, vize seçimi, şehir uyumu ve daha fazlası — ücretsiz hesabınla hepsine eriş."
    >
      {/* Mode toggle */}
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-black/40 p-1">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(null); setInfo(null); }}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'login' ? 'bg-google-blue text-white' : 'text-white/60 hover:text-white'
          )}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(null); setInfo(null); }}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            mode === 'register' ? 'bg-google-blue text-white' : 'text-white/60 hover:text-white'
          )}
        >
          Kayıt Ol
        </button>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-white/15 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-50"
      >
        <GoogleIcon />
        Google ile devam et
      </button>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wider text-white/40">veya</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-google-blue"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
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
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-google-blue"
            placeholder="••••••••"
          />
          {mode === 'register' && (
            <p className="mt-1.5 text-xs text-white/40">En az 6 karakter.</p>
          )}
        </div>

        {error && (
          <p className="rounded-md border border-google-red/40 bg-google-red/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-md border border-google-green/40 bg-google-green/10 px-3 py-2 text-sm text-green-200">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-google-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Lütfen bekleyin…' : mode === 'login' ? 'Giriş Yap' : 'Üye Ol'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-white/40">
        Üyelik tamamen ücretsizdir. Devam ederek kullanım şartlarını kabul etmiş olursunuz.
      </p>
    </AuthSplitLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
