// Playwrightのテスト機能とexpectを使用
import { test, expect } from '../../fixtures/loginFixture';

// 各Page Object（責務分離版）
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkoutキャンセル系テスト（fixture統一版）
================================
*/

test.describe('Checkoutキャンセル系テスト（fixture統一版）', () => {

  /*
  ================================
  ① Cart → Continue Shopping
  ================================
  */
  test('① カート画面でContinue Shopping押下で一覧へ戻ること', async ({ loggedPage }) => {

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
  ② Checkout → Cancel（空）
  ================================
  */
  test('② Checkout入力画面でCancel押下でカートへ戻ること', async ({ loggedPage }) => {

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
  ③ 一部入力Cancel
  ================================
  */
  test('③ 一部入力後にCancel押下でカートへ戻ること', async ({ loggedPage }) => {

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
  ④ 全入力Cancel
  ================================
  */
  test('④ 全項目入力後にCancel押下でカートへ戻ること', async ({ loggedPage }) => {

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
  ⑤ Confirm Cancel
  ================================
  */
  test('⑤ Confirm画面でCancel押下で商品一覧へ戻ること', async ({ loggedPage }) => {

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