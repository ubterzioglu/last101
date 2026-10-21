'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle } from 'lucide-react';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ModeSelect } from './ModeSelect';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { shuffleArray, type Soru, type TestModu } from './vatandaslik-data';

// Direkt Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function VatandaslikTestiClient() {
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
    <>
      <ToolPanel id="vatandaslik-testi-panel">
        {/* Hata Mesajı */}
        {hata && (
          <div
            role="alert"
            className="flex gap-3 rounded-card border border-alm-yellow/20 bg-alm-yellow/5 p-4 text-sm leading-relaxed text-ink"
          >
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-alm-yellow-ink" />
            <p>{hata}</p>
          </div>
        )}

        {/* Mod Seçimi */}
        {!aktifMod && !yukleniyor && (
          <ModeSelect seciliEyalet={seciliEyalet} onEyaletChange={setSeciliEyalet} onStart={setAktifMod} />
        )}

        {/* Yükleniyor */}
        {yukleniyor && (
          <div role="status" className="rounded-card border border-line bg-white p-8 text-center text-muted">
            Sorular yükleniyor...
          </div>
        )}

        {/* Soru Ekranı */}
        {aktifMod && !yukleniyor && !testBitti && mevcutSoru && (
          <QuizQuestion
            soru={mevcutSoru}
            index={mevcutSoruIndex}
            total={sorular.length}
            timerAktif={timerAktif}
            kalanSure={kalanSure}
            cevapVerildi={cevapVerildi}
            secilenCevap={secilenCevap}
            onAnswer={cevabiKontrolEt}
            onNext={sonrakiSoru}
            onReset={testiSifirla}
          />
        )}

        {/* Sonuç Ekranı */}
        {testBitti && (
          <QuizResult total={sorular.length} dogruSayisi={dogruSayisi} aktifMod={aktifMod} onReset={testiSifirla} />
        )}
      </ToolPanel>

      <Container className="pb-12 md:pb-16">
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </Container>
    </>
  );
}
