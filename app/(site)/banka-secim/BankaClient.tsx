'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { PROFILES, BANKS, QUESTIONS } from './data';
import { BankRecommendation } from './types';
import { cn } from '@/lib/utils/cn';

export default function BankaClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Skorları hesapla
  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    Object.keys(PROFILES).forEach(k => (s[k] = 0));

    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;

      const opt = q.options.find(o => o.key === a);
      if (opt?.add) {
        for (const k of Object.keys(opt.add)) {
          s[k] = (s[k] || 0) + opt.add[k];
        }
      }
    }
    return s;
  }, [answers]);

  // Banka skorunu hesapla
  const calculateBankScore = useCallback((bankId: string) => {
    const bank = BANKS.find(b => b.id === bankId);
    if (!bank) return 0;

    let total = 0;
    for (const k of Object.keys(PROFILES)) {
      const s = scores[k] || 0;
      const w = bank.weights[k] || 0;
      total += s * w;
    }
    return total;
  }, [scores]);

  // İhtiyaçları belirle
  const needs = useMemo(() => ({
    wantsLowCost: (scores.LOW_COST || 0) >= 4,
    wantsBranch: (scores.BRANCH || 0) >= 4 || (scores.LOCAL || 0) >= 5,
    wantsCrypto: (scores.CRYPTO || 0) >= 4,
    wantsInvest: (scores.INVEST || 0) >= 4,
    wantsExpat: (scores.EXPAT || 0) >= 4,
    wantsDigital: (scores.DIGITAL || 0) >= 5,
    wantsDirect: (scores.DIRECT || 0) >= 5,
  }), [scores]);

  // Top sinyaller
  const topSignals = useMemo(() => {
    return Object.keys(scores)
      .map(k => ({ key: k, score: scores[k] || 0 }))
      .sort((a, b) => b.score - a.score)
      .filter(x => x.score > 0)
      .slice(0, 3);
  }, [scores]);

  // Banka önerilerini oluştur
  const recommendations: BankRecommendation[] = useMemo(() => {
    const ranked = BANKS
      .map(b => ({ ...b, score: calculateBankScore(b.id) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return ranked.map((b, idx) => {
      const bullets: string[] = [];

      if (needs.wantsLowCost) {
        if ((b.weights.LOW_COST || 0) >= 2) bullets.push('Masraf hassasiyetin yüksek: daha düşük/şeffaf ücret yapısına yakın.');
        else bullets.push('Masraf hassasiyetin yüksek: bu seçenekte ücret/koşulları özellikle kontrol et.');
      }
      if (needs.wantsBranch) {
        if ((b.weights.BRANCH || 0) >= 2) bullets.push('Şube ihtiyacın var: yerel/şubeli yapı daha uygun.');
        else bullets.push('Şube ihtiyacın var: bu seçenek şubesiz/az şubeli olabilir.');
      }
      if (needs.wantsCrypto) {
        if ((b.weights.CRYPTO || 0) >= 2) bullets.push('Kripto ilgine daha uygun bir seçenek.');
        else bullets.push('Kripto istiyorsun: bu seçenekte kripto genelde harici platformla olur.');
      }
      if (needs.wantsInvest) {
        if ((b.weights.INVEST || 0) >= 3) bullets.push('Borsa/ETF tarafında güçlü bir aday.');
        else bullets.push('Borsa/ETF istiyorsun: bu seçenekte yatırım tarafını ayrıca doğrula.');
      }
      if (needs.wantsExpat) {
        if ((b.weights.EXPAT || 0) >= 2) bullets.push('Dil/kurulum açısından expat dostu tarafa daha yakın.');
        else bullets.push('Expat ihtiyaçların var: dil/kurulum süreçlerini kontrol et.');
      }

      const bankNotes: Record<string, string> = {
        sparkasse: 'Almanya\'nın en geniş şube ağı (~13.000+); 2026 ortasında kripto entegrasyonu planlanıyor. Herhangi bir Alman adresiyle Basiskonto açılabilir.',
        volksbank: 'Kooperatif yapısı; özellikle küçük şehirlerde güçlü şube/ATM ağı. 800+ bağımsız banka, hizmet kalitesi bölgeye göre değişebilir.',
        n26: 'Nisan 2024\'te ücretsiz ETF/hisse alım-satımı başlatıldı (~1.700 Sparplan). Almanya\'da en iyi İngilizce destek; Anmeldung olmadan açılabiliyor.',
        ing: 'En kapsamlı ücretsiz ETF Sparplan seçeneklerinden biri (1.198 ETF). Aralık 2024\'te ücret koşulları sıkılaştı: aylık min €1.000 gelir zorunlu.',
        dkb: 'Worldwide ücretsiz ATM (Aktivkunde) + yabancı para ücreti yok. Yalnızca Almanca arayüz; İngilizce destek çok sınırlı.',
        traderepublic: 'Aralık 2024\'te tam ECB bankacılık lisansı + Girokonto başlatıldı. €1/işlem komisyon + ücretsiz ETF Sparplan + %2 mevduat faizi.',
        revolut: 'Mayıs 2024\'te Alman DE IBAN alındı — artık standart Almanya bankası gibi kullanılabiliyor. 30+ para birimi + kripto tek uygulamada.',
        commerzbank: 'Almanya\'nın en iyi İngilizce desteği sunan geleneksel bankası. Mayıs 2025\'ten itibaren ücretsiz hesap için aylık min €700 gelir gerekli.',
        deutschebank: 'Premium segment; uluslararası tanınırlık ve wealth management altyapısı. Postbank\'ı da bünyesine aldı (BT entegrasyonu 2024\'te tamamlandı).',
        c24: 'Check24 bünyesinde modern masrafsız hesap; Kasım 2025\'te BaFin AML denetimine tabi tutuldu — mevduatlar güvenceli, ancak göz önünde bulundurulmalı.',
        comdirect: 'Commerzbank grubu; 576 ücretsiz ETF Sparplan + güçlü broker altyapısı. 2024\'te "Pure Depot" ürünü eklendi.',
        consorsbank: 'BNP Paribas grubu; 2024-2025\'te 1.564 ETF Sparplan\'ın tamamı ücretsiz yapıldı (önceden %1,5 ücret vardı). Yatırım odaklılar için güçlü seçenek.',
        targobank: 'Ücretsiz hesap için düşük eşik: aylık min €600 maaş. Müşteri hizmetleri konusunda karışık yorumlar mevcut.',
        postbank: 'Deutsche Bank grubu; eski posta şubeleri üzerinden ~1.700 şube/hizmet noktası. BT geçişi 2024\'te tamamlandı.',
        hvb: 'UniCredit grubu; Güney Almanya\'da güçlü şube ağı. 2024-2025\'te İngilizce destek kalitesi geriledi; ücretsiz hesap için min €1.500 çeyreklik bakiye gerekli.',
        santander: 'BestGiro koşulsuz ücretsiz (gelir şartı yok) — geleneksel bankalar arasında nadir bir avantaj. 1Plus Visa seyahat için ücretsiz worldwide ATM sunuyor.',
        bunq: 'Anmeldung olmadan açılabilen sayılı AB bankasından biri; 90 gün içinde adres girilmesi yeterli. Tüm hesaplar ücretli: min €8,99/ay.',
        tomorrow: 'Sürdürülebilir bankacılık odaklı; Haziran 2024\'te ilk aylık kâra ulaştı. İngilizce destek mevcut. Silah, fosil yakıt ve fabrika çiftçiliği yatırımı yok.',
        wise: 'Uluslararası transferde benchmark: orta piyasa kuru + şeffaf ücret. Belçika IBAN\'ı (DE değil) — bazı ev sahipleri/işverenler kabul etmeyebilir.',
      };
      if (bankNotes[b.id]) bullets.push(bankNotes[b.id]);

      const tags = topSignals
        .map(s => PROFILES[s.key]?.title)
        .filter(Boolean);

      return { bank: b, rank: idx + 1, tags, bullets };
    });
  }, [calculateBankScore, needs, topSignals]);

  const handleAnswer = (optionKey: string) => {
    const newAnswers = { ...answers, [question.id]: optionKey };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Kopyalama başarısız. Tarayıcı izinlerini kontrol et.');
    }
  };

  const buildCopyText = () => {
    let out = 'almanya101.de • Banka Seçimi Sonucu\n\n';
    recommendations.forEach(r => {
      out += `#${r.rank} ${r.bank.name} (${r.bank.type}) — Skor: ${Math.round(r.bank.score)}\n`;
      r.bullets.slice(0, 3).forEach(b => (out += `- ${b}\n`));
      out += '\n';
    });
    out += 'Not: Ücretler/koşullar değişebilir. Son karardan önce bankanın güncel şartlarını kontrol et.\n';
    return out;
  };

  return (
    <div className="space-y-2">
      {/* Başlık */}
      <div className="bg-white rounded-xl border-2 border-google-blue px-4 py-3">
        <h1 className="text-2xl font-bold leading-tight">Banka Seçim Aracı</h1>
      </div>

      {/* Nasıl Çalışır? */}
      <div
        className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Nasıl Çalışır?</span>
          <span className={cn("text-google-blue text-xl transition-transform duration-200", showInfo && "rotate-180")}>▾</span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• Bu araç 20 soruyla size en uygun bankacılık profilini önerir.</li>
              <li>• Sonuçlar yönlendirme amaçlıdır.</li>
              <li>• Son kararınızı vermeden önce bankanın güncel şartlarını kontrol edin.</li>
              <li>• Ücretler, kart koşulları, şube erişimi ve müşteri hizmetleri bankaya göre değişebilir.</li>
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
          <span className={cn("text-google-green text-xl transition-transform duration-200", showWhy && "rotate-180")}>▾</span>
        </div>
        {showWhy && (
          <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
            <p className="text-sm text-green-900 pt-3 leading-relaxed">
              Almanya'da banka seçmek göründüğü kadar basit değil. N26, Revolut gibi tam dijital bankalar; DKB, ING gibi direkt bankalar; Sparkasse, Volksbank gibi şubeli yerel bankalar; Trade Republic gibi yatırım odaklı platformlar… Hangisinin sana uygun olduğu, günlük alışkanlıklarına, yatırım ihtiyacına, şube gereksinimlerine ve expat statüne göre değişir. Bu araç, 20 kısa soruyla profilini çıkarır ve sana en uygun banka kategorisini somut gerekçelerle önerir.
            </p>
          </div>
        )}
      </div>

      {!showResult && (
        <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-google-red">Soru {currentQuestion + 1} / {totalQuestions}</span>
            <button onClick={handleReset} className="text-sm text-google-red hover:opacity-75 flex items-center gap-1">
              Sıfırla
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-google-red transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Question Card */}
      {!showResult && (
        <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
          <div className="text-google-blue text-xs font-semibold uppercase tracking-widest mb-1">
            {question.category}
          </div>
          <h2 className="text-gray-900 font-bold text-lg leading-tight mb-1">{question.title}</h2>
          <p className="text-gray-500 text-sm mb-4">{question.desc}</p>

          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={cn(
                  'w-full p-4 rounded-lg border-2 text-left transition-all',
                  answers[question.id] === option.key
                    ? 'border-google-blue bg-blue-100'
                    : 'border-google-blue/30 bg-blue-50/60 hover:bg-blue-100/80 hover:border-google-blue'
                )}
              >
                <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ← Geri
            </button>
            <span className="text-xs text-gray-400">Seçince otomatik ilerler</span>
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <>
          <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
            <h2 className="text-gray-900 font-bold text-2xl mb-0.5">Sonuç</h2>
            <p className="text-gray-500 text-sm">Cevaplarına göre en uygun bankacılık profilleri</p>
          </div>

          {recommendations.map((rec, idx) => (
            <div
              key={rec.bank.id}
              className={cn(
                'bg-white rounded-xl border-2 p-5',
                idx === 0 ? 'border-google-yellow' :
                idx === 1 ? 'border-google-blue' : 'border-google-green'
              )}
            >
              <h3 className="text-lg font-bold mb-2">
                {rec.rank} - {rec.bank.name} - {idx === 0 ? 'Ana Öneri' : idx === 1 ? 'Alternatif' : 'Üçüncü Seçenek'}
              </h3>

              {rec.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {rec.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{tag}</span>
                  ))}
                </div>
              )}

              <p className="text-sm font-semibold text-gray-700 mb-2">
                Uygunluk Skoru: <span className="text-google-green">{Math.round(rec.bank.score)}</span>
              </p>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Neden bu banka?</p>
                <ul className="space-y-1">
                  {rec.bullets.slice(0, idx === 0 ? 5 : 2).map((b, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400 shrink-0">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-orange bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Sıfırla
          </button>
          <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-blue bg-google-blue text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
          </button>
          <Link href="/" className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Ana Sayfaya Dön
          </Link>
        </>
      )}
      <Link href="/" className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
