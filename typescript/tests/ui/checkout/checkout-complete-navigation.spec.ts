// Checkout Complete画面からの画面遷移のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectOnCartPage,
  expectOnInventoryPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Complete画面からの画面遷移', () => {

  // Back Home・カートアイコンの2通りで、押すものと移る先の画面だけを切り替えて、同じ確かめ方をする
  const buttonCases = [
    {
      id: 'TC-CO3-002',
      title: 'Back Home を押すと、Products画面へ遷移すること',
      pressButton: (checkoutFlow: CheckoutFlow) => checkoutFlow.backHome(),
      expectDestination: expectOnInventoryPage,
    },
    {
      id: 'TC-CO3-003',
      title: 'カートアイコンを押すと、Cart画面へ遷移すること',
      pressButton: (checkoutFlow: CheckoutFlow) => checkoutFlow.openCart(),
      expectDestination: expectOnCartPage,
    },
  ];

  for (const buttonCase of buttonCases) {

    test(`${buttonCase.id}：${buttonCase.title}`, async ({ loggedPage }) => {

      const checkoutFlow = new CheckoutFlow(loggedPage);

      await checkoutFlow.openCompleteWith([products.backpack], checkoutData);

      await buttonCase.pressButton(checkoutFlow);

      await buttonCase.expectDestination(checkoutFlow);
    });
  }
});
