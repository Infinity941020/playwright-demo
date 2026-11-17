/*
================================
User APIテスト（ReqRes + MSW）
================================
*/

// MSW Setup
import '../setup/msw.setup';

import { test } from '@playwright/test';

// API実行ヘルパー
import { executeGetUserApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

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
  =================================
  正常系：ユーザー取得成功
  =================================
  */
  test('単一ユーザー情報を取得できること', async ({ request }) => {

    const response = await executeGetUserApi(
      request,
      2
    );

    await logApiResponse(response);

    await expectSingleUserResponse(response);
  });

  /*
  =================================
  異常系：存在しないユーザー
  =================================
  */
  test('存在しないユーザーID', async ({ request }) => {

    const response = await executeGetUserApi(
      request,
      9999
    );

    await logApiResponse(response);

    await expectUserNotFoundPattern(response);
  });

});