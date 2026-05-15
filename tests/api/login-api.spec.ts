// Playwright test
import { test } from '@playwright/test';

// APIテスト用データ
import { apiUsers } from '../../data/apiUsers';

// API Helper
import { executeLoginApi } from '../../utils/apiHelper';

// API Assertions
import {
  expectLoginSuccess,
  expectMissingPasswordError
} from '../../utils/apiAssertions';

/*
================================
Login APIテスト
================================
*/

// Login APIテストグループ
test.describe('Login APIテスト', () => {

  /*
  ================================
  正常系ログインAPI
  ================================
  */

  // 正常ログインAPI検証
  test('正常なログインリクエスト', async ({ request }) => {

    // Login API実行
    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    // response確認
    console.log(await response.text());

    // 正常ログイン検証
    await expectLoginSuccess(response);
  });

  /*
  ================================
  異常系ログインAPI（password未入力）
  ================================
  */

  // password未入力時の異常系検証
  test('password未入力時に400エラーになること', async ({ request }) => {

    // Login API実行
    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingPassword
    );

    // response確認
    console.log(await response.text());

    // password未入力検証
    await expectMissingPasswordError(response);
  });
});