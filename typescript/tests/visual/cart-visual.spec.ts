// Cart画面の見た目の比較のテスト
import { test } from '../../fixtures/loginFixture';
import { CartFlow } from '../../flows/CartFlow';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';
import { products } from '../../data/products';

test.describe('Cart画面の見た目', () => {

  test('TC-VIS-003：Cart画面の見た目が、基準画像と一致すること', async ({ loggedPage }) => {

    await new CartFlow(loggedPage).openCartWith([products.backpack]);

    await expectScreenshotMatches(loggedPage, 'cart-page.png', 0.01);
  });
});
