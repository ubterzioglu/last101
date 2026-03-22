import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const MARKER = '[DEVUSER_DIS_V1]';
const APPROVED_RAW_STATUSES = ['read', 'reviewed', 'resolved', 'approved'];

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function repairText(input) {
  const value = String(input || '').normalize('NFC');
  const looksMojibake = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|�/u.test(value);
  if (!looksMojibake) return value;

  try {
    const repaired = Buffer.from(value, 'latin1').toString('utf8').normalize('NFC');
    const stillBroken = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|�/u.test(repaired);
    return stillBroken ? value : repaired;
  } catch {
    return value;
  }
}

function parseLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 200;
  return Math.min(Math.max(parsed, 1), 1000);
}

function normalizeStatusFilter(value) {
  const raw = String(value || 'all').trim().toLowerCase();
  if (raw === 'approved') return 'approved';
  if (raw === 'pending') return 'pending';
  return 'all';
}

function normalizeStatus(status) {
  const safe = String(status || '').toLowerCase();
  if (APPROVED_RAW_STATUSES.includes(safe)) return 'approved';
  return 'pending';
}

function extractErrorMessage(error) {
  return String(error?.message || error?.details || error?.hint || '').toLowerCase();
}

function isMissingColumnError(error, columnName) {
  const msg = extractErrorMessage(error);
  return msg.includes('column') && msg.includes(String(columnName || '').toLowerCase());
}

async function queryDiscussionRowsWithFallback({ supabase, limit, status }) {
  const attempts = [
    { includeStatus: true, orderByCreatedAt: true },
    { includeStatus: true, orderByCreatedAt: false },
    { includeStatus: false, orderByCreatedAt: true },
    { includeStatus: false, orderByCreatedAt: false },
  ];

  let lastError = null;

  for (const attempt of attempts) {
    let selectColumns = 'id, message, created_at';
    if (attempt.includeStatus) selectColumns = 'id, message, status, created_at';

    let query = supabase
      .from('feedback_submissions')
      .select(selectColumns)
      .like('message', `${MARKER}%`)
      .limit(limit);

    if (attempt.orderByCreatedAt) {
      query = query.order('created_at', { ascending: false });
    }

    if (attempt.includeStatus) {
      if (status === 'approved') {
        query = query.in('status', APPROVED_RAW_STATUSES);
      } else if (status === 'pending') {
        query = query.eq('status', 'pending');
      }
    }

    const result = await query;
    if (!result.error) {
      return {
        data: Array.isArray(result.data) ? result.data : [],
        includeStatus: attempt.includeStatus,
        error: null,
      };
    }

    const missingStatus = isMissingColumnError(result.error, 'status');
    const missingCreatedAt = isMissingColumnError(result.error, 'created_at');
    if (!missingStatus && !missingCreatedAt) {
      return { data: [], includeStatus: attempt.includeStatus, error: result.error };
    }

    lastError = result.error;
  }

  return { data: [], includeStatus: false, error: lastError || new Error('Query failed') };
}

function parseMessage(rawMessage) {
  const message = String(rawMessage || '');
  if (!message.startsWith(`${MARKER}\n`)) return null;

  const lines = message.split('\n');
  if (lines.length < 5) return null;

  const anonymousLine = lines[1] || '';
  const fullNameLine = lines[2] || '';
  const topicLabelLine = lines[3] || '';

  if (!anonymousLine.startsWith('anonim:')) return null;
  if (!fullNameLine.startsWith('ad_soyad:')) return null;
  if (topicLabelLine.trim() !== 'konu:') return null;

  const anonymous = anonymousLine.slice('anonim:'.length).trim() === '1';
  const fullName = repairText(fullNameLine.slice('ad_soyad:'.length).trim());
  const topic = repairText(lines.slice(4).join('\n').trim());

  if (!topic) return null;

  return {
    anonymous,
    full_name: anonymous ? null : fullName,
    topic: topic.slice(0, 250),
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const SUPABASE_URL = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const SUPABASE_SERVICE_ROLE_KEY = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  );
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const limit = parseLimit(req.query?.limit);
  const status = normalizeStatusFilter(req.query?.status);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error, includeStatus } = await queryDiscussionRowsWithFallback({
      supabase,
      limit,
      status,
    });
    if (error) {
      console.error('devuser-dis-admin-list query failed:', error);
      return res.status(500).json({ error: 'Failed to fetch records' });
    }

    const parsedItems = [];

    for (const row of data || []) {
      const parsed = parseMessage(row.message);
      if (!parsed) continue;

      const normalizedStatus = includeStatus ? normalizeStatus(row.status) : 'pending';
      parsedItems.push({
        id: row.id,
        topic: parsed.topic,
        anonymous: parsed.anonymous,
        full_name: parsed.full_name,
        created_at: row.created_at,
        status: normalizedStatus,
        raw_status: row.status,
      });
    }

    const items =
      status === 'all'
        ? parsedItems
        : parsedItems.filter((item) => item.status === status);

    const pendingCount = items.filter((item) => item.status === 'pending').length;
    const approvedCount = items.filter((item) => item.status === 'approved').length;

    return res.status(200).json({
      ok: true,
      items,
      stats: {
        total: items.length,
        pending: pendingCount,
        approved: approvedCount,
      },
    });
  } catch (error) {
    console.error('devuser-dis-admin-list failed:', error);
    return res.status(500).json({ error: 'List failed' });
  }
}
