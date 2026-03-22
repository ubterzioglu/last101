'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { Timer, HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

// Direkt Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface Soru {
  id: number;
  soru_almanca: string;
  soru_turkce: string;
  secenekler: Record<string, string>;
  dogru_cevap: string;
  image_url?: string;
  eyalet: string;
}

type TestModu = 'all' | 'state' | 'real' | null;

const EYALETLER = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

export default function VatandaslikTestiPage() {
  // Mod seçimi state'leri
  const [aktifMod, setAktifMod] = useState<TestModu>(null);
  const [seciliEyalet, setSeciliEyalet] = useState('');
  
  // Test state'leri
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [mevcutSoruIndex, setMevcutSoruIndex] = useState(0);
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [cevapVerildi, setCevapVerildi] = useState(false);
  const [secilenCevap, setSecilenCevap] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  
  // Timer state'leri
  const [kalanSure, setKalanSure] = useState(0);
  const [timerAktif, setTimerAktif] = useState(false);

  // Timer efekti
  useEffect(() => {
    if (!timerAktif || kalanSure <= 0) return;
    
    const interval = setInterval(() => {
      setKalanSure((prev) => {
        if (prev <= 1) {
          setTimerAktif(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerAktif, kalanSure]);

  // Süre dolduğunda testi bitir
  useEffect(() => {
    if (timerAktif && kalanSure === 0) {
      setTimerAktif(false);
      setMevcutSoruIndex(sorular.length);
    }
  }, [kalanSure, sorular.length, timerAktif]);

  const formatSure = (saniye: number) => {
    const dakika = Math.floor(saniye / 60);
    const san = saniye % 60;
    return `${String(dakika).padStart(2, '0')}:${String(san).padStart(2, '0')}`;
  };

  const sorulariYukle = useCallback(async () => {
    if (!aktifMod || !supabase) return;
    
    setYukleniyor(true);
    setHata('');

    try {
      let hazirSorular: Soru[] = [];

      if (aktifMod === 'all') {
        const { data, error } = await supabase
          .from('vatandaslik_sorulari')
          .select('*')
          .eq('eyalet', 'Genel');
        
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Genel soru bulunamadı');
        hazirSorular = shuffleArray(data).slice(0, 300);
      } 
      else if (aktifMod === 'state' && seciliEyalet) {
        const { data, error } = await supabase
          .from('vatandaslik_sorulari')
          .select('*')
          .eq('eyalet', seciliEyalet);
        
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Bu eyalet için soru bulunamadı');
        hazirSorular = shuffleArray(data).slice(0, 10);
      } 
      else if (aktifMod === 'real' && seciliEyalet) {
        const [generalRes, stateRes] = await Promise.all([
          supabase.from('vatandaslik_sorulari').select('*').eq('eyalet', 'Genel'),
          supabase.from('vatandaslik_sorulari').select('*').eq('eyalet', seciliEyalet)
        ]);

        if (generalRes.error) throw generalRes.error;
        if (stateRes.error) throw stateRes.error;
        if (!generalRes.data || generalRes.data.length < 30) throw new Error('Genel soru sayısı yetersiz');
        if (!stateRes.data || stateRes.data.length < 3) throw new Error('Eyalet soru sayısı yetersiz');

        const genelSorular = shuffleArray(generalRes.data).slice(0, 30);
        const eyaletSorulari = shuffleArray(stateRes.data).slice(0, 3);
        hazirSorular = shuffleArray([...genelSorular, ...eyaletSorulari]);
      }

      setSorular(hazirSorular);
      setMevcutSoruIndex(0);
      setDogruSayisi(0);
      setCevapVerildi(false);
      setSecilenCevap(null);

      if (aktifMod === 'real') {
        setKalanSure(60 * 60);
        setTimerAktif(true);
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bir hata oluştu');
      setAktifMod(null);
    } finally {
      setYukleniyor(false);
    }
  }, [aktifMod, seciliEyalet]);

  useEffect(() => {
    if (aktifMod && (aktifMod === 'all' || seciliEyalet)) {
      sorulariYukle();
    }
  }, [aktifMod, seciliEyalet, sorulariYukle]);

  const cevabiKontrolEt = (cevap: string) => {
    if (cevapVerildi) return;
    
    setSecilenCevap(cevap);
    setCevapVerildi(true);
    
    const mevcutSoru = sorular[mevcutSoruIndex];
    if (cevap === mevcutSoru.dogru_cevap) {
      setDogruSayisi((prev) => prev + 1);
    }
  };

  const sonrakiSoru = () => {
    if (mevcutSoruIndex < sorular.length - 1) {
      setMevcutSoruIndex((prev) => prev + 1);
      setCevapVerildi(false);
      setSecilenCevap(null);
    } else {
      testiBitir();
    }
  };

  function testiBitir() {
    setTimerAktif(false);
    setMevcutSoruIndex(sorular.length); // Sonuç ekranını göster
  }

  const testiSifirla = () => {
    setAktifMod(null);
    setSeciliEyalet('');
    setSorular([]);
    setMevcutSoruIndex(0);
    setDogruSayisi(0);
    setCevapVerildi(false);
    setSecilenCevap(null);
    setHata('');
    setKalanSure(0);
    setTimerAktif(false);
  };

  const mevcutSoru = sorular[mevcutSoruIndex];
  const testBitti = sorular.length > 0 && mevcutSoruIndex >= sorular.length;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <Section className="bg-[#01A1F1] py-12">
          <Container>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Almanya Vatandaşlık Testi
              </h1>
              <p className="text-lg text-white/90">
                33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün.
              </p>
            </div>
          </Container>
        </Section>

        {/* Hata Mesajı */}
        {hata && (
          <Section className="bg-yellow-500/10 py-4">
            <Container>
              <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 text-yellow-200">
                {hata}
              </div>
            </Container>
          </Section>
        )}

        {/* Mod Seçimi Ekranı */}
        {!aktifMod && !yukleniyor && (
          <Section contained className="py-8">
            {/* Bilgi Kartı */}
            <div className="bg-[#FF9900] rounded-2xl p-6 mb-6 text-gray-900">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HelpCircle size={20} />
                Sınav Bilgisi
              </h2>
              <ul className="space-y-2 text-sm bg-white/90 rounded-xl p-4">
                <li>• Toplam 33 sorudan en az 17 doğru cevap sınavı geçmek için yeterlidir.</li>
                <li>• Her sorunun yalnızca 1 doğru cevabı vardır.</li>
                <li>• İlerledikçe doğru sayınız hesaplanır ve test sonunda sonuç gösterilir.</li>
              </ul>
            </div>

            {/* Mod Kartları */}
            <div className="space-y-4">
              {/* Tüm Sorular */}
              <div className="bg-[#F65314] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Tüm sorular (300)</h3>
                <p className="text-sm text-white/90 mb-4">
                  Genel soruların tamamı arasından 300 soru ile tam test yapın.
                </p>
                <Button 
                  onClick={() => setAktifMod('all')}
                  className="w-full bg-[#FFBB00] hover:bg-[#ffcc33] text-gray-900 font-semibold"
                >
                  Sınava Başla
                </Button>
              </div>

              {/* Gerçek Deneme Sınavı */}
              <div className="bg-[#F65314] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">Gerçek deneme sınavı</h3>
                <p className="text-xs text-white/80 mb-2">(30 genel + 3 eyalet)</p>
                <p className="text-sm text-white/90 mb-4">
                  Genel sorulardan 30, seçtiğiniz eyaletten 3 soru ile klasik sınav formatı.
                </p>
                <label className="block text-xs mb-2">Eyalet Seçin:</label>
                <select
                  value={seciliEyalet}
                  onChange={(e) => setSeciliEyalet(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/35 bg-white/20 text-gray-900 mb-3"
                >
                  <option value="">Seçiniz</option>
                  {EYALETLER.map((eyalet) => (
                    <option key={eyalet} value={eyalet}>
                      {eyalet}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={() => setAktifMod('real')}
                  disabled={!seciliEyalet}
                  className="w-full bg-[#FFBB00] hover:bg-[#ffcc33] text-gray-900 font-semibold disabled:opacity-50"
                >
                  Sınava Başla
                </Button>
              </div>

              {/* Eyalet Soruları */}
              <div className="bg-[#F65314] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Eyalet soruları (10)</h3>
                <p className="text-sm text-white/90 mb-4">
                  Sadece seçtiğiniz eyalete özel 10 soru ile hızlı test.
                </p>
                <label className="block text-xs mb-2">Eyalet Seçin:</label>
                <select
                  value={seciliEyalet}
                  onChange={(e) => setSeciliEyalet(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/35 bg-white/20 text-gray-900 mb-3"
                >
                  <option value="">Seçiniz</option>
                  {EYALETLER.map((eyalet) => (
                    <option key={eyalet} value={eyalet}>
                      {eyalet}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={() => setAktifMod('state')}
                  disabled={!seciliEyalet}
                  className="w-full bg-[#FFBB00] hover:bg-[#ffcc33] text-gray-900 font-semibold disabled:opacity-50"
                >
                  Sınava Başla
                </Button>
              </div>
            </div>
          </Section>
        )}

        {/* Yükleniyor */}
        {yukleniyor && (
          <Section contained className="py-16 text-center">
            <div className="text-white text-lg">Sorular yükleniyor...</div>
          </Section>
        )}

        {/* Soru Ekranı */}
        {aktifMod && !yukleniyor && !testBitti && mevcutSoru && (
          <Section contained className="py-6">
            <div className="bg-[#F65314] rounded-2xl p-6 text-white">
              {/* Soru Başlığı */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold">
                  {mevcutSoruIndex + 1} / {sorular.length}
                </span>
                {timerAktif && (
                  <span className="flex items-center gap-2 text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                    <Timer size={16} />
                    {formatSure(kalanSure)}
                  </span>
                )}
              </div>

              {/* Görsel */}
              {mevcutSoru.image_url && (
                <Image
                  src={mevcutSoru.image_url}
                  alt="Soru görseli"
                  className="w-full max-h-64 object-contain rounded-xl mb-4 bg-white/10"
                  width={1200}
                  height={640}
                  unoptimized
                />
              )}

              {/* Soru Metni */}
              <p className="text-lg font-bold mb-2">{mevcutSoru.soru_almanca}</p>
              <p className="text-sm text-white/85 mb-6">{mevcutSoru.soru_turkce}</p>

              {/* Seçenekler */}
              <div className="space-y-3">
                {Object.entries(mevcutSoru.secenekler).map(([key, value]) => {
                  const isSelected = secilenCevap === key;
                  const isCorrect = mevcutSoru.dogru_cevap === key;
                  const showCorrect = cevapVerildi && isCorrect;
                  const showWrong = cevapVerildi && isSelected && !isCorrect;

                  return (
                    <button
                      key={key}
                      onClick={() => cevabiKontrolEt(key)}
                      disabled={cevapVerildi}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border transition-all duration-200',
                        'border-white/25 bg-white/10 hover:bg-white/20',
                        showCorrect && 'bg-green-600 border-green-600',
                        showWrong && 'bg-red-600 border-red-600',
                        cevapVerildi && !isSelected && !isCorrect && 'opacity-60'
                      )}
                    >
                      <span className="font-semibold">{key.toUpperCase()})</span>{' '}
                      {value}
                    </button>
                  );
                })}
              </div>

              {/* Sonraki Butonu */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={sonrakiSoru}
                  disabled={!cevapVerildi}
                  className="w-full bg-[#FFBB00] hover:bg-[#ffcc33] text-gray-900 font-semibold disabled:opacity-50"
                >
                  {mevcutSoruIndex < sorular.length - 1 ? 'Sonraki Soru' : 'Testi Bitir'}
                </Button>
                <Button
                  onClick={testiSifirla}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20"
                >
                  Sınav Modunu Değiştir
                </Button>
              </div>
            </div>
          </Section>
        )}

        {/* Sonuç Ekranı */}
        {testBitti && (
          <Section contained className="py-8">
            <div className="bg-gradient-to-br from-[#8F03B7] to-[#6B02A3] rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Test Sonucu</h2>
              <p className="text-lg mb-6">
                Toplam <span className="font-bold">{sorular.length}</span> sorudan{' '}
                <span className="font-bold text-[#FFBB00]">{dogruSayisi}</span> tanesini doğru cevapladınız.
              </p>
              
              {/* Sonuç Durumu */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-green-600/30 px-4 py-2 rounded-full">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>{dogruSayisi} Doğru</span>
                </div>
                <div className="flex items-center gap-2 bg-red-600/30 px-4 py-2 rounded-full">
                  <XCircle size={20} className="text-red-400" />
                  <span>{sorular.length - dogruSayisi} Yanlış</span>
                </div>
              </div>

              {/* Geçme Durumu */}
              {aktifMod === 'real' && (
                <div className={cn(
                  'p-4 rounded-xl mb-6',
                  dogruSayisi >= 17 ? 'bg-green-600/30' : 'bg-red-600/30'
                )}>
                  {dogruSayisi >= 17 ? (
                    <p className="font-semibold text-green-300">
                      🎉 Tebrikler! Sınavı geçtiniz!
                    </p>
                  ) : (
                    <p className="font-semibold text-red-300">
                      😔 Maalesef sınavı geçemediniz. En az 17 doğru cevap gerekiyor.
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={testiSifirla}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <RotateCcw size={18} className="mr-2" />
                Sınav Modunu Değiştir
              </Button>
            </div>
          </Section>
        )}
      </main>

      <Footer />
    </>
  );
}


// Yardımcı fonksiyon
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
