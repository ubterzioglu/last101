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
  'All Categories',
  'Executive Search',
  'General Staffing',
  'IT & Digital',
  'Tech & Engineering',
  'Finance & Legal',
  'Healthcare & Medical',
  'Energy & Engineering',
  'HR Consulting',
  'International',
  'Freelancer & Project',
  'Creative & Design'
];

export function RecruitmentAgencies({ agencies }: RecruitmentAgenciesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || 
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
          <span>Recruitment Agency</span>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Recruitment Agencies in Germany
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive list of recruitment agencies, headhunters, and staffing companies operating in Germany. 
          Find the right agency for your career or hiring needs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agencies..."
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
        Showing {filteredAgencies.length} of {agencies.length} agencies
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
                title={`Visit ${agency.name}`}
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
          <p className="text-gray-500">No agencies found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}
            className="mt-2 text-google-blue hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Author Credit */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">150 Recruitment Agencies in Germany</span> with Short Descriptions
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