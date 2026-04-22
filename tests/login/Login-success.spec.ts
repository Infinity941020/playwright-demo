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

// ログイン成功後に商品一覧へ遷移できるか確認するテスト
test('ログイン成功して商品一覧が表示されること', async ({ page }) => {

  // ログイン操作用Page Objectを生成
  const loginPage = new LoginPage(page);

  // ログイン画面へ遷移
  await loginPage.goto();

  // 正しいユーザー情報でログイン実行（users.ts使用）
  await loginPage.login(
    users.standard.username,
    users.standard.password
  );

  // URLが商品一覧ページになっていることを確認
  await expect(page).toHaveURL(/inventory/);

  // 商品一覧が表示されていることを確認
  await expect(page.locator('.inventory_list')).toBeVisible();
});