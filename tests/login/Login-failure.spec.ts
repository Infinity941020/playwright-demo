// Playwrightのテスト機能と検証機能をインポート
import { test, expect } from '@playwright/test';

// ログイン業務フローをインポート
import { LoginFlow } from '../../flows/login.flow';

// テストデータをインポート
import { users } from '../../data/users';

/*
========================================
ログイン異常系テスト
========================================
*/

test.describe('ログイン異常系確認', () => {

  // パターン①：誤ったID・PW
  test('誤ID・誤PW', async ({ page }) => {

    // ログインフロー生成
    const loginFlow = new LoginFlow(page);

    // ログイン実行
    await loginFlow.login(
      users.invalid.username,
      users.invalid.password
    );

    // エラー表示確認
    const loginPage = loginFlow.getPage();
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  // パターン②：ID未入力
  test('ID未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', users.standard.password);

    const loginPage = loginFlow.getPage();
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  // パターン③：PW未入力
  test('PW未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.standard.username, '');

    const loginPage = loginFlow.getPage();
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  // パターン④：両方未入力
  test('ID・PW未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', '');

    const loginPage = loginFlow.getPage();
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  // パターン⑤：ロックユーザー
  test('locked_out_user', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(
      users.locked.username,
      users.locked.password
    );

    const loginPage = loginFlow.getPage();
    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

});