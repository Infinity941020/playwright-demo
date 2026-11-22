import { defineConfig } from '@playwright/test';
import { TEST_TIMEOUT_MS } from './utils/timeouts';

const isCI = !!process.env.CI;

// テストの実行のしかた（テストの種類ごとのブラウザ、並列の数、再実行、制限時間、記録の残し方）を、CI と手元のそれぞれについて決める。
// 制限時間と記録の残し方の理由は python/decisions.md の論点27、見た目の比較の撮影の条件は specs/visual_spec.md にある

export default defineConfig({

  testDir: './tests',

  retries: isCI ? 2 : 0,

  workers: isCI ? 2 : undefined,

  timeout: TEST_TIMEOUT_MS,


  // 見た目の比較の基準画像のファイル名に OS やブラウザの名前を付けず、どの環境でも CI で撮った同じ基準画像と比べる
  // （OS ごとに基準画像が分かれないようにするため）
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/__snapshots__/{arg}.png',


  use: {

    baseURL:
      'https://www.saucedemo.com',

    // 見た目の比較を安定させるため、画面の大きさと画素の密度を固定する
    viewport: {
      width: 1280,
      height: 720,
    },

    deviceScaleFactor: 1,

    actionTimeout: 0,

    screenshot: 'off',

    // 失敗したテストの記録（トレース）と録画だけを残し、成功したテストの分は残さない（python/decisions.md の論点27）
    trace: 'retain-on-failure',
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