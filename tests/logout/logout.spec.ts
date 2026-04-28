// Playwright fixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// LogoutFlow
import { LogoutFlow } from '../../flows/LogoutFlow';

/*
================================
Logoutテスト（Flow版）
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

    // Flow初期化
    flow = new LogoutFlow(loggedPage);
  });

  /*
  ================================
  ログイン後にログアウトできること
  ================================
  */
  test('ログイン後にログアウトできること', async () => {

    // ログアウト実行
    await flow.logout();
  });

});