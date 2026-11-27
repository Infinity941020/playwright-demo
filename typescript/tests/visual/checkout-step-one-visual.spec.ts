// Checkout Step One画面の見た目の比較のテスト
import { test } from '../../fixtures/loginFixture';
import { CheckoutFlow } from '../../flows/CheckoutFlow';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';
import { products } from '../../data/products';

test.describe('Checkout Step One画面の見た目', () => {

  // 入力欄は空のまま撮る
  test('TC-VIS-004：Checkout Step One画面の見た目が、基準画像と一致すること', async ({ loggedPage }) => {

    await new CheckoutFlow(loggedPage).openStepOneWith([products.backpack]);

    await expectScreenshotMatches(loggedPage, 'checkout-step-one-page.png', 0.01);
  });
});
