// Playwrightのテスト機能（test / expect）を使用するためimport
import { test, expect } from '@playwright/test';

// 商品一覧ページ（Page Object）
import { InventoryPage } from '../../pages/InventoryPage';

// ヘッダーコンポーネント（バッジ管理）
import { HeaderComponent } from '../../pages/HeaderComponent';

// カートページ（操作・遷移）
import { CartPage } from '../../pages/CartPage';

// ログイン共通処理
import { login } from '../../utils/loginHelper';

/*
================================
カートバッジ検証テスト（責務分離版）
================================
InventoryPage：商品操作
CartPage：カート操作
HeaderComponent：バッジ表示管理
================================
*/

test.describe('カートバッジ検証テスト', () => {

  // ================================
  // 共通前処理（ログイン）
  // ================================
  test.beforeEach(async ({ page }) => {

    // ログイン処理（共通化）
    await login(page);
  });

  // ================================
  // ① 1件追加
  // ================================
  test('① 1件追加：バッジ表示と件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧画面へ遷移する
    await inventory.goto();

    // 先頭商品をカートに追加する
    await inventory.addFirstItem();

    // バッジが1件であることを確認する
    await header.expectBadgeCount(1);
  });

  // ================================
  // ② 全件追加
  // ================================
  test('② 全件追加：バッジ表示と件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧画面へ遷移する
    await inventory.goto();

    // 全商品をカートに追加する
    const count = await inventory.addAllItems();

    // バッジ件数が商品数と一致することを確認する
    await header.expectBadgeCount(count);
  });

  // ================================
  // ③ 1件削除
  // ================================
  test('③ 1件削除：バッジ表示と件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧画面へ遷移する
    await inventory.goto();

    // 全商品追加する
    const count = await inventory.addAllItems();

    // カート画面へ遷移する
    await cart.goto();

    // 先頭商品を削除する
    await cart.removeFirstItem();

    // バッジが1件減っていることを確認する
    await header.expectBadgeCount(count - 1);
  });

  // ================================
  // ④ 2件削除
  // ================================
  test('④ 2件削除：バッジ表示と件数確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧画面へ遷移する
    await inventory.goto();

    // 全商品追加する
    const count = await inventory.addAllItems();

    // カート画面へ遷移する
    await cart.goto();

    // 2件削除する
    await cart.removeFirstItem();
    await cart.removeFirstItem();

    // バッジが2件減っていることを確認する
    await header.expectBadgeCount(count - 2);
  });

  // ================================
  // ⑤ 全件削除
  // ================================
  test('⑤ 全件削除：バッジ非表示確認', async ({ page }) => {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const header = new HeaderComponent(page);

    // 商品一覧画面へ遷移する
    await inventory.goto();

    // 全商品追加する
    await inventory.addAllItems();

    // カート画面へ遷移する
    await cart.goto();

    // 全商品削除する
    await cart.removeAllItems();

    // バッジが非表示であることを確認する
    await header.expectNoBadge();
  });

});