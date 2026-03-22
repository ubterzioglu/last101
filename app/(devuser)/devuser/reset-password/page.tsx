'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { getDevUserClient } from '@/lib/supabase/devuser';

const css = `
  .rp-container {
    max-width: 480px;
    margin: 40px auto;
    padding: 0 20px;
  }
  .rp-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 28px;
    backdrop-filter: blur(20px);
    margin-bottom: 24px;
    text-align: center;
  }
  .rp-hero-domain {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .rp-card h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin: 8px 0 0 0;
  }
  .rp-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  .rp-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
  }
  .rp-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 24px 0;
    line-height: 1.6;
  }
  .rp-form-group {
    margin-bottom: 20px;
    text-align: left;
  }
  .rp-form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }
  .rp-form-group input {
    width: 100%;
    padding: 14px 16px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .rp-form-group input:focus {
    outline: none;
    border-color: #F65314;
    box-shadow: 0 0 0 3px rgba(246, 83, 20, 0.2);
  }
  .rp-strength-track {
    height: 4px;
    background: #333;
    border-radius: 2px;
    margin-top: 8px;
    overflow: hidden;
  }
  .rp-strength-bar {
    height: 100%;
    width: 0;
    border-radius: 2px;
    transition: all 0.3s;
  }
  .rp-strength-bar.weak { background: #ef4444; width: 33%; }
  .rp-strength-bar.medium { background: #f59e0b; width: 66%; }
  .rp-strength-bar.strong { background: #10b981; width: 100%; }
  .rp-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 6px;
  }
  .rp-btn {
    display: inline-block;
    padding: 16px 24px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 100%);
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    transition: opacity 0.2s;
    border: none;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }
  .rp-btn:hover:not(:disabled) { opacity: 0.88; }
  .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .rp-back-link {
    display: inline-block;
    margin-top: 20px;
    color: #F65314;
    text-decoration: none;
    font-size: 14px;
  }
  .rp-back-link:hover { text-decoration: underline; }
  .rp-status {
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    text-align: left;
  }
  .rp-status.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
  }
  .rp-status.error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }
  .rp-status.info {
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #60a5fa;
  }
`;

type Step = 'no-token' | 'form' | 'success' | 'error';
type Strength = '' | 'weak' | 'medium' | 'strong';

function getPasswordStrength(password: string): Strength {
  if (!password) return '';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('no-token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState<Strength>('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('Bir hata oluştu. Lütfen tekrar deneyin.');
  const codeRef = useRef<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    const code = urlParams.get('code');
    const type = urlParams.get('type');

    const hasToken =
      hash.includes('access_token=') ||
      hash.includes('type=recovery') ||
      (code !== null && type === 'recovery');

    if (!hasToken) {
      setStep('no-token');
      return;
    }

    codeRef.current = code;
    setStep('form');

    if (code && type === 'recovery') {
      getDevUserClient()
        .then((client) =>
          client.auth.exchangeCodeForSession(code)
        )
        .then(({ error }) => {
          if (error) {
            setStatus({
              message: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen yeni bir şifre sıfırlama isteği gönderin.',
              type: 'error',
            });
            setStep('no-token');
          }
        })
        .catch(() => {
          setStatus({ message: 'Oturum başlatılamadı. Lütfen bağlantıyı kontrol edin.', type: 'error' });
        });
    }
  }, []);

  function handlePasswordChange(value: string) {
    setPassword(value);
    setStrength(getPasswordStrength(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (password.length < 6) {
      setStatus({ message: 'Şifre en az 6 karakter olmalıdır.', type: 'error' });
      return;
    }
    if (password !== confirm) {
      setStatus({ message: 'Şifreler eşleşmiyor.', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const client = await getDevUserClient();

      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error(
          'Oturum bulunamadı. Lütfen şifre sıfırlama bağlantınızı kontrol edin veya yeni bir istek gönderin.'
        );
      }

      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;

      setStep('success');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Şifre güncellenemedi. Lütfen tekrar deneyin.';
      setErrorText(message);
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <DevUserShell
        title="de tr software dashboard"
        backHref="/devuser/dev"
        backLabel="← dashboard'a dön"
        frameVariant="compact"
      >
        <div className="rp-container">
          {/* Hero */}
          <div className="rp-card" style={{ marginBottom: 24 }}>
            <div className="rp-hero-domain">almanya101.de</div>
            <h3>Şifre Sıfırlama</h3>
          </div>

          {/* No token */}
          {step === 'no-token' && (
            <div className="rp-card">
              {status && <div className={`rp-status ${status.type}`}>{status.message}</div>}
              <div className="rp-icon">⚠️</div>
              <h2 className="rp-title">Geçersiz Bağlantı</h2>
              <p className="rp-text">
                Şifre sıfırlama bağlantınız geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama
                isteği gönderin.
              </p>
              <Link href="/devuser/devuser/list" className="rp-btn">
                Giriş Sayfasına Dön
              </Link>
            </div>
          )}

          {/* New password form */}
          {step === 'form' && (
            <div className="rp-card">
              <div className="rp-icon">🔐</div>
              <h2 className="rp-title">Yeni Şifre Belirle</h2>
              <p className="rp-text">Hesabınız için yeni bir şifre oluşturun.</p>

              {status && <div className={`rp-status ${status.type}`}>{status.message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="rp-form-group">
                  <label htmlFor="newPassword">Yeni Şifre</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <div className="rp-strength-track">
                    <div className={`rp-strength-bar ${strength}`} />
                  </div>
                  <div className="rp-hint">En az 8 karakter, büyük/küçük harf ve rakam içermeli</div>
                </div>

                <div className="rp-form-group">
                  <label htmlFor="confirmPassword">Şifre Tekrar</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>

                <button type="submit" className="rp-btn" disabled={submitting}>
                  {submitting ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
                </button>
              </form>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="rp-card">
              <div className="rp-icon">✅</div>
              <h2 className="rp-title">Şifre Güncellendi!</h2>
              <p className="rp-text">
                Şifreniz başarıyla güncellendi. Şimdi yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <Link href="/devuser/devuser/list" className="rp-btn">
                Giriş Yap
              </Link>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="rp-card">
              <div className="rp-icon">❌</div>
              <h2 className="rp-title">İşlem Başarısız</h2>
              <p className="rp-text">{errorText}</p>
              <Link href="/devuser/devuser/list" className="rp-btn">
                Giriş Sayfasına Dön
              </Link>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link href="/devuser/devuser/list" className="rp-back-link">
              ← Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </DevUserShell>
    </>
  );
}
