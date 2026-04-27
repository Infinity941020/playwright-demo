/*
================================
Playwright設定ファイル
CI時は安定実行、ローカル時は動画証跡取得
================================
*/

import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/*
================================
CI安定化 + ローカル証跡強化設定
================================
CI:
- リトライあり
- 並列実行
- 失敗時のみ証跡取得

Local:
- 成功時も動画取得
- slowMoで見やすく実行
================================
*/

export default defineConfig({

  // CIでは失敗リトライ
  retries: isCI ? 2 : 0,

  // CIでは並列制御
  workers: isCI ? 2 : undefined,

  // タイムアウト
  timeout: 30 * 1000,

  use: {

    // トレース
    // CI: 初回失敗後の再実行時のみ
    // Local: 常時取得
    trace: isCI ? 'on-first-retry' : 'on',

    // スクリーンショット
    // CI: 失敗時のみ
    // Local: 不要のためOFF
    screenshot: isCI ? 'only-on-failure' : 'off',

    // 動画
    // CI: 失敗時のみ保存
    // Local: 成功時も保存
    video: isCI ? 'retain-on-failure' : 'on',

    // ローカル実行時のみ速度調整
    launchOptions: {
      slowMo: isCI ? 0 : 500
    }
  }
});