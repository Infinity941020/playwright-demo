// Checkout Step One画面からの画面遷移のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectOnCartPage,
  expectOnCheckoutStepTwoPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Step One画面からの画面遷移', () => {

  test('TC-CO1-008：3項目を入力して Continue を押すと、Step Two画面へ遷移すること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepOneWith([products.backpack]);

    await checkoutFlow.fillCheckoutInfo(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
    await checkoutFlow.proceedToOverviewStep();

    await expectOnCheckoutStepTwoPage(checkoutFlow);
  });

  // Cancel とカートアイコンの2つで、押すものだけを切り替えて、同じ確かめ方をする
  const toCartCases = [
    {
      id: 'TC-CO1-009',
      title: 'Cancel を押すと、Cart画面へ遷移すること',
      goToCart: (checkoutFlow: CheckoutFlow) => checkoutFlow.cancelFromStepOne(),
    },
    {
      id: 'TC-CO1-010',
      title: 'カートアイコンを押すと、Cart画面へ遷移すること',
      goToCart: (checkoutFlow: CheckoutFlow) => checkoutFlow.openCart(),
    },
  ];

  for (const testCase of toCartCases) {

    test(`${testCase.id}：${testCase.title}`, async ({ loggedPage }) => {

      const checkoutFlow = new CheckoutFlow(loggedPage);

      await checkoutFlow.openStepOneWith([products.backpack]);

      await testCase.goToCart(checkoutFlow);

      await expectOnCartPage(checkoutFlow);
    });
  }
});
