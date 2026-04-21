// Playwrightのテスト機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// Checkout操作をまとめたPage Objectを使用
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
========================================
Checkoutキャンセル系テスト
（Page Object対応版）
========================================
*/

test.describe('Checkoutキャンセル系テスト', () => {

  /*
  ================================
  ① Cart画面でContinue Shopping
  ================================
  */
  test('① カート画面でContinue Shopping押下で一覧へ戻ること', async ({ page }) => {

    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.click('.shopping_cart_link');

    // カート画面 → 一覧へ戻る
    await page.click('[data-test="continue-shopping"]');

    await expect(page).toHaveURL(/inventory/);
  });

  /*
  ================================
  ② Checkout入力画面でCancel
  ================================
  */
  test('② Checkout入力画面でCancel押下でカートへ戻ること', async ({ page }) => {

    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.click('.shopping_cart_link');

    await checkout.startCheckout();

    // 入力画面でキャンセル
    await checkout.cancel();

    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  /*
  ================================
  ③ 一部入力後Cancel
  ================================
  */
  test('③ 一部入力後にCancel押下でカートへ戻ること', async ({ page }) => {

    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.click('.shopping_cart_link');

    await checkout.startCheckout();

    // 一部入力
    await checkout.fillInfo('Taro', '', '');

    // Cancel
    await checkout.cancel();

    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  /*
  ================================
  ④ 全入力後Cancel
  ================================
  */
  test('④ 全項目入力後にCancel押下でカートへ戻ること', async ({ page }) => {

    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.click('.shopping_cart_link');

    await checkout.startCheckout();

    // 全入力
    await checkout.fillInfo('Taro', 'Yamada', '12345');

    // Cancel
    await checkout.cancel();

    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  /*
  ================================
  ⑤ Confirm画面からCancel
  ================================
  */
  test('⑤ Confirm画面でCancel押下で商品一覧へ戻ること', async ({ page }) => {

    const checkout = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.click('.shopping_cart_link');

    await checkout.startCheckout();

    await checkout.fillInfo('Taro', 'Yamada', '12345');

    await checkout.continue();

    // 最終確認画面から戻る
    await checkout.cancel();

    await expect(page).toHaveURL(/inventory/);
  });

});