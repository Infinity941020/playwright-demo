// Playwrightのテスト機能とexpectを使用
import { test, expect } from '../../fixtures/loginFixture';

// Page Object群（責務分離版）
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout正常系テスト（fixture統一・最終版）
================================
*/

test.describe('Checkout正常系テスト（fixture統一版）', () => {

  /*
  ================================
  ① 一覧画面で1件購入
  ================================
  */
  test('① 一覧画面で1件追加して購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

  /*
  ================================
  ② 複数件追加して購入
  ================================
  */
  test('② 一覧画面で複数件追加して購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addAllItems();

    await cart.goto();

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

  /*
  ================================
  ③ 商品詳細から購入
  ================================
  */
  test('③ 商品詳細画面から追加して購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

  /*
  ================================
  ④ カート確認後に購入
  ================================
  */
  test('④ カート画面で内容確認後に購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await cart.expectItemCount(1);

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

  /*
  ================================
  ⑤ 全件追加→削除→購入
  ================================
  */
  test('⑤ 全件追加後に2件削除して購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    const count = await inventory.addAllItems();

    await cart.goto();

    await cart.removeFirstItem();
    await cart.removeFirstItem();

    await cart.expectItemCount(count - 2);

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

  /*
  ================================
  ⑥ 途中戻り→再追加→購入
  ================================
  */
  test('⑥ 1件追加後に一覧へ戻り全件追加して購入できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);
    const checkout = new CheckoutPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await loggedPage.click('[data-test="continue-shopping"]');

    await inventory.addAllItems();

    await cart.goto();

    await checkout.startCheckout();
    await checkout.fillInfo('Taro', 'Yamada', '12345');
    await checkout.continue();
    await checkout.finish();

    await checkout.expectComplete();
  });

});