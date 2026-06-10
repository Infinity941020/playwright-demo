// Playwrightのテスト機能とアサーション機能をインポート
import { test, expect } from '@playwright/test';

/*
========================================
Visual Regression Test
ログイン画面の表示崩れ検知
========================================
*/

test('visual: login page', async ({ page }) => {

  // ================================
  // ■ 画面表示
  // ================================
  await page.goto('https://www.saucedemo.com/');

  // ================================
  // ■ Visual Regression検証
  // 初回生成されたSnapshotと比較し、
  // 画面表示に差分がないことを確認
  // ================================
  await expect(page).toHaveScreenshot();
});