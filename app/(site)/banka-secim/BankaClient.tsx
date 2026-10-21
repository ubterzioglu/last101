'use client';

import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PROFILES, BANKS, QUESTIONS } from './data';
import { BankRecommendation } from './types';
import { BankaResults } from './BankaResults';
import { Button } from '@/components/ui/Button';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { ToolOption } from '@/components/tools/ToolOption';

export default function BankaClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const totalQuestions = QUESTIONS.length;

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

  if (showResult) {
    return (
      <BankaResults
        recommendations={recommendations}
        copied={copied}
        onReset={handleReset}
        onCopy={handleCopy}
      />
    );
  }

  return (
    <ToolPanel>
      <ToolProgress current={currentQuestion + 1} total={totalQuestions} onReset={handleReset} />

      <ToolQuestionCard category={question.category} title={question.title} description={question.desc}>
        <div className="space-y-2">
          {question.options.map((option) => (
            <ToolOption
              key={option.key}
              selected={answers[question.id] === option.key}
              onClick={() => handleAnswer(option.key)}
              description={option.desc}
            >
              {option.label}
            </ToolOption>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="-ml-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-btn px-2 text-sm font-semibold text-ink transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Geri
          </button>
          <span className="text-xs text-muted">Seçince otomatik ilerler</span>
        </div>
      </ToolQuestionCard>

      <div className="flex justify-end">
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </div>
    </ToolPanel>
  );
}
