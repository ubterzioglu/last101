// Hizmet Rehberi - Supabase Data Fetching
// Birleşik model: tek `providers` tablosu, `type` ile yönetilir (hizmet + gastronomi).
// Tag'ler tek `tags` tablosundan `type` ile gelir, ilişki `provider_tags`.

import { createClient } from '@/lib/supabase/client';
import type { Provider, Tag, ProviderType } from './types';

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient && typeof window !== 'undefined') {
    supabaseClient = createClient();
  }
  return supabaseClient!;
}

// Tamirci alt tipleri tek "tamir" kategorisinde toplanır.
const TAMIRCI_TYPES: ProviderType[] = ['tamirci_otomobil', 'tamirci_tesisat', 'tamirci_boyaci'];

type ProviderRow = {
  id: string;
  type: ProviderType;
  city: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  appointment_url?: string | null;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  updated_at: string;
  name?: string | null;
  display_name?: string | null;
  description?: string | null;
  notes_public?: string | null;
  region?: string | null;
  country_code?: string | null;
  languages?: string[] | null;
  services?: string[] | null;
  source?: 'manual' | 'submission' | 'scraper' | null;
  relevance_score?: number | null;
  provider_tags?: { tag_id: string }[];
};

function normalizeProviders(rows: ProviderRow[] | null | undefined): Provider[] {
  if (!rows) return [];

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name ?? row.display_name ?? '',
    city: row.city ?? '',
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    appointment_url: row.appointment_url ?? undefined,
    description: row.description ?? row.notes_public ?? undefined,
    region: row.region ?? undefined,
    country_code: row.country_code ?? undefined,
    languages: row.languages ?? undefined,
    services: row.services ?? undefined,
    source: row.source ?? undefined,
    relevance_score: row.relevance_score ?? null,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    provider_tags: row.provider_tags,
  }));
}

const PROVIDER_SELECT = `
  *,
  provider_tags(tag_id)
` as const;

/**
 * Kategoriye göre sağlayıcıları getir (tek providers tablosu, type ile).
 * 'all' -> tüm aktif kayıtlar; 'tamir' -> tamirci alt tipleri; diğer -> tek type.
 */
export async function getProvidersByCategory(
  category: ProviderType | 'all',
  city?: string
): Promise<Provider[]> {
  let query = getSupabase()
    .from('providers')
    .select(PROVIDER_SELECT)
    .eq('status', 'active');

  if (category === 'tamir') {
    query = query.in('type', TAMIRCI_TYPES);
  } else if (category !== 'all') {
    query = query.eq('type', category);
  }

  if (city && city !== 'all') {
    query = query.eq('city', city);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
  return normalizeProviders(data as ProviderRow[]);
}

/** Geriye dönük uyum: hizmet kategorisi tek getter. */
export async function getServiceProviders(type: ProviderType, city?: string) {
  return getProvidersByCategory(type, city);
}

/** Geriye dönük uyum: gastronomi de aynı tablodan gelir. */
export async function getGastronomyProviders(type: ProviderType, city?: string) {
  return getProvidersByCategory(type, city);
}

/** Geriye dönük uyum: tamirci alt tipleri. */
export async function getTamirciProviders(city?: string) {
  return getProvidersByCategory('tamir', city);
}

/**
 * Kategoriye göre etiketleri getir (tek tags tablosu, type ile).
 */
export async function getTagsByCategory(category: ProviderType): Promise<Tag[]> {
  if (category === 'all') return [];

  const types = category === 'tamir' ? TAMIRCI_TYPES : [category];
  const { data, error } = await getSupabase()
    .from('tags')
    .select('*')
    .in('type', types);

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  return (data ?? []) as Tag[];
}

/** Geriye dönük uyum. */
export async function getServiceTags(type: ProviderType) {
  return getTagsByCategory(type);
}
export async function getGastronomyTags(type: ProviderType) {
  return getTagsByCategory(type);
}

/**
 * Kullanılabilir şehirleri getir (tek providers tablosu).
 */
export async function getAvailableCities(category?: ProviderType): Promise<string[]> {
  let query = getSupabase()
    .from('providers')
    .select('city')
    .eq('status', 'active')
    .order('city');

  if (category && category !== 'all') {
    if (category === 'tamir') query = query.in('type', TAMIRCI_TYPES);
    else query = query.eq('type', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  const cities = [...new Set((data ?? []).map((item) => item.city as string))];
  return cities.filter(Boolean).sort();
}

/**
 * Kategoriye göre istatistikleri getir (tek providers tablosu).
 */
export async function getCategoryStats(): Promise<Record<string, number>> {
  const { data, error } = await getSupabase()
    .from('providers')
    .select('type')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching stats:', error);
    return {};
  }

  const stats: Record<string, number> = {};
  for (const item of (data ?? []) as { type: string }[]) {
    stats[item.type] = (stats[item.type] || 0) + 1;
    // Tamirci alt tiplerini tek "tamir" altında da topla.
    if (TAMIRCI_TYPES.includes(item.type as ProviderType)) {
      stats['tamir'] = (stats['tamir'] || 0) + 1;
    }
  }
  stats['total'] = (data ?? []).length;
  return stats;
}

/**
 * Tüm aktif sağlayıcıları arama indeksi için getir (tek providers tablosu).
 */
export async function getAllProvidersForSearch(): Promise<Provider[]> {
  const { data, error } = await getSupabase()
    .from('providers')
    .select(PROVIDER_SELECT)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching providers for search:', error);
    return [];
  }
  return normalizeProviders(data as ProviderRow[]);
}
