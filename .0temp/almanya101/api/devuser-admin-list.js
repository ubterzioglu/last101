import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeStatus(value) {
  if (typeof value !== 'string') return 'all';
  const normalized = value.trim().toLowerCase();
  return ALLOWED_STATUSES.has(normalized) ? normalized : 'all';
}

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 200;
  return Math.min(parsed, 1000);
}

function extractErrorMessage(error) {
  if (!error) return '';
  return String(error.message || error.details || error.hint || '').toLowerCase();
}

function normalizeRowStatus(row) {
  const status = String(row?.approval_status || 'pending').toLowerCase();
  if (ALLOWED_STATUSES.has(status)) return status;
  return 'pending';
}

async function runQueryWithFallback({ baseQueryFactory, status }) {
  let orderByCreatedAt = true;
  let result = await baseQueryFactory({
    applyStatusFilter: status !== 'all',
    orderByCreatedAt,
  });

  if (result.error) {
    const firstMessage = extractErrorMessage(result.error);
    const createdAtColumnMissing = firstMessage.includes('created_at') && firstMessage.includes('column');
    if (createdAtColumnMissing) {
      orderByCreatedAt = false;
      result = await baseQueryFactory({
        applyStatusFilter: status !== 'all',
        orderByCreatedAt,
      });
    }
  }

  if (!result.error) return result;

  const message = extractErrorMessage(result.error);
  const approvalColumnMissing = message.includes('approval_status') && message.includes('column');
  if (!approvalColumnMissing) return result;

  result = await baseQueryFactory({
    applyStatusFilter: false,
    orderByCreatedAt,
  });

  if (result.error && orderByCreatedAt) {
    const retryMessage = extractErrorMessage(result.error);
    const createdAtColumnMissing = retryMessage.includes('created_at') && retryMessage.includes('column');
    if (createdAtColumnMissing) {
      result = await baseQueryFactory({
        applyStatusFilter: false,
        orderByCreatedAt: false,
      });
    }
  }

  if (result.error) return result;

  const rows = Array.isArray(result.data) ? result.data : [];
  const rowsWithStatus = rows.map((row) => ({ ...row, approval_status: normalizeRowStatus(row) }));
  const filteredRows =
    status === 'all'
      ? rowsWithStatus
      : rowsWithStatus.filter((row) => normalizeRowStatus(row) === status);

  return {
    ...result,
    data: filteredRows,
    count: filteredRows.length,
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const id = typeof req.query?.id === 'string' ? req.query.id.trim() : '';
    const status = normalizeStatus(req.query?.status);
    const limit = normalizeLimit(req.query?.limit);

    const baseQueryFactory = async ({ applyStatusFilter, orderByCreatedAt }) => {
      let query = supabase
        .from('devuser')
        .select('*', { count: 'exact' })
        .limit(limit);

      if (orderByCreatedAt) {
        query = query.order('created_at', { ascending: false });
      }

      if (id) {
        query = query.eq('id', id);
      } else if (applyStatusFilter && status !== 'all') {
        query = query.eq('approval_status', status);
      }

      return query;
    };

    const { data, error, count } = await runQueryWithFallback({
      baseQueryFactory,
      status,
    });
    if (error) throw error;

    return res.status(200).json({
      data: data || [],
      count: Number(count || 0),
    });
  } catch (error) {
    console.error('devuser-admin-list failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
