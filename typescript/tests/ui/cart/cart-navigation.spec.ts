// カート画面からの画面遷移のテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import {
  expectOnCheckoutStepOnePage,
  expectOnInventoryPage,
  expectOnProductDetailPage,
} from '../../../utils/uiAssertions/cartAssertions';
import { products } from '../../../data/products';

test.describe('カート画面からの画面遷移', () => {

  // Continue Shopping と Checkout の2つのボタンで、押すボタンと移る先の画面だけを切り替えて、同じ確かめ方をする
  const buttonCases = [
    {
      id: 'TC-CART-006',
      title: 'Continue Shopping を押すと、Products画面へ遷移すること',
      pressButton: (cartFlow: CartFlow) => cartFlow.continueShopping(),
      expectDestination: expectOnInventoryPage,
    },
    {
      id: 'TC-CART-007',
      title: 'Checkout を押すと、Checkout Step One画面へ遷移すること',
      pressButton: (cartFlow: CartFlow) => cartFlow.checkout(),
      expectDestination: expectOnCheckoutStepOnePage,
    },
  ];

  for (const buttonCase of buttonCases) {

    test(`${buttonCase.id}：${buttonCase.title}`, async ({ loggedPage }) => {

      const cartFlow = new CartFlow(loggedPage);

      await cartFlow.openCartWith([products.backpack]);

      await buttonCase.pressButton(cartFlow);

      await buttonCase.expectDestination(cartFlow);
    });
  }

  test('TC-CART-008：商品名を押すと、商品詳細画面へ遷移すること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const bikeLight = products.bikeLight;

    await cartFlow.openCartWith([bikeLight]);

    await cartFlow.openProductDetail(bikeLight.name);

    await expectOnProductDetailPage(cartFlow, bikeLight.id);
  });
});
