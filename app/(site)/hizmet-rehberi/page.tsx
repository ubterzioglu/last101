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

  const [providers, setProviders] = useState<Provider[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#050505] text-white">
        <Section
          contained={false}
          className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(246,83,20,0.14),_transparent_34%),linear-gradient(180deg,#0b0b0c_0%,#050505_100%)] py-14 md:py-20"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                  Türk Hizmet Rehberi
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
                  Aradığın hizmeti daha hızlı bul, eksik kaydı tek tıkla öner.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                  Almanya&apos;da Türkçe hizmet veren doktor, avukat, terapist, restoran ve daha fazlasını
                  sade filtrelerle bul. Aradığın kayıt yoksa rehberi birlikte büyütelim.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild href="/hizmet-rehberi/oneri" size="lg" className="rounded-full">
                    Hizmet Öner
                  </Button>
                  <a
                    href="#rehber-arama"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.1]"
                  >
                    Rehber Ara
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {featuredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                        selectedCategory === category.id
                          ? 'border-white/35 bg-white/15 text-white'
                          : 'border-white/12 bg-white/[0.03] text-white/72 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                      )}
                    >
                      {CATEGORY_ICONS[category.id]}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <HeroStatCard
                  icon={<Users className="h-5 w-5" />}
                  value={stats.total || 0}
                  label="Toplam kayıt"
                />
                <HeroStatCard
                  icon={<Scale className="h-5 w-5" />}
                  value={stats.lawyer || 0}
                  label="Avukat"
                />
                <HeroStatCard
                  icon={<Store className="h-5 w-5" />}
                  value={stats.restaurant || 0}
                  label="Restoran"
                />
              </div>
            </div>
          </Container>
        </Section>

        <Section contained className="py-8 md:py-10" id="rehber-arama">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.8rem] border border-[#01A1F1]/20 bg-[linear-gradient(145deg,rgba(1,161,241,0.14),rgba(246,83,20,0.12))] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Rehberi büyüt
                </div>
                <h2 className="mt-3 text-xl font-bold text-white">Aradığın hizmet yok mu?</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Güvenilir bir uzman biliyorsan öner. Ekibimiz kontrol etsin, uygunsa rehbere ekleyelim.
                </p>
                <Button asChild href="/hizmet-rehberi/oneri" className="mt-4 w-full rounded-full">
                  Kayıt Öner
                </Button>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-[#0b0b0c] p-4">
                <label className="mb-2 block text-sm font-medium text-white/70">Ara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="İsim, şehir, açıklama..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/30"
                  />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-[#0b0b0c] p-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                  <MapPin className="h-4 w-4" />
                  Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-white/30"
                >
                  <option value="" className="bg-black">
                    Tüm şehirler
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-black">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-[#0b0b0c] p-4">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white/70">
                  <Filter className="h-4 w-4" />
                  Kategori
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition',
                      selectedCategory === 'all'
                        ? 'border border-white/15 bg-white/[0.10] text-white'
                        : 'border border-transparent bg-white/[0.02] text-white/62 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <div className="mt-0.5 rounded-xl bg-white/[0.06] p-2 text-white">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">Tüm Rehber</div>
                      <div className="mt-1 text-xs leading-5 text-white/42">
                        Hizmet ve gastronomi kayıtlarını birlikte göster
                      </div>
                    </div>
                    <div className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-white/65">
                      {stats.total || 0}
                    </div>
                  </button>
                  {allCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition',
                        selectedCategory === category.id
                          ? 'border border-white/15 bg-white/[0.10] text-white'
                          : 'border border-transparent bg-white/[0.02] text-white/62 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                      )}
                    >
                      <div className="mt-0.5 rounded-xl bg-white/[0.06] p-2 text-white">
                        {CATEGORY_ICONS[category.id]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{category.label}</div>
                        <div className="mt-1 text-xs leading-5 text-white/42">{category.description}</div>
                      </div>
                      <div className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-white/65">
                        {stats[category.id] || 0}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="rounded-[1.8rem] border border-white/10 bg-[#0b0b0c] p-4">
                  <label className="mb-3 block text-sm font-medium text-white/70">Uzmanlık</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition',
                          selectedTags.includes(tag.id)
                            ? 'bg-[#F65314] text-white'
                            : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white'
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
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fd5ff]">
                      Rehber Ara
                    </div>
                    <h2 className="mt-3 text-2xl font-black md:text-3xl">
                      {selectedCategoryMeta?.label || 'Tüm hizmetler ve gastronomi'}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-white/70">
                      {selectedCategoryMeta?.description ||
                        'İsim, şehir ve uzmanlık filtreleriyle tüm rehberde en uygun kaydı bul.'}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">Sonuç</div>
                    <div className="mt-1 text-3xl font-black">{filteredProviders.length}</div>
                  </div>
                </div>

                {hasActiveFilters ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {activeFilterPills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/74"
                      >
                        {pill}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/72 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
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
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-[#0b0b0c] py-24">
                  <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-white" />
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0c] p-10 text-center md:p-14">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] text-3xl">
                    0
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">Bu filtrelerle sonuç çıkmadı.</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">
                    Kategori veya şehir seçimini gevşetmeyi deneyin. Aradığınız kayıt gerçekten eksikse doğrudan öneri bırakabilirsiniz.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={clearFilters} className="rounded-full">
                      Filtreleri Sıfırla
                    </Button>
                    <Link
                      href="/hizmet-rehberi/oneri"
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.08]"
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
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/[0.08] p-2 text-white">{icon}</div>
        <div>
          <div className="text-2xl font-black text-white">{value}</div>
          <div className="text-sm text-white/60">{label}</div>
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
    <article className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition hover:border-white/22">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white/[0.06] p-3 text-white">
          {CATEGORY_ICONS[provider.type] || <MapPin className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                {category.label}
              </span>
            ) : null}
            <span className="rounded-full bg-[#01A1F1]/12 px-3 py-1 text-[11px] font-semibold text-[#8fd9ff]">
              {provider.city}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-bold text-white">{provider.name}</h3>

          {provider.address ? (
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-white/62">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{provider.address}</span>
            </p>
          ) : null}
        </div>
      </div>

      {provider.description ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="text-sm leading-7 text-white/68">{provider.description}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        {provider.phone ? (
          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
          >
            <Phone className="h-4 w-4" />
            Ara
          </a>
        ) : null}

        {provider.email ? (
          <a
            href={`mailto:${provider.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
          >
            <Mail className="h-4 w-4" />
            E-posta
          </a>
        ) : null}

        {provider.website ? (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
          >
            <Globe className="h-4 w-4" />
            Website
          </a>
        ) : null}
      </div>
    </article>
  );
}
