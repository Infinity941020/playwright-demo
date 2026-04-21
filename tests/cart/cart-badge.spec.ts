// Playwrightのテスト機能（テスト定義のみ使用）をimport
import { test } from '@playwright/test';

// カート操作・バッジ検証をまとめたPage Objectを使用するためのimport
import { CartPage } from '../../pages/CartPage';

// 共通テストデータ（URL）を読み込み
import { urls } from '../../data/test-data';

/*
================================
カートバッジ検証テスト（①〜⑤）
fixture対応版（ログイン済み前提）
================================
*/

test.describe('カートバッジ検証テスト', () => {

  /*
  ================================
  ① 1件追加テスト
  ================================
  */
  test('① 1件追加：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ（共通URL使用）
    await page.goto(urls.inventory);

    await cart.addFirstItem();

    await cart.expectBadgeCount(1);
  });

  /*
  ================================
  ② 全件追加テスト
  ================================
  */
  test('② 全件追加：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    await page.goto(urls.inventory);

    const count = await cart.addAllItems();

    await cart.expectBadgeCount(count);
  });

  /*
  ================================
  ③ 1件削除テスト
  ================================
  */
  test('③ 1件削除：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    await page.goto(urls.inventory);

    const count = await cart.addAllItems();

    await cart.goToCart();

    await cart.removeFirstItem();

    await cart.expectBadgeCount(count - 1);
  });

  /*
  ================================
  ④ 2件削除テスト
  ================================
  */
  test('④ 2件削除：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    await page.goto(urls.inventory);

    const count = await cart.addAllItems();

    await cart.goToCart();

    await cart.removeFirstItem();
    await cart.removeFirstItem();

    await cart.expectBadgeCount(count - 2);
  });

  /*
  ================================
  ⑤ 全件削除テスト
  ================================
  */
  test('⑤ 全件削除：バッジ非表示確認', async ({ page }) => {

    const cart = new CartPage(page);

    await page.goto(urls.inventory);

    await cart.addAllItems();

    await cart.goToCart();

    await cart.removeAllItems();

    await cart.expectBadgeCount(0);
  });

});