import { test, expect } from '@playwright/test';
import { users } from '../../data/users';

/*
========================================
Visual Regression Test
Checkout入力画面の表示崩れ検知
========================================
*/

test('visual: checkout step one page', async ({ page }) => {

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
  // ■ 画面安定待ち（A統一）
  // ================================
  await page.waitForLoadState('networkidle');

  // ================================
  // ■ カート追加 → 遷移
  // ================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  // ================================
  // ■ checkout画面の描画待ち（A統一）
  // ================================
  await page.waitForLoadState('networkidle');

  await page.locator('[data-test="firstName"]').waitFor();

  // フォント読み込み待ち（重要）
  await page.evaluate(() => document.fonts?.ready);

  // 微妙なレンダリング揺れ吸収
  await page.waitForTimeout(300);

  // ================================
  // ■ Visual Regression検証
  // ================================
  await expect(page).toHaveScreenshot('checkout-step-one-page.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01
  });
});