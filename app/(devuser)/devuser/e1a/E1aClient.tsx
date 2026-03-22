'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import Link from 'next/link';

const css = `
  .admin-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px;
    position: relative;
    overflow: hidden;
  }

  .hero {
    border-color: rgba(66,133,244,0.25);
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
  }

  .domain {
    font-size: 12px;
    font-weight: 600;
    color: #4285F4;
    text-transform: lowercase;
    margin-bottom: 6px;
  }

  .hero h1 {
    margin: 0;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
  }

  .login-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    margin-bottom: 10px;
  }

  .input {
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

  .input:focus {
    border-color: #4285F4;
  }

  .input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .btn-primary {
    padding: 10px 18px;
    background: linear-gradient(135deg, #4285F4 0%, #3367d6 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: opacity 0.2s;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    padding: 8px 14px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(255,255,255,0.12);
  }

  .btn-danger {
    padding: 6px 12px;
    background: rgba(234,67,53,0.15);
    border: 1px solid rgba(234,67,53,0.3);
    border-radius: 8px;
    color: #f28b82;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }

  .btn-danger:hover {
    background: rgba(234,67,53,0.25);
  }

  .status {
    font-size: 13px;
    padding: 6px 0;
    min-height: 22px;
  }

  .status.error {
    color: #f28b82;
  }

  .status.success {
    color: #81c995;
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .stat-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px;
    text-align: center;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 6px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }

  .toolbar {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
  }

  .section-title {
    margin: 0 0 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }

  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th {
    text-align: left;
    padding: 10px 12px;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    white-space: nowrap;
  }

  td {
    padding: 10px 12px;
    color: #e0e0e0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }

  td.empty {
    color: rgba(255,255,255,0.4);
    font-style: italic;
    text-align: center;
    padding: 20px;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .topic-cell {
    min-width: 280px;
    max-width: 520px;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.45;
  }

  .choices-cell {
    min-width: 180px;
  }

  .choices-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .choice-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 4px 9px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(115, 189, 255, 0.14);
    color: #93d1ff;
    border: 1px solid rgba(115, 189, 255, 0.35);
  }
`;

const ADMIN_KEY_STORAGE = 'event_e1_admin_key_v1';
const LIST_API_URL = '/api/event-e1-admin-list';
const ACTION_API_URL = '/api/event-e1-admin-action';

const CHOICE_LABELS: Record<string, string> = {
  tarih1: 'Tarih1 : 26 Şubat Perşembe 21:00 TR - 19:00 DE',
  tarih2: 'Tarih2 : 27 Şubat Cuma 21:00 TR - 19:00 DE',
  tarih3: 'Tarih3 : 2 Mart Pazartesi 21:00 TR - 19:00 DE',
};

interface VoteRow {
  id: number;
  full_name?: string;
  anonymous?: boolean;
  selected_dates?: string[];
  created_at?: string;
}

interface QuestionRow {
  id: number;
  question?: string;
  created_at?: string;
}

function toDate(value: string | null | undefined): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('tr-TR');
}

export function E1aClient() {
  const [adminKey, setAdminKeyState] = useState('');
  const adminKeyRef = useRef('');
  const [keyInput, setKeyInput] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [loginStatusType, setLoginStatusType] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [voteRows, setVoteRows] = useState<VoteRow[]>([]);
  const [questionRows, setQuestionRows] = useState<QuestionRow[]>([]);
  const [filteredVotes, setFilteredVotes] = useState<VoteRow[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionRow[]>([]);

  const setStatus = (message: string, type = '') => {
    setLoginStatus(message);
    setLoginStatusType(type);
  };

  const apiGet = useCallback(async (url: string) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-admin-key': adminKeyRef.current },
    });
    const payload = await res.json().catch(() => ({})) as { error?: string };
    if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }, []);

  const apiPost = useCallback(async (url: string, body: unknown) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKeyRef.current },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({})) as { error?: string };
    if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }, []);

  const applyFilter = useCallback(
    (votes: VoteRow[], questions: QuestionRow[], query: string) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        setFilteredVotes([...votes]);
        setFilteredQuestions([...questions]);
        return;
      }
      const tokens = q.split(/\s+/).filter(Boolean);
      setFilteredVotes(
        votes.filter((item) => {
          const haystack = [
            item.full_name || '',
            item.anonymous ? 'anonim' : '',
            ...(Array.isArray(item.selected_dates) ? item.selected_dates : []),
          ].join(' ').toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        })
      );
      setFilteredQuestions(
        questions.filter((item) => {
          const haystack = (item.question || '').toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        })
      );
    },
    []
  );

  const loadRows = useCallback(async () => {
    const payload = await apiGet(`${LIST_API_URL}?vote_limit=1000&question_limit=1000`) as {
      vote_items?: VoteRow[];
      question_items?: QuestionRow[];
    };
    const votes = Array.isArray(payload.vote_items) ? payload.vote_items : [];
    const questions = Array.isArray(payload.question_items) ? payload.question_items : [];
    setVoteRows(votes);
    setQuestionRows(questions);
    applyFilter(votes, questions, searchQuery);
  }, [apiGet, applyFilter, searchQuery]);

  const refreshAll = useCallback(async () => {
    try {
      await loadRows();
    } catch (err) {
      const error = err as Error;
      const msg = error.message || 'Yükleme hatası';
      setVoteRows([]);
      setQuestionRows([]);
      setFilteredVotes([{ id: -1, full_name: msg } as VoteRow]);
      setFilteredQuestions([]);
    }
  }, [loadRows]);

  const login = useCallback(async () => {
    const key = keyInput.trim();
    if (!key) {
      setStatus('Admin key/şifre girin.', 'error');
      return;
    }
    adminKeyRef.current = key;
    setAdminKeyState(key);
    setStatus('Bağlantı kontrol ediliyor...');

    try {
      await apiGet(`${LIST_API_URL}?vote_limit=1&question_limit=1`);
      sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
      setLoggedIn(true);
      setStatus('');
      await refreshAll();
    } catch (err) {
      const error = err as Error;
      adminKeyRef.current = '';
      setAdminKeyState('');
      setStatus(error.message || 'Giriş başarısız.', 'error');
    }
  }, [keyInput, apiGet, refreshAll]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    adminKeyRef.current = '';
    setAdminKeyState('');
    setKeyInput('');
    setLoggedIn(false);
    setVoteRows([]);
    setQuestionRows([]);
    setFilteredVotes([]);
    setFilteredQuestions([]);
    setStatus('Çıkış yapıldı.');
  }, []);

  const runAction = useCallback(
    async (action: string, target: string, id: number) => {
      if (!id || !target) return;
      if (action === 'delete' && !window.confirm('Bu kayıt silinsin mi?')) return;
      try {
        await apiPost(ACTION_API_URL, { action, target, id });
        await refreshAll();
      } catch (err) {
        const error = err as Error;
        window.alert(error.message || 'İşlem başarısız.');
      }
    },
    [apiPost, refreshAll]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (!saved) return;
    adminKeyRef.current = saved;
    setAdminKeyState(saved);
    setLoggedIn(true);
    refreshAll().catch(() => logout());
  }, [refreshAll, logout]);

  useEffect(() => {
    applyFilter(voteRows, questionRows, searchQuery);
  }, [searchQuery, voteRows, questionRows, applyFilter]);

  const handleTableClick = (
    e: React.MouseEvent<HTMLTableSectionElement>,
    target: string
  ) => {
    const button = (e.target as HTMLElement).closest('button[data-action][data-id]') as HTMLButtonElement | null;
    if (!button) return;
    runAction(button.dataset.action!, target, Number(button.dataset.id));
  };

  return (
    <>
      <style>{css}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön" frameVariant="wide">
        <div className="admin-container">
          <div className="card hero">
            <div className="domain">almanya101.de</div>
            <h1>Event E1 Admin</h1>
          </div>

          {!loggedIn && (
            <div className="card">
              <div className="login-grid">
                <input
                  className="input"
                  type="password"
                  placeholder="Admin key / şifre"
                  autoComplete="off"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); login(); } }}
                />
                <button className="btn-primary" type="button" onClick={login}>Panele Gir</button>
              </div>
              <div className={`status ${loginStatusType}`}>{loginStatus}</div>
            </div>
          )}

          {loggedIn && (
            <>
              <div className="card">
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Event E1 admin oturumu açık</strong>
                  <div className="row">
                    <Link className="btn-secondary" href="/devuser/e1">E1 Sayfası</Link>
                    <button className="btn-secondary" type="button" onClick={logout}>Çıkış</button>
                  </div>
                </div>
              </div>

              <div className="card stats">
                <div className="stat-box">
                  <div className="stat-label">Toplam Oy</div>
                  <div className="stat-value">{voteRows.length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Toplam Soru</div>
                  <div className="stat-value">{questionRows.length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Filtreli Oy</div>
                  <div className="stat-value">{filteredVotes.length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Filtreli Soru</div>
                  <div className="stat-value">{filteredQuestions.length}</div>
                </div>
              </div>

              <div className="card">
                <div className="toolbar">
                  <input
                    className="input"
                    placeholder="Ara: ad, seçim veya soru..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn-primary" type="button" onClick={refreshAll}>Yenile</button>
                </div>
              </div>

              <div className="card">
                <h2 className="section-title">Tarih Oyları</h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Ad Soyad</th>
                        <th>Seçimler</th>
                        <th>Tarih</th>
                        <th>Aksiyon</th>
                      </tr>
                    </thead>
                    <tbody onClick={(e) => handleTableClick(e, 'vote')}>
                      {filteredVotes.length === 0 ? (
                        <tr><td className="empty" colSpan={4}>Kayıt bulunamadı.</td></tr>
                      ) : (
                        filteredVotes.map((item) => (
                          <tr key={item.id}>
                            <td>{item.anonymous ? 'Anonim' : (item.full_name || '-')}</td>
                            <td className="choices-cell">
                              {Array.isArray(item.selected_dates) && item.selected_dates.length > 0 ? (
                                <div className="choices-wrap">
                                  {item.selected_dates.map((key) => (
                                    <span className="choice-badge" key={key}>
                                      {CHOICE_LABELS[key] || key}
                                    </span>
                                  ))}
                                </div>
                              ) : <span>-</span>}
                            </td>
                            <td>{toDate(item.created_at)}</td>
                            <td>
                              <div className="actions">
                                <button
                                  type="button"
                                  className="btn-danger"
                                  data-action="delete"
                                  data-id={item.id}
                                >Sil</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h2 className="section-title">Sorular</h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Soru</th>
                        <th>Tarih</th>
                        <th>Aksiyon</th>
                      </tr>
                    </thead>
                    <tbody onClick={(e) => handleTableClick(e, 'question')}>
                      {filteredQuestions.length === 0 ? (
                        <tr><td className="empty" colSpan={3}>Kayıt bulunamadı.</td></tr>
                      ) : (
                        filteredQuestions.map((item) => (
                          <tr key={item.id}>
                            <td className="topic-cell">{item.question || ''}</td>
                            <td>{toDate(item.created_at)}</td>
                            <td>
                              <div className="actions">
                                <button
                                  type="button"
                                  className="btn-danger"
                                  data-action="delete"
                                  data-id={item.id}
                                >Sil</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </DevUserShell>
    </>
  );
}
