import { test, expect } from '@playwright/test';

import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
========================================
Checkout 正常系テスト（リファクタ版）
========================================
*/

test.describe('Checkout正常系テスト（安定版）', () => {

  /*
  ================================
  ① 1件購入
  ================================
  */
  test('① 一覧画面で1件追加して購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await cart.addFirstItem();
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  /*
  ================================
  ② 複数件購入
  ================================
  */
  test('② 一覧画面で複数件追加して購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await cart.addItems(2);
    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  /*
  ================================
  ③ 商品詳細から購入
  ================================
  */
  test('③ 商品詳細画面から追加して購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    // 商品詳細へ
    await page.locator('.inventory_item_name').first().click();

    // 商品追加（詳細画面）
    await page.locator('[data-test="add-to-cart"]').click();

    await cart.goToCart();
    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  /*
  ================================
  ④ カート確認後購入
  ================================
  */
  test('④ カート画面で内容確認後に購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await cart.addItems(3);
    await cart.goToCart();

    await expect(page.locator('.cart_item')).toHaveCount(3);

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  /*
  ================================
  ⑤ 全件追加→2件削除→購入
  ================================
  */
  test('⑤ 全件追加後に2件削除して購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await cart.addAllItems();

    await cart.goToCart();

    // 安定版：削除はCartPageに任せる
    await cart.removeItems(2);

    const remaining = await cart.getItemCount();
    await expect(page.locator('.cart_item')).toHaveCount(remaining);

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  /*
  ================================
  ⑥ 1件追加→戻る→全件追加→購入
  ================================
  */
  test('⑥ 1件追加後に一覧へ戻り全件追加して購入できること', async ({ page }) => {

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await cart.addFirstItem();
    await cart.goToCart();

    // 一覧へ戻る
    await page.click('#continue-shopping');

    // 再度全件追加
    await cart.addAllItems();

    await cart.goToCart();

    await page.click('#checkout');

    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

});