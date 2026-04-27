// Playwrightのテスト機能とexpectをインポート
import { test, expect } from '../../fixtures/loginFixture';

// CartFlow（カート業務フロー）をインポート
import { CartFlow } from '../../flows/CartFlow';

// InventoryPage（商品追加用のUI操作）をインポート
import { InventoryPage } from '../../pages/InventoryPage';

/*
================================
カート機能 E2Eテスト（Flow統一版）
================================
*/

test.describe('カート機能テスト', () => {

  /*
  ================================
  パターン①：単一商品追加
  ================================
  */
  test('商品を1つカートに追加できること', async ({ loggedPage }) => {

    // Flow生成
    const cartFlow = new CartFlow(loggedPage);

    // 商品追加（InventoryはUI操作として最小利用）
    const inventory = new InventoryPage(loggedPage);
    await inventory.goto();
    await inventory.addFirstItem();

    // カートへ遷移
    await cartFlow.openCart();

    // 商品数確認（Flow経由）
    await cartFlow['cartPage'].expectItemCount(1);
  });

  /*
  ================================
  パターン②：複数商品追加
  ================================
  */
  test('複数商品をカートに追加できること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const inventory = new InventoryPage(loggedPage);

    await inventory.goto();

    const count = await inventory.addAllItems();

    await cartFlow.openCart();

    await cartFlow['cartPage'].expectItemCount(count);
  });

  /*
  ================================
  パターン③：削除確認
  ================================
  */
  test('カート内商品の削除ができること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const inventory = new InventoryPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cartFlow.openCart();

    await cartFlow.removeFirstItem();

    await cartFlow['cartPage'].expectItemCount(0);
  });

});