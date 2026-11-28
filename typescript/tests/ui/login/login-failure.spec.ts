// ログインの異常系のテスト。
// TC-LOGIN-002〜007 は、エラーの文言の全体と、ログイン画面のままであることを確かめる。
// TC-LOGIN-008 は、エラーが出た後に、ユーザー名の入力値が残っていることを確かめる
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

    await expectLoginErrorMessage(loginFlow, messages.login.usernameRequired);
    await expectOnLoginPage(loginFlow);
  });

  test('TC-LOGIN-003：パスワードを入力せずにログインすると、失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.standard.username, '');

    await expectLoginErrorMessage(loginFlow, messages.login.passwordRequired);
    await expectOnLoginPage(loginFlow);
  });

  test('TC-LOGIN-004：ユーザー名・パスワードの両方が空だと、ユーザー名のエラーでログインに失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login('', '');

    await expectLoginErrorMessage(loginFlow, messages.login.usernameRequired);
    await expectOnLoginPage(loginFlow);
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

      await expectLoginErrorMessage(loginFlow, messages.login.credentialsMismatch);
      await expectOnLoginPage(loginFlow);
    });
  }

  test('TC-LOGIN-007：ロックされたユーザーでは、ログインに失敗すること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.locked.username, users.locked.password);

    await expectLoginErrorMessage(loginFlow, messages.login.lockedOut);
    await expectOnLoginPage(loginFlow);
  });

  test('TC-LOGIN-008：ログイン失敗後、ユーザー名の入力値が保持されること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);
    const username = users.standard.username;

    await loginFlow.login(username, '');

    // テストケースの手順どおり、エラーが出たことを確かめてから、ユーザー名の入力値を確かめる
    await expectLoginErrorMessage(loginFlow, messages.login.passwordRequired);
    await expectUsernameRetained(loginFlow, username);
  });
});
