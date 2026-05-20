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
JSONPlaceholder仕様上、
異常系HTTPエラーは返却されないため、
入力パターン検証として実施する
================================
*/

/*
================================
Login APIテスト
================================
*/
test.describe('Login APIテスト', () => {

  /*
  =================================
  正常ログイン
  =================================
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
  =================================
  password未入力
  =================================
  */
  test('password未入力パターン', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.inputPatterns.missingPassword
    );

    await logApiResponse(response);

    await expectMissingPasswordPattern(response);
  });

  /*
  =================================
  email未入力
  =================================
  */
  test('email未入力パターン', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.inputPatterns.missingEmail
    );

    await logApiResponse(response);

    await expectMissingEmailPattern(response);
  });

  /*
  =================================
  空リクエスト
  =================================
  */
  test('空リクエストパターン', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.inputPatterns.emptyRequest
    );

    await logApiResponse(response);

    await expectEmptyRequestPattern(response);
  });

  /*
  =================================
  不正パスワード
  =================================
  */
  test('不正パスワード入力パターン', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.inputPatterns.wrongPassword
    );

    await logApiResponse(response);

    await expectWrongPasswordPattern(response);
  });

});