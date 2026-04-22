// Playwrightのテスト機能とexpectを使用
import { test, expect } from '../../fixtures/loginFixture';

// Page Object群
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout異常系テスト（CI安定版）
================================
*/

test.describe('Checkout異常系テスト（fixture統一版）', () => {

  /*
  ================================
  ① First Name未入力
  ================================
  */
  test('① First Name未入力', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('', 'Yamada', '12345');

    await checkout.continue();

    await expect(loggedPage.locator('[data-test="error"]')).toBeVisible();
  });

  /*
  ================================
  ② Last Name未入力
  ================================
  */
  test('② Last Name未入力', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('Taro', '', '12345');

    await checkout.continue();

    await expect(loggedPage.locator('[data-test="error"]')).toBeVisible();
  });

  /*
  ================================
  ③ Postal Code未入力
  ================================
  */
  test('③ Postal Code未入力', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('Taro', 'Yamada', '');

    await checkout.continue();

    await expect(loggedPage.locator('[data-test="error"]')).toBeVisible();
  });

  /*
  ================================
  ④ 全項目未入力
  ================================
  */
  test('④ 全項目未入力', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();

    await checkout.fillInfo('', '', '');

    await checkout.continue();

    await expect(loggedPage.locator('[data-test="error"]')).toBeVisible();
  });

});