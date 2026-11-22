// ログアウトした後に、ログインが必要な画面へ戻れないことのテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { LoginFlow } from '../../../flows/LoginFlow';
import { LogoutFlow } from '../../../flows/LogoutFlow';
import { expectLoginErrorMessage, expectOnLoginPage } from '../../../utils/uiAssertions/loginAssertions';
import { messages } from '../../../data/messages';
import { products } from '../../../data/products';

// 開く URL の定義が誤っていても気づけるように、パスは URL の定義から作らず、テストケースの期待結果と同じ値を書く
const inventoryNotLoggedInMessage = messages.login.notLoggedIn.replace('{path}', '/inventory.html');

// エラーの文言には、商品の番号（?id=4）は含まれない
const productDetailNotLoggedInMessage = messages.login.notLoggedIn.replace('{path}', '/inventory-item.html');

test.describe('ログアウトした後のアクセス', () => {

  // 開く画面と、期待するエラーの文言だけを切り替えて、同じ確かめ方をする
  const accessCases = [
    {
      id: 'TC-LOGOUT-007',
      title: 'ログアウト後に Products画面へ直接アクセスすると、Login画面へ戻されること',
      accessDirectly: (inventoryFlow: InventoryFlow) => inventoryFlow.accessInventoryDirectly(),
      errorMessage: inventoryNotLoggedInMessage,
    },
    {
      id: 'TC-LOGOUT-008',
      title: 'ログアウト後に商品詳細画面へ直接アクセスすると、Login画面へ戻されること',
      accessDirectly: (inventoryFlow: InventoryFlow) => inventoryFlow.accessProductDetailDirectly(products.backpack.id),
      errorMessage: productDetailNotLoggedInMessage,
    },
  ];

  for (const accessCase of accessCases) {

    test(`${accessCase.id}：${accessCase.title}`, async ({ loggedPage }) => {

      const logoutFlow = new LogoutFlow(loggedPage);
      const inventoryFlow = new InventoryFlow(loggedPage);
      const loginFlow = new LoginFlow(loggedPage);

      await logoutFlow.logout();

      await accessCase.accessDirectly(inventoryFlow);

      // ログアウトした直後もログイン画面のため、画面の確認だけでは直接開いた結果を確かめられない。戻された後に出るエラーの文言を先に確かめる
      await expectLoginErrorMessage(loginFlow, accessCase.errorMessage);
      await expectOnLoginPage(loginFlow);
    });
  }

  test('TC-LOGOUT-009：ログアウト後にブラウザの「戻る」を押しても、ログイン後の画面に戻れないこと', async ({ loggedPage }) => {

    const logoutFlow = new LogoutFlow(loggedPage);
    const loginFlow = new LoginFlow(loggedPage);

    await logoutFlow.logout();

    await logoutFlow.goBackInBrowser();

    // ログアウトした直後もログイン画面のため、画面の確認だけでは「戻る」の結果を確かめられない。戻された後に出るエラーの文言を先に確かめる
    await expectLoginErrorMessage(loginFlow, inventoryNotLoggedInMessage);
    await expectOnLoginPage(loginFlow);
  });
});
