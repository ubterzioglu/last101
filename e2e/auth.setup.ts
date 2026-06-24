import { test as setup, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Auth setup — logs in once with the E2E test user and saves the browser
 * storage state so gated tool tests can reuse the session.
 *
 * Credentials come from env (or .env.local):
 *   E2E_TEST_EMAIL     (default e2e-test@almanya101.de)
 *   E2E_TEST_PASSWORD  (default matches scripts/e2e-create-test-user.mjs)
 *
 * Output: e2e/.auth/user.json  (gitignored)
 */

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}
loadEnvLocal();

const EMAIL = process.env.E2E_TEST_EMAIL || 'e2e-test@almanya101.de';
const PASSWORD = process.env.E2E_TEST_PASSWORD || 'E2e-Test-Pass-2026!';

export const STORAGE_STATE = path.resolve(process.cwd(), 'e2e/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/giris');

  // Login form (GirisClient.tsx): #email, #password, "Giriş Yap" submit.
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  // Two "Giriş Yap" buttons exist (mode-toggle tab + form submit); target the
  // submit button inside the form.
  await page.locator('form').getByRole('button', { name: 'Giriş Yap' }).click();

  // After successful login the app navigates away from /giris.
  await expect(page).not.toHaveURL(/\/giris/, { timeout: 15_000 });

  // Sanity: a gated tool should now be reachable (not bounced to /giris).
  await page.goto('/maas-hesaplama');
  await expect(page).not.toHaveURL(/\/giris/);

  await page.context().storageState({ path: STORAGE_STATE });
});
