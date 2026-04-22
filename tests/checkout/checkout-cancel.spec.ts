// Playwrightのテスト機能とexpectを使用
import { test, expect } from '@playwright/test';

// カート操作をまとめたPage Object
import { CartPage } from '../../pages/CartPage';

// チェックアウト操作をまとめたPage Object
import { CheckoutPage } from '../../pages/CheckoutPage';

// Checkoutキャンセル系テスト
test.describe('Checkoutキャンセル系テスト（安定版）', () => {

  // ① カート画面でContinue Shopping押下で一覧へ戻ること
  test('① カート画面でContinue Shopping押下で一覧へ戻ること', async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // 商品一覧へ遷移（安定化）
    await cart.gotoInventory();

    // 商品を1件追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Continue Shoppingボタンをクリック（一覧へ戻る）
    await page.click('[data-test="continue-shopping"]');

    // 商品一覧画面に戻ったことを確認
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  // ② Checkout入力画面でCancel押下でカートへ戻ること
  test('② Checkout入力画面でCancel押下でカートへ戻ること', async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // CheckoutPage生成
    const checkout = new CheckoutPage(page);

    // 商品一覧へ遷移
    await cart.gotoInventory();

    // 商品追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // Cancel押下（カートへ戻る）
    await page.click('[data-test="cancel"]');

    // カート画面が表示されていることを確認
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  // ③ 一部入力後にCancel押下でカートへ戻ること
  test('③ 一部入力後にCancel押下でカートへ戻ること', async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // CheckoutPage生成
    const checkout = new CheckoutPage(page);

    // 商品一覧へ遷移
    await cart.gotoInventory();

    // 商品追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // 一部入力（First Nameのみ）
    await page.fill('[data-test="firstName"]', 'Taro');

    // Cancel押下
    await page.click('[data-test="cancel"]');

    // カート画面確認
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  // ④ 全項目入力後にCancel押下でカートへ戻ること
  test('④ 全項目入力後にCancel押下でカートへ戻ること', async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // CheckoutPage生成
    const checkout = new CheckoutPage(page);

    // 商品一覧へ遷移
    await cart.gotoInventory();

    // 商品追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // 全項目入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // Cancel押下
    await page.click('[data-test="cancel"]');

    // カート画面確認
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  // ⑤ Confirm画面でCancel押下で商品一覧へ戻ること
  test('⑤ Confirm画面でCancel押下で商品一覧へ戻ること', async ({ page }) => {

    // CartPage生成
    const cart = new CartPage(page);

    // CheckoutPage生成
    const checkout = new CheckoutPage(page);

    // 商品一覧へ遷移
    await cart.gotoInventory();

    // 商品追加
    await cart.addFirstItem();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // 入力してContinue
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // Confirm画面に遷移している前提でCancel
    await page.click('[data-test="cancel"]');

    // 商品一覧へ戻ることを確認
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

});