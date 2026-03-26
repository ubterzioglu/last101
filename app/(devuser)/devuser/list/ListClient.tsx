'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { getDevUserClient } from '@/lib/supabase/devuser';

const USERS_API_URL = '/api/devuser-list';
const USER_COUNT_API_URL = '/api/devuser-count';
const REQUEST_TIMEOUT_MS = 12000;

// ---- types ----

interface DevUser {
  id?: string;
  ad_soyad: string;
  rol?: string;
  sehir?: string;
  deneyim_seviye?: string;
  is_arama_durumu?: string;
  freelance_aciklik?: string;
  profesyonel_destek_verebilir?: boolean;
  almanya_yasam?: boolean;
  guclu_alanlar?: string[];
  programlama_dilleri?: string[];
  framework_platformlar?: string[];
  devops_cloud?: string[];
  ilgi_konular?: string[];
  ogrenmek_istenen?: string[];
  kullanilan_ide?: string[];
  kullanilan_agent?: string[];
  linkedin_url?: string;
  whatsapp_tel?: string;
  iletisim_izni?: boolean;
  katilma_amaci?: string;
  created_at?: string;
}

interface QuickFilterState {
  activeJob: boolean;
  freelance: boolean;
  mentor: boolean;
  selectedExperience: string[];
}

// ---- helpers ----

function normalizeText(value: unknown): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9,+\s()-]/g, '')
    .trim();
}

function getExperienceBucket(value: unknown): string {
  const text = normalizeText(value);
  if (!text) return '';
  if (/\b10\s*\+/.test(text)) return '10+';
  if (/\b5\s*-\s*10\b/.test(text)) return '5-10';
  if (/\b3\s*-\s*5\b/.test(text)) return '3-5';
  if (/\b1\s*-\s*3\b/.test(text)) return '1-3';
  if (/\b0\s*-\s*1\b/.test(text)) return '0-1';
  return '';
}

function escapeHtml(text: unknown): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSafeLinkedInUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
  try {
    const url = new URL(rawUrl.trim());
    const hostname = url.hostname.toLowerCase();
    const isLinkedIn =
      hostname === 'linkedin.com' ||
      hostname === 'www.linkedin.com' ||
      hostname.endsWith('.linkedin.com');
    if (!isLinkedIn || (url.protocol !== 'https:' && url.protocol !== 'http:')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function getSafeWhatsappUrl(rawPhone: unknown): string | null {
  if (typeof rawPhone !== 'string') return null;
  const digits = rawPhone.replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
  timeoutMessage: string = 'İstek zaman aşımına uğradı.',
): Promise<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timerId !== null) clearTimeout(timerId);
  });
}

function createUserCardHtml(user: DevUser): string {
  const techStack = [
    ...(user.programlama_dilleri || []),
    ...(user.framework_platformlar || []),
    ...(user.devops_cloud || []),
  ].slice(0, 8);

  const badges: string[] = [];
  if (user.is_arama_durumu === 'Evet, aktif') {
    badges.push('<span class="badge badge-green">🟢 Aktif iş arıyor</span>');
  } else if (user.is_arama_durumu === 'Evet, pasif (firsat olursa)') {
    badges.push('<span class="badge">🔍 Pasif iş arıyor</span>');
  }
  if (user.freelance_aciklik && user.freelance_aciklik !== 'Hayir') {
    badges.push('<span class="badge badge-blue">💼 Freelance açık</span>');
  }
  if (user.profesyonel_destek_verebilir) {
    badges.push('<span class="badge badge-purple">🎓 Mentorluk verebilir</span>');
  }

  const safeLinkedinUrl = getSafeLinkedInUrl(user.linkedin_url);
  const safeWhatsappUrl =
    user.whatsapp_tel && user.iletisim_izni ? getSafeWhatsappUrl(user.whatsapp_tel) : null;

  const linkedinBtn = safeLinkedinUrl
    ? `<a href="${escapeHtml(safeLinkedinUrl)}" target="_blank" rel="noopener noreferrer" class="action-btn">LinkedIn</a>`
    : '';
  const whatsappBtn = safeWhatsappUrl
    ? `<a href="${escapeHtml(safeWhatsappUrl)}" target="_blank" rel="noopener noreferrer" class="action-btn">WhatsApp</a>`
    : '';

  const gucluAlanlarHtml =
    user.guclu_alanlar && user.guclu_alanlar.length > 0
      ? `<div class="section-title">Güçlü Alanlar</div>
         <div class="tech-tags">
           ${user.guclu_alanlar.slice(0, 5).map((a) => `<span class="tech-tag">${escapeHtml(a)}</span>`).join('')}
         </div>`
      : '';

  const techStackHtml =
    techStack.length > 0
      ? `<div class="section-title">Teknoloji Stack</div>
         <div class="tech-tags">
           ${techStack.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
         </div>`
      : '';

  const ilgiHtml =
    user.ilgi_konular && user.ilgi_konular.length > 0
      ? `<div class="section-title">İlgi Alanları</div>
         <div class="tech-tags">
           ${user.ilgi_konular.slice(0, 4).map((i) => `<span class="tech-tag">${escapeHtml(i)}</span>`).join('')}
         </div>`
      : '';

  const actionsHtml =
    linkedinBtn || whatsappBtn
      ? `<div class="user-actions">${linkedinBtn}${whatsappBtn}</div>`
      : '';

  return `
    <div class="user-card">
      <div class="user-card-main">
        <div class="user-card-left">
          <div class="user-header">
            <div>
              <h3 class="user-name">${escapeHtml(user.ad_soyad)}</h3>
              <div class="user-role">${escapeHtml(user.rol || 'Developer')}</div>
            </div>
          </div>
          ${badges.length > 0 ? `<div class="user-badges">${badges.join('')}</div>` : ''}
          <div class="user-info">
            ${user.sehir ? `<div class="info-row"><span class="info-icon">📍</span> ${escapeHtml(user.sehir)}</div>` : ''}
            ${user.deneyim_seviye ? `<div class="info-row"><span class="info-icon">⭐</span> ${escapeHtml(user.deneyim_seviye)} deneyim</div>` : ''}
            ${user.almanya_yasam ? `<div class="info-row"><span class="info-icon">🇩🇪</span> Almanya'da yaşıyor</div>` : ''}
          </div>
        </div>
        <div class="user-card-right">
          ${gucluAlanlarHtml}
          ${techStackHtml}
          ${ilgiHtml}
        </div>
      </div>
      ${actionsHtml}
    </div>
  `;
}

// ---- styles ----

const listStyles = `
  :root {
    --google-blue: #4285F4;
    --google-red: #EA4335;
    --google-yellow: #FBBC05;
    --google-green: #34A853;
    --dark-bg: #000000;
    --card-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --gradient-1: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
    --gradient-2: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
    --gradient-3: linear-gradient(135deg, #FBBC05 0%, #EA4335 100%);
  }
  .list-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
  }
  .list-card {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(20px);
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .hero-card1 {
    background: var(--card-bg);
    border: 1px solid rgba(66,133,244,0.3);
    position: relative;
    overflow: hidden;
  }
  .hero-card1::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--gradient-1);
  }
  .hero-top1 {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
  }
  .hero-domain1 { font-size: 14px; font-weight: 600; color: var(--google-blue); text-transform: lowercase; }
  .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  h3 { font-family: 'Space Grotesk', sans-serif; margin: 8px 0 0 0; font-size: 24px; color: #fff; }
  .auth-card { max-width: 480px; margin: 0 auto 20px auto; }
  .auth-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .auth-grid input {
    padding: 14px; background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border); border-radius: 12px;
    color: #fff; font-size: 15px; transition: all 0.3s;
    font-family: 'Inter', sans-serif;
  }
  .auth-grid input:focus { outline: none; border-color: var(--google-blue); box-shadow: 0 0 0 3px rgba(66,133,244,0.2); }
  .auth-grid input::placeholder { color: rgba(255,255,255,0.4); }
  .auth-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  .auth-note { margin: 16px 0 0 0; color: var(--text-secondary); font-size: 13px; }
  .auth-status { min-height: 18px; margin: 12px 0 0 0; font-size: 14px; color: var(--text-secondary); }
  .auth-status.error { color: var(--google-red); }
  .auth-status.success { color: var(--google-green); }
  .password-reset-link {
    display: inline-block; margin-top: 16px; color: var(--google-blue);
    font-size: 14px; text-decoration: none; cursor: pointer; transition: opacity 0.2s;
  }
  .password-reset-link:hover { opacity: 0.8; text-decoration: underline; }
  .list-btn {
    padding: 12px 24px; border: none; border-radius: 12px;
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Inter', sans-serif;
  }
  .list-btn-primary { background: var(--google-blue); color: #fff; }
  .list-btn-primary:hover { background: #3367d6; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(66,133,244,0.3); }
  .list-btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--glass-border); }
  .list-btn-secondary:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.2); }
  .dashboard-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .dashboard-card {
    background: var(--card-bg); border: 1px solid var(--glass-border);
    border-radius: 20px; padding: 20px; backdrop-filter: blur(20px);
    position: relative; overflow: hidden; transition: all 0.3s ease;
  }
  .dashboard-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
  .dashboard-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .dashboard-card.primary::before { background: var(--google-blue); }
  .dashboard-card.success::before { background: var(--google-green); }
  .dashboard-card.info::before { background: var(--google-yellow); }
  .dashboard-card.warning::before { background: var(--google-red); }
  .dashboard-value { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .dashboard-label { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
  .dashboard-icon { position: absolute; top: 16px; right: 16px; font-size: 24px; opacity: 0.5; }
  .main-layout { display: flex; gap: 20px; min-height: calc(100vh - 40px); }
  .sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 20px; height: fit-content; max-height: calc(100vh - 40px); overflow-y: auto; }
  .sidebar::-webkit-scrollbar { width: 6px; }
  .sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
  .sidebar::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 3px; }
  .sidebar .list-card { margin-bottom: 16px; }
  .sidebar-title {
    font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700;
    color: var(--google-blue); margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;
    display: flex; align-items: center; gap: 8px;
  }
  .sidebar-title::before { content: '☰'; font-size: 16px; }
  .sidebar-section { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--glass-border); }
  .sidebar-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .sidebar-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; display: block; text-transform: uppercase; letter-spacing: 0.3px; }
  .category-filter-group { display: flex; flex-direction: column; gap: 8px; }
  .category-btn {
    display: flex; align-items: center; gap: 10px; padding: 12px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
    border-radius: 12px; color: var(--text-secondary); font-size: 13px;
    cursor: pointer; transition: all 0.3s; text-align: left; width: 100%;
    font-family: 'Inter', sans-serif;
  }
  .category-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #fff; }
  .category-btn.active { background: rgba(66,133,244,0.15); border-color: var(--google-blue); color: #fff; }
  .category-btn .icon { font-size: 16px; width: 24px; text-align: center; }
  .category-btn .badge { margin-left: auto; font-size: 11px; padding: 3px 10px; background: rgba(255,255,255,0.1); border-radius: 20px; border: none; color: var(--text-secondary); }
  .category-btn.active .badge { background: var(--google-blue); color: #fff; }
  .sidebar-mobile-toggle {
    display: none; width: 100%; padding: 14px;
    background: var(--card-bg); border: 1px solid var(--glass-border);
    border-radius: 12px; color: #fff; font-size: 14px; cursor: pointer;
    margin-bottom: 16px; align-items: center; justify-content: space-between;
    backdrop-filter: blur(20px); font-family: 'Inter', sans-serif;
  }
  .sidebar-mobile-toggle::after { content: '▼'; font-size: 12px; transition: transform 0.2s; }
  .sidebar-mobile-toggle.open::after { transform: rotate(180deg); }
  .search-bar-container { margin-bottom: 20px; }
  .search-bar-container input {
    width: 100%; padding: 14px 16px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
    border-radius: 12px; color: #fff; font-size: 14px; transition: all 0.3s;
    font-family: 'Inter', sans-serif;
  }
  .search-bar-container input:focus { outline: none; border-color: var(--google-blue); box-shadow: 0 0 0 3px rgba(66,133,244,0.2); }
  .search-bar-container input::placeholder { color: rgba(255,255,255,0.4); }
  .checkbox-filter-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .checkbox-filter-row .checkbox-filter-item { flex: 0 0 auto; min-width: fit-content; max-width: 200px; }
  .checkbox-filter-item {
    display: flex; align-items: center; gap: 8px; padding: 10px 12px;
    border: 1px solid var(--glass-border); border-radius: 10px;
    background: rgba(255,255,255,0.05); cursor: pointer;
    font-size: 13px; color: var(--text-secondary); transition: all 0.3s;
  }
  .checkbox-filter-item:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); }
  .checkbox-filter-item input[type="checkbox"] { accent-color: var(--google-blue); margin: 0; width: 16px; height: 16px; cursor: pointer; }
  .view-all-btn {
    width: 100%; margin-top: 12px; padding: 14px;
    background: var(--gradient-1); border: none; border-radius: 12px;
    color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.3s; display: flex; align-items: center; justify-content: center;
    gap: 8px; font-family: 'Inter', sans-serif;
  }
  .view-all-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(66,133,244,0.3); }
  .view-all-btn.hidden { display: none; }
  .content-area { flex: 1; min-width: 0; }
  .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 4px; }
  .results-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; color: #fff; margin: 0; }
  .results-count { font-size: 14px; color: var(--text-secondary); background: var(--card-bg); padding: 8px 16px; border-radius: 20px; border: 1px solid var(--glass-border); }
  .user-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  .user-card {
    position: relative; display: flex; flex-direction: column; gap: 16px;
    border-radius: 20px; padding: 24px;
    border: 1px solid var(--glass-border); background: var(--card-bg);
    backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  }
  .user-card:hover { transform: translateY(-3px); border-color: rgba(66,133,244,0.3); box-shadow: 0 16px 40px rgba(66,133,244,0.15); }
  .user-card-main { display: grid; grid-template-columns: minmax(280px,320px) 1fr; gap: 24px; align-items: stretch; }
  .user-card-left { background: linear-gradient(165deg,rgba(66,133,244,0.1),rgba(255,255,255,0.02)); border: 1px solid rgba(66,133,244,0.2); border-radius: 16px; padding: 20px; }
  .user-card-right { background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 16px; padding: 20px; }
  .user-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .user-name { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 6px 0; line-height: 1.2; }
  .user-role { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(66,133,244,0.3); background: rgba(66,133,244,0.1); color: #8ab4f8; font-weight: 500; font-size: 12px; letter-spacing: 0.3px; }
  .user-badges { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; background: rgba(66,133,244,0.1); border: 1px solid rgba(66,133,244,0.25); border-radius: 999px; font-size: 11px; font-weight: 600; color: #8ab4f8; }
  .badge-green { background: rgba(52,168,83,0.1); border-color: rgba(52,168,83,0.3); color: #81c995; }
  .badge-blue { background: rgba(251,188,5,0.1); border-color: rgba(251,188,5,0.3); color: #fde293; }
  .badge-purple { background: rgba(234,67,53,0.1); border-color: rgba(234,67,53,0.3); color: #f28b82; }
  .user-info { margin: 0; }
  .info-row { display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary); }
  .info-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; margin-right: 10px; color: var(--google-blue); font-size: 14px; }
  .section-title { display: inline-flex; align-items: center; background: rgba(66,133,244,0.1); border: 1px solid rgba(66,133,244,0.2); color: #8ab4f8; padding: 5px 14px; border-radius: 999px; margin: 0 0 12px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 16px 0; }
  .tech-tag { border-radius: 999px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); padding: 6px 14px; font-size: 12px; color: var(--text-secondary); transition: all 0.2s; }
  .tech-tag:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
  .user-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 0; padding-top: 16px; border-top: 1px dashed var(--glass-border); }
  .action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 999px; border: 1px solid rgba(66,133,244,0.3); background: rgba(66,133,244,0.08); color: #fff; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.3s; }
  .action-btn:hover { background: rgba(66,133,244,0.2); border-color: var(--google-blue); transform: translateY(-1px); }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
  .empty-state h4 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; margin-bottom: 12px; color: #fff; }
  .loading { text-align: center; padding: 40px; color: var(--text-secondary); }
  .loading-spinner { display: inline-block; width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--google-blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hidden { display: none !important; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal-content { background: var(--card-bg); border-radius: 24px; padding: 32px; max-width: 420px; width: 100%; border: 1px solid var(--glass-border); box-shadow: 0 24px 48px rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
  .modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 12px 0; color: #fff; }
  .modal-text { font-size: 14px; color: var(--text-secondary); margin: 0 0 20px 0; line-height: 1.6; }
  .modal-input { width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: #fff; font-size: 15px; margin-bottom: 20px; font-family: 'Inter', sans-serif; transition: all 0.3s; }
  .modal-input:focus { outline: none; border-color: var(--google-blue); box-shadow: 0 0 0 3px rgba(66,133,244,0.2); }
  .modal-input::placeholder { color: rgba(255,255,255,0.4); }
  .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .list-card, .user-card, .dashboard-card { animation: fadeInUp 0.5s ease backwards; }
  @media (max-width: 1024px) {
    .main-layout { flex-direction: column; }
    .sidebar { width: 100%; position: static; max-height: none; }
    .sidebar-mobile-toggle { display: flex !important; }
    .sidebar-content { display: none; }
    .sidebar-content.open { display: block; }
    .dashboard-grid { grid-template-columns: repeat(2,1fr); }
    .user-card-main { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .list-container { padding: 15px; }
    .dashboard-grid { grid-template-columns: 1fr; gap: 12px; }
    .dashboard-card { padding: 16px; }
    .dashboard-value { font-size: 28px; }
    .user-card { padding: 18px; }
    .user-card-left, .user-card-right { padding: 16px; }
    .user-name { font-size: 18px; }
    .user-actions { flex-direction: column; }
    .action-btn { justify-content: center; }
    .hero-top1 { flex-direction: column; align-items: flex-start; }
    .hero-actions { width: 100%; justify-content: flex-start; }
    .modal-content { padding: 24px; }
    .modal-actions { flex-direction: column; }
  }
  @media (max-width: 480px) {
    .checkbox-filter-row { flex-direction: column; align-items: stretch; }
    .checkbox-filter-row .checkbox-filter-item { max-width: 100%; }
  }
  @media (hover: none) {
    .category-btn:active, .action-btn:active, .list-btn:active { transform: scale(0.98); transition: transform 0.1s ease; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

// ---- component ----

export function ListClient() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authStatus, setAuthStatusState] = useState<{ message: string; type: string }>({ message: '', type: '' });
  const [activeAccountEmail, setActiveAccountEmail] = useState('-');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ message: string; type: string }>({ message: '', type: '' });

  const [allUsers, setAllUsers] = useState<DevUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DevUser[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('recent');
  const [showingAll, setShowingAll] = useState(false);
  const [totalRegisteredCount, setTotalRegisteredCount] = useState(0);
  const [resultsTitle, setResultsTitle] = useState('Son Katılan Üyeler');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [filterActiveJob, setFilterActiveJob] = useState(false);
  const [filterFreelance, setFilterFreelance] = useState(false);
  const [filterMentor, setFilterMentor] = useState(false);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);

  const activeSessionUserIdRef = useRef('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const resetEmailRef = useRef<HTMLInputElement>(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, jobSeekers: 0, freelancers: 0, mentors: 0, employers: 0 });

  const setAuthStatus = useCallback((message: string, type = '') => {
    setAuthStatusState({ message, type });
  }, []);

  const getSessionToken = useCallback(async (): Promise<string | null> => {
    try {
      const client = await getDevUserClient();
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) return null;
      return data.session.access_token;
    } catch {
      return null;
    }
  }, []);

  const fetchUsersWithToken = useCallback(async (token: string) => {
    const response = await withTimeout(
      fetch(USERS_API_URL, { method: 'GET', headers: { Authorization: `Bearer ${token}` } }),
      REQUEST_TIMEOUT_MS,
      'Kullanıcı listesi zaman aşımına uğradı.',
    );
    if (response.status === 401) return { ok: false, unauthorized: true, forbidden: false, payload: {}, data: null };
    if (response.status === 403) {
      const payload = await response.json().catch(() => ({}));
      return { ok: false, unauthorized: false, forbidden: true, payload, data: null };
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return { ok: true, unauthorized: false, forbidden: false, payload, data: (payload.data || []) as DevUser[] };
  }, []);

  const signOutSilently = useCallback(async () => {
    try {
      const client = await getDevUserClient();
      await client.auth.signOut();
    } catch {
      // silent
    }
    setIsAuthed(false);
    setAllUsers([]);
    setFilteredUsers([]);
    setUsersLoaded(false);
    activeSessionUserIdRef.current = '';
    setActiveAccountEmail('-');
  }, []);

  const loadUsers = useCallback(async (): Promise<{ ok: boolean; reason: string }> => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const token = await getSessionToken();
      if (!token) {
        setIsAuthed(false);
        return { ok: false, reason: 'auth' };
      }
      let result = await fetchUsersWithToken(token);
      if (result.forbidden) {
        await signOutSilently();
        setAuthStatus((result.payload as Record<string, string>)?.error || 'Kaydınız admin onayı bekliyor.', 'error');
        return { ok: false, reason: 'auth' };
      }
      if (result.unauthorized) {
        const refreshedToken = await getSessionToken();
        if (!refreshedToken) {
          setIsAuthed(false);
          setAuthStatus('Oturum süresi doldu. Lütfen tekrar giriş yapın.', 'error');
          return { ok: false, reason: 'auth' };
        }
        result = await fetchUsersWithToken(refreshedToken);
        if (result.forbidden) {
          await signOutSilently();
          setAuthStatus((result.payload as Record<string, string>)?.error || 'Kaydınız admin onayı bekliyor.', 'error');
          return { ok: false, reason: 'auth' };
        }
        if (result.unauthorized) {
          setIsAuthed(false);
          setAuthStatus('Oturum süresi doldu. Lütfen tekrar giriş yapın.', 'error');
          return { ok: false, reason: 'auth' };
        }
      }
      const users = result.data || [];
      setAllUsers(users);

      // Load total count
      let totalCount = users.length;
      try {
        const countRes = await withTimeout(
          fetch(USER_COUNT_API_URL, { method: 'GET', headers: { Accept: 'application/json' } }),
          6000,
          'Üye sayısı alınamadı.',
        );
        if (countRes.ok) {
          const countPayload = await countRes.json().catch(() => ({}));
          const count = Number(countPayload?.count);
          if (Number.isFinite(count) && count >= 0) totalCount = count;
        }
      } catch {
        // fallback already set
      }
      setTotalRegisteredCount(totalCount);
      setUsersLoaded(true);
      return { ok: true, reason: 'ok' };
    } catch {
      setLoadError(true);
      return { ok: false, reason: 'error' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsersWithToken, getSessionToken, setAuthStatus, signOutSilently]);

  async function signOut() {
    const client = await getDevUserClient();
    await client.auth.signOut();
    setIsAuthed(false);
    setAllUsers([]);
    setFilteredUsers([]);
    setUsersLoaded(false);
    setActiveAccountEmail('-');
    activeSessionUserIdRef.current = '';
    window.location.reload();
  }

  async function signInWithPassword() {
    if (!emailRef.current || !passwordRef.current) return;
    const email = emailRef.current.value.trim().toLowerCase();
    const password = passwordRef.current.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthStatus('Geçerli bir e-posta girin.', 'error');
      return;
    }
    if (password.length < 6) {
      setAuthStatus('Şifre en az 6 karakter olmalı.', 'error');
      return;
    }
    setAuthStatus('Giriş yapılıyor...');
    try {
      const client = await getDevUserClient();
      const { error } = await withTimeout(
        client.auth.signInWithPassword({ email, password }),
        REQUEST_TIMEOUT_MS,
        'Giriş süresi aşıldı.',
      );
      if (error) throw error;
      setAuthStatus('Giriş başarılı.', 'success');
    } catch (error) {
      setAuthStatus((error as Error).message || 'Giriş yapılamadı.', 'error');
    }
  }

  async function sendPasswordReset() {
    if (!resetEmailRef.current) return;
    const email = resetEmailRef.current.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResetStatus({ message: 'Geçerli bir e-posta girin.', type: 'error' });
      return;
    }
    setResetStatus({ message: 'Gönderiliyor...', type: '' });
    try {
      const client = await getDevUserClient();
      const { error } = await withTimeout(
        client.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/devuser/reset-password',
        }),
        REQUEST_TIMEOUT_MS,
        'İstek zaman aşımına uğradı.',
      );
      if (error) throw error;
      setResetStatus({ message: 'Şifre sıfırlama bağlantısı gönderildi. E-postanızı kontrol edin.', type: 'success' });
      setTimeout(() => setShowResetModal(false), 2000);
    } catch (error) {
      setResetStatus({ message: (error as Error).message || 'Gönderilemedi.', type: 'error' });
    }
  }

  // Init auth on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const client = await getDevUserClient();
        client.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            setIsAuthed(false);
            setAllUsers([]);
            setFilteredUsers([]);
            setUsersLoaded(false);
            activeSessionUserIdRef.current = '';
            setActiveAccountEmail('-');
            return;
          }
          const nextUserId = String(session?.user?.id || '');
          if (activeSessionUserIdRef.current && activeSessionUserIdRef.current !== nextUserId) {
            setUsersLoaded(false);
            setAllUsers([]);
          }
          activeSessionUserIdRef.current = nextUserId;
          loadUsers().then((result) => {
            if (result.ok || result.reason === 'error') {
              setIsAuthed(true);
              setActiveAccountEmail(session?.user?.email || '-');
            }
          });
        });

        const { data, error } = await client.auth.getSession();
        if (error || !data.session) {
          setIsAuthed(false);
          return;
        }
        activeSessionUserIdRef.current = String(data.session?.user?.id || '');
        const result = await loadUsers();
        if (result.ok || result.reason === 'error') {
          setIsAuthed(true);
          setActiveAccountEmail(data.session?.user?.email || '-');
        }
      } catch (error) {
        setAuthStatus((error as Error).message || 'Auth başlatılamadı.', 'error');
        setIsAuthed(false);
      }
    }
    initAuth();
  }, [loadUsers, setAuthStatus]);

  // Update stats when allUsers or totalRegisteredCount changes
  useEffect(() => {
    const total =
      Number.isFinite(totalRegisteredCount) && totalRegisteredCount > 0
        ? totalRegisteredCount
        : allUsers.length;
    const jobSeekers = allUsers.filter((u) => {
      const status = normalizeText(u.is_arama_durumu);
      return status.includes('evet') && (status.includes('aktif') || status.includes('pasif'));
    }).length;
    const freelancers = allUsers.filter((u) => {
      const status = normalizeText(u.freelance_aciklik);
      return status && !status.startsWith('hay');
    }).length;
    const mentors = allUsers.filter((u) => u.profesyonel_destek_verebilir).length;
    const employers = allUsers.filter((u) => {
      const amac = normalizeText(u.katilma_amaci);
      return amac.includes('takim') || amac.includes('eleman');
    }).length;
    setStats({ total, jobSeekers, freelancers, mentors, employers });
  }, [allUsers, totalRegisteredCount]);

  // Re-apply category filter when allUsers or category/showingAll changes
  useEffect(() => {
    if (!usersLoaded) return;
    let users = [...allUsers];
    let title = 'Son Katılan Üyeler';
    let hideViewAll = false;

    switch (currentCategory) {
      case 'recent':
        users.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        if (!showingAll) users = users.slice(0, 10);
        title = showingAll ? 'Tüm Üyeler' : 'Son Katılan 10 Üye';
        break;
      case 'jobseeker':
        users = users.filter((u) => normalizeText(u.is_arama_durumu).includes('evet'));
        title = 'İş Arayanlar';
        hideViewAll = true;
        break;
      case 'employer':
        users = users.filter((u) => {
          const amac = normalizeText(u.katilma_amaci);
          return amac.includes('takim') || amac.includes('eleman');
        });
        title = 'İş Verenler / Ekipler';
        hideViewAll = true;
        break;
      case 'freelance':
        users = users.filter((u) => {
          const status = normalizeText(u.freelance_aciklik);
          return status && !status.startsWith('hay');
        });
        title = 'Freelancerlar';
        hideViewAll = true;
        break;
      case 'mentor':
        users = users.filter((u) => u.profesyonel_destek_verebilir);
        title = 'Mentorlar';
        hideViewAll = true;
        break;
    }

    setResultsTitle(title);
    setFilteredUsers(users);
    // Store hideViewAll in ref for render
    hideViewAllRef.current = hideViewAll;
  }, [allUsers, currentCategory, showingAll, usersLoaded]);

  const hideViewAllRef = useRef(false);

  // Apply additional filters (keyword + quick filters) on top of filteredUsers
  const finalUsers = (() => {
    const tokens = keyword
      ? normalizeText(keyword).split(/[\s,]+/).map((t) => t.trim()).filter(Boolean)
      : [];

    return filteredUsers.filter((user) => {
      // Quick filters
      if (filterActiveJob) {
        const status = normalizeText(user.is_arama_durumu);
        if (!status.includes('evet') || !status.includes('aktif')) return false;
      }
      if (filterFreelance) {
        const status = normalizeText(user.freelance_aciklik);
        if (!status || /^hay/.test(status)) return false;
      }
      if (filterMentor && !user.profesyonel_destek_verebilir) return false;
      if (selectedExp.length > 0) {
        const bucket = getExperienceBucket(user.deneyim_seviye);
        if (!selectedExp.includes(bucket)) return false;
      }
      if (tokens.length === 0) return true;
      const haystack = normalizeText(
        [
          user.ad_soyad, user.sehir, user.rol, user.deneyim_seviye, user.is_arama_durumu,
          ...(user.guclu_alanlar || []), ...(user.programlama_dilleri || []),
          ...(user.framework_platformlar || []), ...(user.devops_cloud || []),
          ...(user.ilgi_konular || []), ...(user.ogrenmek_istenen || []),
          ...(user.kullanilan_ide || []), ...(user.kullanilan_agent || []),
        ].join(' '),
      );
      return tokens.every((token) => haystack.includes(token));
    });
  })();

  const showViewAll =
    currentCategory === 'recent' && !showingAll && filteredUsers.length >= 10 && !hideViewAllRef.current;

  return (
    <>
      <style>{listStyles}</style>

      {/* Auth Gate */}
      {!isAuthed && (
        <div className="list-container">
          <div className="list-card hero-card1" style={{ maxWidth: '480px', margin: '0 auto 24px auto' }}>
            <div className="hero-domain1">almanya101.de</div>
            <h3 style={{ marginTop: '8px' }}>Giriş Gerekli</h3>
            <p style={{ margin: '10px 0 0 0', color: 'var(--text-secondary)' }}>
              Devuser listesini görmek için onaylı hesabınızla giriş yapın.
            </p>
          </div>

          <div className="list-card auth-card">
            <div className="auth-grid">
              <input
                type="email"
                ref={emailRef}
                placeholder="Email adresiniz"
                autoComplete="email"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); signInWithPassword(); } }}
              />
              <input
                type="password"
                ref={passwordRef}
                placeholder="Şifreniz"
                autoComplete="current-password"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); signInWithPassword(); } }}
              />
            </div>
            <div className="auth-actions">
              <button className="list-btn list-btn-primary" type="button" onClick={signInWithPassword}>
                E-posta ile giriş
              </button>
            </div>
            <p className="auth-note">Sadece admin onaylı üyeler arama ekranına erişebilir.</p>
            <p className={`auth-status${authStatus.type ? ` ${authStatus.type}` : ''}`}>
              {authStatus.message}
            </p>
            <button
              className="password-reset-link"
              type="button"
              onClick={() => { setShowResetModal(true); setResetStatus({ message: '', type: '' }); }}
            >
              Şifremi unuttum
            </button>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Şifre Sıfırlama</h3>
            <p className="modal-text">Şifre sıfırlama bağlantısı için e-posta adresinizi girin.</p>
            <input
              type="email"
              ref={resetEmailRef}
              className="modal-input"
              placeholder="email@ornek.com"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendPasswordReset(); } }}
            />
            <div className="modal-actions">
              <button className="list-btn list-btn-secondary" type="button" onClick={() => setShowResetModal(false)}>
                İptal
              </button>
              <button className="list-btn list-btn-primary" type="button" onClick={sendPasswordReset}>
                Gönder
              </button>
            </div>
            {resetStatus.message && (
              <p className={`auth-status${resetStatus.type ? ` ${resetStatus.type}` : ''}`} style={{ marginTop: '16px', textAlign: 'center' }}>
                {resetStatus.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Protected Content */}
      {isAuthed && (
        <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
          <div className="list-container">

            {/* Hero */}
            <div className="list-card hero-card1" style={{ marginBottom: '24px' }}>
              <div className="hero-top1">
                <div>
                  <div className="hero-domain1">almanya101.de</div>
                  <h3 style={{ margin: '8px 0 0 0' }}>Developer Topluluğu</h3>
                </div>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="list-btn list-btn-secondary"
                    onClick={() => { window.location.href = '/devuser/profile-edit'; }}
                  >
                    Profil Düzenle
                  </button>
                  <button type="button" className="list-btn list-btn-secondary" onClick={signOut}>
                    Çıkış
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Aktif oturum: <strong style={{ color: '#fff' }}>{activeAccountEmail}</strong>
                </div>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="dashboard-grid">
              <div className="dashboard-card primary">
                <div className="dashboard-icon">👥</div>
                <div className="dashboard-value">{stats.total}</div>
                <div className="dashboard-label">Toplam Üye</div>
              </div>
              <div className="dashboard-card success">
                <div className="dashboard-icon">🔍</div>
                <div className="dashboard-value">{stats.jobSeekers}</div>
                <div className="dashboard-label">İş Arayan</div>
              </div>
              <div className="dashboard-card info">
                <div className="dashboard-icon">💼</div>
                <div className="dashboard-value">{stats.freelancers}</div>
                <div className="dashboard-label">Freelance Açık</div>
              </div>
              <div className="dashboard-card warning">
                <div className="dashboard-icon">🎓</div>
                <div className="dashboard-value">{stats.mentors}</div>
                <div className="dashboard-label">Mentor</div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="main-layout">
              {/* Sidebar */}
              <aside className="sidebar">
                <button
                  className={`sidebar-mobile-toggle${sidebarOpen ? ' open' : ''}`}
                  type="button"
                  onClick={() => setSidebarOpen((v) => !v)}
                >
                  Filtreler ☰
                </button>

                <div className={`sidebar-content${sidebarOpen ? ' open' : ''}`}>
                  <div className="list-card">
                    <h4 className="sidebar-title">Kategoriler</h4>
                    <div className="category-filter-group">
                      {[
                        { key: 'recent', icon: '🆕', label: 'Son Katılanlar', count: 10 },
                        { key: 'jobseeker', icon: '🔍', label: 'İş Arayanlar', count: stats.jobSeekers },
                        { key: 'employer', icon: '🏢', label: 'İş Verenler', count: stats.employers },
                        { key: 'freelance', icon: '💻', label: 'Freelancerlar', count: stats.freelancers },
                        { key: 'mentor', icon: '🎓', label: 'Mentorlar', count: stats.mentors },
                      ].map(({ key, icon, label, count }) => (
                        <button
                          key={key}
                          className={`category-btn${currentCategory === key ? ' active' : ''}`}
                          type="button"
                          onClick={() => {
                            setCurrentCategory(key);
                            setShowingAll(false);
                          }}
                        >
                          <span className="icon">{icon}</span>
                          <span>{label}</span>
                          <span className="badge">{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="list-card">
                    <h4 className="sidebar-title">Filtrele</h4>

                    <div className="sidebar-section">
                      <label className="sidebar-label">Anahtar Kelime</label>
                      <div className="search-bar-container" style={{ margin: 0 }}>
                        <input
                          type="text"
                          placeholder="Ad, şehir, rol, teknoloji..."
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sidebar-section">
                      <label className="sidebar-label">Deneyim Seviyesi</label>
                      <div className="checkbox-filter-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        {[['0-1','0-1 yıl'],['1-3','1-3 yıl'],['3-5','3-5 yıl'],['5-10','5-10 yıl'],['10+','10+ yıl']].map(([v, l]) => (
                          <label className="checkbox-filter-item" key={v}>
                            <input
                              type="checkbox"
                              checked={selectedExp.includes(v)}
                              onChange={(e) =>
                                setSelectedExp((prev) =>
                                  e.target.checked ? [...prev, v] : prev.filter((x) => x !== v),
                                )
                              }
                            />
                            <span>{l}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="sidebar-section">
                      <label className="sidebar-label">Hızlı Filtreler</label>
                      <div className="checkbox-filter-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <label className="checkbox-filter-item">
                          <input type="checkbox" checked={filterActiveJob} onChange={(e) => setFilterActiveJob(e.target.checked)} />
                          <span>🟢 Aktif iş arıyor</span>
                        </label>
                        <label className="checkbox-filter-item">
                          <input type="checkbox" checked={filterFreelance} onChange={(e) => setFilterFreelance(e.target.checked)} />
                          <span>💼 Freelance açık</span>
                        </label>
                        <label className="checkbox-filter-item">
                          <input type="checkbox" checked={filterMentor} onChange={(e) => setFilterMentor(e.target.checked)} />
                          <span>🎓 Mentorluk verebilir</span>
                        </label>
                      </div>
                    </div>

                    {showViewAll && (
                      <button
                        className="view-all-btn"
                        type="button"
                        onClick={() => setShowingAll(true)}
                      >
                        Tüm Üyeleri Göster →
                      </button>
                    )}
                  </div>
                </div>
              </aside>

              {/* Content Area */}
              <main className="content-area">
                <div className="results-header">
                  <h2 className="results-title">{resultsTitle}</h2>
                  <span className="results-count">
                    {isLoading ? 'Yükleniyor...' : `${finalUsers.length} üye`}
                  </span>
                </div>

                {isLoading && (
                  <div className="loading">
                    <div className="loading-spinner" />
                    <p>Üyeler yükleniyor...</p>
                  </div>
                )}

                {loadError && !isLoading && (
                  <div className="loading">
                    <p style={{ color: 'var(--google-red)' }}>Yükleme hatası. Lütfen sayfayı yenileyin.</p>
                  </div>
                )}

                {!isLoading && !loadError && usersLoaded && finalUsers.length === 0 && (
                  <div className="empty-state">
                    <h4>Sonuç bulunamadı</h4>
                    <p>Filtreleri değiştirerek tekrar deneyin.</p>
                  </div>
                )}

                {!isLoading && !loadError && usersLoaded && finalUsers.length > 0 && (
                  <div
                    className="user-grid"
                    dangerouslySetInnerHTML={{ __html: finalUsers.map(createUserCardHtml).join('') }}
                  />
                )}
              </main>
            </div>

          </div>
        </DevUserShell>
      )}
    </>
  );
}
