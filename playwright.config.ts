import { defineConfig, devices } from '@playwright/test';

/**
 * Phase 0+1 smoke configuration.
 * - When BASE_URL is set, tests run against that URL (no local build).
 * - Otherwise Playwright builds and starts the app locally.
 */
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-pw',
  },
  projects: [
    // Public/anonymous smoke — no auth.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /tools\/.*\.spec\.ts/,
    },
    // One-time login that produces the shared storage state.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // Authenticated project for gated tool tests under e2e/tools/.
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /tools\/.*\.spec\.ts/,
    },
  ],
  // Only build+serve locally when BASE_URL is not provided.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
