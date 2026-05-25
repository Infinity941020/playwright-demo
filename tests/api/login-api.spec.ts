/*
================================
Login APIテスト（ReqRes）
================================
*/

import { test } from '@playwright/test';

// MSW Server
import { server } from '../../mocks/server';

// API実行ヘルパー
import { executeLoginApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// テストデータ
import { apiUsers } from '../../data/apiUsers';

// Assertions（ReqRes版）
import {
  expectLoginSuccess,
  expectLoginFailure
} from '../../utils/apiAssertions/loginAssertions';

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
Login APIテスト
================================
*/
test.describe('Login APIテスト（ReqRes）', () => {

  /*
  =================================
  正常系：ログイン成功
  =================================
  */
  test('ログイン成功', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    await logApiResponse(response);

    await expectLoginSuccess(response);
  });

  /*
  =================================
  異常系：ログイン失敗
  =================================
  */
  test('ログイン失敗（不正認証）', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      {
        email: 'invalid@test.com',
        password: 'wrong-password'
      }
    );

    await logApiResponse(response);

    await expectLoginFailure(response);
  });

});