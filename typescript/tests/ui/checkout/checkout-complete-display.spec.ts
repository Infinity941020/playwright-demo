// Checkout Complete画面の表示のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectBadgeCount,
  expectCheckoutCompletePageLayout,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Complete画面の表示', () => {

  test('TC-CO3-001：購入直後に、画面が仕様どおりに表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openCompleteWith([products.backpack, products.bikeLight], checkoutData);

    await expectCheckoutCompletePageLayout(checkoutFlow);
    await expectBadgeCount(checkoutFlow, 0);
  });
});
