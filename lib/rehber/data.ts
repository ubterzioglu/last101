// Hizmet Rehberi - Supabase Data Fetching

import { createClient } from '@/lib/supabase/client';
import type { Provider, Tag, ProviderWithTags, ProviderType } from './types';

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient && typeof window !== 'undefined') {
    supabaseClient = createClient();
  }
  return supabaseClient!;
}

// Eski sistemdeki tablolar:
// - providers (hizmet rehberi)
// - provider_tags (hizmet etiketleri ilişki)
// - tags (hizmet etiketleri)
// - gastronomy_providers (gastronomi)
// - gastronomy_provider_tags (gastronomi etiketleri ilişki)
// - gastronomy_tags (gastronomi etiketleri)

/**
 * Hizmet rehberi sağlayıcılarını getir
 */
export async function getServiceProviders(type: ProviderType, city?: string) {
  let query = getSupabase()
    .from('providers')
    .select(`
      *,
      provider_tags(tag_id)
    `)
    .eq('type', type)
    .eq('status', 'active');

  if (city && city !== 'all') {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching service providers:', error);
    return [];
  }

  return data as Provider[];
}

/**
 * Gastronomi sağlayıcılarını getir
 */
export async function getGastronomyProviders(type: ProviderType, city?: string) {
  let query = getSupabase()
    .from('gastronomy_providers')
    .select(`
      *,
      gastronomy_provider_tags(tag_id)
    `)
    .eq('type', type)
    .eq('status', 'active');

  if (city && city !== 'all') {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gastronomy providers:', error);
    return [];
  }

  return data as Provider[];
}

/**
 * Tamirci kategorisi için özel sorgu (3 farklı tip)
 */
export async function getTamirciProviders(city?: string) {
  const tamirciTypes = ['tamirci_otomobil', 'tamirci_tesisat', 'tamirci_boyaci'];
  
  let query = getSupabase()
    .from('providers')
    .select(`
      *,
      provider_tags(tag_id)
    `)
    .in('type', tamirciTypes)
    .eq('status', 'active');

  if (city && city !== 'all') {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tamirci providers:', error);
    return [];
  }

  return data as Provider[];
}

/**
 * Kategoriye göre sağlayıcıları getir (hem hizmet hem gastronomi)
 */
export async function getProvidersByCategory(
  category: ProviderType | 'all', 
  city?: string
): Promise<Provider[]> {
  if (category === 'all') {
    // Tüm kategorileri getir
    const [services, gastronomy, tamirci] = await Promise.all([
      getServiceProviders('doctor', city),
      getGastronomyProviders('restaurant', city),
      getTamirciProviders(city),
    ]);
    return [...services, ...gastronomy, ...tamirci];
  }

  // Gastronomi kategorileri
  if (['restaurant', 'market', 'kasap', 'cafe', 'bakery'].includes(category)) {
    return getGastronomyProviders(category, city);
  }

  // Tamirci kategorisi
  if (category === 'tamir') {
    return getTamirciProviders(city);
  }

  // Diğer hizmet kategorileri
  return getServiceProviders(category, city);
}

/**
 * Hizmet etiketlerini getir
 */
export async function getServiceTags(type: ProviderType) {
  const { data, error } = await getSupabase()
    .from('tags')
    .select('*')
    .eq('type', type);

  if (error) {
    console.error('Error fetching service tags:', error);
    return [];
  }

  return data as Tag[];
}

/**
 * Gastronomi etiketlerini getir
 */
export async function getGastronomyTags(type: ProviderType) {
  const { data, error } = await getSupabase()
    .from('gastronomy_tags')
    .select('*')
    .eq('type', type);

  if (error) {
    console.error('Error fetching gastronomy tags:', error);
    return [];
  }

  return data as Tag[];
}

/**
 * Kategoriye göre etiketleri getir
 */
export async function getTagsByCategory(category: ProviderType): Promise<Tag[]> {
  if (category === 'all') return [];

  // Gastronomi kategorileri
  if (['restaurant', 'market', 'kasap', 'cafe', 'bakery'].includes(category)) {
    return getGastronomyTags(category);
  }

  // Hizmet kategorileri
  return getServiceTags(category);
}

/**
 * Kullanılabilir şehirleri getir
 */
export async function getAvailableCities(category?: ProviderType) {
  const table = category && ['restaurant', 'market', 'kasap', 'cafe', 'bakery'].includes(category)
    ? 'gastronomy_providers'
    : 'providers';

  const { data, error } = await getSupabase()
    .from(table)
    .select('city')
    .eq('status', 'active')
    .order('city');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Benzersiz şehirleri döndür
  const cities = [...new Set(data?.map(item => item.city) || [])];
  return cities.filter(Boolean).sort();
}

/**
 * Kategoriye göre istatistikleri getir
 */
export async function getCategoryStats() {
  // Hizmet sağlayıcıları
  const { data: serviceData, error: serviceError } = await getSupabase()
    .from('providers')
    .select('type', { count: 'exact' })
    .eq('status', 'active');

  // Gastronomi sağlayıcıları
  const { data: gastroData, error: gastroError } = await getSupabase()
    .from('gastronomy_providers')
    .select('type', { count: 'exact' })
    .eq('status', 'active');

  if (serviceError || gastroError) {
    console.error('Error fetching stats:', serviceError || gastroError);
    return {};
  }

  // İstatistikleri hesapla
  const stats: Record<string, number> = {};

  serviceData?.forEach((item: { type: string }) => {
    stats[item.type] = (stats[item.type] || 0) + 1;
  });

  gastroData?.forEach((item: { type: string }) => {
    stats[item.type] = (stats[item.type] || 0) + 1;
  });

  // Toplam
  const totalService = serviceData?.length || 0;
  const totalGastro = gastroData?.length || 0;
  stats['total'] = totalService + totalGastro;

  return stats;
}

/**
 * Tüm sağlayıcıları arama indeksi için getir
 */
export async function getAllProvidersForSearch() {
  const [serviceProviders, gastroProviders] = await Promise.all([
    getSupabase().from('providers').select('*').eq('status', 'active'),
    getSupabase().from('gastronomy_providers').select('*').eq('status', 'active'),
  ]);

  const services = serviceProviders.data?.map(p => ({ ...p, source: 'service' })) || [];
  const gastronomy = gastroProviders.data?.map(p => ({ ...p, source: 'gastronomy' })) || [];

  return [...services, ...gastronomy] as (Provider & { source: string })[];
}
