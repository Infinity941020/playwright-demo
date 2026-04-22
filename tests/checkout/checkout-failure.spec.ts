// Playwrightのテスト機能とexpectを使用
import { test, expect } from '@playwright/test';

// カート操作用Page Object
import { CartPage } from '../../pages/CartPage';

// チェックアウト操作用Page Object
import { CheckoutPage } from '../../pages/CheckoutPage';

// Checkout異常系テスト（fixture統一）
test.describe('Checkout異常系テスト（fixture統一）', () => {

  // 共通fixture処理：各テスト前に商品追加→checkout入力画面まで進める
  test.beforeEach(async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // 商品一覧へ遷移
    await cart.gotoInventory();

    // 商品を1件追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // 入力画面表示確認
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  // ① First Name未入力
  test('① First Name未入力', async ({ page }) => {

    // Last Name入力
    await page.fill('[data-test="lastName"]', 'Yamada');

    // Postal Code入力
    await page.fill('[data-test="postalCode"]', '12345');

    // Continue押下
    await page.click('[data-test="continue"]');

    // エラー確認
    await expect(page.locator('[data-test="error"]'))
      .toContainText('First Name is required');
  });

  // ② Last Name未入力
  test('② Last Name未入力', async ({ page }) => {

    // First Name入力
    await page.fill('[data-test="firstName"]', 'Taro');

    // Postal Code入力
    await page.fill('[data-test="postalCode"]', '12345');

    // Continue押下
    await page.click('[data-test="continue"]');

    // エラー確認
    await expect(page.locator('[data-test="error"]'))
      .toContainText('Last Name is required');
  });

  // ③ Postal Code未入力
  test('③ Postal Code未入力', async ({ page }) => {

    // First Name入力
    await page.fill('[data-test="firstName"]', 'Taro');

    // Last Name入力
    await page.fill('[data-test="lastName"]', 'Yamada');

    // Continue押下
    await page.click('[data-test="continue"]');

    // エラー確認
    await expect(page.locator('[data-test="error"]'))
      .toContainText('Postal Code is required');
  });

  // ④ 全項目未入力
  test('④ 全項目未入力', async ({ page }) => {

    // Continue押下
    await page.click('[data-test="continue"]');

    // エラー確認
    await expect(page.locator('[data-test="error"]'))
      .toContainText('First Name is required');
  });

});