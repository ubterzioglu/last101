'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PROVIDER_CATEGORIES, type Provider } from '@/lib/rehber/types';
import { categoryKeyOf, PAGE_SIZE, visibleResultCount } from './provider-display';
import { ProviderCard } from './ProviderCard';

interface RehberResultsProps {
  loading: boolean;
  providers: Provider[];
  /** Changes whenever a filter changes; resets the "load more" count. */
  filterKey: string;
  onClear: () => void;
}

/** Loading, empty and 3-column result states with a "load more" button. */
export function RehberResults({ loading, providers, filterKey, onClear }: RehberResultsProps) {
  const [paging, setPaging] = useState({ key: filterKey, count: PAGE_SIZE });
  const visibleCount = visibleResultCount(paging, filterKey, providers.length);

  if (loading) {
    return (
      <div role="status" className="rounded-card border border-line bg-white py-20 text-center text-sm text-muted">
        Kayıtlar yükleniyor...
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="rounded-card border border-line bg-white p-10 text-center md:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-card bg-band text-3xl font-extrabold text-muted">
          0
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">Bu filtrelerle sonuç çıkmadı.</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Kategori veya şehir seçimini gevşetmeyi deneyin. Aradığınız kayıt gerçekten eksikse doğrudan öneri bırakabilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={onClear}>Filtreleri Sıfırla</Button>
          <Button href="/hizmet-rehberi/oneri" variant="outline" arrow>
            Eksik hizmeti öner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
        {providers.slice(0, visibleCount).map((provider) => (
          <li key={provider.id} className="flex">
            <ProviderCard
              provider={provider}
              category={PROVIDER_CATEGORIES.find((category) => category.id === categoryKeyOf(provider.type))}
            />
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted">
          {visibleCount} / {providers.length}
        </p>
        {visibleCount < providers.length ? (
          <Button
            variant="outline"
            onClick={() => setPaging({ key: filterKey, count: visibleCount + PAGE_SIZE })}
          >
            Daha fazla göster
          </Button>
        ) : null}
      </div>
    </div>
  );
}
