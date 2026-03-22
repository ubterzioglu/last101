import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, parseJsonBody } from './_devuser-admin.js';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

const STRING_FIELDS = new Map([
  ['ad_soyad', 100],
  ['linkedin_url', 500],
  ['whatsapp_tel', 40],
  ['sehir', 100],
  ['rol', 80],
  ['deneyim_seviye', 80],
  ['proje_link', 500],
  ['is_arama_durumu', 80],
  ['freelance_aciklik', 80],
  ['katilma_amaci', 300],
  ['ek_notlar', 500],
  ['login_email', 254],
  ['admin_note', 500],
]);

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

const ARRAY_FIELDS = new Set([
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
]);

function sanitizeString(value, maxLength = 500) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function sanitizeArray(value, maxItems = 30) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === 'string')
      .map((item) => item.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, maxItems);
  }

  return [];
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return null;
}

function normalizeStatus(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!ALLOWED_STATUSES.has(normalized)) return null;
  return normalized;
}

function normalizeAction(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!['approve', 'reject', 'pending', 'delete'].includes(normalized)) return null;
  return normalized;
}

function isMissingApprovalStatusColumn(error) {
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();
  return message.includes('approval_status') && message.includes('column');
}

function buildUpdateData(rawData = {}) {
  const updates = {};

  for (const [field, maxLength] of STRING_FIELDS.entries()) {
    if (!Object.prototype.hasOwnProperty.call(rawData, field)) continue;
    updates[field] = sanitizeString(rawData[field], maxLength);
  }

  for (const field of BOOLEAN_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(rawData, field)) continue;
    const value = toBoolean(rawData[field]);
    if (value === null) {
      throw new Error(`Invalid boolean value for ${field}`);
    }
    updates[field] = value;
  }

  for (const field of ARRAY_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(rawData, field)) continue;
    updates[field] = sanitizeArray(rawData[field], 30);
  }

  if (Object.prototype.hasOwnProperty.call(rawData, 'approval_status')) {
    const status = normalizeStatus(rawData.approval_status);
    if (!status) {
      throw new Error('Invalid approval_status');
    }
    updates.approval_status = status;
    if (status === 'approved') {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = 'admin';
    } else {
      updates.approved_at = null;
      updates.approved_by = null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(rawData, 'login_email')) {
    if (updates.login_email) {
      updates.login_email = updates.login_email.toLowerCase();
    }
  }

  return updates;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const body = parseJsonBody(req);
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const action = normalizeAction(body.action);

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (action === 'delete') {
      const { error } = await supabase.from('devuser').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true, deleted: true });
    }

    const updates = buildUpdateData(body.data || {});

    if (action === 'approve') {
      updates.approval_status = 'approved';
      updates.approved_at = new Date().toISOString();
      updates.approved_by = 'admin';
    } else if (action === 'reject') {
      updates.approval_status = 'rejected';
      updates.approved_at = null;
      updates.approved_by = null;
    } else if (action === 'pending') {
      updates.approval_status = 'pending';
      updates.approved_at = null;
      updates.approved_by = null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const executeUpdate = async (payload) => {
      return supabase
        .from('devuser')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();
    };

    let { data, error } = await executeUpdate(updates);

    if (error && isMissingApprovalStatusColumn(error)) {
      const fallbackUpdates = { ...updates };
      delete fallbackUpdates.approval_status;
      delete fallbackUpdates.approved_at;
      delete fallbackUpdates.approved_by;

      if (Object.keys(fallbackUpdates).length === 0) {
        return res.status(409).json({
          error: 'Approval workflow kolonu eksik. Once migration uygulanmali.',
        });
      }

      const retry = await executeUpdate(fallbackUpdates);
      if (retry.error) throw retry.error;
      return res.status(200).json({
        ok: true,
        data: retry.data,
        warning: 'approval_status kolonu bulunamadigi icin onay durumu guncellenemedi.',
      });
    }

    if (error) throw error;

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error('devuser-admin-update failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
