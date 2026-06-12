import { test, expect } from '@playwright/test';
import { users } from '../../data/users';

/*
========================================
Visual Regression Test
Checkout完了画面の表示崩れ検知
========================================
*/

test('visual: checkout complete page', async ({ page }) => {

  // ================================
  // ■ viewport固定（Aルート統一）
  // ================================
  await page.setViewportSize({ width: 1280, height: 720 });

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
  // ■ カート → checkout遷移
  // ================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  // ================================
  // ■ フォーム入力
  // ================================
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('1234567');

  await page.locator('[data-test="continue"]').click();

  await page.locator('[data-test="finish"]').click();

  // ================================
  // ■ 画面安定待ち（A統一）
  // ================================
  await page.waitForLoadState('networkidle');

  // フォント読み込み待ち（重要）
  await page.evaluate(() => document.fonts?.ready);

  // UI安定待ち（揺れ吸収）
  await page.locator('.complete-header').waitFor();

  await page.waitForTimeout(300);

  // ================================
  // ■ Visual Regression検証
  // ================================
  await expect(page).toHaveScreenshot('checkout-complete-page.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01
  });
});