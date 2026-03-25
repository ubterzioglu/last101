'use client';

const ADMIN_AUTH_STORAGE_KEY = 'dad_admin_auth_v1';

export interface StoredAdminAuth {
  email: string;
  password: string;
}

export function saveAdminAuth(password: string, email = 'admin@almanya101.de') {
  if (typeof window === 'undefined') return;
  const auth = { email: String(email || '').trim().toLowerCase(), password: String(password || '') };
  sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function loadAdminAuth(): StoredAdminAuth {
  if (typeof window === 'undefined') return { email: '', password: '' };

  try {
    const parsed = JSON.parse(sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) || '{}');
    return {
      email: String(parsed?.email || '').trim().toLowerCase(),
      password: String(parsed?.password || ''),
    };
  } catch {
    return { email: '', password: '' };
  }
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export function getAdminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const current = loadAdminAuth();
  return {
    ...extra,
    'x-admin-key': current.password,
    'x-admin-email': current.email,
    'x-admin-password': current.password,
  };
}

export async function verifyAdminKey(password: string): Promise<true> {
  const response = await fetch('/api/admin-auth-verify', {
    method: 'GET',
    headers: { Accept: 'application/json', 'x-admin-key': String(password || '').trim() },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('Şifre hatalı.');
    throw new Error(payload.error || `Admin doğrulama başarısız (${response.status})`);
  }
  return true;
}
