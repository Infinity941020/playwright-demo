import { test, expect } from '@playwright/test';

/*
========================================
Visual Regression Test
ログイン画面の表示崩れ検知
========================================
*/

test('visual: login page', async ({ page }) => {

  // ================================
  // ■ viewport固定（Aルート統一）
  // ================================
  await page.setViewportSize({ width: 1280, height: 720 });

  // ================================
  // ■ 画面表示
  // ================================
  await page.goto('https://www.saucedemo.com/');

  // ================================
  // ■ 画面安定待ち（重要）
  // ================================
  await page.waitForLoadState('networkidle');

  // フォント読み込み待ち（A統一）
  await page.evaluate(() => document.fonts?.ready);

  // 念のためUI安定待ち（揺れ防止）
  await page.waitForTimeout(300);

  // ================================
  // ■ Visual Regression検証
  // ================================
  await expect(page).toHaveScreenshot('login-page.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01
  });
});