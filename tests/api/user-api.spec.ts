/*
================================
User APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// API実行ヘルパー
import { executeGetUserApi } from '../../utils/apiHelper';

/*
================================
User Assertions
================================
*/
import {
  expectSingleUserResponse,
  expectUserNotFoundPattern
} from '../../utils/apiAssertions/userAssertions';

/*
================================
User APIテスト
================================
*/
test.describe('User APIテスト', () => {

  /*
  ================================
  正常系：単一ユーザー取得
  ================================
  */
  test('単一ユーザー情報を取得できること', async ({ request }) => {

    const response = await executeGetUserApi(
      request,
      2
    );

    console.log(await response.text());

    await expectSingleUserResponse(response);
  });

  /*
  ================================
  取得パターン：存在しないユーザー
  ================================
  */
  test('存在しないユーザーID', async ({ request }) => {

    const response = await executeGetUserApi(
      request,
      9999
    );

    console.log(await response.text());

    await expectUserNotFoundPattern(response);
  });

});