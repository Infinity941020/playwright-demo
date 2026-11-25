/*
================================
User APIテスト（ReqRes + MSW）
================================
*/

import { test } from '../../fixtures/apiFixture';

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
  test('単一ユーザー情報を取得できること', async ({ api }) => {

    const response = await api.user.get(
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
  test('存在しないユーザーID', async ({ api }) => {

    const response = await api.user.get(
      9999
    );

    await logApiResponse(response);

    await expectUserNotFoundPattern(response);
  });

});