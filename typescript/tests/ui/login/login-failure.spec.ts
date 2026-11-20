// ログインの異常系のテスト。
// どのテストも、エラーの文言を一字一句確かめ、ログイン画面のままであることも確かめる
import { test } from '@playwright/test';
import { LoginFlow } from '../../../flows/LoginFlow';
import {
  expectLoginErrorMessage,
  expectOnLoginPage,
  expectUsernameRetained,
} from '../../../utils/uiAssertions/loginAssertions';
import { users } from '../../../data/users';
import { messages } from '../../../data/messages';

test.describe('ログインの異常系', () => {

  test('TC-LOGIN-002：ユーザー名を入力せずにログインすると、失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', users.standard.password);

    await expectOnLoginPage(loginFlow);
    await expectLoginErrorMessage(loginFlow, messages.login.usernameRequired);
  });

  test('TC-LOGIN-003：パスワードを入力せずにログインすると、失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.standard.username, '');

    await expectOnLoginPage(loginFlow);
    await expectLoginErrorMessage(loginFlow, messages.login.passwordRequired);
  });

  test('TC-LOGIN-004：ユーザー名・パスワードの両方が空だと、ユーザー名のエラーでログインに失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', '');

    await expectOnLoginPage(loginFlow);
    await expectLoginErrorMessage(loginFlow, messages.login.usernameRequired);
  });

  // ユーザー名だけ・パスワードだけが誤っている2つの組で、同じ確かめ方をする（同じエラーの文言になる）
  const singleFieldWrongCases = [
    {
      id: 'TC-LOGIN-005',
      title: '存在しないユーザー名でログインすると、失敗すること',
      user: users.wrongUsernameOnly,
    },
    {
      id: 'TC-LOGIN-006',
      title: '正しいユーザー名で、パスワードだけが誤っていると、ログインに失敗すること',
      user: users.wrongPasswordOnly,
    },
  ];

  for (const testCase of singleFieldWrongCases) {

    test(`${testCase.id}：${testCase.title}`, async ({ page }) => {

      const loginFlow = new LoginFlow(page);

      await loginFlow.login(testCase.user.username, testCase.user.password);

      await expectOnLoginPage(loginFlow);
      await expectLoginErrorMessage(loginFlow, messages.login.credentialsMismatch);
    });
  }

  test('TC-LOGIN-007：ロックされたユーザーでは、ログインに失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.locked.username, users.locked.password);

    await expectOnLoginPage(loginFlow);
    await expectLoginErrorMessage(loginFlow, messages.login.lockedOut);
  });

  test('TC-LOGIN-008：ログインに失敗した後も、ユーザー名の入力値が残っていること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);
    const username = users.standard.username;

    await loginFlow.login(username, '');

    // 失敗したことを先に確かめてから、入力値を確かめる
    await expectLoginErrorMessage(loginFlow, messages.login.passwordRequired);
    await expectUsernameRetained(loginFlow, username);
  });
});
