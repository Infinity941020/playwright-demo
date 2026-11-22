// 各画面からログアウトしたときのテスト
import { Page } from '@playwright/test';
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import { LoginFlow } from '../../../flows/LoginFlow';
import { LogoutFlow } from '../../../flows/LogoutFlow';
import {
  expectLoginInputsEmpty,
  expectNoLoginError,
  expectOnLoginPage,
} from '../../../utils/uiAssertions/loginAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('ログアウト', () => {

  // ログアウトを始める画面（Products・Cart・Complete）だけを切り替えて、同じ確かめ方をする
  const startPageCases = [
    {
      id: 'TC-LOGOUT-004',
      title: 'Products画面からログアウトすると、空の Login画面へ遷移すること',

      // ログイン済みの画面は、商品一覧画面を開いた状態で始まるため、何もしない
      openStartPage: async (_page: Page) => {},
    },
    {
      id: 'TC-LOGOUT-005',
      title: 'Cart画面からログアウトすると、空の Login画面へ遷移すること',
      openStartPage: (page: Page) => new CartFlow(page).openCartWith([]),
    },
    {
      id: 'TC-LOGOUT-006',
      title: 'Checkout Complete画面からログアウトすると、空の Login画面へ遷移すること',
      openStartPage: (page: Page) => new CheckoutFlow(page).openCompleteWith([products.backpack], checkoutData),
    },
  ];

  for (const startPageCase of startPageCases) {

    test(`${startPageCase.id}：${startPageCase.title}`, async ({ loggedPage }) => {

      const logoutFlow = new LogoutFlow(loggedPage);
      const loginFlow = new LoginFlow(loggedPage);

      await startPageCase.openStartPage(loggedPage);

      await logoutFlow.logout();

      // 期待結果の URL と表示を、テストの確認として明示する（ログアウトの操作の中でも確かめている）
      await expectOnLoginPage(loginFlow);
      await expectLoginInputsEmpty(loginFlow);
      await expectNoLoginError(loginFlow);
    });
  }
});
