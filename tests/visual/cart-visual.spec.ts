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
  // ■ カート追加 & 遷移
  // ================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  // ================================
  // ■ 安定化（Visual差分対策）
  // ================================

  // ページロード完了待ち
  await page.waitForLoadState('networkidle');

  // カートUIが描画されていることを保証
  await expect(page.locator('.shopping_cart_link')).toBeVisible();

  // レンダリング安定化（微妙なレイアウトズレ防止）
  await page.waitForTimeout(300);

  // ================================
  // ■ Visual Regression検証
  // ================================
  await expect(page).toHaveScreenshot('cart-page.png', {
    threshold: 0.02,
    animations: 'disabled',
  });
});