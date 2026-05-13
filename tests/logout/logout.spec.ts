// Playwright fixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// LogoutFlow
import { LogoutFlow } from '../../flows/LogoutFlow';

/*
================================
Logout機能テスト（Flow版）
================================
*/

test.describe('Logout機能テスト（Flow版）', () => {

  let flow: LogoutFlow;

  /*
  ================================
  前処理
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    flow = new LogoutFlow(loggedPage);
  });

  /*
  ================================
  ログイン後にログアウトできること
  ================================
  */
  test('ログイン後にログアウトできること', async () => {

    await test.step('ログアウト実行', async () => {
      await flow.logout();
    });

    await test.step('ログイン画面表示確認', async () => {
      await flow.expectOnLoginPage();
    });

  });

});