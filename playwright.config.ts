/*
================================
Playwright設定ファイル
CI時は安定実行
ローカル時は証跡取得を強化
================================
*/

// Playwright設定定義
import { defineConfig } from '@playwright/test';

// CI実行判定
const isCI = !!process.env.CI;

/*
================================
CI安定化 + ローカル証跡強化設定
================================

■ CI
- retry有効
- worker数制御
- 失敗時のみ証跡保存

■ Local
- trace常時取得
- video常時取得
- slowMo有効
================================
*/
export default defineConfig({

  /*
  ================================
  テスト実行設定
  ================================
  */

  // CI時のみretry有効化
  retries: isCI ? 2 : 0,

  // CI時のみworker数制御
  workers: isCI ? 2 : undefined,

  // テスト全体タイムアウト
  timeout: 30 * 1000,

  /*
  ================================
  ブラウザ実行設定
  ================================
  */
  use: {

    // trace設定
    // CI: 初回失敗後のみ取得
    // Local: 常時取得
    trace: isCI ? 'on-first-retry' : 'on',

    // スクリーンショット設定
    // CI: 失敗時のみ
    // Local: OFF
    screenshot: isCI
      ? 'only-on-failure'
      : 'off',

    // 動画設定
    // CI: 失敗時のみ保持
    // Local: 常時保存
    video: isCI
      ? 'retain-on-failure'
      : 'on',

    // 起動設定
    launchOptions: {

      // Local時のみslowMo適用
      slowMo: isCI ? 0 : 500,
    },
  },
});