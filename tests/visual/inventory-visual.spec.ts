// Playwrightのテスト機能とアサーション機能をインポート
import { test, expect } from '@playwright/test';

// テスト用ユーザーデータをインポート
import { users } from '../../data/users';

/*
========================================
Visual Regression Test
商品一覧画面の表示崩れ検知
========================================
*/

test('visual: inventory page', async ({ page }) => {

  // ================================
  // ■ ログイン
  // ================================
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill(
    users.standard.username
  );

  await page.locator('[data-test="password"]').fill(
    users.standard.password
  );

  await page.locator('[data-test="login-button"]').click();

  // ================================
  // ■ Visual Regression検証
  // 初回生成されたSnapshotと比較し、
  // 画面表示に差分がないことを確認
  // ================================
  await expect(page).toHaveScreenshot('inventory-page.png');
});