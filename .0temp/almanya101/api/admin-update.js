// =====================================================
// API/ADMIN-UPDATE.JS
// Updates provider records for admin edit panel
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_TABLES = new Set(['providers', 'gastronomy_providers']);
const ALLOWED_FIELDS = new Set([
  'display_name',
  'city',
  'address',
  'phone',
  'website',
  'status',
  'google_place_id',
  'google_maps_url',
  'google_rating',
  'google_user_ratings_total',
  'notes_public',
  'languages'
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const { table, id, data } = req.body || {};
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }
  if (!id || !data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    if (ALLOWED_FIELDS.has(key)) {
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const { data: updated, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
