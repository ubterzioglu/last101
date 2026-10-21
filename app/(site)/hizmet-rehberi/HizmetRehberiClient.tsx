'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/site/Chip';
import { CtaRow } from '@/components/site/CtaRow';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import {
  PROVIDER_CATEGORIES,
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
import { CategoryGrid, RehberFilters } from './RehberFilters';
import { RehberResults } from './RehberResults';
import { RehberSteps } from './RehberSteps';

export default function HizmetRehberiClient() {
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

  const filterKey = JSON.stringify([selectedCategory, selectedCity, searchQuery, selectedTags]);

  return (
    <>
      <PageHead
        title="Tüm Türkler"
        description={
          <>
            Almanya&apos;da Türkçe hizmet veren doktorlardan restoranlara, tüm uzmanları tek yerde bulun.
            <span className="mt-4 block text-sm">
              Doktor • Avukat • Terapist • Ebe/Hemşire • Tamirci • Nakliyat • Sigortacı • Vergi Danışmanı • Berber • Kuaför • Sürücü Kursu
            </span>
            <span className="mt-1 block text-sm">Restoran • Kafe • Market • Kasap • Fırın/Pastane</span>
          </>
        }
        stats={[
          { value: String(stats.total || 0), label: 'Toplam' },
          { value: String(stats.doctor || 0), label: 'Doktor' },
          { value: String(stats.lawyer || 0), label: 'Avukat' },
          { value: String(stats.restaurant || 0), label: 'Restoran' },
          { value: String(stats.kuafor || 0), label: 'Kuaför' },
        ]}
        actions={
          <>
            <Button href="/hizmet-rehberi/oneri" arrow>
              Türk Öner
            </Button>
            <a
              href="#rehber-arama"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700"
            >
              Türk Bul
            </a>
          </>
        }
        media={
          <PhotoCard
            src="/images/site/ofis-ekip.webp"
            alt="Birlikte çalışan bir ekip"
            chip={{ label: 'Türkçe hizmet veren uzmanlar' }}
            priority
          />
        }
      />

      <Container id="rehber-arama" className="scroll-mt-24 space-y-10 py-12">
        <RehberFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          cities={cities}
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />

        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          counts={sidebarCounts}
          totalFallback={stats.total || 0}
        />

        <section aria-labelledby="rehber-sonuclar-baslik" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-ink">Türk Bul</p>
              <h2
                id="rehber-sonuclar-baslik"
                className="mt-3 text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold leading-tight tracking-[-0.04em] text-ink"
              >
                {selectedCategoryMeta?.label || 'Tüm hizmetler ve gastronomi'}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                {selectedCategoryMeta?.description ||
                  'İsim, şehir ve uzmanlık filtreleriyle tüm rehberde en uygun kaydı bul.'}
              </p>
            </div>
            <div className="text-right" aria-live="polite">
              <p className="text-sm text-muted">Sonuç</p>
              <p className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {filteredProviders.length}
              </p>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterPills.map((pill) => (
                <Chip key={pill}>{pill}</Chip>
              ))}
            </div>
          ) : null}

          <RehberResults
            loading={loading}
            providers={filteredProviders}
            filterKey={filterKey}
            onClear={clearFilters}
          />
        </section>
      </Container>

      <RehberSteps />

      <CtaRow
        eyebrow="Listeyi büyüt"
        title="Aradığın hizmet yok mu?"
        description="Güvenilir bir uzman biliyorsan öner. Ekibimiz kontrol etsin, uygunsa listeye ekleyelim."
        action={
          <Button href="/hizmet-rehberi/oneri" arrow>
            Kayıt Öner
          </Button>
        }
      />
    </>
  );
}
