/**
 * Analitik izin (consent) deposu.
 *
 * Google Analytics, GoatCounter ve Microsoft Clarity yalnızca açık izin
 * sonrasında yüklenir. Tercih localStorage'da saklanır; ret, değişiklik ve
 * geri alma desteklenir. Bu modül yalnızca tarayıcıda anlamlıdır ve
 * sunucu bileşenlerinden import edilmemelidir.
 */
export const CONSENT_STORAGE_KEY = 'a101-analitik-izin';
export const CONSENT_EVENT = 'a101-analitik-izin-degisti';

export type ConsentState = {
  analytics: boolean;
  decidedAt: string;
};

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed?.analytics !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): void {
  if (typeof window === 'undefined') return;

  const state: ConsentState = { analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Depolama kullanılamıyorsa tercih yalnızca bu oturum için geçerli olur.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // yoksay
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
