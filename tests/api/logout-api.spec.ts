/*
================================
Logout APIテスト（MSW）
================================
*/

/*
================================
MSW Setup
================================
*/
import '../setup/msw.setup';

import { test } from '../../fixtures/apiFixture';

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
Logout APIテスト
================================
*/
test.describe('Logout APIテスト（MSW）', () => {

  /*
  ================================
  正常系：ログアウト成功
  ================================
  */
  test('ログアウト成功', async ({ api }) => {

    const response = await api.logout({
      body: {},
      token: 'Bearer mock-token',
    });

    await logApiResponse(response);

    await expectLogoutSuccess(response);
  });

  /*
  ================================
  未認証
  ================================
  */
  test('未認証ログアウト（401）', async ({ api }) => {

    const response = await api.logout({
      body: {},
      token: undefined,
    });

    await logApiResponse(response);

    await expectLogoutUnauthorized(response);
  });

  /*
  ================================
  不正リクエスト
  ================================
  */
  test('不正リクエスト（400）', async ({ api }) => {

    const response = await api.logout({
      body: { invalid: 'data' },
      token: 'Bearer mock-token',
    });

    await logApiResponse(response);

    await expectLogoutBadRequest(response);
  });

});