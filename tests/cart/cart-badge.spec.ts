// Playwrightのテスト機能（テスト定義のみ使用）をimport
import { test } from '@playwright/test';

// ログイン処理をまとめたPage Objectを使用するためのimport
import { LoginPage } from '../../pages/LoginPage';

// カート操作・バッジ検証をまとめたPage Objectを使用するためのimport
import { CartPage } from '../../pages/CartPage';

/*
================================
カートバッジ検証テスト（①〜⑤）
Page Objectを使ったシナリオ層
================================
*/

// テストグループ（カートバッジ検証のまとまり）
test.describe('カートバッジ検証テスト', () => {

  /*
  ================================
  共通処理：ログイン
  ================================
  ・LoginPageを使ってログイン操作を実行
  */
  const login = async (page: any) => {

    // LoginPageインスタンス生成
    const loginPage = new LoginPage(page);

    // ログイン画面へ遷移
    await loginPage.goto();

    // 正常ユーザーでログイン実行
    await loginPage.login('standard_user', 'secret_sauce');
  };

  /*
  ================================
  ① 1件追加テスト
  ================================
  */
  test('① 1件追加：バッジ表示と件数確認', async ({ page }) => {

    // CartPageインスタンス生成（カート操作用）
    const cart = new CartPage(page);

    // ログイン処理実行
    await login(page);

    // 商品を1件カートに追加
    await cart.addFirstItem();

    // バッジが1件であることを検証
    await cart.expectBadgeCount(1);
  });

  /*
  ================================
  ② 全件追加テスト
  ================================
  */
  test('② 全件追加：バッジ表示と件数確認', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // ログイン処理実行
    await login(page);

    // 全商品をカートに追加し、件数を取得
    const count = await cart.addAllItems();

    // バッジ数が商品数と一致することを確認
    await cart.expectBadgeCount(count);
  });

  /*
  ================================
  ③ 1件削除テスト（全件追加後）
  ================================
  */
  test('③ 1件削除：バッジ表示と件数確認', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // ログイン処理実行
    await login(page);

    // 全商品をカートに追加
    const count = await cart.addAllItems();

    // カート画面へ遷移
    await cart.goToCart();

    // 1件削除
    await cart.removeFirstItem();

    // バッジが1減っていることを確認
    await cart.expectBadgeCount(count - 1);
  });

  /*
  ================================
  ④ 2件削除テスト（全件追加後）
  ================================
  */
  test('④ 2件削除：バッジ表示と件数確認', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // ログイン処理実行
    await login(page);

    // 全商品をカートに追加
    const count = await cart.addAllItems();

    // カート画面へ遷移
    await cart.goToCart();

    // 1件目削除
    await cart.removeFirstItem();

    // 2件目削除
    await cart.removeFirstItem();

    // バッジが2減っていることを確認
    await cart.expectBadgeCount(count - 2);
  });

  /*
  ================================
  ⑤ 全件削除テスト（全件追加後）
  ================================
  */
  test('⑤ 全件削除：バッジ非表示確認', async ({ page }) => {

    // CartPageインスタンス生成
    const cart = new CartPage(page);

    // ログイン処理実行
    await login(page);

    // 全商品をカートに追加
    await cart.addAllItems();

    // カート画面へ遷移
    await cart.goToCart();

    // 全商品を削除
    await cart.removeAllItems();

    // バッジが0（非表示）であることを確認
    await cart.expectBadgeCount(0);
  });

});