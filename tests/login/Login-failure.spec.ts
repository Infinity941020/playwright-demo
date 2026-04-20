// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// 異常系ログインテスト集
test.describe('ログイン異常系確認', () => {

  // パターン①：誤ったID・PW
  test('パターン① 誤ID・誤PW', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // ログイン画面へアクセス
    await loginPage.goto();

    // 誤情報でログイン
    await loginPage.login('wrong_user', 'wrong_pass');

    // エラー表示確認
    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン②：ID未入力
  test('パターン② ID未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // ID空欄、PWのみ入力
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン③：PW未入力
  test('パターン③ PW未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // IDのみ入力、PW空欄
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン④：ID・PW両方未入力
  test('パターン④ ID・PW未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // 両方空欄でログイン
    await loginPage.login('', '');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン⑤：ログイン不可ユーザー
  test('パターン⑤ locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // ログイン不可ユーザーで実行
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

});