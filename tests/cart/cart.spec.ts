// Playwrightのテスト機能（test / expect）を使用するためimport
import { test, expect } from '@playwright/test';

// カート操作・バッジ検証をまとめたPage Objectを使用するためimport
import { CartPage } from '../../pages/CartPage';

// ログイン共通処理を読み込み
import { login } from '../../utils/loginHelper';

// ================================
// カート機能 E2Eテスト（PageObject統一版）
// ================================
test.describe('カート機能テスト', () => {

  // 各テスト実行前にログインする
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ================================
  // パターン①：単一商品追加
  // ================================
  test('パターン①：商品を1つカートに追加できること', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧画面へ遷移する
    await cart.gotoInventory();

    // 先頭商品を追加する
    await cart.addFirstItem();

    // バッジ件数確認
    await cart.expectBadgeCount(1);
  });

  // ================================
  // パターン②：複数商品追加
  // ================================
  test('パターン②：複数商品をカートに追加できること', async ({ page }) => {

    const cart = new CartPage(page);

    await cart.gotoInventory();

    // 全商品追加件数を取得する
    const count = await cart.addAllItems();

    // バッジ件数確認
    await cart.expectBadgeCount(count);
  });

  // ================================
  // パターン③：カート内容確認
  // ================================
  test('パターン③：カート内に商品が正しく入っていること', async ({ page }) => {

    const cart = new CartPage(page);

    await cart.gotoInventory();

    await cart.addFirstItem();

    await cart.goToCart();

    // カート内商品件数確認
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  // ================================
  // パターン④：カートから削除
  // ================================
  test('パターン④：カートから商品を削除できること', async ({ page }) => {

    const cart = new CartPage(page);

    await cart.gotoInventory();

    await cart.addFirstItem();

    await cart.goToCart();

    // 商品が1件あることを確認する
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // 商品を削除する
    await cart.removeFirstItem();

    // カートが空であることを確認する
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

});