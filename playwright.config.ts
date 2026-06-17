import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/*
========================================
Playwright Config (PROJECT SPLIT VERSION)
========================================

目的：
- UI：Chromium / Firefox / WebKit対応
- API：Chromium固定
- Visual：Chromium固定
- OS依存snapshot差異抑制
- CI / Local環境統一
- Visual Regression安定運用

========================================
*/

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

    trace: isCI
      ? 'retain-on-failure'
      : 'on',

    screenshot: 'off',

    video: isCI
      ? 'retain-on-failure'
      : 'on',

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


    /*
    ================================
    UI Tests
    ================================
    */


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


    /*
    ================================
    API Tests
    ================================
    */


    {
      name: 'chromium-api',

      testMatch:
        '**/tests/api/**/*.spec.ts',

      use: {
        browserName: 'chromium',
      },

    },


    /*
    ================================
    Visual Tests
    ================================
    */


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