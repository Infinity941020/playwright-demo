// Playwrightのテスト機能とexpectを使用（ログイン状態はfixtureで管理）
import { test, expect } from '../../fixtures/loginFixture';

// Page Object（画面操作の分離）
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkoutキャンセル系テスト
各画面での戻り動作を検証
================================
*/
test.describe('Checkoutキャンセル系テスト（fixture統一版）', () => {

  /*
  ================================
  ① カート → 商品一覧へ戻る
  ================================
  */
  test('① カート画面から商品一覧へ戻る', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await cart.continueShopping();

    await expect(loggedPage.locator('.inventory_list')).toBeVisible();
  });

  /*
  ================================
  ② Checkout開始直後のキャンセル
  ================================
  */
  test('② Checkout開始直後にカートへ戻る', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.cancel();

    await expect(loggedPage.locator('.cart_list')).toBeVisible();
  });

  /*
  ================================
  ③ 入力途中でキャンセル
  ================================
  */
  test('③ 入力途中でカートへ戻る', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('Taro', '', '');

    await checkout.cancel();

    await expect(loggedPage.locator('.cart_list')).toBeVisible();
  });

  /*
  ================================
  ④ 入力完了後のキャンセル
  ================================
  */
  test('④ 入力完了後にカートへ戻る', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('Taro', 'Yamada', '12345');

    await checkout.cancel();

    await expect(loggedPage.locator('.cart_list')).toBeVisible();
  });

  /*
  ================================
  ⑤ 確認画面から商品一覧へ戻る
  ================================
  */
  test('⑤ 確認画面から商品一覧へ戻る', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();

    await checkout.cancel();

    await expect(loggedPage.locator('.inventory_list')).toBeVisible();
  });

});