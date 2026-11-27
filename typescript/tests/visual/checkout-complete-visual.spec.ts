// Checkout Complete画面の見た目を、基準画像と比べるテスト
import { test } from '../../fixtures/loginFixture';
import { CheckoutFlow } from '../../flows/CheckoutFlow';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';
import { checkoutData } from '../../data/checkoutData';
import { products } from '../../data/products';

test.describe('Checkout Complete画面の見た目', () => {

  test('TC-VIS-006：Checkout Complete画面の見た目が、基準画像と一致すること', async ({ loggedPage }) => {

    await new CheckoutFlow(loggedPage).openCompleteWith([products.backpack], checkoutData);

    await expectScreenshotMatches(loggedPage, 'checkout-complete-page.png', 0.01);
  });
});
