// Playwrightのテスト関数とexpectを使用するためのインポート
import { test, expect } from '@playwright/test';

// カート操作をまとめたPage Objectを使用するためのインポート
import { CartPage } from '../../pages/CartPage';

// チェックアウト用のデータや処理をまとめたヘルパー（存在する前提）
import { CheckoutPage } from '../../pages/CheckoutPage';

// テスト開始（正常系：安定版）
test.describe('Checkout正常系テスト（安定版）', () => {

  // ① 一覧画面で1件追加して購入できること
  test('① 一覧画面で1件追加して購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移して表示を安定化
    await cart.gotoInventory();

    // 1件商品をカートに追加
    await cart.addFirstItem();

    // カート画面へ遷移
    await cart.goToCart();

    // Checkout開始ボタンをクリック
    await page.click('#checkout');

    // ユーザー情報入力（固定値で安定化）
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入処理を実行
    await checkout.finish();

    // 完了画面が表示されることを確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ② 一覧画面で複数件追加して購入できること
  test('② 一覧画面で複数件追加して購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移
    await cart.gotoInventory();

    // 複数商品をカートに追加（安定化版）
    await cart.addItems(2);

    // カート画面へ遷移
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // ユーザー情報入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入完了処理
    await checkout.finish();

    // 完了画面確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ③ 商品詳細画面から追加して購入できること
  test('③ 商品詳細画面から追加して購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移
    await cart.gotoInventory();

    // 商品詳細画面へ遷移
    await page.locator('.inventory_item_name').first().click();

    // 商品をカートに追加
    await page.locator('[data-test="add-to-cart"]').click();

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // ユーザー情報入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入完了
    await checkout.finish();

    // 完了画面確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ④ カート画面で内容確認後に購入できること
  test('④ カート画面で内容確認後に購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移
    await cart.gotoInventory();

    // 複数商品追加（3件）
    await cart.addItems(3);

    // カートへ移動
    await cart.goToCart();

    // カート内の商品数確認
    await expect(page.locator('.cart_item')).toHaveCount(3);

    // Checkout開始
    await page.click('#checkout');

    // ユーザー情報入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入完了
    await checkout.finish();

    // 完了画面確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ⑤ 全件追加後に2件削除して購入できること
  test('⑤ 全件追加後に2件削除して購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移
    await cart.gotoInventory();

    // 全商品追加
    await cart.addItems(6);

    // カートへ移動
    await cart.goToCart();

    // 2件削除（安定化）
    await cart.removeFirstItem();
    await cart.removeFirstItem();

    // Checkout開始
    await page.click('#checkout');

    // ユーザー情報入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入完了
    await checkout.finish();

    // 完了画面確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ⑥ 1件追加後に一覧へ戻り全件追加して購入できること
  test('⑥ 1件追加後に一覧へ戻り全件追加して購入できること', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // CheckoutPageインスタンス生成
    const checkout = new CheckoutPage(page);

    // 商品一覧画面へ遷移
    await cart.gotoInventory();

    // 1件追加
    await cart.addFirstItem();

    // 一覧へ戻る
    await page.goBack();

    // 再度商品追加（安定化）
    await cart.addItems(3);

    // カートへ移動
    await cart.goToCart();

    // Checkout開始
    await page.click('#checkout');

    // ユーザー情報入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // 購入完了
    await checkout.finish();

    // 完了画面確認
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

});