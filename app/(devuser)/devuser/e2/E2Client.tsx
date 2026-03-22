'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';

const css = `
  .container1 {
    height: auto;
    min-height: calc(100dvh - 24px);
    display: flex;
    flex-direction: column;
    overflow: visible;
    gap: 10px;
  }

  .container1 > .card:last-child {
    min-height: 0;
    display: block;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px;
    position: relative;
    overflow: hidden;
  }

  .card p {
    margin: 0;
    color: #cfcfcf;
    line-height: 1.5;
    font-size: 14px;
  }

  .hero-card1 {
    background: rgba(255,255,255,0.04);
    border-color: rgba(66,133,244,0.25);
  }

  .hero-card1::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
  }

  .hero-domain1 {
    font-size: 12px;
    font-weight: 600;
    color: #4285F4;
    text-transform: lowercase;
    margin-bottom: 6px;
  }

  .hero-card1 h3 {
    margin: 0 0 8px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }

  .stack-form {
    display: grid;
    gap: 12px;
  }

  .field-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .form-input {
    width: 100%;
    padding: 10px 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    border-color: #4285F4;
  }

  .form-input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .textarea-input {
    min-height: 120px;
    resize: vertical;
  }

  .checkbox-group {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
  }

  .checkbox-label {
    display: flex;
    margin: 0;
    padding: 10px;
    justify-content: flex-start;
    min-height: 44px;
    align-items: flex-start;
    gap: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 4px;
    flex: 0 0 auto;
    accent-color: #4285F4;
  }

  .char-meta {
    text-align: right;
    color: #9a9a9a;
    font-size: 12px;
  }

  .hp-field {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .form-status {
    display: none;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 600;
  }

  .form-status.loading {
    display: block;
    background: #3e2d06;
    color: #ffe08a;
  }

  .form-status.success {
    display: block;
    background: #143b27;
    color: #9af0be;
  }

  .form-status.error {
    display: block;
    background: #46181d;
    color: #ff9aa6;
  }

  .head-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .head-row h4 {
    margin: 0;
    color: #fff;
    font-size: 17px;
  }

  .refresh-btn {
    min-height: 34px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: 8px;
    border: none;
    background: #2a2a2a;
    color: #fff;
    cursor: pointer;
  }

  .refresh-btn:hover {
    background: #3a3a3a;
  }

  .result-meta {
    color: #a9a9a9;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .result-grid {
    display: grid;
    gap: 10px;
  }

  .result-card {
    background: #161616;
    border: 1px solid #2d2d2d;
    border-radius: 10px;
    padding: 10px;
  }

  .result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
    color: #f2f2f2;
    font-size: 13px;
    font-weight: 600;
  }

  .topic-label {
    display: block;
    white-space: pre-line;
    line-height: 1.3;
  }

  .result-bar {
    height: 8px;
    width: 100%;
    border-radius: 999px;
    background: #2b2b2b;
    overflow: hidden;
  }

  .result-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #89dcff, #56b3ff);
    transition: width 0.24s ease;
  }

  .question-list {
    display: grid;
    gap: 8px;
  }

  .question-item {
    background: #161616;
    border: 1px solid #2f2f2f;
    border-radius: 10px;
    padding: 10px;
  }

  .question-text {
    margin: 0;
    color: #f7f7f7;
    font-size: 14px;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .question-meta {
    margin-top: 8px;
    color: #a5a5a5;
    font-size: 12px;
  }

  .empty-state {
    color: #a7a7a7;
    font-size: 13px;
  }

  .btn {
    padding: 10px 16px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(135deg, #4285F4 0%, #3367d6 100%);
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const VOTE_SUBMIT_API_URL = '/api/event-e2-submit';
const VOTE_RESULTS_API_URL = '/api/event-e2-results';
const QUESTION_SUBMIT_API_URL = '/api/event-e2-question-submit';
const QUESTION_LIST_API_URL = '/api/event-e2-question-list';

const TOPIC_KEYS = [
  'ai-tools',
  'industry-trends',
  'ai-vs-coding',
  'nonprofit',
  'ai-collaboration',
  'app-testing',
  'state-groups',
  'ai-usage',
  'working-conditions',
  'project-presentations',
  'mutual-support',
] as const;

type TopicKey = typeof TOPIC_KEYS[number];

const TOPIC_LABELS: Record<TopicKey, string> = {
  'ai-tools': 'AI Araçları ve Eğitim',
  'industry-trends': 'Sektör Trendleri',
  'ai-vs-coding': 'AI vs Geleneksel Kodlama',
  'nonprofit': 'Kâr Amacı Gütmeyen Dernek',
  'ai-collaboration': 'AI ile İşbirliği',
  'app-testing': 'Uygulama Test Grubu',
  'state-groups': 'Eyalet Bazlı Gruplar',
  'ai-usage': 'Yapay Zeka Kullanımı',
  'working-conditions': "Almanya'da Çalışma Koşulları",
  'project-presentations': 'Proje Tanıtımları',
  'mutual-support': 'Birbirimize Destek',
};

type StatusType = 'loading' | 'success' | 'error' | '';

interface ResultStats {
  counts?: Record<string, number>;
  total_submissions?: number;
  total_votes?: number;
}

interface QuestionItem {
  question: string;
  created_at: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR');
}

export function E2Client() {
  const [voteName, setVoteName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [voteStatusMsg, setVoteStatusMsg] = useState('');
  const [voteStatusType, setVoteStatusType] = useState<StatusType>('');
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const websiteTrapVote = useRef('');

  const [questionText, setQuestionText] = useState('');
  const [questionStatusMsg, setQuestionStatusMsg] = useState('');
  const [questionStatusType, setQuestionStatusType] = useState<StatusType>('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const websiteTrapQuestion = useRef('');

  const [resultsMeta, setResultsMeta] = useState('Yükleniyor...');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [maxCount, setMaxCount] = useState(1);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState('');

  const loadVoteResults = useCallback(async () => {
    setResultsMeta('Yükleniyor...');
    try {
      const response = await fetch(VOTE_RESULTS_API_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; error?: string; stats?: ResultStats };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      const stats = payload.stats ?? {};
      const newCounts = stats.counts ?? {};
      const max = Math.max(...TOPIC_KEYS.map((k) => Number(newCounts[k] || 0)), 1);
      setCounts(newCounts);
      setMaxCount(max);
      setResultsMeta(
        `Toplam gönderim: ${stats.total_submissions ?? 0} | Toplam seçim: ${stats.total_votes ?? 0}`
      );
    } catch (err) {
      const error = err as Error;
      setResultsMeta(error.message || 'Sonuçlar yüklenemedi.');
    }
  }, []);

  const loadQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError('');
    try {
      const response = await fetch(`${QUESTION_LIST_API_URL}?limit=80`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; error?: string; items?: QuestionItem[] };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setQuestions(payload.items ?? []);
    } catch (err) {
      const error = err as Error;
      setQuestionsError(error.message || 'Konular yüklenemedi.');
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVoteResults();
    loadQuestions();
  }, [loadVoteResults, loadQuestions]);

  const toggleTopic = (value: string) => {
    setSelectedTopics((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoteStatusMsg('');
    setVoteStatusType('');

    const fullName = voteName.replace(/\r\n/g, '\n').trim().replace(/\n/g, ' ');
    if (!fullName) {
      setVoteStatusMsg('Ad soyad zorunlu.');
      setVoteStatusType('error');
      return;
    }
    if (!selectedTopics.length) {
      setVoteStatusMsg('En az bir konu seçmelisiniz.');
      setVoteStatusType('error');
      return;
    }

    setVoteSubmitting(true);
    setVoteStatusMsg('Kayıt alınıyor...');
    setVoteStatusType('loading');

    try {
      const response = await fetch(VOTE_SUBMIT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          anonymous: false,
          selected_topics: selectedTopics,
          website: websiteTrapVote.current,
        }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Gönderim başarısız');
      }
      setVoteName('');
      setSelectedTopics([]);
      setVoteStatusMsg('Konu seçimin alındı.');
      setVoteStatusType('success');
      await loadVoteResults();
    } catch (err) {
      const error = err as Error;
      setVoteStatusMsg(error.message || 'Gönderim sırasında hata oluştu.');
      setVoteStatusType('error');
    } finally {
      setVoteSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionStatusMsg('');
    setQuestionStatusType('');

    const question = questionText.replace(/\r\n/g, '\n').trim();
    if (!question) {
      setQuestionStatusMsg('Konu zorunlu.');
      setQuestionStatusType('error');
      return;
    }
    if (question.length > 500) {
      setQuestionStatusMsg('Konu en fazla 500 karakter olabilir.');
      setQuestionStatusType('error');
      return;
    }

    setQuestionSubmitting(true);
    setQuestionStatusMsg('Konu kaydediliyor...');
    setQuestionStatusType('loading');

    try {
      const response = await fetch(QUESTION_SUBMIT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, website: websiteTrapQuestion.current }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Konu gönderilemedi');
      }
      setQuestionText('');
      setQuestionStatusMsg('Konu gönderildi.');
      setQuestionStatusType('success');
      await loadQuestions();
    } catch (err) {
      const error = err as Error;
      setQuestionStatusMsg(error.message || 'Konu gönderilirken hata oluştu.');
      setQuestionStatusType('error');
    } finally {
      setQuestionSubmitting(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön" frameVariant="compact">
        <div className="container1">
          <div className="card hero-card1">
            <div className="hero-domain1">almanya101.de</div>
            <h3 style={{ marginBottom: 8 }}>almanya101.de ikinci etkinliğini sunar!</h3>
            <p style={{ color: 'rgba(255,255,255,.95)' }}>
              İkinci etkinliğimizin konu başlıklarını birlikte oyluyoruz.
            </p>
            <p style={{ color: 'rgba(255,255,255,.95)', marginTop: 6 }}>
              Konu seçimini ve istersen soru/öneri metnini ayrı ayrı gönderebilirsin.
            </p>
          </div>

          <div className="card">
            <div className="head-row">
              <h4>Konu Oylama Sonuçları</h4>
              <button className="refresh-btn" type="button" onClick={loadVoteResults}>Yenile</button>
            </div>
            <div className="result-meta">{resultsMeta}</div>
            <div className="result-grid">
              {TOPIC_KEYS.map((key) => {
                const count = Number(counts[key] || 0);
                const width = Math.round((count / maxCount) * 100);
                return (
                  <article className="result-card" key={key}>
                    <div className="result-row">
                      <span className="topic-label">{TOPIC_LABELS[key]}</span>
                      <span>{count} kişi</span>
                    </div>
                    <div className="result-bar">
                      <div className="result-fill" style={{ width: `${width}%` }} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginTop: 0, marginBottom: 10, color: '#fff' }}>Konu Seçimi Gönder</h4>
            <form onSubmit={handleVoteSubmit} className="stack-form" noValidate>
              <div>
                <label className="field-label" htmlFor="voteFullNameInput">Ad Soyad</label>
                <input
                  id="voteFullNameInput"
                  className="form-input"
                  type="text"
                  maxLength={80}
                  placeholder="Adınız soyadınız"
                  required
                  value={voteName}
                  onChange={(e) => setVoteName(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Konu Seç (birden fazla seçilebilir)</label>
                <div className="checkbox-group">
                  {TOPIC_KEYS.map((key) => (
                    <label className="checkbox-label" key={key}>
                      <input
                        type="checkbox"
                        name="topicChoice"
                        value={key}
                        checked={selectedTopics.includes(key)}
                        onChange={() => toggleTopic(key)}
                      />
                      <span className="topic-label">{TOPIC_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <input
                className="hp-field"
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                onChange={(e) => { websiteTrapVote.current = e.target.value; }}
              />
              <button className="btn btn-primary" type="submit" disabled={voteSubmitting}>
                {voteSubmitting ? 'Gönderiliyor...' : 'Konu Seçimini Gönder'}
              </button>
              {voteStatusMsg && (
                <div className={`form-status ${voteStatusType}`} style={{ display: 'block' }}>
                  {voteStatusMsg}
                </div>
              )}
            </form>
          </div>

          <div className="card">
            <h4 style={{ marginTop: 0, marginBottom: 10, color: '#fff' }}>Konu / Soru Gönder</h4>
            <form onSubmit={handleQuestionSubmit} className="stack-form" noValidate>
              <div>
                <label className="field-label" htmlFor="questionInput">Konu veya sorun</label>
                <textarea
                  id="questionInput"
                  className="form-input textarea-input"
                  maxLength={500}
                  placeholder="Metninizi yazın..."
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <div className="char-meta">{questionText.length} / 500</div>
              </div>
              <input
                className="hp-field"
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                onChange={(e) => { websiteTrapQuestion.current = e.target.value; }}
              />
              <button className="btn btn-primary" type="submit" disabled={questionSubmitting}>
                {questionSubmitting ? 'Gönderiliyor...' : 'Konuyu Gönder'}
              </button>
              {questionStatusMsg && (
                <div className={`form-status ${questionStatusType}`} style={{ display: 'block' }}>
                  {questionStatusMsg}
                </div>
              )}
            </form>
          </div>

          <div className="card">
            <div className="head-row">
              <h4>Gönderilen Konular</h4>
              <button className="refresh-btn" type="button" onClick={loadQuestions}>Yenile</button>
            </div>
            {questionsLoading ? (
              <div className="empty-state">Yükleniyor...</div>
            ) : questionsError ? (
              <div className="empty-state">{questionsError}</div>
            ) : questions.length === 0 ? (
              <div className="empty-state">Henüz konu yok.</div>
            ) : (
              <div className="question-list">
                {questions.map((item, i) => (
                  <article className="question-item" key={i}>
                    <p className="question-text">{item.question}</p>
                    <div className="question-meta">{formatDate(item.created_at)}</div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </DevUserShell>
    </>
  );
}
