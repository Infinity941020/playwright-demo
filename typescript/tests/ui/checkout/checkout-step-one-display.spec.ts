// Checkout Step One画面の表示のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectBadgeCount,
  expectCheckoutStepOnePageLayout,
  expectNoCheckoutError,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { products } from '../../../data/products';

test.describe('Checkout Step One画面の表示', () => {

  test('TC-CO1-001：画面が仕様どおりに表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepOneWith([products.backpack]);

    await expectCheckoutStepOnePageLayout(checkoutFlow);
    await expectBadgeCount(checkoutFlow, 1);
    await expectNoCheckoutError(checkoutFlow);
  });
});
