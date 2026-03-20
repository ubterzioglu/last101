'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { 
  PROVIDER_CATEGORIES, 
  GERMAN_STATES, 
  TAMIRCI_SUBTYPES,
  type ProviderType,
  type Provider,
  type Tag 
} from '@/lib/rehber/types';
import { 
  getProvidersByCategory, 
  getTagsByCategory,
  getAvailableCities,
  getCategoryStats 
} from '@/lib/rehber/data';
import { 
  Search, 
  MapPin, 
  Filter, 
  Phone, 
  Mail, 
  Globe, 
  Building2,
  Users,
  Store,
  UtensilsCrossed,
  Stethoscope,
  Scale,
  Wrench,
  Truck,
  Shield,
  Calculator,
  Scissors,
  Car,
  Coffee,
  ShoppingCart,
  Beef,
  Croissant,
  Brain,
  UserPlus
} from 'lucide-react';

// Kategori ikonları
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  doctor: <Stethoscope className="w-6 h-6" />,
  lawyer: <Scale className="w-6 h-6" />,
  terapist: <Brain className="w-6 h-6" />,
  ebe: <UserPlus className="w-6 h-6" />,
  tamir: <Wrench className="w-6 h-6" />,
  nakliyat: <Truck className="w-6 h-6" />,
  sigorta: <Shield className="w-6 h-6" />,
  vergi_danismani: <Calculator className="w-6 h-6" />,
  berber: <Scissors className="w-6 h-6" />,
  kuafor: <Scissors className="w-6 h-6" />,
  surucu_kursu: <Car className="w-6 h-6" />,
  restaurant: <UtensilsCrossed className="w-6 h-6" />,
  cafe: <Coffee className="w-6 h-6" />,
  market: <ShoppingCart className="w-6 h-6" />,
  kasap: <Beef className="w-6 h-6" />,
  bakery: <Croissant className="w-6 h-6" />,
};

export default function HizmetRehberiPage() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<ProviderType | 'all'>('doctor');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'gastronomy'>('services');

  // İlk yükleme

  // Kategori değiştiğinde verileri yükle

  const loadInitialData = useCallback(async () => {
    const statsData = await getCategoryStats();
    setStats(statsData);
    setLoading(false);
  }, []);

  const loadProviders = useCallback(async () => {
    setLoading(true);
    const data = await getProvidersByCategory(selectedCategory, selectedCity || undefined);
    setProviders(data);
    setLoading(false);
  }, [selectedCategory, selectedCity]);

  const loadTags = useCallback(async () => {
    if (selectedCategory === 'all') {
      setTags([]);
      return;
    }
    const data = await getTagsByCategory(selectedCategory);
    setTags(data);
  }, [selectedCategory]);

  const loadCities = useCallback(async () => {
    const data = await getAvailableCities(selectedCategory === 'all' ? undefined : selectedCategory);
    setCities(data);
  }, [selectedCategory]);

  // Ä°lk yÃ¼kleme
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Kategori deÄŸiÅŸtiÄŸinde verileri yÃ¼kle
  useEffect(() => {
    loadProviders();
    loadTags();
    loadCities();
  }, [loadCities, loadProviders, loadTags]);

  // Filtreleme
  const filteredProviders = useMemo(() => {
    let filtered = providers;

    // Şehir filtresi
    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Etiket filtresi
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => {
        const providerTagIds = p.provider_tags?.map(t => t.tag_id) || 
                              p.gastronomy_provider_tags?.map(t => t.tag_id) || [];
        return selectedTags.some(tagId => providerTagIds.includes(tagId));
      });
    }

    return filtered;
  }, [providers, selectedCity, searchQuery, selectedTags]);

  // Tab değiştiğinde kategori değiştir
  const handleTabChange = (tab: 'services' | 'gastronomy') => {
    setActiveTab(tab);
    setSelectedCategory(tab === 'services' ? 'doctor' : 'restaurant');
    setSelectedCity('');
    setSearchQuery('');
    setSelectedTags([]);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const serviceCategories = PROVIDER_CATEGORIES.filter(c => c.group === 'services');
  const gastronomyCategories = PROVIDER_CATEGORIES.filter(c => c.group === 'gastronomy');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero */}
        <Section className="bg-gradient-to-br from-[#01A1F1] to-[#0077B6] py-12">
          <Container>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Türk Hizmet Rehberi
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Almanya'da Türkçe hizmet veren doktorlardan restoranlara,<br className="hidden md:block" />
                tüm uzmanları tek yerde bulun.
              </p>
              
              {/* İstatistikler */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <StatCard 
                  icon={<Users className="w-5 h-5" />}
                  value={stats['total'] || 0}
                  label="Toplam Kayıt"
                />
                <StatCard 
                  icon={<Building2 className="w-5 h-5" />}
                  value={stats['doctor'] || 0}
                  label="Doktor"
                />
                <StatCard 
                  icon={<Store className="w-5 h-5" />}
                  value={stats['restaurant'] || 0}
                  label="Restoran"
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Tab Seçimi */}
        <div className="bg-[#0b0b0c] border-b border-white/10">
          <Container>
            <div className="flex gap-1 p-2">
              <button
                onClick={() => handleTabChange('services')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                  activeTab === 'services' 
                    ? 'bg-[#F65314] text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Users className="w-4 h-4" />
                Hizmet Rehberi
              </button>
              <button
                onClick={() => handleTabChange('gastronomy')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                  activeTab === 'gastronomy' 
                    ? 'bg-[#FF9900] text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <UtensilsCrossed className="w-4 h-4" />
                Gastronomi Rehberi
              </button>
            </div>
          </Container>
        </div>

        <Section contained className="py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sol Sidebar - Filtreler */}
            <div className="lg:col-span-1 space-y-6">
              {/* Arama */}
              <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
                <label className="text-sm text-white/70 mb-2 block">Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="İsim, şehir..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Şehir Filtresi */}
              <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
                <label className="text-sm text-white/70 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="" className="bg-gray-800">Tüm Şehirler</option>
                  {cities.map(city => (
                    <option key={city} value={city} className="bg-gray-800">{city}</option>
                  ))}
                </select>
              </div>

              {/* Kategoriler */}
              <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
                <label className="text-sm text-white/70 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Kategori
                </label>
                <div className="space-y-2">
                  {(activeTab === 'services' ? serviceCategories : gastronomyCategories).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                        selectedCategory === cat.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-xs text-white/40">{cat.description}</div>
                      </div>
                      {stats[cat.id] > 0 && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {stats[cat.id]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Etiketler */}
              {tags.length > 0 && (
                <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
                  <label className="text-sm text-white/70 mb-3 block">Uzmanlık</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                          selectedTags.includes(tag.id)
                            ? 'bg-[#F65314] text-white'
                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ İçerik - Liste */}
            <div className="lg:col-span-3">
              {/* Sonuç Başlığı */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {PROVIDER_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Tümü'}
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    {filteredProviders.length} kayıt bulundu
                  </p>
                </div>
                {(selectedCity || searchQuery || selectedTags.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCity('');
                      setSearchQuery('');
                      setSelectedTags([]);
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    Filtreleri Temizle
                  </Button>
                )}
              </div>

              {/* Liste */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-white mb-2">Sonuç bulunamadı</h3>
                  <p className="text-sm text-white/50">
                    Farklı bir kategori veya şehir seçmeyi deneyin.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredProviders.map(provider => (
                    <ProviderCard 
                      key={provider.id} 
                      provider={provider}
                      category={PROVIDER_CATEGORIES.find(c => c.id === provider.type)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

// İstatistik Kartı
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="text-white/80">{icon}</div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-white/60">{label}</div>
      </div>
    </div>
  );
}

// Sağlayıcı Kartı
function ProviderCard({ provider, category }: { provider: Provider; category?: { icon: string; label: string } }) {
  return (
    <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
          {category?.icon || '📍'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{provider.name}</h3>
          <p className="text-sm text-white/50 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {provider.city}
          </p>
          {provider.address && (
            <p className="text-xs text-white/40 mt-1 line-clamp-1">{provider.address}</p>
          )}
        </div>
      </div>

      {provider.description && (
        <p className="text-sm text-white/60 mt-4 line-clamp-2">{provider.description}</p>
      )}

      {/* İletişim Bilgileri */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/80 transition-colors"
          >
            <Phone className="w-3 h-3" />
            Ara
          </a>
        )}
        {provider.email && (
          <a
            href={`mailto:${provider.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/80 transition-colors"
          >
            <Mail className="w-3 h-3" />
            E-posta
          </a>
        )}
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/80 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Website
          </a>
        )}
      </div>
    </div>
  );
}
