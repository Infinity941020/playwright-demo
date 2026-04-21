// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

/*
========================================
ログアウト機能テスト
（fixture対象：ログイン済み状態から開始）
========================================
*/

// ログイン済み状態からログアウトできることを確認するテスト
test('ログイン後にログアウトできること', async ({ page }) => {

  // 商品一覧ページへ遷移（ログイン済み前提）
  await page.goto('https://www.saucedemo.com/inventory.html');

  // 商品一覧画面が表示されていることを確認
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 左上のハンバーガーメニューを開く
  await page.click('#react-burger-menu-btn');

  // ログアウトボタンをクリック
  await page.click('#logout_sidebar_link');

  // ログアウト後にログイン画面へ戻ることを確認
  await expect(page.locator('#login-button')).toBeVisible();

  // URLもログイン画面になっていることを確認
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});