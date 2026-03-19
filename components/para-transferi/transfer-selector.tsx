'use client';

import { useState, useCallback, useMemo } from 'react';
import { TRANSFER_SYSTEMS } from '@/constants/para-transferi/systems';
import { QUESTIONS } from '@/constants/para-transferi/questions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';
import { 
  RotateCcw, 
  Info, 
  ChevronLeft,
  Check,
  Copy,
  Award,
  TrendingUp,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

interface Answer {
  questionId: number;
  answerId: string;
}

interface SystemResult {
  system: typeof TRANSFER_SYSTEMS[0];
  score: number;
}

export function TransferSelector() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [results, setResults] = useState<SystemResult[] | null>(null);
  const [copied, setCopied] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  const handleAnswer = useCallback((answerId: string) => {
    const newAnswers = [...answers, { questionId: question.id, answerId }];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  }, [answers, currentQuestion, question.id]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  }, [currentQuestion, answers]);

  const handleReset = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  }, []);

  const calculateResults = (allAnswers: Answer[]) => {
    const scores = new Map<string, number>();

    // Her sistem için başlangıç puanı
    TRANSFER_SYSTEMS.forEach(sys => {
      scores.set(sys.id, 0);
    });

    // Her cevabı işle
    allAnswers.forEach(answer => {
      const q = QUESTIONS.find(q => q.id === answer.questionId);
      const a = q?.answers.find(a => a.id === answer.answerId);
      if (!a?.weights) return;

      // Ağırlıkları uygula
      TRANSFER_SYSTEMS.forEach(sys => {
        let questionScore = 0;
        
        Object.entries(a.weights!).forEach(([key, weight]) => {
          const scoreKey = key as keyof typeof sys.scores;
          const baseScore = sys.scores[scoreKey] || 3;
          questionScore += baseScore * weight;
        });

        scores.set(sys.id, (scores.get(sys.id) || 0) + questionScore);
      });
    });

    // Sonuçları sırala
    const sorted: SystemResult[] = TRANSFER_SYSTEMS.map(sys => ({
      system: sys,
      score: scores.get(sys.id) || 0,
    })).sort((a, b) => b.score - a.score);

    setResults(sorted);
  };

  const topResults = useMemo(() => {
    if (!results) return [];
    return results.slice(0, 3);
  }, [results]);

  const copyResults = useCallback(() => {
    if (!topResults.length) return;
    
    const text = topResults.map((r, i) => 
      `${i + 1}. ${r.system.name} (${r.system.tags.join(', ')})`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [topResults]);

  if (results) {
    return (
      <Section contained className="py-8">
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Sonuçlar</h2>
            <p className="text-gray-600">Cevaplarınıza göre en uygun para transferi sistemleri:</p>
          </div>

          {/* Top 3 Results */}
          <div className="space-y-4 mb-8">
            {topResults.map((result, index) => (
              <div
                key={result.system.id}
                className={cn(
                  "border rounded-xl p-5 transition-all",
                  index === 0 ? "border-google-yellow bg-yellow-50/50" :
                  index === 1 ? "border-gray-300 bg-gray-50" :
                  "border-gray-200"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                    index === 0 ? "bg-google-yellow text-white" :
                    index === 1 ? "bg-gray-400 text-white" :
                    "bg-gray-300 text-white"
                  )}>
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{result.system.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {result.system.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              result.system.color === 'purple' ? "bg-purple-100 text-purple-700" :
                              result.system.color === 'red' ? "bg-red-100 text-red-700" :
                              "bg-blue-100 text-blue-700"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-5 gap-2 text-xs text-gray-600 mt-3">
                      <ScoreBadge icon={<TrendingUp className="w-3 h-3" />} label="Maliyet" value={result.system.scores.cost} />
                      <ScoreBadge icon={<Clock className="w-3 h-3" />} label="Hız" value={result.system.scores.speed} />
                      <ScoreBadge icon={<Zap className="w-3 h-3" />} label="Online" value={result.system.scores.online} />
                      <ScoreBadge icon={<Shield className="w-3 h-3" />} label="Resmi" value={result.system.scores.official} />
                      <ScoreBadge icon={<Award className="w-3 h-3" />} label="Basit" value={result.system.scores.simple} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Not:</strong> Bu araç yönlendirme amaçlıdır. Ücretler (kur farkı + sabit ücret), 
              teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir. Karar vermeden önce 
              sağlayıcının kendi fiyat hesaplayıcısında aynı tutar için &quot;toplam maliyeti&quot; kontrol edin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Yeniden Başlat
            </Button>
            <Button variant="primary" onClick={copyResults} className="flex items-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopyalandı' : 'Sonucu Kopyala'}
            </Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section contained className="py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Para Transferi Seçim Aracı</h1>
        <p className="text-gray-600">20 soruyla Türkiye ↔ Almanya para transferi için en uygun sistemi bulun!</p>
      </div>

      {/* Info Card */}
      <Card className="mb-6 p-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Info className="w-4 h-4" />
          {showInfo ? 'Bilgi Gizle' : 'Bilgi Göster'}
        </button>

        {showInfo && (
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Bu araç 20 soruyla size en uygun para transferi yöntemini önerir.</li>
              <li>• Sonuçlar yönlendirme amaçlıdır; son kararınızı vermeden önce sağlayıcının güncel şartlarını kontrol edin.</li>
              <li>• Ücretler (kur farkı + sabit ücret), teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir.</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Progress */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Soru {currentQuestion + 1} / {QUESTIONS.length}</span>
          <button
            onClick={handleReset}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Sıfırla
          </button>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-google-orange transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
        {question.description && (
          <p className="text-gray-600 mb-6">{question.description}</p>
        )}

        <div className="space-y-3">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswer(answer.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-google-blue hover:bg-blue-50/50",
                "border-gray-200"
              )}
            >
              <span className="font-medium">{answer.label}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Geri
          </Button>
          <span className="text-sm text-gray-500 self-center">
            {currentQuestion + 1} / {QUESTIONS.length}
          </span>
        </div>
      </Card>
    </Section>
  );
}

// ==================== ALT KOMPONENTLER ====================

interface ScoreBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function ScoreBadge({ icon, label, value }: ScoreBadgeProps) {
  const colorClass = value >= 4 ? 'text-green-600' : value >= 3 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="flex flex-col items-center">
      <div className={cn("mb-1", colorClass)}>{icon}</div>
      <span className="text-gray-500">{label}</span>
      <span className={cn("font-bold", colorClass)}>{value}/5</span>
    </div>
  );
}
