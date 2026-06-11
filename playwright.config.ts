import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/*
================================
Playwright Config (Safe Visual Fix Version)
================================
目的：
- 既存テスト資産を一切壊さない
- Visual RegressionのLinux/Windows差分問題を解消
- 最小限の変更で安定化
================================
*/

export default defineConfig({
  testDir: './tests',

  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30 * 1000,

  /*
  ================================
  Visual安定化（最小構成）
  ================================
  */

  use: {
    baseURL: 'https://www.saucedemo.com',

    // Visual安定化のための固定値
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,

    // アニメーション・描画差分対策
    actionTimeout: 0,

    // trace / video（既存運用維持 + CI最適化）
    trace: isCI ? 'on-first-retry' : 'on',
    screenshot: 'off',
    video: isCI ? 'retain-on-failure' : 'on',
  },

  /*
  ================================
  レポート
  ================================
  */
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'on-failure' }]],

  /*
  ================================
  注意：snapshot設定は触らない（重要）
  ================================
  理由：
  - 既存6画面のsnapshotとズレるリスクを排除
  - 今は「安定化フェーズ」であり構造変更は不要
  ================================
  */

  // projectsも触らない（既存資産保護）
});