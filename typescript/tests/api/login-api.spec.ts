// Login の API のテスト
import { test } from '../../fixtures/apiFixture';
import { expectLoginBadRequest, expectLoginSuccess } from '../../utils/apiAssertions/loginAssertions';
import { apiUsers } from '../../data/apiUsers';

test.describe('Login API', () => {

  test('TC-API-LOGIN-001：正しい認証情報でログインすると、トークンが返ること', async ({ api }) => {

    const response = await api.login(apiUsers.validUser);

    await expectLoginSuccess(response, 'mock-token');
  });

  test('TC-API-LOGIN-002：誤った認証情報でログインすると、400 とエラーが返ること', async ({ api }) => {

    const response = await api.login(apiUsers.invalidUser);

    await expectLoginBadRequest(response, 'user not found');
  });
});
