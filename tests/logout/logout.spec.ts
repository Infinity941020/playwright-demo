// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// ログイン → ログアウトまでの一連の流れを確認するE2Eテスト
test('ログイン後にログアウトできること', async ({ page }) => {

  // ログイン操作をまとめたPage Objectを生成
  const loginPage = new LoginPage(page);

  // ① ログイン画面へ遷移
  await loginPage.goto();

  // ② ログイン実行（正常ユーザー）
  await loginPage.login('standard_user', 'secret_sauce');

  // ③ ログイン成功確認（商品一覧が表示される）
  await expect(page.locator('.inventory_list')).toBeVisible();

  // ④ ハンバーガーメニューをクリックして開く
  // （左上の三本線メニュー）
  await page.click('#react-burger-menu-btn');

  // ⑤ ログアウトボタンをクリック
  await page.click('#logout_sidebar_link');

  // ⑥ ログアウト後、ログイン画面に戻ったことを確認
  await expect(page.locator('#login-button')).toBeVisible();
});