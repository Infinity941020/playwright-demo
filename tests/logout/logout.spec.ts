// Playwrightのテスト機能とexpectを使用
import { test, expect } from '@playwright/test';

// URL定義を読み込み
import { urls } from '../../utils/urls';

// ログアウト機能テスト
test('ログイン後にログアウトできること', async ({ page }) => {

  // ログイン画面へアクセス
  await page.goto(urls.login);

  // ユーザーID入力
  await page.fill('#user-name', 'standard_user');

  // パスワード入力
  await page.fill('#password', 'secret_sauce');

  // ログインボタン押下
  await page.click('#login-button');

  // 商品一覧画面へ遷移完了まで待機
  await page.waitForURL('**/inventory.html');

  // 商品一覧表示確認
  await expect(page.locator('.inventory_list')).toBeVisible();

  // ハンバーガーメニュー表示確認
  await expect(page.locator('#react-burger-menu-btn')).toBeVisible();

  // メニューを開く
  await page.click('#react-burger-menu-btn');

  // Logoutリンク表示待機
  await expect(page.locator('#logout_sidebar_link')).toBeVisible();

  // Logout押下
  await page.click('#logout_sidebar_link');

  // ログイン画面へ戻ったことを確認
  await page.waitForURL('**/');

  // ログインボタン表示確認
  await expect(page.locator('#login-button')).toBeVisible();

});