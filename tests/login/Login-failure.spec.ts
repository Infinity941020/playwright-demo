// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// 共通テストデータを読み込み
import { users } from '../../data/users';

// 異常系ログインテスト集
test.describe('ログイン異常系確認', () => {

  // パターン①：誤ったID・PW
  test('パターン① 誤ID・誤PW', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // 誤情報でログイン（users.ts使用）
    await loginPage.login(
      users.invalid.username,
      users.invalid.password
    );

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン②：ID未入力
  test('パターン② ID未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン③：PW未入力
  test('パターン③ PW未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(users.standard.username, '');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン④：ID・PW両方未入力
  test('パターン④ ID・PW未入力', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('', '');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  // パターン⑤：ログイン不可ユーザー
  test('パターン⑤ locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // ロックユーザー（users.ts使用）
    await loginPage.login(
      users.locked.username,
      users.locked.password
    );

    await expect(loginPage.errorMessage()).toBeVisible();
  });

});