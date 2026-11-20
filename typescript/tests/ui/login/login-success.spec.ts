// ログインの正常系のテスト（ログインの手順を、画面で最初から最後まで通す）
import { test } from '@playwright/test';
import { LoginFlow } from '../../../flows/LoginFlow';
import { expectLoginSuccess } from '../../../utils/uiAssertions/loginAssertions';
import { users } from '../../../data/users';

test.describe('ログインの正常系', () => {

  test('TC-LOGIN-001：正しいユーザー名・パスワードでログインできること', async ({ page }) => {

    const loginFlow = new LoginFlow(page);

    await loginFlow.login(users.standard.username, users.standard.password);

    await expectLoginSuccess(loginFlow);
  });
});
