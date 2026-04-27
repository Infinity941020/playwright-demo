// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作をまとめたPage Objectを読み込み
import { LoginPage } from '../../pages/LoginPage';

// 共通テストデータを読み込み
import { users } from '../../data/users';

/*
========================================
ログイン機能の正常系テスト
（fixture対象外：認証機能そのものの検証）
========================================
*/

test('ログイン成功して商品一覧が表示されること', async ({ page }) => {

  // ログイン操作用Page Object生成
  const loginPage = new LoginPage(page);

  // ログイン画面へ遷移
  await loginPage.goto();

  // 正常ログイン
  await loginPage.login(
    users.standard.username,
    users.standard.password
  );

  // 商品一覧ページへ遷移確認
  await expect(page).toHaveURL(/inventory/);

  // 商品一覧表示確認
  await expect(page.locator('.inventory_list')).toBeVisible();

});