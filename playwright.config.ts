import { defineConfig } from '@playwright/test';

/*
================================
CI安定化設定
================================
フレーク対策の基本セット
================================
*/

export default defineConfig({

  // CIでは失敗リトライ
  retries: 2,

  // CIでは並列制御
  workers: 2,

  // タイムアウト増加
  timeout: 30 * 1000,

  use: {

    // 失敗時のトレース取得
    trace: 'on-first-retry',

    // スクリーンショット
    screenshot: 'only-on-failure',

    // 動画
    video: 'retain-on-failure'
  }
});