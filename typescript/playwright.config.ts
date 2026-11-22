import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

// テストの実行のしかたを決める。
// - 画面のテストは Chromium・Firefox・WebKit の3つで、API と見た目の比較のテストは Chromium だけで動かす
// - CI では2並列で、失敗したテストを2回まで再実行する。手元では再実行せず、並列の数は Playwright の初期値（CPU の数の半分）にする
// - テストの制限時間は30秒。ログイン状態の作り直しとログイン済みの画面を開く処理は、別の制限時間で動く（fixtures/loginFixture.ts）

export default defineConfig({

  testDir: './tests',

  retries: isCI ? 2 : 0,

  workers: isCI ? 2 : undefined,

  timeout: 30 * 1000,


  snapshotPathTemplate:
    '{testDir}/{testFileDir}/__snapshots__/{arg}.png',


  use: {

    baseURL:
      'https://www.saucedemo.com',

    viewport: {
      width: 1280,
      height: 720,
    },

    deviceScaleFactor: 1,

    actionTimeout: 0,

    // 手元でも CI と同じく、失敗したときだけ残す（python/decisions.md の論点27）
    trace: 'retain-on-failure',

    screenshot: 'off',

    video: 'retain-on-failure',

  },


  reporter: isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
      ]
    : [
        ['html', { open: 'on-failure' }],
      ],



  projects: [


    {
      name: 'chromium-ui',

      testMatch:
        '**/tests/ui/**/*.spec.ts',

      use: {
        browserName: 'chromium',
      },

    },


    {
      name: 'firefox-ui',

      testMatch:
        '**/tests/ui/**/*.spec.ts',

      use: {
        browserName: 'firefox',
      },

    },


    {
      name: 'webkit-ui',

      testMatch:
        '**/tests/ui/**/*.spec.ts',

      use: {
        browserName: 'webkit',
      },

    },


    {
      name: 'chromium-api',

      testMatch:
        '**/tests/api/**/*.spec.ts',

      use: {
        browserName: 'chromium',
      },

    },


    {
      name: 'chromium-visual',

      testMatch:
        '**/tests/visual/**/*.spec.ts',

      use: {
        browserName: 'chromium',
      },

    },


  ],

});