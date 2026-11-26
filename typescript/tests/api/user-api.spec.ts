// User の API のテスト
import { test } from '../../fixtures/apiFixture';
import { expectSingleUserResponse, expectUserNotFound } from '../../utils/apiAssertions/userAssertions';

// 値は specs/api_spec.md「User API」の表と同じにする
const EXPECTED_USER = {
  id: 2,
  email: 'janet.weaver@reqres.in',
  first_name: 'Janet',
  last_name: 'Weaver',
  avatar: 'https://reqres.in/img/faces/2-image.jpg',
};

test.describe('User API', () => {

  test('TC-API-USER-001：存在するユーザーの情報が返ること', async ({ api }) => {

    const response = await api.user.get(2);

    await expectSingleUserResponse(response, EXPECTED_USER);
  });

  test('TC-API-USER-002：存在しないユーザーで 404 が返ること', async ({ api }) => {

    const response = await api.user.get(9999);

    await expectUserNotFound(response);
  });
});
