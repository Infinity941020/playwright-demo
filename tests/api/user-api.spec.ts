// Playwright test
import { test } from '@playwright/test';

// API Helper
import { executeGetSingleUserApi } from '../../utils/apiHelper';

// API Assertions
import { expectSingleUserResponse } from '../../utils/apiAssertions';

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

    // User API実行
    const response = await executeGetSingleUserApi(
      request,
      2
    );

    // response確認
    console.log(await response.text());

    // User情報検証
    await expectSingleUserResponse(response);
  });
});