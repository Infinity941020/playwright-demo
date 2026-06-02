/*
================================
Login APIテスト（ReqRes）
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

// テストデータ
import { apiUsers } from '../../data/apiUsers';

// Assertions（ReqRes版）
import {
  expectLoginSuccess,
  expectLoginBadRequest
} from '../../utils/apiAssertions/loginAssertions';

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
  test('ログイン成功', async ({ api }) => {

    const response = await api.login(
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
  test('ログイン失敗（不正認証）', async ({ api }) => {

    const response = await api.login({
      email: 'invalid@test.com',
      password: 'wrong-password'
    });

    await logApiResponse(response);

    await expectLoginBadRequest(response);
  });

});