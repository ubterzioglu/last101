'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Calculator, TrendingUp, CheckCircle, Clock, Shield } from 'lucide-react';

interface TransferProvider {
  id: string;
  name: string;
  logo: string;
  feeType: 'fixed' | 'percentage' | 'hybrid';
  fixedFee: number;
  percentageFee: number;
  minFee: number;
  exchangeRateMargin: number;
  transferTime: string;
  rating: number;
  features: string[];
}

const PROVIDERS: TransferProvider[] = [
  {
    id: 'wise',
    name: 'Wise',
    logo: '💰',
    feeType: 'percentage',
    fixedFee: 0.5,
    percentageFee: 0.5,
    minFee: 0.5,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.8,
    features: ['Düşük ücretler', 'Şeffaf kur', 'Hızlı transfer', 'Mobil uygulama'],
  },
  {
    id: 'remitly',
    name: 'Remitly',
    logo: '🌍',
    feeType: 'hybrid',
    fixedFee: 1.99,
    percentageFee: 1.5,
    minFee: 1.99,
    exchangeRateMargin: 1.0,
    transferTime: '1-3 iş günü',
    rating: 4.7,
    features: ['Hızlı transfer', 'Promosyonlar', 'Mobil uygulama', '7/24 destek'],
  },
  {
    id: 'western-union',
    name: 'Western Union',
    logo: '🔗',
    feeType: 'hybrid',
    fixedFee: 2.99,
    percentageFee: 2.0,
    minFee: 2.99,
    exchangeRateMargin: 1.5,
    transferTime: '1-3 iş günü',
    rating: 4.5,
    features: ['Geniş ağ', 'Nakit teslimat', 'Anında transfer', 'Global'],
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    logo: '💵',
    feeType: 'hybrid',
    fixedFee: 2.99,
    percentageFee: 2.0,
    minFee: 2.99,
    exchangeRateMargin: 1.5,
    transferTime: '1-3 iş günü',
    rating: 4.4,
    features: ['Nakit teslimat', 'Hızlı transfer', 'Global ağ', 'Mobil uygulama'],
  },
  {
    id: 'xe',
    name: 'XE Money Transfer',
    logo: '📊',
    feeType: 'percentage',
    fixedFee: 0,
    percentageFee: 0.5,
    minFee: 0,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.6,
    features: ['Şeffaf kur', 'Düşük ücretler', 'Kur takibi', 'Mobil uygulama'],
  },
  {
    id: 'revolut',
    name: 'Revolut',
    logo: '🏦',
    feeType: 'percentage',
    fixedFee: 0,
    percentageFee: 0.5,
    minFee: 0,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.7,
    features: ['Şeffaf kur', 'Düşük ücretler', 'Mobil uygulama', 'Kart'],
  },
];

const EXCHANGE_RATE = 0.032; // 1 EUR = 0.032 TRY (örnek)

export default function ParaTransferiClient() {
  const [amount, setAmount] = useState<number>(1000);
  const [showResults, setShowResults] = useState(false);

  const calculateTransfer = (provider: TransferProvider) => {
    let fee = 0;
    if (provider.feeType === 'fixed') {
      fee = provider.fixedFee;
    } else if (provider.feeType === 'percentage') {
      fee = Math.max(amount * (provider.percentageFee / 100), provider.minFee);
    } else {
      fee = Math.max(
        provider.fixedFee + amount * (provider.percentageFee / 100),
        provider.minFee
      );
    }

    const exchangeRate = EXCHANGE_RATE * (1 - provider.exchangeRateMargin / 100);
    const receivedAmount = (amount - fee) * exchangeRate;

    return {
      fee,
      exchangeRate,
      receivedAmount,
      effectiveRate: receivedAmount / amount,
    };
  };

  const results = PROVIDERS.map((provider) => ({
    ...provider,
    ...calculateTransfer(provider),
  })).sort((a, b) => b.receivedAmount - a.receivedAmount);

  const formatCurrency = (value: number, currency: 'EUR' | 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Info Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-google-blue">
        <div className="px-5 pt-5 pb-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Para Transferi Seçim Aracı
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Almanya'dan Türkiye'ye en uygun transfer yöntemini bulun
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-red">
        <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Transfer Bilgileri
        </h2>

        <div className="grid gap-4">
          {/* Amount */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">
              Transfer Miktarı (€)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
              placeholder="1000"
            />
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={14} />
              <span>
                Mevcut Kur: 1 EUR = {EXCHANGE_RATE.toFixed(4)} TRY (örnek)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowResults(true)}
          disabled={amount <= 0}
          className={cn(
            'mt-4 w-full py-3 px-6 font-semibold rounded-xl transition-all',
            amount <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-google-blue text-white hover:bg-blue-600 active:scale-95'
          )}
        >
          Karşılaştır
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <>
          {/* Best Option */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-green">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">En İyi Seçenek</h2>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-4 border border-google-blue/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{results[0].logo}</div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {results[0].name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ⭐ {results[0].rating}/5
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Alınacak Tutar</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(results[0].receivedAmount, 'TRY')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Transfer Ücreti</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(results[0].fee, 'EUR')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Providers */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-yellow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tüm Sağlayıcılar
            </h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={cn(
                    'rounded-xl p-4 border transition-all',
                    index === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-google-blue/10 border-google-blue/20'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{result.logo}</div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {result.name}
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              En İyi
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          ⭐ {result.rating}/5 • {result.transferTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(result.receivedAmount, 'TRY')}
                      </div>
                      <div className="text-xs text-gray-500">
                        +{formatCurrency(result.fee, 'EUR')} ücret
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border border-gray-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-blue">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">İpuçları</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Daha büyük transferlerde sabit ücretler daha az önemli hale gelir,
                  yüzdelik ücretlere dikkat edin.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Kur farkı (exchange rate margin) toplam maliyeti önemli ölçüde
                  etkiler.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  İlk transferlerde promosyonlar ve ücretsiz transferler olabilir.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
