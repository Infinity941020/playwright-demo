// Products画面を、ログインせずに開いたときのテスト。
// ログインした状態を引き継がないように、ログイン済みの画面を用意する部品は使わない
import { test } from '@playwright/test';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { LoginFlow } from '../../../flows/LoginFlow';
import { expectLoginErrorMessage, expectOnLoginPage } from '../../../utils/uiAssertions/loginAssertions';
import { messages } from '../../../data/messages';

// 開く URL の定義が誤っていても気づけるように、パスは URL の定義から作らず、テストケースの期待結果と同じ値を書く
const notLoggedInMessage = messages.login.notLoggedIn.replace('{path}', '/inventory.html');

test.describe('Products画面の認証', () => {

  test('TC-PROD-014：未ログインで直接アクセスすると、Login画面へ戻されること', async ({ page }) => {

    const inventoryFlow = new InventoryFlow(page);
    const loginFlow = new LoginFlow(page);

    await inventoryFlow.accessInventoryDirectly();

    await expectOnLoginPage(loginFlow);
    await expectLoginErrorMessage(loginFlow, notLoggedInMessage);
  });
});
