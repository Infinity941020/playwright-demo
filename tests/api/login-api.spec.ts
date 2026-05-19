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

// Assertions（Phase4版）
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

    console.log(await response.text());

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

    console.log(await response.text());

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

    console.log(await response.text());

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

    console.log(await response.text());

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

    console.log(await response.text());

    await expectWrongPasswordPattern(response);
  });

});