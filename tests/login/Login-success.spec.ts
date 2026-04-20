 // Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// 正常系ログインテスト
test('正常ログイン確認', async ({ page }) => {

  // ログイン画面操作クラス呼び出し
  const loginPage = new LoginPage(page);

  // ログイン画面へアクセス
  await loginPage.goto();

  // 正常なID・PWでログイン実行
  await loginPage.login('standard_user', 'secret_sauce');

  // 商品一覧画面へ遷移したこと確認
  await expect(page).toHaveURL(/inventory/);
});