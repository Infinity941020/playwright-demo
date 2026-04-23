// Playwrightのテスト機能（test / expect）を使用
import { test, expect } from '@playwright/test';

// Page Object
import { InventoryPage } from '../../pages/InventoryPage';
import { HeaderComponent } from '../../pages/HeaderComponent';
import { CartPage } from '../../pages/CartPage';

// ログイン処理（共通化）
import { login } from '../../utils/loginHelper';

/*
================================
カートバッジ検証テスト
商品追加・削除時のバッジ表示を検証
================================
*/
test.describe('カートバッジ検証テスト', () => {

  /*
  ================================
  共通前処理（ログイン）
  ================================
  */
  test.beforeEach(async ({ page }) => {

    // ログイン実行
    await login(page);
  });

  /*
  ================================
  ① 商品を1件追加
  ================================
  */
  test('① 1件追加時のバッジ表示確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧へ遷移
    await inventory.goto();

    // 商品を1件追加
    await inventory.addFirstItem();

    // バッジが1件であることを確認
    await header.expectBadgeCount(1);
  });

  /*
  ================================
  ② 全商品追加
  ================================
  */
  test('② 全件追加時のバッジ件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧へ遷移
    await inventory.goto();

    // 全商品を追加
    const count = await inventory.addAllItems();

    // バッジ件数が商品数と一致することを確認
    await header.expectBadgeCount(count);
  });

  /*
  ================================
  ③ 商品を1件削除
  ================================
  */
  test('③ 1件削除時のバッジ件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧へ遷移
    await inventory.goto();

    // 全商品を追加
    const count = await inventory.addAllItems();

    // カートへ遷移
    await cart.goto();

    // 商品を1件削除
    await cart.removeFirstItem();

    // バッジが1件減っていることを確認
    await header.expectBadgeCount(count - 1);
  });

  /*
  ================================
  ④ 商品を2件削除
  ================================
  */
  test('④ 2件削除時のバッジ件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧へ遷移
    await inventory.goto();

    // 全商品を追加
    const count = await inventory.addAllItems();

    // カートへ遷移
    await cart.goto();

    // 商品を2件削除
    await cart.removeFirstItem();
    await cart.removeFirstItem();

    // バッジが2件減っていることを確認
    await header.expectBadgeCount(count - 2);
  });

  /*
  ================================
  ⑤ 全件削除
  ================================
  */
  test('⑤ 全件削除時はバッジが非表示になる', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧へ遷移
    await inventory.goto();

    // 全商品を追加
    await inventory.addAllItems();

    // カートへ遷移
    await cart.goto();

    // 全商品を削除
    await cart.removeAllItems();

    // バッジが0件（非表示）であることを確認
    await header.expectBadgeCount(0);
  });

});