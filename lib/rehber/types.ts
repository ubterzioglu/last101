// Hizmet Rehberi ve Gastronomi Rehberi Tipleri

export type ProviderType = 
  // Hizmet Rehberi
  | 'doctor' | 'lawyer' | 'terapist' | 'ebe' | 'nakliyat' 
  | 'sigorta' | 'vergi_danismani' | 'berber' | 'kuafor' | 'surucu_kursu'
  | 'tamirci_otomobil' | 'tamirci_tesisat' | 'tamirci_boyaci' | 'tamir'
  // Gastronomi Rehberi
  | 'restaurant' | 'market' | 'kasap' | 'cafe' | 'bakery'
  // All categories
  | 'all';

export interface Provider {
  id: string;
  type: ProviderType;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  updated_at: string;
  // Joined fields
  provider_tags?: { tag_id: string }[];
  gastronomy_provider_tags?: { tag_id: string }[];
}

export interface Tag {
  id: string;
  type: ProviderType;
  label: string;
  created_at?: string;
}

export interface ProviderWithTags extends Provider {
  tags: Tag[];
}

// Kategori yapısı
export interface Category {
  id: ProviderType;
  label: string;
  icon: string;
  description: string;
  group: 'services' | 'gastronomy';
}

// Tüm kategoriler
export const PROVIDER_CATEGORIES: Category[] = [
  // Hizmet Kategorileri
  { id: 'doctor', label: 'Doktor', icon: '👨‍⚕️', description: 'Türkçe konuşan doktorlar', group: 'services' },
  { id: 'lawyer', label: 'Avukat', icon: '⚖️', description: 'Türkçe konuşan avukatlar', group: 'services' },
  { id: 'terapist', label: 'Terapist', icon: '🧠', description: 'Psikolog ve terapistler', group: 'services' },
  { id: 'ebe', label: 'Ebe/Hemşire', icon: '👩‍⚕️', description: 'Sağlık personeli', group: 'services' },
  { id: 'tamir', label: 'Tamirci', icon: '🔧', description: 'Tesisat, boyacı, tamirci', group: 'services' },
  { id: 'nakliyat', label: 'Nakliyat', icon: '🚚', description: 'Taşımacılık hizmetleri', group: 'services' },
  { id: 'sigorta', label: 'Sigortacı', icon: '🛡️', description: 'Sigorta danışmanları', group: 'services' },
  { id: 'vergi_danismani', label: 'Vergi Danışmanı', icon: '📊', description: 'Mali müşavirler', group: 'services' },
  { id: 'berber', label: 'Berber', icon: '✂️', description: 'Erkek kuaförleri', group: 'services' },
  { id: 'kuafor', label: 'Kuaför', icon: '💇‍♀️', description: 'Kadın kuaförleri', group: 'services' },
  { id: 'surucu_kursu', label: 'Sürücü Kursu', icon: '🚗', description: 'Ehliyet kursları', group: 'services' },
  
  // Gastronomi Kategorileri
  { id: 'restaurant', label: 'Restoran', icon: '🍽️', description: 'Türk restoranları', group: 'gastronomy' },
  { id: 'cafe', label: 'Kafe', icon: '☕', description: 'Kafeler', group: 'gastronomy' },
  { id: 'market', label: 'Market', icon: '🛒', description: 'Türk marketleri', group: 'gastronomy' },
  { id: 'kasap', label: 'Kasap', icon: '🥩', description: 'Kasaplar', group: 'gastronomy' },
  { id: 'bakery', label: 'Fırın/Pastane', icon: '🥐', description: 'Fırın ve pastaneler', group: 'gastronomy' },
];

// Tamirci alt kategorileri (eski sistemden gelen)
export const TAMIRCI_SUBTYPES = [
  { id: 'tamirci_otomobil', label: '🚗 Otomobil Tamircisi' },
  { id: 'tamirci_tesisat', label: '🔧 Tesisatçı' },
  { id: 'tamirci_boyaci', label: '🎨 Boyacı' },
];

// Eyalet listesi
export const GERMAN_STATES = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
];

// Arama parametreleri
export interface SearchFilters {
  category: ProviderType | 'all';
  city: string;
  searchQuery: string;
  selectedTags: string[];
}
