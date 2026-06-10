// Playwrightのテスト機能とアサーション機能をインポート
import { test, expect } from '@playwright/test';

// テスト用ユーザーデータをインポート
import { users } from '../../data/users';

/*
========================================
Visual Regression Test
カート画面の表示崩れ検知
========================================
*/

test('visual: cart page', async ({ page }) => {

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
  // ■ カート画面表示
  // ================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  // ================================
  // ■ Visual Regression検証
  // 初回生成されたSnapshotと比較し、
  // 画面表示に差分がないことを確認
  // ================================
  await expect(page).toHaveScreenshot();
});