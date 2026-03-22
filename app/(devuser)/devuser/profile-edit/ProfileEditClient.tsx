'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DevUserShell } from '@/components/devuser/DevUserShell';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const PAGE_CSS = `
  .profile-layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .profile-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 20px;
  }

  .profile-content {
    flex: 1;
    min-width: 0;
  }

  .progress-card {
    text-align: center;
    padding: 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    margin-bottom: 16px;
  }

  .progress-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto 16px;
    position: relative;
  }

  .progress-circle svg {
    transform: rotate(-90deg);
  }

  .progress-circle-bg {
    fill: none;
    stroke: #2a2a2a;
    stroke-width: 8;
  }

  .progress-circle-fill {
    fill: none;
    stroke: #F65314;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px;
    font-weight: 700;
    color: #fff;
  }

  .progress-label {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
  }

  .section-nav {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .section-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 4px;
    font-size: 14px;
    color: rgba(255,255,255,0.7);
  }

  .section-nav-item:hover {
    background: #1a1a1a;
    color: #fff;
  }

  .section-nav-item.active {
    background: rgba(246, 83, 20, 0.15);
    color: #F65314;
    font-weight: 600;
  }

  .section-nav-item.completed {
    color: #10b981;
  }

  .section-nav-item.completed::after {
    content: '✓';
    margin-left: auto;
    font-size: 12px;
  }

  .section-nav-icon {
    width: 24px;
    text-align: center;
    font-size: 16px;
  }

  .sidebar-nav-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 16px;
  }

  .form-section {
    margin-bottom: 20px;
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    overflow: hidden;
    background: #111;
  }

  .form-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: linear-gradient(90deg, rgba(246, 83, 20, 0.1) 0%, transparent 100%);
    border-bottom: 1px solid #2a2a2a;
    cursor: pointer;
    transition: all 0.2s;
  }

  .form-section-header:hover {
    background: linear-gradient(90deg, rgba(246, 83, 20, 0.15) 0%, transparent 100%);
  }

  .form-section-header.collapsed {
    border-bottom: none;
  }

  .form-section-icon {
    font-size: 20px;
  }

  .form-section-title {
    flex: 1;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .form-section-status {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    background: #1a1a1a;
    color: rgba(255,255,255,0.5);
  }

  .form-section-status.completed {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .form-section-status.partial {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }

  .form-section-toggle {
    font-size: 12px;
    transition: transform 0.2s;
  }

  .form-section-header.collapsed .form-section-toggle {
    transform: rotate(-90deg);
  }

  .form-section-body {
    padding: 24px;
  }

  .form-section-body.collapsed {
    display: none;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
  }

  .form-group input[type="text"],
  .form-group input[type="url"],
  .form-group input[type="tel"],
  .form-group input[type="email"] {
    width: 100%;
    padding: 14px 16px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #F65314;
    box-shadow: 0 0 0 3px rgba(246, 83, 20, 0.1);
    background: #222;
  }

  .form-group input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .form-group input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .input-with-toggle {
    position: relative;
  }

  .input-with-toggle input {
    padding-right: 100px;
  }

  .input-toggle {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #2a2a2a;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .input-toggle:hover {
    background: #333;
  }

  .input-toggle input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #F65314;
  }

  .checkbox-group-container,
  .radio-group-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  .checkbox-label,
  .radio-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .checkbox-label:hover,
  .radio-label:hover {
    border-color: #F65314;
    background: #222;
  }

  .checkbox-label:has(input:checked),
  .radio-label:has(input:checked) {
    background: rgba(246, 83, 20, 0.1);
    border-color: #F65314;
  }

  .checkbox-label input,
  .radio-label input {
    width: 18px;
    height: 18px;
    accent-color: #F65314;
    flex-shrink: 0;
  }

  .action-bar {
    position: sticky;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, #000 20%);
    padding: 20px 0;
    margin-top: 20px;
    z-index: 100;
  }

  .action-bar-inner {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .error-text {
    color: #ef4444;
    font-size: 13px;
    margin-top: 6px;
  }

  .status-message {
    padding: 16px 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .status-message.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
  }

  .status-message.error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  .loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: #F65314;
    border-radius: 50%;
    animation: pe-spin 0.8s linear infinite;
  }

  @keyframes pe-spin {
    to { transform: rotate(360deg); }
  }

  .btn {
    padding: 14px 32px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #F65314;
    color: #fff;
  }

  .btn-primary:hover {
    background: #d94510;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #1a1a1a;
    color: rgba(255,255,255,0.8);
    border: 1px solid #333;
  }

  .btn-secondary:hover {
    background: #222;
    color: #fff;
  }

  .hero-card-profile {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
  }

  .hero-top-profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .hero-domain-profile {
    font-size: 13px;
    font-weight: 600;
    color: #F65314;
    text-transform: lowercase;
    margin-bottom: 4px;
  }

  .hero-card-profile h3 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }

  .loading-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    text-align: center;
    padding: 60px;
  }

  .loading-card h3 {
    margin-top: 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #fff;
  }

  @media (max-width: 1024px) {
    .profile-layout {
      flex-direction: column;
    }

    .profile-sidebar {
      width: 100%;
      position: static;
      order: -1;
    }

    .section-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .section-nav-item {
      flex: 1;
      min-width: 140px;
      justify-content: center;
      margin-bottom: 0;
    }

    .section-nav-item.completed::after {
      display: none;
    }

    .progress-card {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .checkbox-group-container,
    .radio-group-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .form-section-body {
      padding: 16px;
    }

    .form-section-header {
      padding: 16px 20px;
    }

    .action-bar-inner {
      flex-direction: column;
    }

    .action-bar .btn {
      width: 100%;
    }
  }
`;

type SectionId = 'personal' | 'profile' | 'tech' | 'interests' | 'work' | 'collab' | 'privacy';

interface SectionStatus {
  label: string;
  className: string;
}

interface ProfileData {
  ad_soyad?: string;
  sehir?: string;
  linkedin_url?: string;
  whatsapp_tel?: string;
  proje_link?: string;
  rol?: string;
  deneyim_seviye?: string;
  is_arama_durumu?: string;
  freelance_aciklik?: string;
  katilma_amaci?: string;
  almanya_yasam?: boolean;
  aktif_kod?: boolean;
  acik_kaynak?: boolean;
  kendi_proje?: boolean;
  gonullu_proje?: boolean;
  profesyonel_destek_verebilir?: boolean;
  profesyonel_destek_almak?: boolean;
  aratilabilir?: boolean;
  iletisim_izni?: boolean;
  linkedin_gorunur?: boolean;
  whatsapp_gorunur?: boolean;
  guclu_alanlar?: string[];
  programlama_dilleri?: string[];
  framework_platformlar?: string[];
  devops_cloud?: string[];
  ilgi_konular?: string[];
  ogrenmek_istenen?: string[];
  isbirligi_turu?: string[];
}

let profileEditClient: SupabaseClient | null = null;

async function getAuthClient(): Promise<SupabaseClient> {
  if (profileEditClient) return profileEditClient;
  const res = await fetch('/api/supabase-config', { cache: 'no-store' });
  if (!res.ok) throw new Error('Config fetch failed');
  const { url, anonKey } = await res.json();
  if (!url || !anonKey) throw new Error('Supabase config eksik.');
  profileEditClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return profileEditClient;
}

async function getSessionToken(): Promise<string | null> {
  const client = await getAuthClient();
  const { data, error } = await client.auth.getSession();
  if (error || !data.session) return null;
  return data.session.access_token;
}

const SECTIONS: Array<{ id: SectionId; icon: string; label: string }> = [
  { id: 'personal', icon: '👤', label: 'Kişisel Bilgiler' },
  { id: 'profile', icon: '💼', label: 'Profil Bilgileri' },
  { id: 'tech', icon: '⚙️', label: 'Teknoloji Stack' },
  { id: 'interests', icon: '⭐', label: 'İlgi Alanları' },
  { id: 'work', icon: '🔍', label: 'İş Durumu' },
  { id: 'collab', icon: '🤝', label: 'İş Birliği' },
  { id: 'privacy', icon: '🔒', label: 'Görünürlük' },
];

export function ProfileEditClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [nameError, setNameError] = useState('');
  const [progress, setProgress] = useState(0);
  const [sectionStatuses, setSectionStatuses] = useState<Record<SectionId, SectionStatus>>({
    personal: { label: 'Boş', className: 'form-section-status' },
    profile: { label: 'Boş', className: 'form-section-status' },
    tech: { label: 'Boş', className: 'form-section-status' },
    interests: { label: 'Boş', className: 'form-section-status' },
    work: { label: 'Boş', className: 'form-section-status' },
    collab: { label: 'Boş', className: 'form-section-status' },
    privacy: { label: 'Boş', className: 'form-section-status' },
  });
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set());
  const [activeSection, setActiveSection] = useState<SectionId>('personal');
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionId>>(
    new Set(['profile', 'tech', 'interests', 'work', 'collab', 'privacy'])
  );

  // Form field refs — text inputs
  const adSoyadRef = useRef<HTMLInputElement>(null);
  const sehirRef = useRef<HTMLInputElement>(null);
  const linkedinUrlRef = useRef<HTMLInputElement>(null);
  const whatsappTelRef = useRef<HTMLInputElement>(null);
  const projeLinkRef = useRef<HTMLInputElement>(null);

  // Checkbox refs (single booleans)
  const almanyaYasamRef = useRef<HTMLInputElement>(null);
  const aktifKodRef = useRef<HTMLInputElement>(null);
  const acikKaynakRef = useRef<HTMLInputElement>(null);
  const kendiProjeRef = useRef<HTMLInputElement>(null);
  const gonulluProjeRef = useRef<HTMLInputElement>(null);
  const profesyonelDestekVerebilirRef = useRef<HTMLInputElement>(null);
  const profesyonelDestekAlmakRef = useRef<HTMLInputElement>(null);
  const aratilabilirRef = useRef<HTMLInputElement>(null);
  const iletisimIzniRef = useRef<HTMLInputElement>(null);
  const linkedinGorunurRef = useRef<HTMLInputElement>(null);
  const whatsappGorunurRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const computeProgress = useCallback(() => {
    if (!formRef.current) return;

    const sectionDefs = [
      { id: 'personal' as SectionId, fields: ['ad_soyad', 'sehir', 'linkedin_url', 'whatsapp_tel'] },
      { id: 'profile' as SectionId, fields: ['rol', 'deneyim_seviye', 'guclu_alanlar'] },
      { id: 'tech' as SectionId, fields: ['programlama_dilleri', 'framework_platformlar', 'devops_cloud'] },
      { id: 'interests' as SectionId, fields: ['ilgi_konular', 'ogrenmek_istenen'] },
      { id: 'work' as SectionId, fields: ['is_arama_durumu', 'freelance_aciklik'] },
      { id: 'collab' as SectionId, fields: ['katilma_amaci', 'isbirligi_turu'] },
      { id: 'privacy' as SectionId, fields: ['aratilabilir'] },
    ];

    const arrayFields = new Set([
      'guclu_alanlar', 'programlama_dilleri', 'framework_platformlar',
      'devops_cloud', 'ilgi_konular', 'ogrenmek_istenen', 'isbirligi_turu',
    ]);
    const radioFields = new Set([
      'rol', 'deneyim_seviye', 'is_arama_durumu', 'freelance_aciklik', 'katilma_amaci',
    ]);

    let completed = 0;
    let partial = 0;

    const newStatuses = { ...sectionStatuses };
    const newCompleted = new Set<SectionId>();

    sectionDefs.forEach(({ id, fields }) => {
      let filled = 0;
      fields.forEach((field) => {
        if (arrayFields.has(field)) {
          const checked = formRef.current!.querySelectorAll(`input[name="${field}"]:checked`);
          if (checked.length > 0) filled++;
        } else if (radioFields.has(field)) {
          const checked = formRef.current!.querySelector(`input[name="${field}"]:checked`);
          if (checked) filled++;
        } else {
          const input = formRef.current!.querySelector<HTMLInputElement>(`#${field}`);
          if (input && input.value.trim()) filled++;
        }
      });

      if (filled === fields.length && fields.length > 0) {
        newStatuses[id] = { label: 'Tamamlandı', className: 'form-section-status completed' };
        newCompleted.add(id);
        completed++;
      } else if (filled > 0) {
        newStatuses[id] = { label: 'Eksik', className: 'form-section-status partial' };
        partial++;
      } else {
        newStatuses[id] = { label: 'Boş', className: 'form-section-status' };
      }
    });

    const pct = Math.round(((completed + partial * 0.5) / sectionDefs.length) * 100);
    setProgress(pct);
    setSectionStatuses(newStatuses);
    setCompletedSections(newCompleted);
  }, [sectionStatuses]);

  function populateForm(data: ProfileData) {
    // Text fields
    if (adSoyadRef.current && data.ad_soyad) adSoyadRef.current.value = data.ad_soyad;
    if (sehirRef.current && data.sehir) sehirRef.current.value = data.sehir;
    if (linkedinUrlRef.current && data.linkedin_url) linkedinUrlRef.current.value = data.linkedin_url;
    if (whatsappTelRef.current && data.whatsapp_tel) whatsappTelRef.current.value = data.whatsapp_tel;
    if (projeLinkRef.current && data.proje_link) projeLinkRef.current.value = data.proje_link;

    // Radio fields
    const radioFields: Array<[string, string | undefined]> = [
      ['rol', data.rol],
      ['deneyim_seviye', data.deneyim_seviye],
      ['is_arama_durumu', data.is_arama_durumu],
      ['freelance_aciklik', data.freelance_aciklik],
      ['katilma_amaci', data.katilma_amaci],
    ];
    if (formRef.current) {
      radioFields.forEach(([name, value]) => {
        if (value) {
          const radio = formRef.current!.querySelector<HTMLInputElement>(
            `input[name="${name}"][value="${value}"]`
          );
          if (radio) radio.checked = true;
        }
      });
    }

    // Boolean checkboxes
    const boolMap: Array<[React.RefObject<HTMLInputElement | null>, boolean | undefined]> = [
      [almanyaYasamRef, data.almanya_yasam],
      [aktifKodRef, data.aktif_kod],
      [acikKaynakRef, data.acik_kaynak],
      [kendiProjeRef, data.kendi_proje],
      [gonulluProjeRef, data.gonullu_proje],
      [profesyonelDestekVerebilirRef, data.profesyonel_destek_verebilir],
      [profesyonelDestekAlmakRef, data.profesyonel_destek_almak],
      [aratilabilirRef, data.aratilabilir],
      [iletisimIzniRef, data.iletisim_izni],
    ];
    boolMap.forEach(([ref, val]) => {
      if (ref.current) ref.current.checked = val === true;
    });

    // Privacy toggles (default true if undefined)
    if (linkedinGorunurRef.current) linkedinGorunurRef.current.checked = data.linkedin_gorunur !== false;
    if (whatsappGorunurRef.current) whatsappGorunurRef.current.checked = data.whatsapp_gorunur !== false;

    // Array checkboxes
    const arrayFields: Array<[string, string[] | undefined]> = [
      ['guclu_alanlar', data.guclu_alanlar],
      ['programlama_dilleri', data.programlama_dilleri],
      ['framework_platformlar', data.framework_platformlar],
      ['devops_cloud', data.devops_cloud],
      ['ilgi_konular', data.ilgi_konular],
      ['ogrenmek_istenen', data.ogrenmek_istenen],
      ['isbirligi_turu', data.isbirligi_turu],
    ];
    if (formRef.current) {
      arrayFields.forEach(([name, values]) => {
        if (Array.isArray(values)) {
          values.forEach((val) => {
            const cb = formRef.current!.querySelector<HTMLInputElement>(
              `input[name="${name}"][value="${val}"]`
            );
            if (cb) cb.checked = true;
          });
        }
      });
    }
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getSessionToken();
        if (!token) {
          router.replace('/devuser/list');
          return;
        }

        const response = await fetch('/api/devuser-me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Profil yüklenemedi');
        const result = await response.json();
        if (!result.data) throw new Error('Profil bulunamadı');

        populateForm(result.data as ProfileData);
        setLoading(false);
        // Compute progress after DOM has updated
        setTimeout(computeProgress, 0);
      } catch {
        router.replace('/devuser/list');
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function serializeForm(): ProfileData {
    const getRadio = (name: string): string => {
      const checked = formRef.current?.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    };
    const getCheckboxArray = (name: string): string[] => {
      const checkboxes = formRef.current?.querySelectorAll<HTMLInputElement>(
        `input[name="${name}"]:checked`
      );
      return checkboxes ? Array.from(checkboxes).map((cb) => cb.value) : [];
    };

    return {
      ad_soyad: adSoyadRef.current?.value.trim() ?? '',
      sehir: sehirRef.current?.value.trim() ?? '',
      linkedin_url: linkedinUrlRef.current?.value.trim() ?? '',
      whatsapp_tel: whatsappTelRef.current?.value.trim() ?? '',
      proje_link: projeLinkRef.current?.value.trim() ?? '',
      rol: getRadio('rol'),
      deneyim_seviye: getRadio('deneyim_seviye'),
      is_arama_durumu: getRadio('is_arama_durumu'),
      freelance_aciklik: getRadio('freelance_aciklik'),
      katilma_amaci: getRadio('katilma_amaci'),
      almanya_yasam: almanyaYasamRef.current?.checked ?? false,
      aktif_kod: aktifKodRef.current?.checked ?? false,
      acik_kaynak: acikKaynakRef.current?.checked ?? false,
      kendi_proje: kendiProjeRef.current?.checked ?? false,
      gonullu_proje: gonulluProjeRef.current?.checked ?? false,
      profesyonel_destek_verebilir: profesyonelDestekVerebilirRef.current?.checked ?? false,
      profesyonel_destek_almak: profesyonelDestekAlmakRef.current?.checked ?? false,
      aratilabilir: aratilabilirRef.current?.checked ?? false,
      iletisim_izni: iletisimIzniRef.current?.checked ?? false,
      linkedin_gorunur: linkedinGorunurRef.current?.checked ?? true,
      whatsapp_gorunur: whatsappGorunurRef.current?.checked ?? true,
      guclu_alanlar: getCheckboxArray('guclu_alanlar'),
      programlama_dilleri: getCheckboxArray('programlama_dilleri'),
      framework_platformlar: getCheckboxArray('framework_platformlar'),
      devops_cloud: getCheckboxArray('devops_cloud'),
      ilgi_konular: getCheckboxArray('ilgi_konular'),
      ogrenmek_istenen: getCheckboxArray('ogrenmek_istenen'),
      isbirligi_turu: getCheckboxArray('isbirligi_turu'),
    };
  }

  function validateForm(): boolean {
    const name = adSoyadRef.current?.value.trim() ?? '';
    if (!name || name.length < 2) {
      setNameError('Ad Soyad en az 2 karakter olmalı');
      return false;
    }
    setNameError('');
    return true;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setStatusMsg('');
    setStatusType('');
    setSaving(true);

    try {
      const token = await getSessionToken();
      if (!token) {
        setStatusMsg('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
        setStatusType('error');
        setTimeout(() => router.replace('/devuser/list'), 2000);
        return;
      }

      const formData = serializeForm();

      const response = await fetch('/api/devuser-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatusMsg((result as { error?: string }).error || 'Güncelleme başarısız.');
        setStatusType('error');
        return;
      }

      setStatusMsg('Profil başarıyla güncellendi! Listeye yönlendiriliyorsunuz...');
      setStatusType('success');
      computeProgress();
      setTimeout(() => router.replace('/devuser/list'), 1500);
    } catch {
      setStatusMsg('Bir hata oluştu. Lütfen tekrar deneyin.');
      setStatusType('error');
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(id: SectionId) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function navigateToSection(id: SectionId) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      // Collapse all, expand selected
      SECTIONS.forEach((s) => next.add(s.id));
      next.delete(id);
      return next;
    });
    setActiveSection(id);
    setTimeout(() => {
      document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const circumference = 326.73;
  const strokeOffset = circumference - (progress / 100) * circumference;

  if (loading) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön" frameVariant="wide">
          <div className="loading-card">
            <div className="hero-domain-profile">almanya101.de</div>
            <h3>Profil Düzenle</h3>
            <div style={{ marginTop: 30 }}>
              <div className="loading-spinner" />
              <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.6)' }}>Profil yükleniyor...</p>
            </div>
          </div>
        </DevUserShell>
      </>
    );
  }

  return (
    <>
      <style>{PAGE_CSS}</style>
      <DevUserShell backHref="/devuser/dev" backLabel="← dashboard'a dön" frameVariant="wide">
        {/* Hero */}
        <div className="hero-card-profile">
          <div className="hero-top-profile">
            <div>
              <div className="hero-domain-profile">almanya101.de</div>
              <h3>Profil Düzenle</h3>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => router.replace('/devuser/list')}>
              ← Listeye Dön
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className={`status-message ${statusType}`}>{statusMsg}</div>
        )}

        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="progress-card">
              <div className="progress-circle">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle className="progress-circle-bg" cx="60" cy="60" r="52" />
                  <circle
                    className="progress-circle-fill"
                    cx="60"
                    cy="60"
                    r="52"
                    strokeDasharray="326.73"
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div className="progress-text">{progress}%</div>
              </div>
              <div className="progress-label">Profil Tamamlama</div>
            </div>

            <div className="sidebar-nav-card">
              <ul className="section-nav">
                {SECTIONS.map(({ id, icon, label }) => (
                  <li
                    key={id}
                    className={[
                      'section-nav-item',
                      activeSection === id ? 'active' : '',
                      completedSections.has(id) ? 'completed' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => navigateToSection(id)}
                  >
                    <span className="section-nav-icon">{icon}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form Content */}
          <main className="profile-content" ref={formRef}>
            {/* Kişisel Bilgiler */}
            <div className="form-section" id="section-personal">
              <div
                className={`form-section-header${collapsedSections.has('personal') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('personal')}
              >
                <span className="form-section-icon">👤</span>
                <h4 className="form-section-title">Kişisel Bilgiler</h4>
                <span className={sectionStatuses.personal.className}>{sectionStatuses.personal.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('personal') ? ' collapsed' : ''}`} id="body-personal">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ad_soyad">Ad Soyad *</label>
                    <input
                      type="text"
                      id="ad_soyad"
                      name="ad_soyad"
                      ref={adSoyadRef}
                      required
                      autoComplete="name"
                      placeholder="Adınız ve soyadınız"
                      className={nameError ? 'error' : ''}
                      onChange={computeProgress}
                    />
                    {nameError && <div className="error-text">{nameError}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sehir">Şehir</label>
                    <input
                      type="text"
                      id="sehir"
                      name="sehir"
                      ref={sehirRef}
                      autoComplete="address-level2"
                      placeholder="örn: Berlin"
                      onChange={computeProgress}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="linkedin_url">LinkedIn URL</label>
                  <div className="input-with-toggle">
                    <input
                      type="url"
                      id="linkedin_url"
                      name="linkedin_url"
                      ref={linkedinUrlRef}
                      autoComplete="url"
                      placeholder="https://linkedin.com/in/kullanici"
                      onChange={computeProgress}
                    />
                    <label className="input-toggle">
                      <input type="checkbox" id="linkedin_gorunur" name="linkedin_gorunur" ref={linkedinGorunurRef} defaultChecked />
                      <span>Göster</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="whatsapp_tel">WhatsApp Telefon</label>
                  <div className="input-with-toggle">
                    <input
                      type="tel"
                      id="whatsapp_tel"
                      name="whatsapp_tel"
                      ref={whatsappTelRef}
                      autoComplete="tel"
                      placeholder="+49 123 456 7890"
                      onChange={computeProgress}
                    />
                    <label className="input-toggle">
                      <input type="checkbox" id="whatsapp_gorunur" name="whatsapp_gorunur" ref={whatsappGorunurRef} defaultChecked />
                      <span>Göster</span>
                    </label>
                  </div>
                </div>

                <label className="checkbox-label" style={{ marginTop: 8 }}>
                  <input type="checkbox" id="almanya_yasam" name="almanya_yasam" ref={almanyaYasamRef} onChange={computeProgress} />
                  <span>🇩🇪 Almanya&apos;da yaşıyorum</span>
                </label>
              </div>
            </div>

            {/* Profil Bilgileri */}
            <div className="form-section" id="section-profile">
              <div
                className={`form-section-header${collapsedSections.has('profile') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('profile')}
              >
                <span className="form-section-icon">💼</span>
                <h4 className="form-section-title">Profil Bilgileri</h4>
                <span className={sectionStatuses.profile.className}>{sectionStatuses.profile.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('profile') ? ' collapsed' : ''}`} id="body-profile">
                <div className="form-group">
                  <label>Rol</label>
                  <div className="radio-group-container">
                    {['Software Developer', 'QA/Test', 'DevOps', 'Data/AI', 'Product/Project', 'UI/UX', 'Öğrenci', 'Diğer'].map((val) => (
                      <label key={val} className="radio-label">
                        <input type="radio" name="rol" value={val} onChange={computeProgress} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Deneyim Seviyesi</label>
                  <div className="radio-group-container">
                    {['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl'].map((val) => (
                      <label key={val} className="radio-label">
                        <input type="radio" name="deneyim_seviye" value={val} onChange={computeProgress} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Güçlü Alanlar</label>
                  <div className="checkbox-group-container">
                    {['Backend', 'Frontend', 'Mobile', 'QA/Manual Testing', 'Test Automation', 'DevOps/CI-CD', 'Data/BI', 'AI/ML', 'Cloud', 'Security', 'Product/Project', 'UI/UX'].map((val) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="guclu_alanlar" value={val} onChange={computeProgress} />
                        {val === 'QA/Manual Testing' ? 'QA/Manual' : val}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: 16 }}>
                  <label className="checkbox-label">
                    <input type="checkbox" id="aktif_kod" name="aktif_kod" ref={aktifKodRef} onChange={computeProgress} />
                    <span>💻 Aktif kod yazıyorum</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" id="acik_kaynak" name="acik_kaynak" ref={acikKaynakRef} onChange={computeProgress} />
                    <span>🌍 Açık kaynak projeler</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" id="kendi_proje" name="kendi_proje" ref={kendiProjeRef} onChange={computeProgress} />
                    <span>🚀 Kendi projem var</span>
                  </label>
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label htmlFor="proje_link">Proje Link</label>
                  <input
                    type="url"
                    id="proje_link"
                    name="proje_link"
                    ref={projeLinkRef}
                    autoComplete="url"
                    placeholder="https://github.com/kullanici/proje"
                    onChange={computeProgress}
                  />
                </div>
              </div>
            </div>

            {/* Teknoloji Stack */}
            <div className="form-section" id="section-tech">
              <div
                className={`form-section-header${collapsedSections.has('tech') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('tech')}
              >
                <span className="form-section-icon">⚙️</span>
                <h4 className="form-section-title">Teknoloji Stack</h4>
                <span className={sectionStatuses.tech.className}>{sectionStatuses.tech.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('tech') ? ' collapsed' : ''}`} id="body-tech">
                <div className="form-group">
                  <label>Programlama Dilleri</label>
                  <div className="checkbox-group-container">
                    {['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'PHP', 'C/C++', 'Kotlin', 'Swift', 'SQL', 'Rust'].map((val) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="programlama_dilleri" value={val} onChange={computeProgress} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Framework/Platformlar</label>
                  <div className="checkbox-group-container">
                    {['React', 'Angular', 'Vue', 'Next.js', 'Node.js', '.NET', 'Spring', 'Django', 'FastAPI', 'Flutter', 'React Native'].map((val) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="framework_platformlar" value={val} onChange={computeProgress} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>DevOps/Cloud</label>
                  <div className="checkbox-group-container">
                    {['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'GitHub Actions', 'GitLab CI', 'Jenkins'].map((val) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="devops_cloud" value={val} onChange={computeProgress} />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* İlgi Alanları */}
            <div className="form-section" id="section-interests">
              <div
                className={`form-section-header${collapsedSections.has('interests') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('interests')}
              >
                <span className="form-section-icon">⭐</span>
                <h4 className="form-section-title">İlgi Alanları</h4>
                <span className={sectionStatuses.interests.className}>{sectionStatuses.interests.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('interests') ? ' collapsed' : ''}`} id="body-interests">
                <div className="form-group">
                  <label>İlgi Konuları</label>
                  <div className="checkbox-group-container">
                    {[
                      ['AI araçları/LLM uygulamaları', '🤖 AI/LLM'],
                      ['Startup/ürün geliştirme', '🚀 Startup'],
                      ['Freelance/danışmanlık', '💼 Freelance'],
                      ['Remote çalışma', '🏠 Remote'],
                      ['Almanya\'da kariyer', '🇩🇪 Almanya Kariyer'],
                      ['Networking/event/meetup', '🎉 Networking'],
                      ['Side project/hackathon', '⚡ Side Projects'],
                      ['Open-source', '🌍 Open Source'],
                      ['Sertifika/eğitim', '📚 Eğitim'],
                      ['Teknik yazı/içerik', '✍️ Teknik Yazı'],
                    ].map(([val, display]) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="ilgi_konular" value={val} onChange={computeProgress} />
                        {display}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Öğrenmek İstenen</label>
                  <div className="checkbox-group-container">
                    {['Backend', 'Frontend', 'Mobile', 'Test Automation', 'DevOps', 'Cloud', 'AI/ML', 'Data Engineering', 'Security', 'System Design', 'Interview prep/CV', 'Almanya kariyer'].map((val) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="ogrenmek_istenen" value={val} onChange={computeProgress} />
                        {val === 'Interview prep/CV' ? 'Interview Prep' : val === 'Almanya kariyer' ? 'Almanya Kariyer' : val}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* İş Durumu */}
            <div className="form-section" id="section-work">
              <div
                className={`form-section-header${collapsedSections.has('work') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('work')}
              >
                <span className="form-section-icon">🔍</span>
                <h4 className="form-section-title">İş Durumu</h4>
                <span className={sectionStatuses.work.className}>{sectionStatuses.work.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('work') ? ' collapsed' : ''}`} id="body-work">
                <div className="form-group">
                  <label>İş Arama Durumu</label>
                  <div className="radio-group-container">
                    {[
                      ['Hayır', '🟢 Hayır (Çalışıyorum)'],
                      ['Evet pasif (firsat olursa)', '🟡 Pasif (Fırsat olursa)'],
                      ['Evet, aktif', '🔴 Aktif Arıyorum'],
                      ['Sadece freelance bakıyorum', '💻 Sadece Freelance'],
                    ].map(([val, display]) => (
                      <label key={val} className="radio-label">
                        <input type="radio" name="is_arama_durumu" value={val} onChange={computeProgress} />
                        {display}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Freelance Açıklık</label>
                  <div className="radio-group-container">
                    {[
                      ['Hayır', '❌ Hayır'],
                      ['Evet hafta içi akşamları', '🌙 Hafta içi akşamları'],
                      ['Evet hafta sonu', '📅 Hafta sonu'],
                      ['Evet part-time düzenli', '⏰ Part-time düzenli'],
                      ['Evet full-time freelance', '🚀 Full-time freelance'],
                    ].map(([val, display]) => (
                      <label key={val} className="radio-label">
                        <input type="radio" name="freelance_aciklik" value={val} onChange={computeProgress} />
                        {display}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="checkbox-label" style={{ marginTop: 8 }}>
                  <input type="checkbox" id="gonullu_proje" name="gonullu_proje" ref={gonulluProjeRef} onChange={computeProgress} />
                  <span>🙋 Gönüllü projelere katılabilirim</span>
                </label>
              </div>
            </div>

            {/* İş Birliği */}
            <div className="form-section" id="section-collab">
              <div
                className={`form-section-header${collapsedSections.has('collab') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('collab')}
              >
                <span className="form-section-icon">🤝</span>
                <h4 className="form-section-title">İş Birliği</h4>
                <span className={sectionStatuses.collab.className}>{sectionStatuses.collab.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('collab') ? ' collapsed' : ''}`} id="body-collab">
                <div className="form-group">
                  <label>Katılma Amacı</label>
                  <div className="radio-group-container">
                    {[
                      ['Networking', '🤝 Networking'],
                      ['İş bulmak', '🔍 İş bulmak'],
                      ['İş arkadaşı bulmak', '👥 İş arkadaşı bulmak'],
                      ['Proje geliştirmek', '🚀 Proje geliştirmek'],
                      ['Bilgi paylaşmak', '📚 Bilgi paylaşmak'],
                      ['Mentorluk almak', '🎓 Mentorluk almak'],
                      ['Mentorluk vermek', '👨‍🏫 Mentorluk vermek'],
                    ].map(([val, display]) => (
                      <label key={val} className="radio-label">
                        <input type="radio" name="katilma_amaci" value={val} onChange={computeProgress} />
                        {display}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>İş Birliği Türleri</label>
                  <div className="checkbox-group-container">
                    {[
                      ['Side project (haftada 2-5 saat)', '⚡ Side project (2-5 saat)'],
                      ['Side project (haftada 5-10 saat)', '🚀 Side project (5-10 saat)'],
                      ['Startup kurmak (ciddi)', '💡 Startup kurmak'],
                      ['MVP çıkarma ekibi', '🎯 MVP ekibi'],
                      ['Freelance ekip kurmak', '💼 Freelance ekip'],
                      ['Açık kaynak proje', '🌍 Açık kaynak'],
                      ['Study group', '📖 Study group'],
                      ['Mentorluk/koçluk', '🎓 Mentorluk'],
                      ['Sadece tanışma & network', '☕ Sadece network'],
                    ].map(([val, display]) => (
                      <label key={val} className="checkbox-label">
                        <input type="checkbox" name="isbirligi_turu" value={val} onChange={computeProgress} />
                        {display}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: 16 }}>
                  <label className="checkbox-label">
                    <input type="checkbox" id="profesyonel_destek_verebilir" name="profesyonel_destek_verebilir" ref={profesyonelDestekVerebilirRef} onChange={computeProgress} />
                    <span>👨‍🏫 Profesyonel destek verebilirim</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" id="profesyonel_destek_almak" name="profesyonel_destek_almak" ref={profesyonelDestekAlmakRef} onChange={computeProgress} />
                    <span>🎓 Profesyonel destek almak istiyorum</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Görünürlük */}
            <div className="form-section" id="section-privacy">
              <div
                className={`form-section-header${collapsedSections.has('privacy') ? ' collapsed' : ''}`}
                onClick={() => toggleSection('privacy')}
              >
                <span className="form-section-icon">🔒</span>
                <h4 className="form-section-title">Görünürlük</h4>
                <span className={sectionStatuses.privacy.className}>{sectionStatuses.privacy.label}</span>
                <span className="form-section-toggle">▼</span>
              </div>
              <div className={`form-section-body${collapsedSections.has('privacy') ? ' collapsed' : ''}`} id="body-privacy">
                <div className="form-row">
                  <label className="checkbox-label">
                    <input type="checkbox" id="aratilabilir" name="aratilabilir" ref={aratilabilirRef} defaultChecked onChange={computeProgress} />
                    <span>🔍 Aranabilir (diğer üyeler beni bulsun)</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" id="iletisim_izni" name="iletisim_izni" ref={iletisimIzniRef} defaultChecked onChange={computeProgress} />
                    <span>📞 İletişim bilgilerimi paylaş</span>
                  </label>
                </div>
                <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  💡 <strong>Bilgi:</strong> LinkedIn ve WhatsApp görünürlüğünü her alanın yanındaki &quot;Göster&quot; toggle&apos;ından yönetebilirsiniz.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <div className="action-bar-inner">
                <button type="button" className="btn btn-secondary" onClick={() => router.replace('/devuser/list')}>
                  İptal
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? '💾 Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </DevUserShell>
    </>
  );
}
