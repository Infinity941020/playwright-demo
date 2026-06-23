// Playwrightのテスト機能と検証機能をインポート
import { test } from '@playwright/test';

// ログイン業務フローをインポート
import { LoginFlow } from '../../../flows/LoginFlow';

// Login UI Assertions
import { expectLoginError } from '../../../utils/uiAssertions/loginAssertions';

// テストデータをインポート
import { users } from '../../../data/users';

/*
========================================
ログイン異常系テスト
（Flow統一版）
========================================
*/
test.describe('ログイン異常系確認', () => {

  // ================================
  // ■ 誤ったID・PW
  // ================================
  test('誤ID・誤PW', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(
      users.invalid.username,
      users.invalid.password
    );

    await expectLoginError(loginFlow);
  });

  // ================================
  // ■ ID未入力
  // ================================
  test('ID未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(
      '',
      users.standard.password
    );

    await expectLoginError(loginFlow);
  });

  // ================================
  // ■ PW未入力
  // ================================
  test('PW未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(
      users.standard.username,
      ''
    );

    await expectLoginError(loginFlow);
  });

  // ================================
  // ■ 両方未入力
  // ================================
  test('ID・PW未入力', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', '');

    await expectLoginError(loginFlow);
  });

  // ================================
  // ■ ロックユーザー
  // ================================
  test('locked_out_user', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(
      users.locked.username,
      users.locked.password
    );

    await expectLoginError(loginFlow);
  });

});