'use client';

import { useState } from 'react';
import { FileText, ChevronDown, Clock, Wallet, Building2, Users, FileCheck } from 'lucide-react';
import { belgelerData } from './data';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';

export function BelgelerClient() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    belgelerData.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {})
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Yararlı Belgeler Kataloğu
        </h1>
        <p className="text-lg text-white/70">
          Almanya'da yaşayan veya Almanya'ya taşınmayı planlayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin listesi.
        </p>
      </div>

      <div className="space-y-6">
        {belgelerData.map((category) => (
          <div key={category.category} className="overflow-hidden rounded-2xl bg-[#111] border border-white/10">
            <button
              onClick={() => toggleCategory(category.category)}
              className="flex w-full items-center justify-between bg-[#1a1a1a] px-6 py-4 text-left transition-colors hover:bg-[#222]"
            >
              <h2 className="text-xl font-semibold text-white">{category.category}</h2>
              <ChevronDown
                className={cn('h-5 w-5 text-white/50 transition-transform', {
                  'rotate-180': openCategories[category.category],
                })}
              />
            </button>
            
            {openCategories[category.category] && (
              <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2">
                {category.documents.map((doc, idx) => (
                  <Card key={idx} className="flex flex-col border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors p-5">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-[#01A1F1]/10 p-2 text-[#01A1F1]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{doc.name}</h3>
                        <p className="text-sm text-white/50">{doc.officialName}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1 text-sm">
                      <p className="text-white/80">{doc.purpose}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                          <span className="text-white/70"><strong className="text-white/90">Kimler:</strong> {doc.who}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                          <span className="text-white/70"><strong className="text-white/90">Gerekenler:</strong> {doc.supportingDocs}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                          <span className="text-white/70"><strong className="text-white/90">Makam:</strong> {doc.authority}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                          <span className="text-white/70"><strong className="text-white/90">Süre:</strong> {doc.duration}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                          <span className="text-white/70"><strong className="text-white/90">Ücret:</strong> {doc.cost}</span>
                        </div>
                      </div>
                      
                      {doc.note && (
                        <div className="mt-3 rounded-md bg-google-yellow/10 p-3 text-sm text-google-yellow">
                          <strong>Not:</strong> {doc.note}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}