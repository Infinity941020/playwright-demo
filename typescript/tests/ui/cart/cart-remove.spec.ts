// カート画面での商品の削除のテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectCartItemNamesInOrder,
  expectCartPageLayout,
} from '../../../utils/uiAssertions/cartAssertions';
import { products } from '../../../data/products';

test.describe('カート画面の削除', () => {

  test('TC-CART-004：Remove を押すと、その商品の行だけが消え、バッジが1減ること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const { backpack, bikeLight, onesie } = products;

    await cartFlow.openCartWith([backpack, bikeLight, onesie]);

    // 先頭ではなく途中の行を消して、押した行ではなく先頭の行が消える不具合も見つけられるようにする
    await cartFlow.removeFromCart(bikeLight.name);

    await expectCartItemNamesInOrder(cartFlow, [backpack.name, onesie.name]);
    await expectBadgeCount(cartFlow, 2);
  });

  test('TC-CART-005：最後の1件を Remove すると、商品の行とバッジがなくなること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const backpack = products.backpack;

    await cartFlow.openCartWith([backpack]);

    await cartFlow.removeFromCart(backpack.name);

    await expectCartItemCount(cartFlow, 0);
    await expectBadgeCount(cartFlow, 0);
    await expectCartPageLayout(cartFlow);
  });
});
