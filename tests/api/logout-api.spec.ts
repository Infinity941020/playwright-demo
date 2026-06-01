import { test } from '@playwright/test';

/*
================================
Logout APIテスト（MSW）
================================
*/

// MSW Server
import { server } from '../../mocks/server';

// API実行ヘルパー
import { executeLogoutApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import {
  expectLogoutSuccess,
  expectLogoutUnauthorized,
  expectLogoutBadRequest,
} from '../../utils/apiAssertions/logoutAssertions';

/*
================================
MSW Setup
================================
*/
test.beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'bypass',
  });
});

test.afterEach(() => {
  server.resetHandlers();
});

test.afterAll(() => {
  server.close();
});

/*
================================
Logout APIテスト
================================
*/
test.describe('Logout APIテスト（MSW）', () => {

  /*
  =================================
  正常系：ログアウト成功
  =================================
  */
  test('ログアウト成功', async ({ request }) => {
    const response = await executeLogoutApi(
      request,
      {},
      'Bearer mock-token'
    );

    await logApiResponse(response);

    await expectLogoutSuccess(response);
  });

  /*
  =================================
  異常系：未認証
  =================================
  */
  test('未認証ログアウト（401）', async ({ request }) => {
    const response = await executeLogoutApi(
      request,
      {},
      undefined
    );

    await logApiResponse(response);

    await expectLogoutUnauthorized(response);
  });

  /*
  =================================
  異常系：不正リクエスト
  =================================
  */
  test('不正リクエスト（400）', async ({ request }) => {
    const response = await executeLogoutApi(
      request,
      { invalid: 'data' },
      'Bearer mock-token'
    );

    await logApiResponse(response);

    await expectLogoutBadRequest(response);
  });

});