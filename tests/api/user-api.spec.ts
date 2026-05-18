/*
================================
User APIテスト
（完成テンプレ：共通アサーション統一）
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
  expectSingleUserResponse
} from '../../utils/apiAssertions/userAssertions';

/*
================================
User APIテスト
================================
*/
test.describe('User APIテスト', () => {

  /*
  ================================
  単一ユーザー取得
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

});