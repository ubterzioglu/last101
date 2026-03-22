'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { getDevUserClient } from '@/lib/supabase/devuser';

const EDGE_FUNCTION_URL = '/api/devuser-register';
const USER_COUNT_API_URL = '/api/devuser-count';
const FORM_DRAFT_KEY = 'devuser_form_draft_v1';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINKEDIN_PREFIX = 'https://linkedin.com/in/';
const TOTAL_STEPS = 21;

const API_KEY_ERROR_PATTERNS = [
  'unregistered api key',
  'invalid api key',
  'invalid apikey',
  'no api key found in request',
];

const BOOLEAN_FIELDS = new Set([
  'almanya_yasam',
  'aktif_kod',
  'acik_kaynak',
  'kendi_proje',
  'gonullu_proje',
  'profesyonel_destek_verebilir',
  'profesyonel_destek_almak',
  'aratilabilir',
  'iletisim_izni',
  'veri_paylasim_onay',
]);

const ARRAY_FIELDS = [
  'guclu_alanlar',
  'programlama_dilleri',
  'framework_platformlar',
  'devops_cloud',
  'ilgi_konular',
  'ogrenmek_istenen',
  'isbirligi_turu',
  'kullanilan_ide',
  'kullanilan_agent',
  'ai_app_builders',
];

// ---- helpers ----

function normalizeLinkedinInputValue(value: string): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw === LINKEDIN_PREFIX) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.toLowerCase();
      if (
        host === 'linkedin.com' ||
        host === 'www.linkedin.com' ||
        host.endsWith('.linkedin.com')
      ) {
        if (parsed.pathname === '/in/' || parsed.pathname === '/in') return '';
        return parsed.toString();
      }
    } catch {
      return '';
    }
    return '';
  }
  const slug = raw.replace(/^\/+/, '');
  if (!slug) return '';
  return `${LINKEDIN_PREFIX}${slug}`;
}

function isAbortLikeError(error: unknown): boolean {
  const message = String((error as Error)?.message || error || '').toLowerCase();
  return (
    (error as Error)?.name === 'AbortError' ||
    message.includes('signal is aborted') ||
    message.includes('aborted')
  );
}

function isApiKeyConfigurationError(error: unknown): boolean {
  const message = String((error as Error)?.message || error || '').toLowerCase();
  return API_KEY_ERROR_PATTERNS.some((p) => message.includes(p));
}

function getReadableSubmitError(error: unknown): string {
  if (isAbortLikeError(error)) {
    return 'Bağlantı kesildi. Lütfen internetinizi kontrol edip tekrar deneyin.';
  }
  if (isApiKeyConfigurationError(error)) {
    return 'Supabase API anahtarı geçersiz görünüyor. Sayfayı yenileyip tekrar deneyin.';
  }
  const raw = String((error as Error)?.message || error || '');
  const lower = raw.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'E-posta veya şifre hatalı. Kayıtlı bir hesabınız varsa doğru şifreyi girin.';
  }
  return String((error as Error)?.message || error || 'Bilinmeyen hata');
}

function formatCount(value: number): string {
  return Number(value || 0).toLocaleString('tr-TR');
}

async function withAbortRetry<T>(
  task: () => Promise<T>,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<T> {
  const attempts = Number(options.attempts || 2);
  const delayMs = Number(options.delayMs || 350);
  let lastError: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      const isLastAttempt = i === attempts - 1;
      if (isLastAttempt || !isAbortLikeError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw lastError || new Error('Bilinmeyen hata');
}

function buildDataFromForm(formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'linkedin_url') {
      data[key] = normalizeLinkedinInputValue(String(value));
    } else if (BOOLEAN_FIELDS.has(key)) {
      data[key] = value === 'true';
    } else if (!Object.prototype.hasOwnProperty.call(data, key)) {
      data[key] = value;
    }
  }
  ARRAY_FIELDS.forEach((field) => {
    const values = formData.getAll(field);
    data[field] = values.length > 0 ? values : [];
  });
  const katilmaAmaclari = formData.getAll('katilma_amaci').filter(Boolean);
  data.katilma_amaci = katilmaAmaclari.length > 0 ? katilmaAmaclari.join(', ') : '';
  return data;
}

function saveDraft(data: Record<string, unknown>): void {
  sessionStorage.setItem(FORM_DRAFT_KEY, JSON.stringify({ data, savedAt: Date.now() }));
}

function clearDraft(): void {
  sessionStorage.removeItem(FORM_DRAFT_KEY);
}

function loadDraftData(): Record<string, unknown> | null {
  const raw = sessionStorage.getItem(FORM_DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.data && typeof parsed.data === 'object' ? parsed.data : null;
  } catch {
    return null;
  }
}

const duStyles = `
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
  .du-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 12px 16px 80px;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }
  .du-card {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 18px;
    backdrop-filter: blur(20px);
    margin-bottom: 12px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .du-card:hover { border-color: rgba(255,255,255,0.15); }
  #formCard { flex: 1; display: flex; flex-direction: column; overflow: visible; }
  #devuserForm { flex: 1; overflow: visible; }
  .hero-card { text-align: center; position: relative; overflow: hidden; }
  .hero-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--gradient-1);
  }
  .hero-domain {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px; font-weight: 600;
    color: var(--google-blue);
    text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;
  }
  .hero-card h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px; font-weight: 600; margin-bottom: 16px;
    background: var(--gradient-1);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hero-count { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; }
  .hero-count-label { color: var(--text-secondary); }
  .hero-count-value { font-weight: 600; color: var(--google-green); }
  .info-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 4px 0; }
  .info-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; color: var(--google-yellow); }
  .info-toggle { font-size: 14px; color: var(--text-secondary); transition: transform 0.3s ease; }
  .info-toggle.open { transform: rotate(180deg); }
  .info-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
  .info-content.open { max-height: 500px; padding-top: 16px; }
  .info-content p { color: var(--text-secondary); line-height: 1.6; font-size: 14px; }
  .progress-container { margin-bottom: 8px; }
  .progress-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
  .progress-fill { height: 100%; background: var(--gradient-1); border-radius: 4px; transition: width 0.4s ease; }
  .progress-text { text-align: center; font-size: 13px; color: var(--text-secondary); font-weight: 500; }
  .step-container { display: none; animation: fadeIn 0.3s ease; overflow: visible; }
  .step-container.active { display: block; min-height: 200px; }
  .step-inner { transform-origin: top center; transition: transform 0.18s ease; will-change: transform; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .question-number {
    font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600;
    color: var(--google-blue); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
  }
  .question-title {
    font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600;
    margin-bottom: 12px; color: var(--text-primary); line-height: 1.4;
  }
  .form-input {
    width: 100%; padding: 11px 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
    border-radius: 12px; color: var(--text-primary);
    font-family: 'Inter', sans-serif; font-size: 14px;
    transition: all 0.3s ease; outline: none;
  }
  .form-input::placeholder { color: rgba(255,255,255,0.3); }
  .form-input:focus { border-color: var(--google-blue); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(66,133,244,0.1); }
  .form-input.invalid { border-color: var(--google-red); box-shadow: 0 0 0 3px rgba(234,67,53,0.18); }
  .form-input.city-offset { margin-top: 16px; }
  textarea.form-input { min-height: 120px; resize: vertical; }
  .radio-group { display: flex; flex-direction: column; gap: 7px; }
  .radio-group.role-two-col { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .radio-label {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border); border-radius: 12px;
    cursor: pointer; transition: all 0.3s ease;
  }
  .radio-label:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
  .radio-label input[type="radio"] { width: 20px; height: 20px; accent-color: var(--google-blue); cursor: pointer; }
  .radio-label span { font-size: 14px; color: var(--text-primary); }
  .checkbox-group { display: flex; flex-direction: column; gap: 7px; }
  .checkbox-group.checkbox-group-two-col { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .checkbox-label {
    display: flex; align-items: center; gap: 12px;
    padding: 9px 11px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border); border-radius: 10px;
    cursor: pointer; transition: all 0.3s ease;
  }
  .checkbox-label:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
  .checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--google-green); cursor: pointer; }
  .checkbox-label span { font-size: 13px; color: var(--text-primary); }
  .conditional-field { display: none; margin-top: 16px; animation: fadeIn 0.3s ease; }
  .conditional-field.active { display: block; }
  .conditional-field .question-title { font-size: 14px; margin-bottom: 10px; color: var(--text-secondary); }
  .nav-buttons { display: flex; gap: 12px; margin-top: 10px; }
  .du-btn {
    flex: 1; padding: 11px 16px; border: none; border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.3s ease; outline: none;
  }
  .du-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .du-btn-primary { background: var(--gradient-1); color: white; }
  .du-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(66,133,244,0.4); }
  .du-btn-secondary { background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid var(--glass-border); }
  .du-btn-secondary:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
  .success-message { display: none; text-align: center; padding: 40px 20px; animation: fadeIn 0.5s ease; }
  .success-message.active { display: block; }
  .success-icon { font-size: 64px; margin-bottom: 20px; }
  .success-title {
    font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 16px;
    background: var(--gradient-2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .success-text { font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
  #charCount { font-size: 12px; color: var(--text-secondary); margin-top: 8px; text-align: right; }
  .step7-compact .question-title { font-size: 15px; margin-bottom: 12px; }
  .step7-compact .question-title:not(:first-of-type) { margin-top: 20px; }
  .step17-compact .checkbox-label span { font-size: 12px; }
  @media (max-width: 768px) {
    .du-container { padding: 15px 15px 100px; }
    .du-card { padding: 20px; border-radius: 20px; }
    .hero-card h3 { font-size: 20px; }
    .question-title { font-size: 15px; line-height: 1.4; }
    .radio-group.role-two-col, .checkbox-group.checkbox-group-two-col { grid-template-columns: 1fr; }
    .checkbox-label span, .radio-label span { font-size: 13px; }
    .du-btn { padding: 14px 18px; font-size: 14px; }
    .success-title { font-size: 22px; }
    .step-container.active { min-height: 150px; }
    textarea.form-input { min-height: 100px; }
    .nav-buttons {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 12px 16px; background: rgba(0,0,0,0.95);
      backdrop-filter: blur(10px); border-top: 1px solid var(--glass-border);
      margin: 0; z-index: 100;
    }
  }
  @media (max-width: 480px) {
    .form-input { padding: 12px 14px; font-size: 14px; }
    .radio-label { padding: 12px 14px; }
    .checkbox-label { padding: 10px 12px; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export function DuClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredCount, setRegisteredCount] = useState<string>('Yükleniyor...');
  const [charCount, setCharCount] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [conditionals, setConditionals] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Load registered user count
  useEffect(() => {
    fetch(USER_COUNT_API_URL, { method: 'GET', headers: { Accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        const count = Number(payload?.count);
        if (Number.isFinite(count) && count >= 0) {
          setRegisteredCount(`${formatCount(count)} kişi`);
        } else {
          throw new Error('Invalid count');
        }
      })
      .catch(() => setRegisteredCount('Şu an alınamıyor'));
  }, []);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraftData();
    if (draft && formRef.current) {
      applyDraftToForm(draft, formRef.current);
      setCurrentStep(TOTAL_STEPS);
    }
    // Setup linkedin prefix
    setupLinkedinPrefixInput();
  }, []);

  // Fit viewport on resize
  useEffect(() => {
    const handler = () => fitActiveStepToViewport();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [currentStep]);

  useEffect(() => {
    fitActiveStepToViewport();
  }, [currentStep, infoOpen]);

  // Enter key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentStep < TOTAL_STEPS) {
          handleChangeStep(1);
        } else {
          handleSubmit();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  function fitActiveStepToViewport() {
    const active = document.querySelector('.step-container.active') as HTMLElement | null;
    if (!active) return;
    const inner = active.querySelector('.step-inner') as HTMLElement | null;
    if (!inner) return;
    active.style.height = '';
    inner.style.transform = 'scale(1)';
    const navButtons = document.querySelector('.nav-buttons') as HTMLElement | null;
    const activeTop = active.getBoundingClientRect().top;
    const navTop = navButtons ? navButtons.getBoundingClientRect().top : window.innerHeight - 16;
    const viewportBottom = window.innerHeight - 12;
    const usableBottom = Math.min(navTop - 8, viewportBottom);
    const available = Math.max(220, usableBottom - activeTop);
    const needed = Math.max(1, inner.scrollHeight);
    let scale = Math.min(1, available / needed);
    scale = Math.max(0.45, scale);
    inner.style.transform = `scale(${scale})`;
    active.style.height = `${Math.ceil(needed * scale)}px`;
  }

  function setupLinkedinPrefixInput() {
    const linkedinInput = document.querySelector('input[name="linkedin_url"]') as HTMLInputElement | null;
    if (!linkedinInput) return;
    const ensurePrefix = () => {
      const current = String(linkedinInput.value || '');
      if (!current || !current.startsWith(LINKEDIN_PREFIX)) {
        const normalized = normalizeLinkedinInputValue(current);
        linkedinInput.value = normalized || LINKEDIN_PREFIX;
      }
    };
    const enforceCaret = () => {
      const prefixLength = LINKEDIN_PREFIX.length;
      const selectionStart = Number(linkedinInput.selectionStart || 0);
      const selectionEnd = Number(linkedinInput.selectionEnd || 0);
      if (selectionStart < prefixLength || selectionEnd < prefixLength) {
        linkedinInput.setSelectionRange(
          Math.max(selectionStart, prefixLength),
          Math.max(selectionEnd, prefixLength),
        );
      }
    };
    linkedinInput.addEventListener('focus', () => { ensurePrefix(); requestAnimationFrame(enforceCaret); });
    linkedinInput.addEventListener('click', () => requestAnimationFrame(enforceCaret));
    linkedinInput.addEventListener('keydown', (event) => {
      const prefixLength = LINKEDIN_PREFIX.length;
      const selectionStart = Number(linkedinInput.selectionStart || 0);
      const selectionEnd = Number(linkedinInput.selectionEnd || 0);
      const touchesPrefix = selectionStart <= prefixLength || selectionEnd <= prefixLength;
      if ((event.key === 'Backspace' || event.key === 'Delete') && touchesPrefix) {
        event.preventDefault();
        linkedinInput.setSelectionRange(prefixLength, prefixLength);
      }
    });
    linkedinInput.addEventListener('input', () => {
      const normalized = normalizeLinkedinInputValue(linkedinInput.value);
      linkedinInput.value = normalized || LINKEDIN_PREFIX;
      enforceCaret();
    });
    linkedinInput.addEventListener('blur', () => {
      const normalized = normalizeLinkedinInputValue(linkedinInput.value);
      linkedinInput.value = normalized || LINKEDIN_PREFIX;
    });
    ensurePrefix();
  }

  function applyDraftToForm(draft: Record<string, unknown>, form: HTMLFormElement) {
    Object.entries(draft).forEach(([key, value]) => {
      const fields = Array.from(form.querySelectorAll<HTMLInputElement>(`[name="${key}"]`));
      if (!fields.length) return;
      if (Array.isArray(value)) {
        fields.forEach((field) => {
          if (field.type === 'checkbox') field.checked = (value as string[]).includes(field.value);
        });
        return;
      }
      const first = fields[0];
      if (first.type === 'radio') {
        fields.forEach((field) => { field.checked = String(field.value) === String(value); });
        return;
      }
      if (first.type === 'checkbox') {
        if (fields.length > 1) {
          const values = String(value || '').split(',').map((i) => i.trim()).filter(Boolean);
          fields.forEach((field) => { field.checked = values.includes(String(field.value)); });
          return;
        }
        first.checked = Boolean(value);
        return;
      }
      (first as HTMLInputElement | HTMLTextAreaElement).value = String(value ?? '');
    });
    const ekNotlar = form.querySelector<HTMLTextAreaElement>('textarea[name="ek_notlar"]');
    if (ekNotlar) setCharCount(ekNotlar.value.length);
  }

  function validateCurrentStep(): boolean {
    const currentContainer = document.querySelector(`.step-container[data-step="${currentStep}"]`);
    if (!currentContainer) return true;
    // Remove invalid state
    currentContainer.querySelectorAll('.form-input.invalid').forEach((f) => f.classList.remove('invalid'));

    const requiredFields = Array.from(currentContainer.querySelectorAll<HTMLInputElement>('[required]'));
    for (const field of requiredFields) {
      if (field.disabled) continue;
      const value = String(field.value || '').trim();
      if (!value) {
        field.classList.add('invalid');
        field.focus();
        alert('Lütfen bu alanı doldurun.');
        return false;
      }
      if (field.type === 'email' && !EMAIL_REGEX.test(value.toLowerCase())) {
        field.classList.add('invalid');
        field.focus();
        alert('Lütfen geçerli bir e-posta adresi girin.');
        return false;
      }
      if (field.name === 'auth_password' && value.length < 6) {
        field.classList.add('invalid');
        field.focus();
        alert('Şifre en az 6 karakter olmalıdır.');
        return false;
      }
    }
    return true;
  }

  const handleChangeStep = useCallback((direction: number) => {
    if (direction === 1 && !validateCurrentStep()) return;
    setCurrentStep((prev) => {
      const next = Math.min(Math.max(prev + direction, 1), TOTAL_STEPS);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  function toggleConditional(fieldId: string, show: boolean) {
    setConditionals((prev) => ({ ...prev, [fieldId]: show }));
    if (!show) {
      const input = document.querySelector<HTMLInputElement>(`#${fieldId} input`);
      if (input) input.value = '';
    }
    requestAnimationFrame(fitActiveStepToViewport);
  }

  function persistDraft() {
    if (!formRef.current) return;
    const data = buildDataFromForm(new FormData(formRef.current));
    saveDraft(data);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    if (!validateCurrentStep()) return;
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = buildDataFromForm(formData);

    const email = String(data.auth_email || '').trim().toLowerCase();
    const password = String(data.auth_password || '');
    if (!email) { alert('Lütfen e-posta adresinizi girin.'); return; }
    if (!EMAIL_REGEX.test(email)) { alert('Lütfen geçerli bir e-posta adresi girin.'); return; }
    if (!password) { alert('Lütfen şifrenizi girin.'); return; }
    if (password.length < 6) { alert('Şifre en az 6 karakter olmalıdır.'); return; }

    setIsSubmitting(true);

    try {
      const supabase = await getDevUserClient();

      // Try sign up, then sign in if already registered
      const signUpResult = await withAbortRetry(() =>
        supabase.auth.signUp({ email, password, options: { data: {} } })
      );

      let session = signUpResult.data?.session;

      if (!session) {
        const signUpErrorMessage = String(signUpResult.error?.message || '').toLowerCase();
        const isAlreadyRegistered =
          signUpErrorMessage.includes('already registered') ||
          signUpErrorMessage.includes('already been registered') ||
          signUpErrorMessage.includes('user already registered');
        if (!isAlreadyRegistered && signUpResult.error) {
          throw new Error(signUpResult.error.message || 'E-posta ile kayıt başarısız.');
        }

        const signInResult = await withAbortRetry(() =>
          supabase.auth.signInWithPassword({ email, password })
        );
        if (signInResult.error || !signInResult.data?.session) {
          const signInMsg = String(signInResult.error?.message || '').toLowerCase();
          if (signInMsg.includes('email not confirmed') || signInMsg.includes('email address not authorized')) {
            throw new Error('Hesap oluşturuldu ancak email onayı gerekiyor. Lütfen e-postanızı kontrol edin.');
          }
          throw new Error(signInResult.error?.message || 'E-posta ile giriş başarısız.');
        }
        session = signInResult.data.session;
      }

      if (!session) throw new Error('Oturum oluşturulamadı.');

      const payload = { ...data };
      delete payload.auth_email;
      delete payload.auth_password;

      const sendRequest = (accessToken: string) =>
        withAbortRetry(() =>
          fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(payload),
          })
        );

      let response = await sendRequest(session.access_token);
      let result: Record<string, unknown> = await response.json().catch(() => ({}));

      if (response.status === 401) {
        const refreshed = await withAbortRetry(() => supabase.auth.refreshSession());
        const refreshedToken = refreshed?.data?.session?.access_token;
        if (refreshedToken) {
          response = await sendRequest(refreshedToken);
          result = await response.json().catch(() => ({}));
        }
      }

      if (response.status === 401) throw new Error('Kimlik doğrulama başarısız. Sayfayı yenileyip tekrar deneyin.');
      if (!response.ok) throw new Error(String(result.error) || 'Kayıt sırasında bir hata oluştu');

      clearDraft();
      setShowSuccess(true);
    } catch (error) {
      alert('Bir hata oluştu: ' + getReadableSubmitError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  return (
    <>
      <style>{duStyles}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön">
        <div className="du-container">

          {/* Hero Card */}
          <div className="du-card hero-card">
            <div className="hero-domain">almanya101.de</div>
            <h3>Software Veritabanı Kayıt</h3>
            <div className="hero-count" aria-live="polite">
              <span className="hero-count-label">Kayıtlı kullanıcı:</span>
              <span className="hero-count-value">{registeredCount}</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="du-card">
            <div className="info-header" onClick={() => setInfoOpen((v) => !v)}>
              <span className="info-title">💡 Neden?</span>
              <span className={`info-toggle${infoOpen ? ' open' : ''}`}>▼</span>
            </div>
            <div className={`info-content${infoOpen ? ' open' : ''}`}>
              <p>
                Amaç veri toplamak değil; birbirimize destek olmak. Bu veritabanı, ihtiyaç duyduğumuzda
                birbirimizin tecrübelerini, ilgi alanlarını ve yeteneklerini tanıyabilmek için oluşturuluyor.
                Paylaşılan bilgiler yalnızca topluluk içinde networking, mentorluk, iş birlikleri ve bilgi
                paylaşımı için kullanılacak.<br /><br />Birlikte daha güçlüyüz.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="du-card">
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="progress-text">Soru {currentStep} / {TOTAL_STEPS}</div>
            </div>
          </div>

          {/* Form Card */}
          <div className="du-card" id="formCard">
            <form
              id="devuserForm"
              ref={formRef}
              onInput={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('form-input')) target.classList.remove('invalid');
                persistDraft();
              }}
              onChange={persistDraft}
            >

              {/* Step 1: Yaşam yeri */}
              <div className="step-container active" data-step="1">
                <div className="step-inner">
                  <div className="question-number">Soru 1 / {TOTAL_STEPS}</div>
                  <div className="question-title">Şu anda nerede yaşıyorsunuz?</div>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="yasam_yeri" value="Almanya" onChange={() => toggleConditional('yasamYeriDiger', false)} />
                      <span>Almanya</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="yasam_yeri" value="Türkiye" onChange={() => toggleConditional('yasamYeriDiger', false)} />
                      <span>Türkiye</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="yasam_yeri" value="Diğer" onChange={() => toggleConditional('yasamYeriDiger', true)} />
                      <span>Diğer</span>
                    </label>
                  </div>
                  <div id="yasamYeriDiger" className={`conditional-field${conditionals['yasamYeriDiger'] ? ' active' : ''}`}>
                    <input type="text" name="yasam_yeri_diger" className="form-input" placeholder="Hangi ülke?" />
                  </div>
                  <input type="text" name="sehir" className="form-input city-offset" placeholder="Şehir (Berlin, Münih, Hamburg...)" />
                </div>
              </div>

              {/* Step 2: Rol */}
              <div className="step-container" data-step="2">
                <div className="step-inner">
                  <div className="question-number">Soru 2 / {TOTAL_STEPS}</div>
                  <div className="question-title">Rolün nedir?</div>
                  <div className="radio-group role-two-col">
                    {['Software Developer','QA / Test','DevOps','Data / AI','Product / Project','UI/UX','Öğrenci','Diğer'].map((r) => (
                      <label className="radio-label" key={r}>
                        <input type="radio" name="rol" value={r} />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Deneyim */}
              <div className="step-container" data-step="3">
                <div className="step-inner">
                  <div className="question-number">Soru 3 / {TOTAL_STEPS}</div>
                  <div className="question-title">Deneyim seviyeniz?</div>
                  <div className="radio-group">
                    {[['0-1 yil','0-1 yıl'],['1-3 yil','1-3 yıl'],['3-5 yil','3-5 yıl'],['5-10 yil','5-10 yıl'],['10+ yil','10+ yıl']].map(([v, l]) => (
                      <label className="radio-label" key={v}>
                        <input type="radio" name="deneyim_seviye" value={v} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Güçlü alanlar */}
              <div className="step-container" data-step="4">
                <div className="step-inner">
                  <div className="question-number">Soru 4 / {TOTAL_STEPS}</div>
                  <div className="question-title">En güçlü olduğun alanlar (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['Backend','Frontend','Mobile','QA / Manual Testing','Test Automation','DevOps / CI-CD','Data / BI','AI / ML','Cloud','Security','Product / Project','UI/UX'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="guclu_alanlar" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 5: Proje / aktif / açık kaynak / destek */}
              <div className="step-container step7-compact" data-step="5">
                <div className="step-inner">
                  <div className="question-number">Soru 5 / {TOTAL_STEPS}</div>
                  <div className="question-title">Kendi projen / girişimin var mı?</div>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="kendi_proje" value="true" onChange={() => toggleConditional('projeLink', true)} />
                      <span>Evet</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="kendi_proje" value="false" onChange={() => toggleConditional('projeLink', false)} />
                      <span>Hayır</span>
                    </label>
                  </div>
                  <div id="projeLink" className={`conditional-field${conditionals['projeLink'] ? ' active' : ''}`}>
                    <div className="question-title">Proje linki veya ismi :</div>
                    <input type="text" name="proje_link" className="form-input" placeholder="Proje linki (GitHub, website, vb.)" />
                  </div>
                  <div className="question-title">Aktif olarak kod yazıyor musun?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="aktif_kod" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="aktif_kod" value="false" /><span>Hayır</span></label>
                  </div>
                  <div className="question-title">Açık kaynak projelere katkı sağlıyor musun?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="acik_kaynak" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="acik_kaynak" value="false" /><span>Hayır</span></label>
                  </div>
                  <div className="question-title" style={{ marginTop: '20px' }}>Profesyonel destek almak ister misin?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="profesyonel_destek_almak" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="profesyonel_destek_almak" value="false" /><span>Hayır</span></label>
                  </div>
                  <div className="question-title" style={{ marginTop: '20px' }}>Profesyonel destek verebilir misin? (CV, mülakat, kariyer)</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="profesyonel_destek_verebilir" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="profesyonel_destek_verebilir" value="false" /><span>Hayır</span></label>
                  </div>
                </div>
              </div>

              {/* Step 6: Programlama dilleri */}
              <div className="step-container" data-step="6">
                <div className="step-inner">
                  <div className="question-number">Soru 6 / {TOTAL_STEPS}</div>
                  <div className="question-title">Kullandığın programlama dilleri (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['JavaScript','TypeScript','Python','Java','C#','Go','PHP','C/C++','Kotlin','Swift','SQL','Diğer'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="programlama_dilleri" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 7: Framework / platformlar */}
              <div className="step-container" data-step="7">
                <div className="step-inner">
                  <div className="question-number">Soru 7 / {TOTAL_STEPS}</div>
                  <div className="question-title">Kullandığın framework / platformlar (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['React','Angular','Vue','Node.js','.NET','Spring','Django','FastAPI','Flutter','React Native','Compose','Ktor','Quarkus','Micronaut','Fiber (Go)'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="framework_platformlar" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 8: DevOps / Cloud */}
              <div className="step-container" data-step="8">
                <div className="step-inner">
                  <div className="question-number">Soru 8 / {TOTAL_STEPS}</div>
                  <div className="question-title">DevOps / Cloud araçları (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['Docker','Kubernetes','AWS','Azure','GCP','Terraform','GitHub Actions','GitLab CI','Jenkins','Diğer'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="devops_cloud" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 9: İlgi konuları */}
              <div className="step-container" data-step="9">
                <div className="step-inner">
                  <div className="question-number">Soru 9 / {TOTAL_STEPS}</div>
                  <div className="question-title">Şu anda en çok ilgini çeken konular (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['AI araçları / LLM uygulamaları','Startup / ürün geliştirme','Freelance / danışmanlık','Remote çalışma','Almanya\'da kariyer & iş piyasası','Networking / event / meetup','Side project / hackathon','Open-source','Sertifika / eğitim','Teknik yazı / içerik üretimi'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="ilgi_konular" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 10: Öğrenmek istenen */}
              <div className="step-container" data-step="10">
                <div className="step-inner">
                  <div className="question-number">Soru 10 / {TOTAL_STEPS}</div>
                  <div className="question-title">Öğrenmek istediğin alanlar (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['Backend','Frontend','Mobile','Test Automation','DevOps','Cloud','AI / ML','System Design / Architecture','UI/UX','Interview prep / CV','Almanya kariyer / iş arama','Diğer'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="ogrenmek_istenen" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 11: İş arama */}
              <div className="step-container" data-step="11">
                <div className="step-inner">
                  <div className="question-number">Soru 11 / {TOTAL_STEPS}</div>
                  <div className="question-title">Aktif olarak iş arıyor musun?</div>
                  <div className="radio-group">
                    {[['Hayir','Hayır'],['Evet, pasif (firsat olursa)','Evet, pasif (fırsat olursa)'],['Evet, aktif','Evet, aktif'],['Sadece freelance bakiyorum','Sadece freelance bakıyorum']].map(([v, l]) => (
                      <label className="radio-label" key={v}>
                        <input type="radio" name="is_arama_durumu" value={v} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 12: AI App Builders */}
              <div className="step-container" data-step="12">
                <div className="step-inner">
                  <div className="question-number">Soru 12 / {TOTAL_STEPS}</div>
                  <div className="question-title">Aşağıdaki AI-driven app builderlardan hangilerini kullanıyorsun? (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['Manus','Lovable','Bolt.new','Vercel v0','Replit AI Apps','Glide AI','Softr AI','Bubble AI','Builder.ai','Draftbit AI','FlutterFlow AI','Kullanmıyorum'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="ai_app_builders" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 13: Freelance */}
              <div className="step-container" data-step="13">
                <div className="step-inner">
                  <div className="question-number">Soru 13 / {TOTAL_STEPS}</div>
                  <div className="question-title">Freelance işlere açık mısın?</div>
                  <div className="radio-group">
                    {[['Hayir','Hayır'],['Evet, hafta ici aksamlari','Evet, hafta içi akşamları'],['Evet, hafta sonu','Evet, hafta sonu'],['Evet, part-time duzenli','Evet, part-time düzenli'],['Evet, full-time freelance','Evet, full-time freelance']].map(([v, l]) => (
                      <label className="radio-label" key={v}>
                        <input type="radio" name="freelance_aciklik" value={v} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 14: Gönüllü proje + aratılabilir */}
              <div className="step-container" data-step="14">
                <div className="step-inner">
                  <div className="question-number">Soru 14 / {TOTAL_STEPS}</div>
                  <div className="question-title">Gönüllü projelerde yer almak ister misin?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="gonullu_proje" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="gonullu_proje" value="false" /><span>Hayır</span></label>
                  </div>
                  <div className="question-title" style={{ marginTop: '20px' }}>Bilgilerin topluluk içinde aratılabilir olsun mu?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="aratilabilir" value="true" /><span>Evet, profilim görünsün</span></label>
                    <label className="radio-label"><input type="radio" name="aratilabilir" value="false" /><span>Hayır, sadece kayıt olmak istiyorum</span></label>
                  </div>
                </div>
              </div>

              {/* Step 15: Katılma amacı */}
              <div className="step-container" data-step="15">
                <div className="step-inner">
                  <div className="question-number">Soru 15 / {TOTAL_STEPS}</div>
                  <div className="question-title">Topluluğa katılma amaçların (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['Networking','İş bulmak','İş arkadaşı bulmak','Proje geliştirmek','Bilgi paylaşmak','Mentorluk almak','Mentorluk vermek'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="katilma_amaci" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 16: İş birliği türü */}
              <div className="step-container step17-compact" data-step="16">
                <div className="step-inner">
                  <div className="question-number">Soru 16 / {TOTAL_STEPS}</div>
                  <div className="question-title">Nasıl iş birliği yapmak istersin? (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {[
                      ['Side project (haftada 2–5 saat)','Side project (2-5 saat)'],
                      ['Side project (haftada 5–10 saat)','Side project (5-10 saat)'],
                      ['Startup kurmak (ciddi)','Startup kurmak'],
                      ['MVP çıkarma ekibi (tasarım+dev+test)','MVP ekip'],
                      ['Freelance ekip kurmak (ücretli)','Freelance ekip'],
                      ['Açık kaynak proje','Açık kaynak proje'],
                      ['Study group (system design, leetcode vb.)','Study group'],
                      ['Mentorluk / koçluk','Mentorluk / koçluk'],
                      ['Sadece tanışma & network','Tanışma & network'],
                    ].map(([v, l]) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="isbirligi_turu" value={v} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 17: IDE */}
              <div className="step-container" data-step="17">
                <div className="step-inner">
                  <div className="question-number">Soru 17 / {TOTAL_STEPS}</div>
                  <div className="question-title">Kullandığınız IDE&apos;ler (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['VS Code','IntelliJ IDEA','PyCharm','WebStorm','Visual Studio','Eclipse','Xcode','Android Studio','Sublime Text','Vim / Neovim'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="kullanilan_ide" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 18: AI Agents */}
              <div className="step-container" data-step="18">
                <div className="step-inner">
                  <div className="question-number">Soru 18 / {TOTAL_STEPS}</div>
                  <div className="question-title">Kullandığınız AI Agent&apos;lar (birden fazla seçebilirsin)</div>
                  <div className="checkbox-group checkbox-group-two-col">
                    {['GitHub Copilot','ChatGPT','Claude','Cursor','Windsurf','Manus','Tabnine','Codeium','Amazon Q','Kullanmıyorum'].map((v) => (
                      <label className="checkbox-label" key={v}>
                        <input type="checkbox" name="kullanilan_agent" value={v} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 19: Ek notlar */}
              <div className="step-container" data-step="19">
                <div className="step-inner">
                  <div className="question-number">Soru 19 / {TOTAL_STEPS}</div>
                  <div className="question-title">Eklemek istediğiniz bir şey var mı?</div>
                  <textarea
                    name="ek_notlar"
                    className="form-input"
                    placeholder="Kısa bir not bırakabilirsiniz... (Opsiyonel)"
                    maxLength={500}
                    rows={5}
                    onInput={(e) => setCharCount((e.target as HTMLTextAreaElement).value.length)}
                  />
                  <div id="charCount">{charCount} / 500</div>
                </div>
              </div>

              {/* Step 20: Veri paylaşım onayı + iletişim izni */}
              <div className="step-container" data-step="20">
                <div className="step-inner">
                  <div className="question-number">Soru 20 / {TOTAL_STEPS}</div>
                  <div className="question-title">Oluşturulan veritabanı grupla paylaşılacak. Onaylıyor musunuz?</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                    (Onaylamazsanız listeye erişiminiz ne yazık ki olmayacak.)
                  </p>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="veri_paylasim_onay" value="true" /><span>Evet, onaylıyorum</span></label>
                    <label className="radio-label"><input type="radio" name="veri_paylasim_onay" value="false" /><span>Hayır, onaylamıyorum</span></label>
                  </div>
                  <div className="question-title" style={{ marginTop: '20px' }}>WhatsApp üzerinden proje/iş teklifleri için iletişime geçilebilir mi?</div>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="iletisim_izni" value="true" /><span>Evet</span></label>
                    <label className="radio-label"><input type="radio" name="iletisim_izni" value="false" /><span>Hayır</span></label>
                  </div>
                </div>
              </div>

              {/* Step 21: Kimlik bilgileri */}
              <div className="step-container" data-step="21">
                <div className="step-inner">
                  <div className="question-number">Soru 21 / {TOTAL_STEPS}</div>
                  <div className="question-title">Ad Soyad</div>
                  <input type="text" name="ad_soyad" className="form-input" placeholder="Adınız ve soyadınız" />
                  <div className="question-title" style={{ marginTop: '20px' }}>LinkedIn profil linkiniz</div>
                  <input type="text" name="linkedin_url" className="form-input" placeholder="kullanici-adi" autoComplete="url" />
                  <div className="question-title" style={{ marginTop: '20px' }}>WhatsApp telefon numaranız</div>
                  <input type="text" name="whatsapp_tel" className="form-input" placeholder="+49 123 456 7890" />
                  <div className="question-title">Devuser girişi için e-posta ve şifre belirleyin</div>
                  <div>
                    <input type="email" name="auth_email" id="authEmailInput" className="form-input" placeholder="Email adresiniz" autoComplete="email" required />
                    <input type="password" name="auth_password" id="authPasswordInput" className="form-input" placeholder="Şifreniz (en az 6 karakter)" autoComplete="new-password" minLength={6} required style={{ marginTop: '12px' }} />
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
                      Bu e-posta ve şifre ile list sayfasına giriş yapacaksınız. Hesabınız admin onayından sonra arama ekranı açılır.
                    </p>
                  </div>
                </div>
              </div>

            </form>

            {/* Navigation Buttons */}
            {!showSuccess && (
              <div className="nav-buttons">
                <button
                  type="button"
                  className="du-btn du-btn-secondary"
                  onClick={() => handleChangeStep(-1)}
                  disabled={currentStep === 1}
                >
                  ← Geri
                </button>
                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    className="du-btn du-btn-primary"
                    onClick={() => handleChangeStep(1)}
                  >
                    İleri →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="du-btn du-btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder 🚀'}
                  </button>
                )}
              </div>
            )}

            {/* Success Message */}
            <div className={`success-message${showSuccess ? ' active' : ''}`}>
              <div className="success-icon">✅</div>
              <div className="success-title">Kayıt Başarılı!</div>
              <div className="success-text">
                Admin onayından sonra tarafınıza bilgi verilecek ve listeye erişebileceksiniz! Teşekkürler!
              </div>
            </div>
          </div>

        </div>
      </DevUserShell>

      <StepSyncEffect currentStep={currentStep} totalSteps={TOTAL_STEPS} />
    </>
  );
}

// Side-effect component to sync active step class on DOM
function StepSyncEffect({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  useEffect(() => {
    document.querySelectorAll('.step-container').forEach((container) => {
      const step = Number((container as HTMLElement).dataset.step);
      if (step === currentStep) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    });
  }, [currentStep, totalSteps]);
  return null;
}
