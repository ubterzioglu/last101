// =========================================================
// FILE: /api/devuser-list.js
// PURPOSE: Auth-protected proxy for DevUser list
// =========================================================

import { getSupabaseUserFromRequest } from './_supabase-user.js';

const PUBLIC_SELECT = [
  'id',
  'ad_soyad',
  'sehir',
  'rol',
  'deneyim_seviye',
  'aktif_kod',
  'guclu_alanlar',
  'programlama_dilleri',
  'framework_platformlar',
  'devops_cloud',
  'ilgi_konular',
  'ogrenmek_istenen',
  'is_arama_durumu',
  'ai_app_builders',
  'freelance_aciklik',
  'katilma_amaci',
  'isbirligi_turu',
  'profesyonel_destek_verebilir',
  'profesyonel_destek_almak',
  'kullanilan_ide',
  'kullanilan_agent',
  'linkedin_url',
  'whatsapp_tel',
  'iletisim_izni',
  'email_gorunur',
  'linkedin_gorunur',
  'whatsapp_gorunur',
  'created_at',
].join(',');

function getServiceHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 200;
  return Math.min(parsed, 1000);
}

function normalizeKeyword(value) {
  return String(value || '').trim().toLowerCase();
}

function parseErrorMessage(payload = {}) {
  return String(payload?.message || payload?.error || payload?.hint || '').toLowerCase();
}

function isMissingColumnPayload(payload, columnName) {
  const msg = parseErrorMessage(payload);
  return msg.includes(String(columnName || '').toLowerCase()) && msg.includes('column');
}

async function fetchJsonWithStatus(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function fetchProfileByField({ supabaseUrl, headers, field, value }) {
  if (!value) {
    return { row: null, missingField: false };
  }

  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('select', '*');
  url.searchParams.set(field, `eq.${value}`);
  url.searchParams.set('limit', '1');

  const { response, payload } = await fetchJsonWithStatus(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (isMissingColumnPayload(payload, field)) {
      return { row: null, missingField: true };
    }
    return { row: null, missingField: false };
  }

  const rows = Array.isArray(payload) ? payload : [];
  return { row: rows[0] || null, missingField: false };
}

async function bindProfileToAuthUser({ supabaseUrl, headers, profileId, userId, email }) {
  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('id', `eq.${profileId}`);
  url.searchParams.set('select', '*');

  const { response, payload } = await fetchJsonWithStatus(url.toString(), {
    method: 'PATCH',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      user_id: userId,
      login_email: email,
    }),
  });

  if (!response.ok) return null;
  const rows = Array.isArray(payload) ? payload : [];
  return rows[0] || null;
}

async function resolveProfile({ supabaseUrl, serviceRoleKey, auth }) {
  const headers = getServiceHeaders(serviceRoleKey);
  const email = String(auth.user.email || '').toLowerCase();

  const byUserId = await fetchProfileByField({
    supabaseUrl,
    headers,
    field: 'user_id',
    value: auth.user.id,
  });
  if (byUserId.row) {
    return byUserId.row;
  }

  const byEmail = await fetchProfileByField({
    supabaseUrl,
    headers,
    field: 'login_email',
    value: email,
  });

  if (byEmail.row) {
    if (!byEmail.row.user_id && !byUserId.missingField) {
      const claimed = await bindProfileToAuthUser({
        supabaseUrl,
        headers,
        profileId: byEmail.row.id,
        userId: auth.user.id,
        email,
      });
      return claimed || byEmail.row;
    }

    return byEmail.row;
  }
  return null;
}

function sanitizeUserRows(rows = []) {
  return rows.map((user) => ({
    ...user,
    // Privacy controls: only show contact info if user allowed it
    linkedin_url: user?.linkedin_gorunur !== false ? user?.linkedin_url : null,
    whatsapp_tel: user?.iletisim_izni && user?.whatsapp_gorunur !== false ? user?.whatsapp_tel : null,
    // Remove privacy flags and contact consent from public view
    email_gorunur: undefined,
    linkedin_gorunur: undefined,
    whatsapp_gorunur: undefined,
    iletisim_izni: undefined,
  }));
}

function keywordMatch(user, keyword) {
  if (!keyword) return true;

  const listToText = (value) => (Array.isArray(value) ? value.join(' ') : String(value || ''));
  const haystack = [
    user.ad_soyad,
    user.sehir,
    user.rol,
    user.deneyim_seviye,
    user.is_arama_durumu,
    listToText(user.guclu_alanlar),
    listToText(user.programlama_dilleri),
    listToText(user.framework_platformlar),
    listToText(user.devops_cloud),
    listToText(user.ilgi_konular),
    listToText(user.ogrenmek_istenen),
    listToText(user.kullanilan_ide),
    listToText(user.kullanilan_agent),
  ]
    .join(' ')
    .toLowerCase();

  const tokens = keyword
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (tokens.length === 0) return true;
  return tokens.every((token) => haystack.includes(token));
}

async function fetchPublicUsers({ supabaseUrl, serviceRoleKey, limit }) {
  const headers = getServiceHeaders(serviceRoleKey);
  const baseUrl = new URL(`${supabaseUrl}/rest/v1/devuser`);
  baseUrl.searchParams.set('select', PUBLIC_SELECT);
  baseUrl.searchParams.set('aratilabilir', 'eq.true');
  baseUrl.searchParams.set('order', 'created_at.desc');
  baseUrl.searchParams.set('limit', String(limit));

  const withApprovalUrl = new URL(baseUrl.toString());
  withApprovalUrl.searchParams.set('approval_status', 'eq.approved');

  let result = await fetchJsonWithStatus(withApprovalUrl.toString(), {
    method: 'GET',
    headers,
  });

  if (!result.response.ok && isMissingColumnPayload(result.payload, 'approval_status')) {
    throw new Error('Approval workflow eksik. Lutfen migration uygulayin.');
  }

  if (!result.response.ok) {
    const msg = parseErrorMessage(result.payload) || `HTTP ${result.response.status}`;
    throw new Error(msg);
  }

  const rows = Array.isArray(result.payload) ? result.payload : [];
  return sanitizeUserRows(rows);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim();
  const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('devuser-list missing env config', {
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
    return res.status(503).json({ error: 'Service not configured' });
  }

  const limit = normalizeLimit(req.query?.limit);
  const keyword = normalizeKeyword(req.query?.q);

  let profile = null;
  try {
    profile = await resolveProfile({
      supabaseUrl: SUPABASE_URL,
      serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
      auth,
    });
  } catch (error) {
    console.error('devuser-list profile check failed:', error);
    return res.status(500).json({ error: 'Profile check failed' });
  }

  if (!profile) {
    return res.status(403).json({
      error: 'Kayit bulunamadi. Lutfen once formu doldurun.',
      code: 'PROFILE_NOT_FOUND',
    });
  }

  if (!Object.prototype.hasOwnProperty.call(profile, 'approval_status')) {
    return res.status(403).json({
      error: 'Onay durumu dogrulanamadi. Lutfen admin ile iletisime gecin.',
      code: 'APPROVAL_UNKNOWN',
    });
  }

  const approvalStatus = String(profile.approval_status || 'pending').toLowerCase();
  if (approvalStatus !== 'approved') {
    const waitingMessage =
      approvalStatus === 'rejected'
        ? 'Kaydiniz admin tarafindan reddedildi. Bilgi icin admin ile iletisime gecin.'
        : 'Kaydiniz admin onayi bekliyor. Onaydan sonra arama ekranini kullanabilirsiniz.';

    return res.status(403).json({
      error: waitingMessage,
      code: 'APPROVAL_PENDING',
      approval_status: approvalStatus,
    });
  }

  try {
    const rows = await fetchPublicUsers({
      supabaseUrl: SUPABASE_URL,
      serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
      limit,
    });

    const filtered = keyword ? rows.filter((row) => keywordMatch(row, keyword)) : rows;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      data: filtered,
      pagination: {
        page: 1,
        limit,
        total: filtered.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('devuser-list fetch failed:', error);
    return res.status(500).json({ error: error.message || 'User list unavailable' });
  }
}
