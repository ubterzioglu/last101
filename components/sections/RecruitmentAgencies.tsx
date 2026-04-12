'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, Search, Filter } from 'lucide-react';
import type { RecruitmentAgency } from '@/types';
import { cn } from '@/lib/utils/cn';

interface RecruitmentAgenciesProps {
  agencies: RecruitmentAgency[];
}

const CATEGORIES = [
  'Tüm Kategoriler',
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
];

export function RecruitmentAgencies({ agencies }: RecruitmentAgenciesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tüm Kategoriler' || 
                            agency.category === selectedCategory ||
                            agency.category?.includes(selectedCategory.split(' & ')[0]) ||
                            agency.category?.includes(selectedCategory.split(' & ')[1]);
      
      return matchesSearch && matchesCategory;
    });
  }, [agencies, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-google-blue/20 bg-google-blue/10 px-4 py-2 text-sm text-google-blue">
          <span className="font-semibold">{agencies.length}</span>
          <span>İş Bulma Ajansı</span>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Almanya&apos;daki İş Bulma Ajansları
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Almanya&apos;da faaliyet gösteren işe alım ajansları, kafa avcıları ve personel şirketlerinin kapsamlı listesi.
          Kariyer veya işe alım ihtiyaçlarınız için doğru ajansı bulun.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ajans ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-google-blue focus:outline-none focus:ring-2 focus:ring-google-blue/20"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-8 text-sm focus:border-google-blue focus:outline-none focus:ring-2 focus:ring-google-blue/20"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {agencies.length} ajansdan {filteredAgencies.length} tanesi gösteriliyor
      </div>

      {/* Agencies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgencies.map((agency, index) => (
          <div
            key={agency.id || index}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-google-blue/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-google-blue transition-colors">
                  {agency.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {agency.description}
                </p>
                {agency.category && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {agency.category}
                  </span>
                )}
              </div>
              <Link
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-google-blue hover:text-white"
                title={`${agency.name} sitesine git`}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAgencies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aramanızla eşleşen ajans bulunamadı.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Tüm Kategoriler');
            }}
            className="mt-2 text-google-blue hover:underline"
          >
            Filtreleri temizle
          </button>
        </div>
      )}

      {/* Author Credit */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Almanya&apos;daki 204 İş Bulma Ajansı</span> — Kısa Açıklamalar
        </p>
        <p className="text-xs text-gray-500 mt-1">
          by <Link 
            href="https://www.linkedin.com/in/ubterzioglu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-google-blue hover:underline"
          >
            Umut Barış Terzioğlu
          </Link>
        </p>
      </div>
    </div>
  );
}
