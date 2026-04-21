// Playwrightのテスト機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ================================
// カート機能 E2Eテスト（fixture対応版）
// ================================
test.describe('カート機能テスト', () => {

  // ================================
  // パターン①：単一商品追加
  // ================================
  test('パターン①：商品を1つカートに追加できること', async ({ page }) => {

    // 商品一覧ページへ遷移（ログイン済み前提）
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 最初の商品をカートに追加
    await page.locator('.inventory_item button').first().click();

    // カートバッジが1件表示されることを確認
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // ================================
  // パターン②：複数商品追加
  // ================================
  test('パターン②：複数商品をカートに追加できること', async ({ page }) => {

    // 商品一覧ページへ遷移
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 2商品追加
    await page.locator('.inventory_item button').nth(0).click();
    await page.locator('.inventory_item button').nth(1).click();

    // バッジ数が2であることを確認
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  // ================================
  // パターン③：カート内容確認
  // ================================
  test('パターン③：カート内に商品が正しく入っていること', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('.inventory_item button').first().click();

    await page.click('.shopping_cart_link');

    // カートに商品が1件あることを確認
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  // ================================
  // パターン④：カートから削除
  // ================================
  test('パターン④：カートから商品を削除できること', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('.inventory_item button').first().click();

    await page.click('.shopping_cart_link');

    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.locator('button', { hasText: 'Remove' }).click();

    // カートが空になっていることを確認
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

});