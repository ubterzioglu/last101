'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
let configPromise: Promise<{ url: string; anonKey: string }> | null = null;

async function loadConfig() {
  if (configPromise) return configPromise;
  configPromise = fetch('/api/supabase-config', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('Config fetch failed: ' + res.status);
      return res.json();
    })
    .catch((e) => {
      configPromise = null;
      throw e;
    });
  return configPromise;
}

export async function getDevUserClient(): Promise<SupabaseClient> {
  if (client) return client;
  const { url, anonKey } = await loadConfig();
  if (!url || !anonKey) throw new Error('Supabase config eksik');
  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
