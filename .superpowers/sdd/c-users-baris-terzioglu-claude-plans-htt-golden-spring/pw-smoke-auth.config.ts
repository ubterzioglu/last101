// Scratch config (git-ignored): run e2e/smoke with the logged-in test user,
// because tool routes are gated by middleware. Run from the repo root.
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const root = process.cwd();

export default defineConfig({
  testDir: path.join(root, 'e2e', 'smoke'),
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  reporter: [['line']],
  outputDir: path.join(root, 'test-results', 'smoke-auth'),
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-pw',
  },
  projects: [
    {
      name: 'smoke-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(root, 'e2e', '.auth', 'user.json'),
      },
    },
  ],
});
