'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  PROVIDER_CATEGORIES,
  type Category,
  type ProviderType,
  type Provider,
  type Tag,
} from '@/lib/rehber/types';
import {
  getProvidersByCategory,
  getTagsByCategory,
  getAvailableCities,
  getCategoryStats,
} from '@/lib/rehber/data';
import {
  Search,
  MapPin,
  Filter,
  Phone,
  Mail,
  Globe,
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
  UserPlus,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  doctor: <Stethoscope className="h-5 w-5" />,
  lawyer: <Scale className="h-5 w-5" />,
  terapist: <Brain className="h-5 w-5" />,
  ebe: <UserPlus className="h-5 w-5" />,
  tamir: <Wrench className="h-5 w-5" />,
  nakliyat: <Truck className="h-5 w-5" />,
  sigorta: <Shield className="h-5 w-5" />,
  vergi_danismani: <Calculator className="h-5 w-5" />,
  berber: <Scissors className="h-5 w-5" />,
  kuafor: <Scissors className="h-5 w-5" />,
  surucu_kursu: <Car className="h-5 w-5" />,
  restaurant: <UtensilsCrossed className="h-5 w-5" />,
  cafe: <Coffee className="h-5 w-5" />,
  market: <ShoppingCart className="h-5 w-5" />,
  kasap: <Beef className="h-5 w-5" />,
  bakery: <Croissant className="h-5 w-5" />,
};

export default function HizmetRehberiPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProviderType | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);

  const loadInitialData = useCallback(async () => {
    const [statsData, allProvidersData] = await Promise.all([
      getCategoryStats(),
      getProvidersByCategory('all'),
    ]);
    setStats(statsData);
    setAllProviders(allProvidersData);
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

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadProviders();
    loadTags();
    loadCities();
  }, [loadCities, loadProviders, loadTags]);

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (selectedCity) {
      filtered = filtered.filter((provider) => provider.city === selectedCity);
    }

    if (searchQuery) {
      const query = searchQuery.toLocaleLowerCase('tr-TR');
      filtered = filtered.filter((provider) => {
        const haystack = [
          provider.name,
          provider.city,
          provider.address || '',
          provider.description || '',
        ]
          .join(' ')
          .toLocaleLowerCase('tr-TR');

        return haystack.includes(query);
      });
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((provider) => {
        const providerTagIds =
          provider.provider_tags?.map((tag) => tag.tag_id) ||
          provider.gastronomy_provider_tags?.map((tag) => tag.tag_id) ||
          [];

        return selectedTags.some((tagId) => providerTagIds.includes(tagId));
      });
    }

    return filtered;
  }, [providers, searchQuery, selectedCity, selectedTags]);

  const sidebarCounts = useMemo(() => {
    const counts: Record<string, number> = { total: 0 };
    const normalizedQuery = searchQuery.toLocaleLowerCase('tr-TR').trim();

    const matchesSharedFilters = (provider: Provider) => {
      if (selectedCity && provider.city !== selectedCity) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        provider.name,
        provider.city,
        provider.address || '',
        provider.description || '',
      ]
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      return haystack.includes(normalizedQuery);
    };

    const matchesSelectedTags = (provider: Provider) => {
      if (selectedTags.length === 0) {
        return true;
      }

      const providerTagIds =
        provider.provider_tags?.map((tag) => tag.tag_id) ||
        provider.gastronomy_provider_tags?.map((tag) => tag.tag_id) ||
        [];

      return selectedTags.some((tagId) => providerTagIds.includes(tagId));
    };

    const getCategoryKey = (type: ProviderType) => {
      if (
        type === 'tamirci_otomobil' ||
        type === 'tamirci_tesisat' ||
        type === 'tamirci_boyaci'
      ) {
        return 'tamir';
      }

      return type;
    };

    for (const provider of allProviders) {
      if (!matchesSharedFilters(provider)) {
        continue;
      }

      const categoryKey = getCategoryKey(provider.type);
      const shouldApplyTagFilter =
        selectedTags.length > 0 &&
        (selectedCategory === categoryKey ||
          (selectedCategory === 'tamir' &&
            (provider.type === 'tamirci_otomobil' ||
              provider.type === 'tamirci_tesisat' ||
              provider.type === 'tamirci_boyaci')));

      if (shouldApplyTagFilter && !matchesSelectedTags(provider)) {
        continue;
      }

      counts.total = (counts.total || 0) + 1;
      counts[categoryKey] = (counts[categoryKey] || 0) + 1;
    }

    return counts;
  }, [allProviders, searchQuery, selectedCity, selectedTags, selectedCategory]);

  const allCategories = PROVIDER_CATEGORIES;
  const featuredCategories = allCategories.slice(0, 8);
  const selectedCategoryMeta =
    PROVIDER_CATEGORIES.find((category) => category.id === selectedCategory) || null;

  const activeFilterPills = [
    selectedCity ? `Şehir: ${selectedCity}` : '',
    selectedCategoryMeta ? `Kategori: ${selectedCategoryMeta.label}` : '',
    searchQuery ? `Arama: ${searchQuery}` : '',
    selectedTags.length > 0 ? `Uzmanlık: ${selectedTags.length} seçili` : '',
  ].filter(Boolean);

  const hasActiveFilters = activeFilterPills.length > 0;

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('');
    setSearchQuery('');
    setSelectedTags([]);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
        <Section
          contained={false}
          className="relative overflow-hidden border-b border-gray-200 bg-white py-6 md:py-8"
        >
          <Container>
            <div className="flex flex-col items-center text-center">
              <div className="max-w-3xl w-full">
                <h1 className="text-4xl font-black leading-tight md:text-5xl text-gray-900">
                  Tüm Türkler
                </h1>
                <p className="mt-4 text-lg text-gray-600 mx-auto max-w-2xl">
                  Almanya'da Türkçe hizmet veren doktorlardan restoranlara, tüm uzmanları tek yerde bulun.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#rehber-arama"
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Türk Bul
                  </a>
                  <Button asChild href="/hizmet-rehberi/oneri" size="lg" className="rounded-full">
                    Türk Öner
                  </Button>
                </div>

                <div className="mt-8 flex justify-center gap-3 flex-wrap">
                  <HeroStatCard
                    icon={<Users className="h-4 w-4" />}
                    value={stats.total || 0}
                    label="Toplam"
                  />
                  <HeroStatCard
                    icon={<Stethoscope className="h-4 w-4" />}
                    value={stats.doctor || 0}
                    label="Doktor"
                  />
                  <HeroStatCard
                    icon={<Scale className="h-4 w-4" />}
                    value={stats.lawyer || 0}
                    label="Avukat"
                  />
                  <HeroStatCard
                    icon={<Store className="h-4 w-4" />}
                    value={stats.restaurant || 0}
                    label="Restoran"
                  />
                  <HeroStatCard
                    icon={<Scissors className="h-4 w-4" />}
                    value={stats.kuafor || 0}
                    label="Kuaför"
                  />
                </div>

                <div className="mt-8 flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-3 pb-2 w-full">
                  {featuredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'inline-flex whitespace-nowrap items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition shrink-0',
                        selectedCategory === category.id
                          ? 'border-google-blue bg-blue-50 text-google-blue'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {CATEGORY_ICONS[category.id]}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section contained className="py-8 md:py-10" id="rehber-arama">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-6 no-scrollbar">
              <div className="rounded-[1.8rem] border border-blue-100 bg-blue-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Listeyi büyüt
                </div>
                <h2 className="mt-3 text-xl font-bold text-gray-900">Aradığın hizmet yok mu?</h2>
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  Güvenilir bir uzman biliyorsan öner. Ekibimiz kontrol etsin, uygunsa listeye ekleyelim.
                </p>
                <Button asChild href="/hizmet-rehberi/oneri" className="mt-4 w-full rounded-full">
                  Kayıt Öner
                </Button>
              </div>

              <div className="rounded-[1.8rem] border border-gray-200 bg-white p-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="İsim, şehir, açıklama..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-google-blue focus:ring-1 focus:ring-google-blue"
                  />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-gray-200 bg-white p-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4" />
                  Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-google-blue focus:ring-1 focus:ring-google-blue"
                >
                  <option value="" className="bg-white">
                    Tüm şehirler
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[1.8rem] border border-gray-200 bg-white p-4">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter className="h-4 w-4" />
                  Kategori
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition',
                      selectedCategory === 'all'
                        ? 'border border-blue-200 bg-blue-50 text-google-blue'
                        : 'border border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className={cn("mt-0.5 rounded-xl p-2", selectedCategory === 'all' ? "bg-blue-100 text-google-blue" : "bg-gray-100 text-gray-500")}>
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">Tüm Türkler</div>
                      <div className={cn("mt-1 text-xs leading-5", selectedCategory === 'all' ? "text-blue-700" : "text-gray-500")}>
                        Hizmet ve gastronomi kayıtlarını birlikte göster
                      </div>
                    </div>
                      <div className={cn("rounded-full px-2 py-1 text-[11px]", selectedCategory === 'all' ? "bg-blue-100 text-google-blue" : "bg-gray-100 text-gray-500")}>
                      {sidebarCounts.total || stats.total || 0}
                      </div>
                  </button>
                  {allCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition',
                        selectedCategory === category.id
                          ? 'border border-blue-200 bg-blue-50 text-google-blue'
                          : 'border border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className={cn("mt-0.5 rounded-xl p-2", selectedCategory === category.id ? "bg-blue-100 text-google-blue" : "bg-gray-100 text-gray-500")}>
                        {CATEGORY_ICONS[category.id]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{category.label}</div>
                        <div className={cn("mt-1 text-xs leading-5", selectedCategory === category.id ? "text-blue-700" : "text-gray-500")}>{category.description}</div>
                      </div>
                      <div className={cn("rounded-full px-2 py-1 text-[11px]", selectedCategory === category.id ? "bg-blue-100 text-google-blue" : "bg-gray-100 text-gray-500")}>
                        {sidebarCounts[category.id] || 0}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="rounded-[1.8rem] border border-gray-200 bg-white p-4">
                  <label className="mb-3 block text-sm font-medium text-gray-700">Uzmanlık</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition border',
                          selectedTags.includes(tag.id)
                            ? 'border-google-blue bg-google-blue text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-google-blue">
                      Türk Bul
                    </div>
                    <h2 className="mt-3 text-2xl font-black md:text-3xl text-gray-900">
                      {selectedCategoryMeta?.label || 'Tüm hizmetler ve gastronomi'}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {selectedCategoryMeta?.description ||
                        'İsim, şehir ve uzmanlık filtreleriyle tüm rehberde en uygun kaydı bul.'}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-gray-100 bg-gray-50 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Sonuç</div>
                    <div className="mt-1 text-3xl font-black text-gray-900">{filteredProviders.length}</div>
                  </div>
                </div>

                {hasActiveFilters ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {activeFilterPills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {pill}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredCategories.map((category) => (
                      <button
                        key={`quick-${category.id}`}
                        onClick={() => setSelectedCategory(category.id)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center rounded-[2rem] border border-gray-200 bg-white py-24 shadow-sm">
                  <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-google-blue" />
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="rounded-[2rem] border border-gray-200 bg-white p-10 text-center md:p-14 shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl text-gray-400">
                    0
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-gray-900">Bu filtrelerle sonuç çıkmadı.</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">
                    Kategori veya şehir seçimini gevşetmeyi deneyin. Aradığınız kayıt gerçekten eksikse doğrudan öneri bırakabilirsiniz.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={clearFilters} className="rounded-full">
                      Filtreleri Sıfırla
                    </Button>
                    <Link
                      href="/hizmet-rehberi/oneri"
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Eksik hizmeti öner
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      category={
                        PROVIDER_CATEGORIES.find((category) => category.id === provider.type) || undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
    </div>
  );
}

function HeroStatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-gray-50 p-2 text-gray-500">{icon}</div>
        <div>
          <div className="text-lg font-bold text-gray-900 leading-none">{value}</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
  category,
}: {
  provider: Provider;
  category?: Category;
}) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-4 transition hover:border-google-blue shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500">
          {CATEGORY_ICONS[provider.type] || <MapPin className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                {category.label}
              </span>
            ) : null}
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-google-blue">
              {provider.city}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold text-gray-900">{provider.name}</h3>

          {provider.address ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-gray-600">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{provider.address}</span>
            </p>
          ) : null}
        </div>
      </div>

      {provider.description ? (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm leading-6 text-gray-700">{provider.description}</p>
        </div>
      ) : null}

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
        {provider.phone ? (
          <a
            href={`tel:${provider.phone}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-google-blue transition hover:bg-blue-100"
            title="Ara"
          >
            <Phone className="h-4 w-4" />
          </a>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300" title="Telefon yok">
            <Phone className="h-4 w-4" />
          </div>
        )}

        {provider.email ? (
          <a
            href={`mailto:${provider.email}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-google-green transition hover:bg-green-100"
            title="E-posta gönder"
          >
            <Mail className="h-4 w-4" />
          </a>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300" title="E-posta yok">
            <Mail className="h-4 w-4" />
          </div>
        )}

        {provider.website ? (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-google-orange transition hover:bg-orange-100"
            title="Websiteye git"
          >
            <Globe className="h-4 w-4" />
          </a>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300" title="Website yok">
            <Globe className="h-4 w-4" />
          </div>
        )}
      </div>
    </article>
  );
}
