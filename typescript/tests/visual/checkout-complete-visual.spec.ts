// Checkout Complete画面の見た目の比較のテスト
import { test } from '../../fixtures/loginFixture';
import { CheckoutFlow } from '../../flows/CheckoutFlow';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';
import { checkoutData } from '../../data/checkoutData';
import { products } from '../../data/products';

test.describe('Checkout Complete画面の見た目', () => {

  // 画像は見出しが表示された時点で読み込みが終わっていない場合があるため、撮る前に読み込みが終わるのを待つ（比べる部品の中で待つ）
  test('TC-VIS-006：Checkout Complete画面の見た目が、基準画像と一致すること', async ({ loggedPage }) => {

    await new CheckoutFlow(loggedPage).openCompleteWith([products.backpack], checkoutData);

    await expectScreenshotMatches(loggedPage, 'checkout-complete-page.png', 0.01);
  });
});
