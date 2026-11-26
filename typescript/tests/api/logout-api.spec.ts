// Logout の API のテスト
import { test } from '../../fixtures/apiFixture';
import {
  expectLogoutBadRequest,
  expectLogoutSuccess,
  expectLogoutUnauthorized,
} from '../../utils/apiAssertions/logoutAssertions';

// Authorization ヘッダーの値（モックはヘッダーの有無だけを見る）
const TOKEN = 'Bearer mock-token';

test.describe('Logout API', () => {

  test('TC-API-LOGOUT-001：トークンがあり本文が空なら、ログアウトできること', async ({ api }) => {

    // テストケースの操作のとおり、本文は渡さない（渡さないと本文なしで送る）
    const response = await api.logout({ token: TOKEN });

    await expectLogoutSuccess(response);
  });

  test('TC-API-LOGOUT-002：トークンがないと、401 とエラーが返ること', async ({ api }) => {

    const response = await api.logout();

    await expectLogoutUnauthorized(response, 'unauthorized');
  });

  test('TC-API-LOGOUT-003：本文が空でないと、400 とエラーが返ること', async ({ api }) => {

    const response = await api.logout({ body: { invalid: 'data' }, token: TOKEN });

    await expectLogoutBadRequest(response, 'invalid request');
  });
});
