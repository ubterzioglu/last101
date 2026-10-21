import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Service role (RLS'i atlayan) Supabase client'ı için tek fabrika. Yalnızca sunucuda kullanılır;
// 'server-only' importu bu modülün yanlışlıkla client bundle'a girmesini build sırasında engeller.

const URL_ENV_NAMES = ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'] as const;
const SERVICE_KEY_ENV_NAMES = ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_SECRET_KEY'] as const;

/** Env değerindeki boşlukları ve (Coolify/.env kaynaklı) çevreleyen tırnakları temizler. */
function normalizeEnvValue(value: string | undefined): string {
  const raw = String(value ?? '').trim();
  const quoted = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"));
  return quoted ? raw.slice(1, -1).trim() : raw;
}

function readFirstEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = normalizeEnvValue(process.env[name]);
    if (value) return value;
  }
  return '';
}

export interface ServiceSupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

/** Service client için env yapılandırması; eksikse null. */
export function getServiceSupabaseConfig(): ServiceSupabaseConfig | null {
  const url = readFirstEnv(URL_ENV_NAMES);
  const serviceRoleKey = readFirstEnv(SERVICE_KEY_ENV_NAMES);
  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
}

export class ServiceClientConfigError extends Error {
  constructor() {
    super('Service not configured');
    this.name = 'ServiceClientConfigError';
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

/**
 * Service role client'ı döndürür; yapılandırma eksikse null.
 * Oturum tutmayan, durumsuz bir client olduğu için süreç içinde yeniden kullanılır.
 */
export function tryCreateServiceClient(): SupabaseClient | null {
  const config = getServiceSupabaseConfig();
  if (!config) return null;

  const configKey = `${config.url}|${config.serviceRoleKey}`;
  if (!cachedClient || cachedConfigKey !== configKey) {
    cachedClient = createClient(config.url, config.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    cachedConfigKey = configKey;
  }
  return cachedClient;
}

/** Service role client'ı döndürür; yapılandırma eksikse ServiceClientConfigError fırlatır. */
export function createServiceClient(): SupabaseClient {
  const client = tryCreateServiceClient();
  if (!client) throw new ServiceClientConfigError();
  return client;
}
