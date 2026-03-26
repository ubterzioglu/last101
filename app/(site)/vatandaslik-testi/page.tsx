'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { cn } from '@/lib/utils/cn';
import { Timer, CheckCircle, XCircle } from 'lucide-react';

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

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

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
    setMevcutSoruIndex(sorular.length);
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
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-2">

        {/* Başlık */}
        <div className="bg-white rounded-xl border-2 border-google-blue px-4 py-3">
          <h1 className="text-2xl font-bold leading-tight">Almanya Vatandaşlık Testi</h1>
        </div>

        {/* Nasıl Çalışır? */}
        <div
          className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
          onClick={() => setShowInfo(!showInfo)}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-semibold text-gray-900">Nasıl Çalışır?</span>
            <span className={cn('text-google-blue text-xl transition-transform duration-200', showInfo && 'rotate-180')}>▾</span>
          </div>
          {showInfo && (
            <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
              <ul className="space-y-2 text-sm text-blue-800 pt-3">
                <li>• Toplam 33 sorudan en az 17 doğru cevap sınavı geçmek için yeterlidir.</li>
                <li>• Her sorunun yalnızca 1 doğru cevabı vardır.</li>
                <li>• İlerledikçe doğru sayınız hesaplanır ve test sonunda sonuç gösterilir.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Bu araç neden var? */}
        <div
          className="bg-white rounded-xl border-2 border-google-green overflow-hidden cursor-pointer select-none"
          onClick={() => setShowWhy(!showWhy)}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-semibold text-gray-900">Bu araç neden var?</span>
            <span className={cn('text-google-green text-xl transition-transform duration-200', showWhy && 'rotate-180')}>▾</span>
          </div>
          {showWhy && (
            <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
              <p className="text-sm text-green-900 pt-3 leading-relaxed">
                Almanya vatandaşlığı için başvuru yapacaksanız Einbürgerungstest'i geçmek zorundasınız. Sınav, Bundesamt für Migration und Flüchtlinge (BAMF) tarafından hazırlanan 310 soruluk havuzdan rastgele seçilen 33 sorudan oluşur ve en az 17 doğru yanıt gereklidir. Bu araç, resmi soru havuzunu kullanarak gerçek sınav formatında pratik yapmanızı sağlar. Tüm sorular, eyalet sorularıyla ya da gerçek sınav simülasyonuyla çalışabilirsiniz; anlık geri bildirim ve sonuç özeti ile hangi konuları pekiştirmeniz gerektiğini hızla görebilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Hata Mesajı */}
        {hata && (
          <div className="bg-white rounded-xl border-2 border-google-yellow p-4">
            <p className="text-sm text-gray-700">{hata}</p>
          </div>
        )}

        {/* Mod Seçimi */}
        {!aktifMod && !yukleniyor && (
          <>
            {/* Tüm Sorular */}
            <div className="bg-white rounded-xl border-2 border-google-red p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tüm Sorular (300)</h3>
              <p className="text-sm text-gray-500 mb-4">Genel soruların tamamı arasından 300 soru ile tam test yapın.</p>
              <button
                onClick={() => setAktifMod('all')}
                className="w-full rounded-lg bg-google-red text-white font-semibold py-3 hover:opacity-90 transition-opacity"
              >
                Sınava Başla
              </button>
            </div>

            {/* Gerçek Deneme */}
            <div className="bg-white rounded-xl border-2 border-google-red p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-0.5">Gerçek Deneme Sınavı</h3>
              <p className="text-xs text-gray-400 mb-1">(30 genel + 3 eyalet)</p>
              <p className="text-sm text-gray-500 mb-4">Genel sorulardan 30, seçtiğiniz eyaletten 3 soru ile klasik sınav formatı.</p>
              <label className="text-xs text-gray-500 block mb-1">Eyalet Seçin</label>
              <select
                value={seciliEyalet}
                onChange={(e) => setSeciliEyalet(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white mb-3 focus:outline-none"
              >
                <option value="">Seçiniz</option>
                {EYALETLER.map((eyalet) => (
                  <option key={eyalet} value={eyalet}>{eyalet}</option>
                ))}
              </select>
              <button
                onClick={() => setAktifMod('real')}
                disabled={!seciliEyalet}
                className="w-full rounded-lg bg-google-red text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sınava Başla
              </button>
            </div>

            {/* Eyalet Soruları */}
            <div className="bg-white rounded-xl border-2 border-google-red p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Eyalet Soruları (10)</h3>
              <p className="text-sm text-gray-500 mb-4">Sadece seçtiğiniz eyalete özel 10 soru ile hızlı test.</p>
              <label className="text-xs text-gray-500 block mb-1">Eyalet Seçin</label>
              <select
                value={seciliEyalet}
                onChange={(e) => setSeciliEyalet(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white mb-3 focus:outline-none"
              >
                <option value="">Seçiniz</option>
                {EYALETLER.map((eyalet) => (
                  <option key={eyalet} value={eyalet}>{eyalet}</option>
                ))}
              </select>
              <button
                onClick={() => setAktifMod('state')}
                disabled={!seciliEyalet}
                className="w-full rounded-lg bg-google-red text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sınava Başla
              </button>
            </div>
          </>
        )}

        {/* Yükleniyor */}
        {yukleniyor && (
          <div className="bg-white rounded-xl border-2 border-google-blue p-8 text-center">
            <p className="text-gray-500">Sorular yükleniyor...</p>
          </div>
        )}

        {/* Soru Ekranı */}
        {aktifMod && !yukleniyor && !testBitti && mevcutSoru && (
          <>
            {/* Progress */}
            <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-google-red">
                  Soru {mevcutSoruIndex + 1} / {sorular.length}
                </span>
                {timerAktif && (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-google-red">
                    <Timer size={15} />
                    {formatSure(kalanSure)}
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-google-red transition-all duration-300"
                  style={{ width: `${((mevcutSoruIndex + 1) / sorular.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Soru Kartı */}
            <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
              {mevcutSoru.image_url && (
                <Image
                  src={mevcutSoru.image_url}
                  alt="Soru görseli"
                  className="w-full max-h-64 object-contain rounded-xl mb-4"
                  width={1200}
                  height={640}
                  unoptimized
                />
              )}

              <p className="text-gray-900 font-bold text-lg leading-tight mb-1">{mevcutSoru.soru_almanca}</p>
              <p className="text-gray-500 text-sm mb-4">{mevcutSoru.soru_turkce}</p>

              <div className="mx-auto w-full max-w-[560px] space-y-2 px-[50px] sm:px-0">
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
                        'w-full text-left p-4 rounded-lg border-2 transition-all',
                        showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-google-blue bg-blue-100'
                          : 'border-google-blue/30 bg-blue-50/60 hover:bg-blue-100/80 hover:border-google-blue',
                        cevapVerildi && !isSelected && !isCorrect && 'opacity-60'
                      )}
                    >
                      <span className="font-semibold text-sm text-gray-900">{key.toUpperCase()})</span>{' '}
                      <span className="text-sm text-gray-800">{value}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={sonrakiSoru}
                  disabled={!cevapVerildi}
                  className="w-full rounded-lg bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {mevcutSoruIndex < sorular.length - 1 ? 'Sonraki Soru' : 'Testi Bitir'}
                </button>
                <button
                  onClick={testiSifirla}
                  className="w-full rounded-lg border-2 border-google-blue bg-google-blue text-white font-medium py-2.5 hover:opacity-90 transition-opacity text-sm"
                >
                  Sınav Modunu Değiştir
                </button>
              </div>
            </div>
          </>
        )}

        {/* Sonuç Ekranı */}
        {testBitti && (
          <>
            <div className="bg-white rounded-xl border-2 border-google-green p-5 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Test Sonucu</h2>
              <p className="text-gray-500 text-sm mb-5">
                Toplam <span className="font-bold text-gray-900">{sorular.length}</span> sorudan{' '}
                <span className="font-bold text-google-green">{dogruSayisi}</span> tanesini doğru cevapladınız.
              </p>

              <div className="flex justify-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{dogruSayisi} Doğru</span>
                </div>
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                  <XCircle size={18} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-600">{sorular.length - dogruSayisi} Yanlış</span>
                </div>
              </div>

              {aktifMod === 'real' && (
                <div className={cn(
                  'p-4 rounded-xl mb-5 text-sm font-semibold',
                  dogruSayisi >= 17
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                )}>
                  {dogruSayisi >= 17
                    ? 'Tebrikler! Sınavı geçtiniz!'
                    : 'Maalesef sınavı geçemediniz. En az 17 doğru cevap gerekiyor.'}
                </div>
              )}
            </div>

            <button
              onClick={testiSifirla}
              className="w-full flex items-center justify-center rounded-xl border-2 border-google-blue bg-google-blue text-white font-semibold py-3 hover:opacity-90 transition-opacity"
            >
              Sınav Modunu Değiştir
            </button>
            <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
              Ana Sayfaya Dön
            </Link>
          </>
        )}

        <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
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
