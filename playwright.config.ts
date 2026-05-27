import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/*
================================
Playwright Config
================================
MSWは完全に排除（重要）
================================
*/

export default defineConfig({
  testDir: './tests',
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30 * 1000,

  use: {
    baseURL: 'http://localhost',

    trace: isCI ? 'on-first-retry' : 'on',
    screenshot: isCI ? 'only-on-failure' : 'off',
    video: isCI ? 'retain-on-failure' : 'on',

    // launchOptionsはAPIテストでは不要なので削除してOK
  },
});