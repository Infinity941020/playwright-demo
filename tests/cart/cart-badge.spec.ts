// Playwrightのテスト機能（test / expect）を使用するためimport
import { test, expect } from '@playwright/test';

// カート操作・バッジ検証をまとめたPage Objectを使用するためimport
import { CartPage } from '../../pages/CartPage';

// 共通テストデータ（URL）を読み込み
import { urls } from '../../data/test-data';

/*
================================
カートバッジ検証テスト（①〜⑤）
ログイン処理追加版
================================
*/

test.describe('カートバッジ検証テスト', () => {

  // 各テスト実行前にログインする
  test.beforeEach(async ({ page }) => {

    // ログイン画面へ遷移する
    await page.goto(urls.login);

    // ユーザー名を入力する
    await page.locator('#user-name').fill('standard_user');

    // パスワードを入力する
    await page.locator('#password').fill('secret_sauce');

    // ログインボタンを押下する
    await page.locator('#login-button').click();

    // 商品一覧画面が表示されることを確認する
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  /*
  ================================
  ① 1件追加テスト
  ================================
  */
  test('① 1件追加：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ遷移する
    await cart.gotoInventory();

    // 先頭商品を追加する
    await cart.addFirstItem();

    // バッジ件数1件を確認する
    await cart.expectBadgeCount(1);
  });

  /*
  ================================
  ② 全件追加テスト
  ================================
  */
  test('② 全件追加：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ遷移する
    await cart.gotoInventory();

    // 全商品追加件数を取得する
    const count = await cart.addAllItems();

    // バッジ件数を確認する
    await cart.expectBadgeCount(count);
  });

  /*
  ================================
  ③ 1件削除テスト
  ================================
  */
  test('③ 1件削除：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ遷移する
    await cart.gotoInventory();

    // 全商品追加件数を取得する
    const count = await cart.addAllItems();

    // カート画面へ移動する
    await cart.goToCart();

    // 先頭商品を削除する
    await cart.removeFirstItem();

    // バッジ件数を確認する
    await cart.expectBadgeCount(count - 1);
  });

  /*
  ================================
  ④ 2件削除テスト
  ================================
  */
  test('④ 2件削除：バッジ表示と件数確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ遷移する
    await cart.gotoInventory();

    // 全商品追加件数を取得する
    const count = await cart.addAllItems();

    // カート画面へ移動する
    await cart.goToCart();

    // 先頭商品を2件削除する
    await cart.removeFirstItem();
    await cart.removeFirstItem();

    // バッジ件数を確認する
    await cart.expectBadgeCount(count - 2);
  });

  /*
  ================================
  ⑤ 全件削除テスト
  ================================
  */
  test('⑤ 全件削除：バッジ非表示確認', async ({ page }) => {

    const cart = new CartPage(page);

    // 商品一覧ページへ遷移する
    await cart.gotoInventory();

    // 全商品追加する
    await cart.addAllItems();

    // カート画面へ移動する
    await cart.goToCart();

    // 全商品削除する
    await cart.removeAllItems();

    // バッジ非表示を確認する
    await cart.expectNoBadge();
  });

});