// =========================================================
// FILE: /api/devuser-register.js
// PURPOSE: Register authenticated Supabase users in devuser
// =========================================================

import { getSupabaseUserFromRequest } from './_supabase-user.js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

function sanitizeString(value, maxLength = 500) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function sanitizeArray(value, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return fallback;
}

function normalizePhone(phone) {
  if (typeof phone !== 'string') return null;
  const raw = phone.trim();
  if (!raw) return null;
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  return hasPlus ? `+${digits}` : digits;
}

function isValidPhone(phone) {
  if (!phone) return true;
  return /^(\+|00)?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidLinkedInUrl(rawUrl) {
  if (!rawUrl) return true;
  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.toLowerCase();
    const isLinkedInHost =
      hostname === 'linkedin.com' ||
      hostname === 'www.linkedin.com' ||
      hostname.endsWith('.linkedin.com');
    return isLinkedInHost && (url.protocol === 'https:' || url.protocol === 'http:');
  } catch {
    return false;
  }
}

function isValidGenericUrl(rawUrl) {
  if (!rawUrl) return true;
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function parseBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  return null;
}

function deriveDisplayName(rawName, email) {
  const name = sanitizeString(rawName, 100);
  if (name && name.length >= 2) return name;

  const emailLocal = String(email || '')
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  const fromEmail = sanitizeString(emailLocal, 100);
  if (fromEmail && fromEmail.length >= 2) return fromEmail;

  return 'DevUser';
}

function extractMissingColumn(message) {
  const text = String(message || '');
  const patterns = [
    /could not find the '([^']+)' column/i,
    /column\s+"([^"]+)"/i,
    /column\s+'([^']+)'/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}

function buildErrorMessage(payload) {
  return (
    payload?.message ||
    payload?.error ||
    payload?.hint ||
    'Kayit sirasinda bir hata olustu. Lutfen tekrar deneyin.'
  );
}

function isLegacyLoginConstraintError(message) {
  const text = String(message || '').toLowerCase();
  return (
    text.includes('check_devuser_login_email_format') ||
    text.includes('check_devuser_login_hash_presence') ||
    text.includes('check_devuser_login_hash_pair')
  );
}

async function insertWithSchemaFallback({ supabaseUrl, headers, insertData }) {
  const removableColumns = new Set([
    'approval_status',
    'approved_at',
    'approved_by',
    'admin_note',
    'login_email',
    'login_pin_hash',
    'login_pin_salt',
    'user_id',
    'veri_paylasim_onay',
  ]);

  let dataToInsert = { ...insertData };
  let response = null;
  let payload = null;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    response = await fetch(`${supabaseUrl}/rest/v1/devuser`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(dataToInsert),
    });

    payload = await response.json().catch(() => null);
    if (response.ok) {
      return { response, payload, usedData: dataToInsert };
    }

    const message = buildErrorMessage(payload);
    const missingColumn = extractMissingColumn(message);
    if (!missingColumn) {
      if (isLegacyLoginConstraintError(message)) {
        const hasLoginFields =
          Object.prototype.hasOwnProperty.call(dataToInsert, 'login_email') ||
          Object.prototype.hasOwnProperty.call(dataToInsert, 'login_pin_hash') ||
          Object.prototype.hasOwnProperty.call(dataToInsert, 'login_pin_salt');
        if (hasLoginFields) {
          const next = { ...dataToInsert };
          delete next.login_email;
          delete next.login_pin_hash;
          delete next.login_pin_salt;
          dataToInsert = next;
          continue;
        }
      }
      return { response, payload, usedData: dataToInsert };
    }
    if (!Object.prototype.hasOwnProperty.call(dataToInsert, missingColumn)) {
      return { response, payload, usedData: dataToInsert };
    }
    if (!removableColumns.has(missingColumn)) {
      return { response, payload, usedData: dataToInsert };
    }

    const next = { ...dataToInsert };
    delete next[missingColumn];
    dataToInsert = next;
  }

  return { response, payload, usedData: dataToInsert };
}

function getSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = parseBody(req);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const providedAdSoyad = sanitizeString(body.ad_soyad, 100);
  const sehir = sanitizeString(body.sehir, 100);
  const rol = sanitizeString(body.rol, 80);
  const deneyimSeviye = sanitizeString(body.deneyim_seviye, 80);
  const isAramaDurumu = sanitizeString(body.is_arama_durumu, 80);
  const freelanceAciklik = sanitizeString(body.freelance_aciklik, 80);
  const katilmaAmaci = sanitizeString(body.katilma_amaci, 80);
  const linkedinUrl = sanitizeString(body.linkedin_url, 500);
  const projeLink = sanitizeString(body.proje_link, 500);
  const loginEmail = sanitizeString(auth.user.email || '', 254)?.toLowerCase() || '';
  const rawPhone = sanitizeString(body.whatsapp_tel, 40);
  const normalizedPhone = normalizePhone(rawPhone);
  const adSoyad = deriveDisplayName(providedAdSoyad, loginEmail);

  const aratilabilir = toBoolean(body.aratilabilir, false);
  const iletisimIzni = toBoolean(body.iletisim_izni, false);
  const veriPaylasimOnay = toBoolean(body.veri_paylasim_onay, false);

  if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
    return res.status(400).json({ error: 'Gecerli bir Supabase hesap email adresi gerekli' });
  }

  // Formattan dolayi kaydi durdurma:
  // Geçersiz LinkedIn/telefon/proje linki gelirse null'a çekip devam et.
  const safeLinkedinUrl = isValidLinkedInUrl(linkedinUrl) ? linkedinUrl : null;
  const safePhone = isValidPhone(normalizedPhone || '') ? normalizedPhone : null;
  const safeProjeLink = isValidGenericUrl(projeLink) ? projeLink : null;

  const headers = getSupabaseHeaders(SUPABASE_SERVICE_ROLE_KEY);

  try {
    const insertData = {
      user_id: auth.user.id,
      ad_soyad: adSoyad,
      linkedin_url: safeLinkedinUrl,
      whatsapp_tel: safePhone,
      almanya_yasam: body.yasam_yeri === 'Almanya',
      sehir,
      rol,
      deneyim_seviye: deneyimSeviye,
      aktif_kod: toBoolean(body.aktif_kod, false),
      guclu_alanlar: sanitizeArray(body.guclu_alanlar, 16),
      acik_kaynak: toBoolean(body.acik_kaynak, false),
      kendi_proje: toBoolean(body.kendi_proje, false),
      proje_link: safeProjeLink,
      programlama_dilleri: sanitizeArray(body.programlama_dilleri, 16),
      framework_platformlar: sanitizeArray(body.framework_platformlar, 16),
      devops_cloud: sanitizeArray(body.devops_cloud, 16),
      ilgi_konular: sanitizeArray(body.ilgi_konular, 16),
      ogrenmek_istenen: sanitizeArray(body.ogrenmek_istenen, 20),
      is_arama_durumu: isAramaDurumu,
      ai_app_builders: sanitizeArray(body.ai_app_builders, 16),
      freelance_aciklik: freelanceAciklik,
      gonullu_proje: toBoolean(body.gonullu_proje, false),
      katilma_amaci: katilmaAmaci,
      isbirligi_turu: sanitizeArray(body.isbirligi_turu, 16),
      profesyonel_destek_verebilir: toBoolean(body.profesyonel_destek_verebilir, false),
      profesyonel_destek_almak: toBoolean(body.profesyonel_destek_almak, false),
      aratilabilir,
      iletisim_izni: iletisimIzni,
      kullanilan_ide: sanitizeArray(body.kullanilan_ide, 16),
      kullanilan_agent: sanitizeArray(body.kullanilan_agent, 16),
      ek_notlar: sanitizeString(body.ek_notlar, 500),
      veri_paylasim_onay: veriPaylasimOnay,
      login_email: loginEmail,
      login_pin_hash: null,
      login_pin_salt: null,
      approval_status: 'pending',
      approved_at: null,
      approved_by: null,
      admin_note: null,
    };

    const { response, payload, usedData } = await insertWithSchemaFallback({
      supabaseUrl: SUPABASE_URL,
      headers,
      insertData,
    });
    if (!response.ok) {
      const message = buildErrorMessage(payload);
      return res.status(response.status).json({ error: message });
    }

    const created = Array.isArray(payload) ? payload[0] : null;
    const hasApprovalStatus = Object.prototype.hasOwnProperty.call(usedData, 'approval_status');
    return res.status(200).json({
      success: true,
      message: hasApprovalStatus
        ? 'Kayit alindi. Admin onayindan sonra listeye erisebilirsiniz.'
        : 'Kayit alindi. Profiliniz olusturuldu.',
      id: created?.id || null,
    });
  } catch (error) {
    console.error('devuser-register failed:', error);
    return res.status(500).json({
      error: 'Beklenmeyen bir hata olustu. Lutfen daha sonra tekrar deneyin.',
    });
  }
}

