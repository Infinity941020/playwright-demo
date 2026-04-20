// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// ログイン成功 → 商品一覧表示までを確認するE2Eテスト
test('ログイン成功して商品一覧が表示されること', async ({ page }) => {

  // Page Object（ログイン操作をまとめたクラス）を生成
  const loginPage = new LoginPage(page);

  // ① ログインページへ遷移
  // baseURL + /login のような画面へ移動する処理
  await loginPage.goto();

  // ② ログイン処理を実行
  // 正しいユーザー情報でログインを行う
  await loginPage.login('standard_user', 'secret_sauce');

  // ③ URL確認（ログイン成功の判定）
  // inventoryページに遷移しているかチェック
  await expect(page).toHaveURL(/inventory/);

  // ④ 商品一覧が表示されているか確認
  // ログイン後のメイン画面が正しく表示されているか検証
  await expect(page.locator('.inventory_list')).toBeVisible();
});