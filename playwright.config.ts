// Playwrightの設定を定義するための関数をimport
import { defineConfig } from '@playwright/test';

// Playwright全体の設定を定義
export default defineConfig({

  // テスト全体の共通設定
  use: {

    // ここには共通設定を書く（今回は空）
    // ※storageStateはここでは使わない（setupと分離するため）
  },

  // テスト実行の単位（プロジェクト構成）
  projects: [

    // setupプロジェクト（ログイン状態を作る専用）
    {
      name: 'setup',

      // setupファイルだけを実行対象にする
      testMatch: /.*\.setup\.ts/,

      // setupではブラウザ状態を持たないので空設定
      use: {},
    },

    // 通常のE2Eテスト実行用プロジェクト
    {
      name: 'chromium',

      // Chromiumブラウザでテスト実行
      use: {

        // setupで作成したログイン状態を使う
        storageState: 'auth.json',
      },

      // setupが完了してから実行される依存関係
      dependencies: ['setup'],
    },
  ],
});