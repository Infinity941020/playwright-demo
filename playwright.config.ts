import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/*
========================================
Playwright Config (FINAL STABLE VERSION)
========================================
目的：
- OS依存snapshotを完全排除
- ローカル / CI / Linux / Windows完全統一
- Visual Regressionを単一baseline化
========================================
*/

export default defineConfig({
  testDir: './tests',

  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30 * 1000,

  /*
  ========================================
  ★ Visual Regressionの本丸修正
  ========================================
  OS依存のsnapshot分裂を防ぐ
  ========================================
  */
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/__snapshots__/{arg}.png',

  use: {
    baseURL: 'https://www.saucedemo.com',

    /*
    ================================
    Visual安定化（必須セット）
    ================================
    */
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,

    // アニメーション差分を防ぐ
    actionTimeout: 0,

    // CIログ安定化
    trace: isCI ? 'retain-on-failure' : 'on',
    screenshot: 'off',
    video: isCI ? 'retain-on-failure' : 'on',
  },

  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'on-failure' }]],

  /*
  ========================================
  ★ 重要：projectsは触らない（現状維持）
  ========================================
  理由：
  - OS分岐の原因を増やさないため
  - 今は単一Chromium運用で安定化優先
  ========================================
  */

  projects: [
    {
      name: 'chromium',
    },
  ],
});