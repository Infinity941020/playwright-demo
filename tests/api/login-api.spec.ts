/*
================================
Login APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// テストデータ
import { apiUsers } from '../../data/apiUsers';

// API実行ヘルパー
import { executeLoginApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import {
  expectLoginSuccess,
  expectMissingPasswordPattern,
  expectMissingEmailPattern,
  expectEmptyRequestPattern,
  expectWrongPasswordPattern
} from '../../utils/apiAssertions/loginAssertions';

/*
================================
Login APIテスト
================================
*/
test.describe('Login APIテスト', () => {

  test('正常ログイン（POST作成成功）', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    await logApiResponse(response);

    await expectLoginSuccess(response);
  });

  test('password未入力', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingPassword
    );

    await logApiResponse(response);

    await expectMissingPasswordPattern(response);
  });

  test('email未入力', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingEmail
    );

    await logApiResponse(response);

    await expectMissingEmailPattern(response);
  });

  test('空リクエスト', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.emptyRequest
    );

    await logApiResponse(response);

    await expectEmptyRequestPattern(response);
  });

  test('不正パスワード', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.wrongPassword
    );

    await logApiResponse(response);

    await expectWrongPasswordPattern(response);
  });

});