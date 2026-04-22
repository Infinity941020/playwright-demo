// 共通URL定義を使用
import { urls } from '../utils/urls';

/*
================================
ログイン処理ヘルパー
================================
各テスト・fixtureから呼び出される共通ログインロジック
================================
*/

export async function login(page: any) {

  // ログイン画面へ遷移
  await page.goto(urls.login);

  // ユーザー名入力
  await page.locator('#user-name').fill('standard_user');

  // パスワード入力
  await page.locator('#password').fill('secret_sauce');

  // ログインボタン押下
  await page.locator('#login-button').click();

  // 商品一覧画面の表示を待機
  await page.locator('.inventory_list').waitFor();
}