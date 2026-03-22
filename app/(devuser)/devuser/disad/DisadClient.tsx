'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const ADMIN_KEY_STORAGE = 'devuser_dis_admin_key_v1';
const LIST_API_URL = '/api/devuser-dis-admin-list';
const ACTION_API_URL = '/api/devuser-dis-admin-action';

interface DisRow {
  id: string;
  topic: string;
  full_name: string | null;
  anonymous: boolean;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
}

function toDate(value: string | null | undefined): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('tr-TR');
}

export default function DisadClient() {
  const [adminKey, setAdminKey] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [rows, setRows] = useState<DisRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<DisRow[]>([]);
  const [search, setSearch] = useState('');
  const [tableStatus, setTableStatus] = useState('Yükleniyor...');
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0 });
  const keyRef = useRef(adminKey);
  keyRef.current = adminKey;

  function applyFilter(allRows: DisRow[], query: string) {
    if (!query.trim()) {
      setFilteredRows(allRows);
      return allRows;
    }
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const filtered = allRows.filter(item => {
      const haystack = [
        item.full_name ?? '',
        item.anonymous ? 'anonim' : '',
        item.topic ?? '',
        item.status ?? '',
      ].join(' ').toLowerCase();
      return tokens.every(t => haystack.includes(t));
    });
    setFilteredRows(filtered);
    return filtered;
  }

  async function apiGet(url: string, key: string) {
    const res = await fetch(url, { method: 'GET', headers: { 'x-admin-key': key } });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }

  async function apiPost(url: string, body: object, key: string) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }

  async function loadRows(key: string, currentSearch: string) {
    setTableStatus('Yükleniyor...');
    try {
      const payload = await apiGet(`${LIST_API_URL}?status=all&limit=1000`, key);
      const allRows: DisRow[] = Array.isArray(payload.items) ? payload.items : [];
      setRows(allRows);
      const filtered = applyFilter(allRows, currentSearch);
      setStats({
        total: allRows.length,
        pending: allRows.filter(r => r.status === 'pending').length,
        approved: allRows.filter(r => r.status === 'approved').length,
      });
      if (filtered.length === 0) setTableStatus('');
      else setTableStatus('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Yükleme hatası';
      setTableStatus(msg);
    }
  }

  async function login() {
    const key = adminKeyInput.trim();
    if (!key) { setLoginError('Admin key girin.'); return; }
    setLoginStatus('Bağlantı kontrol ediliyor...');
    setLoginError('');
    try {
      await apiGet(`${LIST_API_URL}?limit=1`, key);
      sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
      setAdminKey(key);
      setLoggedIn(true);
      setLoginStatus('');
      loadRows(key, '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Giriş başarısız.';
      setLoginError(msg);
      setLoginStatus('');
    }
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey('');
    setAdminKeyInput('');
    setLoggedIn(false);
    setRows([]);
    setFilteredRows([]);
    setSearch('');
    setLoginStatus('Çıkış yapıldı.');
    setLoginError('');
  }

  async function runAction(action: string, id: string) {
    if (!id) return;
    if (action === 'delete' && !window.confirm('Bu kayıt silinsin mi?')) return;
    try {
      await apiPost(ACTION_API_URL, { action, id }, keyRef.current);
      loadRows(keyRef.current, search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'İşlem başarısız.';
      window.alert(msg);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (!saved) return;
    setAdminKey(saved);
    setLoggedIn(true);
    loadRows(saved, '').catch(() => { logout(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchChange(val: string) {
    setSearch(val);
    applyFilter(rows, val);
    setStats(prev => ({ ...prev }));
  }

  const css = `
    .disad-wrap { display: flex; flex-direction: column; gap: 20px; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 24px; position: relative; overflow: hidden; }
    .hero { border-color: rgba(66,133,244,0.3); }
    .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%); }
    .domain { color: #4285F4; font-weight: 600; font-size: 14px; margin-bottom: 8px; }
    .hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; margin: 0; color: #fff; }
    .login-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .login-grid input { flex: 1; min-width: 200px; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; font-size: 15px; font-family: inherit; }
    .login-grid input:focus { outline: none; border-color: #4285F4; box-shadow: 0 0 0 3px rgba(66,133,244,0.15); }
    .status-text { margin-top: 12px; font-size: 14px; color: rgba(255,255,255,0.6); }
    .status-text.error { color: #f28b82; }
    .btn-primary { padding: 12px 20px; background: #4285F4; border: 1px solid #4285F4; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s ease; }
    .btn-primary:hover:not(:disabled) { background: #3367d6; border-color: #3367d6; }
    .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn-secondary { padding: 10px 16px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.2s ease; text-decoration: none; display: inline-flex; align-items: center; }
    .btn-secondary:hover { background: rgba(255,255,255,0.14); }
    .btn-danger { padding: 10px 16px; background: rgba(234,67,53,0.12); border: 1px solid rgba(234,67,53,0.35); border-radius: 10px; color: #f28b82; font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.2s ease; }
    .btn-danger:hover { background: rgba(234,67,53,0.2); }
    .row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; }
    .stat-box { flex: 1; min-width: 100px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px; text-align: center; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: #fff; }
    .toolbar { display: flex; gap: 12px; flex-wrap: wrap; }
    .toolbar input { flex: 1; min-width: 200px; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; font-size: 15px; font-family: inherit; }
    .toolbar input:focus { outline: none; border-color: #4285F4; box-shadow: 0 0 0 3px rgba(66,133,244,0.15); }
    .toolbar input::placeholder { color: rgba(255,255,255,0.3); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { text-align: left; padding: 12px 14px; color: rgba(255,255,255,0.5); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; color: rgba(255,255,255,0.85); }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255,255,255,0.02); }
    td.empty { text-align: center; color: rgba(255,255,255,0.4); padding: 32px; }
    .topic-cell { min-width: 340px; max-width: 560px; white-space: pre-wrap; word-break: break-word; line-height: 1.45; }
    .meta-line { display: block; margin-top: 6px; color: rgba(255,255,255,0.6); font-size: 12px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; min-width: 94px; text-align: center; }
    .badge.approved { background: rgba(52,168,83,0.15); color: #81c995; border: 1px solid rgba(52,168,83,0.3); }
    .badge.pending { background: rgba(251,188,5,0.15); color: #fde293; border: 1px solid rgba(251,188,5,0.3); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .stats { gap: 10px; }
      .stat-value { font-size: 22px; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="disad-wrap">
        {/* Hero */}
        <div className="card hero">
          <div className="domain">almanya101.de</div>
          <h1>DevUser DIS Admin</h1>
        </div>

        {/* Login card */}
        {!loggedIn && (
          <div className="card">
            <div className="login-grid">
              <input
                type="password"
                placeholder="Admin key"
                autoComplete="off"
                value={adminKeyInput}
                onChange={e => setAdminKeyInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); login(); } }}
              />
              <button className="btn-primary" type="button" onClick={login}>Panele Gir</button>
            </div>
            {loginStatus && <p className="status-text">{loginStatus}</p>}
            {loginError && <p className="status-text error">{loginError}</p>}
          </div>
        )}

        {/* Panel */}
        {loggedIn && (
          <>
            {/* Session bar */}
            <div className="card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>DIS admin oturumu açık</strong>
                <div className="row">
                  <Link className="btn-secondary" href="/devuser/dis">DIS Sayfası</Link>
                  <button className="btn-secondary" type="button" onClick={logout}>Çıkış</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="card stats">
              <div className="stat-box">
                <div className="stat-label">Toplam</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{stats.approved}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Filtre Sonucu</div>
                <div className="stat-value">{filteredRows.length}</div>
              </div>
            </div>

            {/* Search */}
            <div className="card">
              <div className="toolbar">
                <input
                  placeholder="Ara: ad veya konu..."
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                />
                <button className="btn-primary" type="button" onClick={() => loadRows(adminKey, search)}>Yenile</button>
              </div>
            </div>

            {/* Table */}
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Konu</th>
                      <th>Gönderen</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                      <th>Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableStatus && filteredRows.length === 0 ? (
                      <tr><td className="empty" colSpan={5}>{tableStatus}</td></tr>
                    ) : filteredRows.length === 0 ? (
                      <tr><td className="empty" colSpan={5}>Kayıt bulunamadı.</td></tr>
                    ) : (
                      filteredRows.map(item => {
                        const isApproved = String(item.status ?? '').toLowerCase() === 'approved';
                        const isPending = !isApproved;
                        const sender = item.anonymous ? 'Anonim' : (item.full_name ?? '-');
                        return (
                          <tr key={item.id}>
                            <td className="topic-cell">{item.topic ?? ''}</td>
                            <td>
                              {sender}
                              {item.anonymous && <span className="meta-line">anonim</span>}
                            </td>
                            <td>
                              <span className={`badge ${isApproved ? 'approved' : 'pending'}`}>
                                {isApproved ? 'approved' : 'pending'}
                              </span>
                            </td>
                            <td>{toDate(item.created_at)}</td>
                            <td>
                              <div className="actions">
                                <button
                                  type="button"
                                  className="btn-primary"
                                  disabled={isApproved}
                                  onClick={() => runAction('approve', item.id)}
                                >
                                  Onayla
                                </button>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  disabled={isPending}
                                  onClick={() => runAction('pending', item.id)}
                                >
                                  Beklemeye Al
                                </button>
                                <button
                                  type="button"
                                  className="btn-danger"
                                  onClick={() => runAction('delete', item.id)}
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
