'use client';

import { useState, useMemo } from 'react';
import { ArrowUpRight, CircleAlert, Search } from 'lucide-react';
import type { RecruitmentAgency } from '@/types';
import { cn } from '@/lib/utils/cn';
import { Chip } from '@/components/site/Chip';
import { FilterPanel } from '@/components/site/FilterPanel';
import type { SiteTone } from '@/components/site/tones';
import { BrokenLinkReportModal } from '@/components/ui/BrokenLinkReportModal';

interface RecruitmentAgenciesProps {
  agencies: RecruitmentAgency[];
}

const CAREER_PLATFORMS = 'İş ve Kariyer Platformları';

const MAIN_CATEGORIES = ['Tüm Kategoriler', 'İş Bulma Ajansları', 'İngilizce İşe Alan Şirketler', CAREER_PLATFORMS];

const SUB_CATEGORIES = {
  'İş Bulma Ajansları': [
    'Tümü',
    'Üst Düzey Yönetici Arama',
    'Genel İşe Alım',
    'BT & Dijital',
    'Teknoloji & Mühendislik',
    'Finans & Hukuk',
    'Sağlık & Tıp',
    'Enerji & Mühendislik',
    'İK Danışmanlığı',
    'Uluslararası',
    'Freelance & Proje',
    'Yaratıcı & Tasarım'
  ],
  'İngilizce İşe Alan Şirketler': [
    'Tümü',
    'E-ticaret & Moda',
    'Danışmanlık',
    'Fintech & Finans',
    'Yapay Zeka & Teknoloji',
    'Dil Öğrenme',
    'İK Yazılım',
    'Lojistik',
    'Sağlık & Tıp Teknolojisi',
    'Yenilenebilir Enerji',
    'Gıda Teknolojisi',
    'E-öğrenim',
    'Siber Güvenlik',
    'Sigorta'
  ],
  [CAREER_PLATFORMS]: [
    'Tümü',
    'Genel İlan Platformları',
    'Kamu & Resmî',
    'IT & Yazılım',
    'İngilizce & Relocation',
    'Mühendislik & Enerji',
    'Sağlık & Bakım',
    'Zanaat (Handwerk)',
    'Lojistik, Otel & Perakende',
    'Öğrenci & Yeni Mezun',
    'Akademi & Araştırma',
    'İşveren Kariyer Sayfaları'
  ]
};

const CATEGORY_TONES: Record<string, SiteTone> = {
  'İş Bulma Ajansları': 'blue',
  'İngilizce İşe Alan Şirketler': 'green',
  [CAREER_PLATFORMS]: 'orange',
};

const FIELD_CLASSES =
  'min-h-[48px] w-full rounded-btn border border-line bg-white px-4 text-sm text-ink transition-colors placeholder:text-muted focus:border-brand-700';

interface AgencyCardProps {
  agency: RecruitmentAgency;
  onReport: (agency: RecruitmentAgency) => void;
}

/** MediaCard-like agency card: the name link covers the card; the report button sits above it. */
function AgencyCard({ agency, onReport }: AgencyCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-card border border-line bg-white p-5 transition-colors hover:border-ink/30">
      {agency.category && (
        <Chip tone={CATEGORY_TONES[agency.category]} className="mb-3 w-fit">
          {agency.category}
        </Chip>
      )}
      <h3 className="break-words text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
        <a
          href={agency.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${agency.name} sitesine git`}
          className="transition-colors after:absolute after:inset-0 after:rounded-card group-hover:text-brand-700"
        >
          {agency.name}
        </a>
      </h3>
      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{agency.description}</p>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-line pt-2">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 underline decoration-brand-700/30 underline-offset-4 transition-colors group-hover:decoration-brand-700"
          >
            Siteye git
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
          <button
            type="button"
            onClick={() => onReport(agency)}
            title="Kırık link bildir"
            className="relative z-10 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-alm-red-ink"
          >
            <CircleAlert aria-hidden="true" className="h-4 w-4" />
            Kırık link bildir
          </button>
        </div>
      </div>
    </article>
  );
}

export function RecruitmentAgencies({ agencies }: RecruitmentAgenciesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('Tüm Kategoriler');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Tümü');
  const [selectedAgency, setSelectedAgency] = useState<RecruitmentAgency | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMainCategory = selectedMainCategory === 'Tüm Kategoriler' ||
                              agency.category === selectedMainCategory;
      // Yeni kategori alt kategoriyi alanından okur; eski kayıtlar açıklama metniyle eşleşir
      const matchesSubCategory = selectedSubCategory === 'Tümü' ||
                              (agency.category === CAREER_PLATFORMS
                                ? agency.subCategory === selectedSubCategory
                                : agency.description.includes(selectedSubCategory.split(' ')[0]));

      return matchesSearch && matchesMainCategory && matchesSubCategory;
    });
  }, [agencies, searchTerm, selectedMainCategory, selectedSubCategory]);

  const availableSubCategories = selectedMainCategory === 'Tüm Kategoriler'
    ? ['Tümü']
    : SUB_CATEGORIES[selectedMainCategory as keyof typeof SUB_CATEGORIES] || ['Tümü'];

  const handleMainCategoryChange = (category: string) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory('Tümü');
  };

  const handleReportBrokenLink = (agency: RecruitmentAgency) => {
    setSelectedAgency(agency);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMainCategory('Tüm Kategoriler');
    setSelectedSubCategory('Tümü');
  };

  return (
    <div className="space-y-8">
      <FilterPanel>
        <div
          className={cn(
            'grid gap-4',
            selectedMainCategory !== 'Tüm Kategoriler' ? 'md:grid-cols-3' : 'md:grid-cols-2'
          )}
        >
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              aria-label="Ajans ara"
              placeholder="Ajans ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(FIELD_CLASSES, 'pl-10')}
            />
          </div>

          <select
            aria-label="Kategori"
            value={selectedMainCategory}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
            className={FIELD_CLASSES}
          >
            {MAIN_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {selectedMainCategory !== 'Tüm Kategoriler' && (
            <select
              aria-label="Alt kategori"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className={FIELD_CLASSES}
            >
              {availableSubCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
        </div>
      </FilterPanel>

      {/* Results Count */}
      <p className="text-sm text-muted" aria-live="polite">
        {agencies.length} ajansdan {filteredAgencies.length} tanesi gösteriliyor
      </p>

      {/* Agencies Grid */}
      <ul className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
        {filteredAgencies.map((agency, index) => (
          <li key={agency.id || index}>
            <AgencyCard agency={agency} onReport={handleReportBrokenLink} />
          </li>
        ))}
      </ul>

      {/* No Results */}
      {filteredAgencies.length === 0 && (
        <div className="rounded-card border border-line bg-white py-12 text-center">
          <p className="text-muted">Aramanızla eşleşen ajans bulunamadı.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 min-h-[44px] text-sm font-semibold text-brand-700 underline decoration-brand-700/30 underline-offset-4 hover:decoration-brand-700"
          >
            Filtreleri temizle
          </button>
        </div>
      )}

      {/* Author Credit */}
      <div className="border-t border-line py-8 text-center">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">Almanya&apos;daki {agencies.length} İş Bulma Ajansı ve Şirket</span> · Kısa Açıklamalar
        </p>
        <p className="mt-1 text-xs text-muted">
          by{' '}
          <a
            href="https://www.linkedin.com/in/ubterzioglu/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 underline decoration-brand-700/30 underline-offset-4 hover:decoration-brand-700"
          >
            Umut Barış Terzioğlu
          </a>
        </p>
      </div>

      <BrokenLinkReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agencyId={selectedAgency?.id}
        agencyName={selectedAgency?.name || ''}
      />
    </div>
  );
}
