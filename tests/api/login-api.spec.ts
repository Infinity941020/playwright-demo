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

  /*
  ================================
  正常系（POST作成成功）
  ================================
  */
  test('正常ログイン（POST作成成功）', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    await logApiResponse(response);

    await expectLoginSuccess(response);
  });

  /*
  ================================
  入力パターン：password未入力
  ================================
  */
  test('password未入力', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingPassword
    );

    await logApiResponse(response);

    await expectMissingPasswordPattern(response);
  });

  /*
  ================================
  入力パターン：email未入力
  ================================
  */
  test('email未入力', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingEmail
    );

    await logApiResponse(response);

    await expectMissingEmailPattern(response);
  });

  /*
  ================================
  入力パターン：空リクエスト
  ================================
  */
  test('空リクエスト', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.emptyRequest
    );

    await logApiResponse(response);

    await expectEmptyRequestPattern(response);
  });

  /*
  ================================
  入力パターン：不正パスワード
  ================================
  */
  test('不正パスワード', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.wrongPassword
    );

    await logApiResponse(response);

    await expectWrongPasswordPattern(response);
  });

});