import { Metadata } from 'next';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Globe, Calculator, ArrowRight } from 'lucide-react';

export const metadata: Metadata = createMetadata({
  title: 'Tatil Planlayıcı',
  description: 'Almanya ve Türkiye için 2026 tatil planlayıcı. İzin günlerinizi en verimli şekilde kullanın.',
  path: '/tatil',
});

export default function TatilLandingPage() {
  return (
    <>
      <HeroSection
        title="Tatil Planlayıcı"
        description="2026 yılı için Almanya ve Türkiye tatil planlayıcı. İzin günlerinizi en verimli şekilde kullanın, hafta sonları ve resmî tatilleri hesaba katarak maksimum dinlenme süresi elde edin."
        className="bg-google-blue"
      />

      <Section contained>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Almanya Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-google-yellow/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-google-yellow" />
              </div>
              <h2 className="text-2xl font-bold">Almanya</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Bundesland seçiminize göre eyalete özel tatilleri hesaplayın. 
              Almanya&apos;nın 16 federal eyaleti için farklı tatil günlerini içerir.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-google-green" />
                Eyalete özel tatiller
              </li>
              <li className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-google-green" />
                İzin verimlilik analizi
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-google-green" />
                Hafta hafta detaylı plan
              </li>
            </ul>
            <Link href="/tatil/almanya">
              <Button variant="primary" className="w-full">
                Almanya Planlayıcı
              </Button>
            </Link>
          </Card>

          {/* Türkiye Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-google-red/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-google-red" />
              </div>
              <h2 className="text-2xl font-bold">Türkiye</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Türkiye&apos;nin 2026 resmî tatillerini hesaplayın. 
              Ramazan ve Kurban Bayramları, ulusal bayramlar ve arefe günleri dahildir.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-google-green" />
                Dini ve ulusal bayramlar
              </li>
              <li className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-google-green" />
                Arefe (yarım gün) hesaplama
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-google-green" />
                Uzatma tüyoları
              </li>
            </ul>
            <Link href="/tatil/turkiye">
              <Button variant="danger" className="w-full">
                Türkiye Planlayıcı
              </Button>
            </Link>
          </Card>
        </div>
      </Section>

      <Section contained className="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-google-blue/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-google-blue">1</span>
              </div>
              <h3 className="font-semibold mb-2">Tarih Seçin</h3>
              <p className="text-sm text-gray-600">Başlangıç ve bitiş tarihlerini seçin</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-google-green/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-google-green">2</span>
              </div>
              <h3 className="font-semibold mb-2">Hesaplayın</h3>
              <p className="text-sm text-gray-600">Sistem otomatik olarak hesaplar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-google-yellow/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-google-yellow">3</span>
              </div>
              <h3 className="font-semibold mb-2">Planlayın</h3>
              <p className="text-sm text-gray-600">Verimli izin kullanımı planlayın</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
