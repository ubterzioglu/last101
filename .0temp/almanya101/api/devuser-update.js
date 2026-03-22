import { getSupabaseUserFromRequest } from './_supabase-user.js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function getSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

// Validation constants
const ROL_OPTIONS = [
  'Software Developer', 'QA/Test', 'DevOps', 'Data/AI',
  'Product/Project', 'UI/UX', 'Öğrenci', 'Diğer'
];

const DENEYIM_OPTIONS = [
  '0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl'
];

const ARAMA_DURUMU_OPTIONS = [
  'Hayır', 'Evet pasif (firsat olursa)', 'Evet, aktif', 'Sadece freelance bakıyorum'
];

const FREELANCE_OPTIONS = [
  'Hayır', 'Evet hafta içi akşamları', 'Evet hafta sonu',
  'Evet part-time düzenli', 'Evet full-time freelance'
];

const KATILMA_AMACI_OPTIONS = [
  'Networking', 'İş bulmak', 'İş arkadaşı bulmak',
  'Proje geliştirmek', 'Bilgi paylaşmak', 'Mentorluk almak', 'Mentorluk vermek'
];

function validateString(value, fieldName, minLength = 0, maxLength = 500) {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null }; // Optional field
  }
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  return { valid: true, value: value.trim() };
}

function validateRequiredString(value, fieldName, minLength = 2, maxLength = 200) {
  if (value === undefined || value === null || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return validateString(value, fieldName, minLength, maxLength);
}

function validateBoolean(value, fieldName) {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (typeof value !== 'boolean') {
    return { valid: false, error: `${fieldName} must be true or false` };
  }
  return { valid: true, value };
}

function validateArray(value, fieldName, allowedValues = null) {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (!Array.isArray(value)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }
  if (allowedValues) {
    for (const item of value) {
      if (!allowedValues.includes(item)) {
        return { valid: false, error: `Invalid value in ${fieldName}: ${item}` };
      }
    }
  }
  return { valid: true, value };
}

function validateEnum(value, fieldName, allowedValues) {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null };
  }
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (!allowedValues.includes(value)) {
    return { valid: false, error: `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}` };
  }
  return { valid: true, value };
}

function validateUrl(value, fieldName) {
  if (!value || value === '') {
    return { valid: true, value: null };
  }
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: `${fieldName} must be a valid HTTP/HTTPS URL` };
    }
    return { valid: true, value: url.toString() };
  } catch {
    return { valid: false, error: `${fieldName} must be a valid URL` };
  }
}

function validatePhone(value, fieldName) {
  if (!value || value === '') {
    return { valid: true, value: null };
  }
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) {
    return { valid: false, error: `${fieldName} must be between 8-15 digits` };
  }
  return { valid: true, value: value.replace(/\s/g, '') };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const headers = getSupabaseHeaders(SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Fetch current profile by user_id
    const url = new URL(`${SUPABASE_URL}/rest/v1/devuser`);
    url.searchParams.set('select', '*');
    url.searchParams.set('user_id', `eq.${auth.user.id}`);
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), { method: 'GET', headers });
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    const rows = await response.json().catch(() => []);
    if (!Array.isArray(rows) || !rows[0]) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const currentProfile = rows[0];

    // Verify ownership (extra security)
    if (currentProfile.user_id !== auth.user.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = req.body || {};
      if (typeof req.body === 'string') {
        requestBody = JSON.parse(req.body);
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Validate request body
    const fieldErrors = {};
    const validatedData = {};

    // Required fields
    const nameResult = validateRequiredString(requestBody.ad_soyad, 'Ad Soyad');
    if (!nameResult.valid) {
      fieldErrors.ad_soyad = nameResult.error;
    } else {
      validatedData.ad_soyad = nameResult.value;
    }

    // Optional fields
    const cityResult = validateString(requestBody.sehir, 'Şehir', 0, 100);
    if (!cityResult.valid) fieldErrors.sehir = cityResult.error;
    else validatedData.sehir = cityResult.value;

    const linkedinResult = validateUrl(requestBody.linkedin_url, 'LinkedIn URL');
    if (!linkedinResult.valid) fieldErrors.linkedin_url = linkedinResult.error;
    else validatedData.linkedin_url = linkedinResult.value;

    const whatsappResult = validatePhone(requestBody.whatsapp_tel, 'WhatsApp');
    if (!whatsappResult.valid) fieldErrors.whatsapp_tel = whatsappResult.error;
    else validatedData.whatsapp_tel = whatsappResult.value;

    validatedData.almanya_yasam = validateBoolean(requestBody.almanya_yasam, 'Almanya\'da Yaşıyor').value;
    validatedData.rol = validateEnum(requestBody.rol, 'Rol', ROL_OPTIONS).value;
    validatedData.deneyim_seviye = validateEnum(requestBody.deneyim_seviye, 'Deneyim Seviyesi', DENEYIM_OPTIONS).value;
    validatedData.is_arama_durumu = validateEnum(requestBody.is_arama_durumu, 'İş Arama Durumu', ARAMA_DURUMU_OPTIONS).value;
    validatedData.freelance_aciklik = validateEnum(requestBody.freelance_aciklik, 'Freelance Açıklık', FREELANCE_OPTIONS).value;
    validatedData.katilma_amaci = validateEnum(requestBody.katilma_amaci, 'Katılma Amacı', KATILMA_AMACI_OPTIONS).value;

    const gucluAlanlarResult = validateArray(requestBody.guclu_alanlar, 'Güçlü Alanlar');
    if (!gucluAlanlarResult.valid) fieldErrors.guclu_alanlar = gucluAlanlarResult.error;
    else validatedData.guclu_alanlar = gucluAlanlarResult.value;

    const progDilleriResult = validateArray(requestBody.programlama_dilleri, 'Programlama Dilleri');
    if (!progDilleriResult.valid) fieldErrors.programlama_dilleri = progDilleriResult.error;
    else validatedData.programlama_dilleri = progDilleriResult.value;

    const frameworkResult = validateArray(requestBody.framework_platformlar, 'Framework/Platformlar');
    if (!frameworkResult.valid) fieldErrors.framework_platformlar = frameworkResult.error;
    else validatedData.framework_platformlar = frameworkResult.value;

    const devopsResult = validateArray(requestBody.devops_cloud, 'DevOps/Cloud');
    if (!devopsResult.valid) fieldErrors.devops_cloud = devopsResult.error;
    else validatedData.devops_cloud = devopsResult.value;

    const ilgiResult = validateArray(requestBody.ilgi_konular, 'İlgi Konular');
    if (!ilgiResult.valid) fieldErrors.ilgi_konular = ilgiResult.error;
    else validatedData.ilgi_konular = ilgiResult.value;

    const ogrenResult = validateArray(requestBody.ogrenmek_istenen, 'Öğrenmek İstenen');
    if (!ogrenResult.valid) fieldErrors.ogrenmek_istenen = ogrenResult.error;
    else validatedData.ogrenmek_istenen = ogrenResult.value;

    const isbirligiResult = validateArray(requestBody.isbirligi_turu, 'İş Birliği Türü');
    if (!isbirligiResult.valid) fieldErrors.isbirligi_turu = isbirligiResult.error;
    else validatedData.isbirligi_turu = isbirligiResult.value;

    // Boolean fields
    validatedData.aktif_kod = validateBoolean(requestBody.aktif_kod, 'Aktif Kod').value;
    validatedData.acik_kaynak = validateBoolean(requestBody.acik_kaynak, 'Açık Kaynak').value;
    validatedData.kendi_proje = validateBoolean(requestBody.kendi_proje, 'Kendi Proje').value;
    validatedData.gonullu_proje = validateBoolean(requestBody.gonullu_proje, 'Gönüllü Proje').value;
    validatedData.profesyonel_destek_verebilir = validateBoolean(requestBody.profesyonel_destek_verebilir, 'Profesyonel Destek Verebilir').value;
    validatedData.profesyonel_destek_almak = validateBoolean(requestBody.profesyonel_destek_almak, 'Profesyonel Destek Almak').value;
    validatedData.aratilabilir = validateBoolean(requestBody.aratilabilir, 'Aranabilir').value;
    validatedData.iletisim_izni = validateBoolean(requestBody.iletisim_izni, 'İletişim İzni').value;

    // Privacy control fields
    validatedData.email_gorunur = validateBoolean(requestBody.email_gorunur, 'Email Görünür').value;
    validatedData.linkedin_gorunur = validateBoolean(requestBody.linkedin_gorunur, 'LinkedIn Görünür').value;
    validatedData.whatsapp_gorunur = validateBoolean(requestBody.whatsapp_gorunur, 'WhatsApp Görünür').value;

    // URL field
    const projeLinkResult = validateUrl(requestBody.proje_link, 'Proje Link');
    if (!projeLinkResult.valid) fieldErrors.proje_link = projeLinkResult.error;
    else validatedData.proje_link = projeLinkResult.value;

    // Check if there are validation errors
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ error: 'Validation failed', field_errors: fieldErrors });
    }

    // Update profile in Supabase
    const updateUrl = new URL(`${SUPABASE_URL}/rest/v1/devuser`);
    updateUrl.searchParams.set('id', `eq.${currentProfile.id}`);
    updateUrl.searchParams.set('select', '*');

    const updateResponse = await fetch(updateUrl.toString(), {
      method: 'PATCH',
      headers: {
        ...headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(validatedData),
    });

    if (!updateResponse.ok) {
      console.error('Supabase update failed:', updateResponse.status);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    const updatedRows = await updateResponse.json().catch(() => []);
    if (!Array.isArray(updatedRows) || !updatedRows[0]) {
      return res.status(500).json({ error: 'Failed to retrieve updated profile' });
    }

    // Strip sensitive fields before returning
    const { login_pin_hash, login_pin_salt, ...safeData } = updatedRows[0];

    return res.status(200).json({
      success: true,
      data: safeData,
    });
  } catch (error) {
    console.error('devuser-update auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
