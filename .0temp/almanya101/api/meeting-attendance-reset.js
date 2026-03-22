import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  );
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { error } = await supabase
      .from('meeting_attendance')
      .delete()
      .not('id', 'is', null); // Delete all records (id is not null)

    if (error) {
      console.error('meeting-attendance-reset delete failed:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, message: 'Tüm kayıtlar başarıyla silindi' });
  } catch (error) {
    console.error('meeting-attendance-reset failed:', error);
    return res.status(500).json({ error: error.message || 'Reset failed' });
  }
}
