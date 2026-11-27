// Login画面の見た目の比較のテスト
import { test } from '@playwright/test';
import { LoginFlow } from '../../flows/LoginFlow';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';

test.describe('Login画面の見た目', () => {

  // ログイン状態を引き継がないよう、ログイン済みの画面ではなく、ログインしていない画面を使う
  test('TC-VIS-001：Login画面の見た目が、基準画像と一致すること', async ({ page }) => {

    await new LoginFlow(page).openLoginPage();

    await expectScreenshotMatches(page, 'login-page.png', 0.01);
  });
});
