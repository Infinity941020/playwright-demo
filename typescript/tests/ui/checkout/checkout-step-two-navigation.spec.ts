// Checkout Step Two画面からの画面遷移のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectOnCartPage,
  expectOnCheckoutCompletePage,
  expectOnInventoryPage,
  expectOnProductDetailPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Step Two画面からの画面遷移', () => {

  // Finish・Cancel・カートアイコンの3通りで、押すものと移る先の画面だけを切り替えて、同じ確かめ方をする
  const buttonCases = [
    {
      id: 'TC-CO2-007',
      title: 'Finish を押すと、Complete画面へ遷移すること',
      pressButton: (checkoutFlow: CheckoutFlow) => checkoutFlow.completePurchase(),
      expectDestination: expectOnCheckoutCompletePage,
    },
    {
      id: 'TC-CO2-008',
      title: 'Cancel を押すと、Products画面へ遷移すること',
      pressButton: (checkoutFlow: CheckoutFlow) => checkoutFlow.cancelFromStepTwo(),
      expectDestination: expectOnInventoryPage,
    },
    {
      id: 'TC-CO2-009',
      title: 'カートアイコンを押すと、Cart画面へ遷移すること',
      pressButton: (checkoutFlow: CheckoutFlow) => checkoutFlow.openCart(),
      expectDestination: expectOnCartPage,
    },
  ];

  for (const buttonCase of buttonCases) {

    test(`${buttonCase.id}：${buttonCase.title}`, async ({ loggedPage }) => {

      const checkoutFlow = new CheckoutFlow(loggedPage);

      await checkoutFlow.openStepTwoWith([products.backpack], checkoutData);

      await buttonCase.pressButton(checkoutFlow);

      await buttonCase.expectDestination(checkoutFlow);
    });
  }

  test('TC-CO2-010：商品名を押すと、商品詳細画面へ遷移すること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const bikeLight = products.bikeLight;

    await checkoutFlow.openStepTwoWith([bikeLight], checkoutData);

    await checkoutFlow.openProductDetail(bikeLight.name);

    await expectOnProductDetailPage(checkoutFlow, bikeLight.id);
  });
});
