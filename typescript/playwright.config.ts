import { defineConfig } from '@playwright/test';
import { TEST_TIMEOUT_MS } from './utils/timeouts';

const isCI = !!process.env.CI;

// テストの実行のしかた（テストの種類ごとのブラウザ、並列の数、再実行、制限時間、記録の残し方）を、CI と手元のそれぞれについて決める。
// 見た目の比較の撮影の条件は specs/visual_spec.md にある

export default defineConfig({

  testDir: './tests',

  retries: isCI ? 2 : 0,

  workers: isCI ? 2 : undefined,

  timeout: TEST_TIMEOUT_MS,


  // 基準画像を CI で撮った1組だけにして、どの環境でもそれと比べるため、ファイル名に OS やブラウザの名前を付けない
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

    // 失敗したテストの記録（トレース）と録画だけを残し、成功したテストの分は残さない（すべて残すと、実行が遅くなるため）
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