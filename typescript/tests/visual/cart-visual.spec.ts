import { test, expect } from '@playwright/test';
import { users } from '../../data/users';

/*
========================================
Visual Regression Test
カート画面の表示崩れ検知
========================================
*/

test('visual: cart page', async ({ page }) => {

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
  // ■ ロード待ち（A統一）
  // ================================
  await page.waitForLoadState('networkidle');

  // ================================
  // ■ カート操作
  // ================================
  await page.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  ).click();

  await page.locator('.shopping_cart_link').click();

  // ================================
  // ■ カート画面安定待ち（A統一）
  // ================================
  await page.waitForLoadState('networkidle');

  await page.locator('.cart_list').waitFor();

  // フォント読み込み待ち
  await page.evaluate(() => document.fonts?.ready);

  // レンダリング安定化
  await page.waitForTimeout(300);

  // ================================
  // ■ Visual Regression検証
  // ================================
  await expect(page).toHaveScreenshot('cart-page.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01
  });
});