// Playwrightのテスト機能とexpectを使用
import { test, expect } from '../../fixtures/loginFixture';

// 商品一覧ページ（Page Object）
import { InventoryPage } from '../../pages/InventoryPage';

// カートページ（Page Object）
import { CartPage } from '../../pages/CartPage';

// ヘッダーコンポーネント（バッジ管理）
import { HeaderComponent } from '../../pages/HeaderComponent';

/*
================================
カート機能 E2Eテスト（fixture統一版）
================================
InventoryPage：商品操作
CartPage：カート操作
HeaderComponent：バッジ表示管理
================================
*/

test.describe('カート機能テスト', () => {

  /*
  ================================
  パターン①：単一商品追加
  ================================
  */
  test('パターン①：商品を1つカートに追加できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const header = new HeaderComponent(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await header.expectBadgeCount(1);
  });

  /*
  ================================
  パターン②：複数商品追加
  ================================
  */
  test('パターン②：複数商品をカートに追加できること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const header = new HeaderComponent(loggedPage);

    await inventory.goto();

    const count = await inventory.addAllItems();

    await header.expectBadgeCount(count);
  });

/*
===============================
パターン③：カート内の商品件数確認
===============================
*/
test('パターン③：カートに追加した商品が正しく表示されること', async ({ loggedPage }) => {

    const inventory = new InventoryPage(loggedPage);
    const cart = new CartPage(loggedPage);

    await inventory.goto();
    await inventory.addFirstItem();

    await cart.goto();

    await expect(loggedPage.locator('.cart_item')).toHaveCount(1);

    await cart.removeFirstItem();

    await expect(loggedPage.locator('.cart_item')).toHaveCount(0);
  });

});