import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CartPage } from '../../pages/CartPage';

/*
========================================
Checkout異常系（fixture統一版）
========================================
*/

test.describe('Checkout異常系テスト（fixture統一）', () => {

  /*
  ================================
  共通前提：ログイン済み
  ================================
  */

  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  /*
  ================================
  ① First Name未入力
  ================================
  */
  test('① First Name未入力', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.addFirstItem();
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('', 'Yamada', '12345');
    await checkout.continue();

    await checkout.expectErrorVisible();
  });

  /*
  ================================
  ② Last Name未入力
  ================================
  */
  test('② Last Name未入力', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.addFirstItem();
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('Taro', '', '12345');
    await checkout.continue();

    await checkout.expectErrorVisible();
  });

  /*
  ================================
  ③ Postal Code未入力
  ================================
  */
  test('③ Postal Code未入力', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.addFirstItem();
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '');
    await checkout.continue();

    await checkout.expectErrorVisible();
  });

  /*
  ================================
  ④ 全項目未入力
  ================================
  */
  test('④ 全項目未入力', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.addFirstItem();
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('', '', '');
    await checkout.continue();

    await checkout.expectErrorVisible();
  });

});