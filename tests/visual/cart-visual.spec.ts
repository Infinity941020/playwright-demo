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
  // ================================
  await expect(page).toHaveScreenshot('cart-page.png', {
    threshold: 0.02,
    animations: 'disabled',
  });
});