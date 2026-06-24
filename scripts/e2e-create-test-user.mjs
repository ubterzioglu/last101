/**
 * Creates (idempotently) a single E2E test user in Supabase using the service
 * role key, with email confirmation pre-set so it can log in immediately.
 *
 * Usage:
 *   node scripts/e2e-create-test-user.mjs
 *
 * Reads from environment (or .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   E2E_TEST_EMAIL      (default: e2e-test@almanya101.de)
 *   E2E_TEST_PASSWORD   (default: a generated-but-stable test password)
 *
 * SECURITY: service role key is admin-level. This script ONLY creates/ensures
 * one fixed test user. It never deletes or touches other users.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Minimal .env.local loader (no extra dependency).
function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2];
      }
    }
  } catch {
    // .env.local optional if env already set
  }
}

loadEnvLocal();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const EMAIL = process.env.E2E_TEST_EMAIL || 'e2e-test@almanya101.de';
const PASSWORD = process.env.E2E_TEST_PASSWORD || 'E2e-Test-Pass-2026!';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  // Paginate listUsers until found (admin API has no direct getByEmail).
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find(
      (u) => (u.email || '').toLowerCase() === email.toLowerCase()
    );
    if (found) return found;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  console.log(`Ensuring E2E test user: ${EMAIL}`);

  const existing = await findUserByEmail(EMAIL);
  if (existing) {
    // Make sure it can log in: confirm email + reset password to known value.
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    console.log('Test user already existed — ensured confirmed + password set.');
    console.log(`  id=${existing.id}`);
    return;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { e2e: true },
  });
  if (error) throw error;

  console.log('Test user created.');
  console.log(`  id=${data.user.id}`);
  console.log(`  email=${EMAIL}`);
  console.log('NOTE: store E2E_TEST_EMAIL / E2E_TEST_PASSWORD in your CI secrets / .env.local.');
}

main().catch((err) => {
  console.error('Failed:', err.message || err);
  process.exit(1);
});
