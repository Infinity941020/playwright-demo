// カート画面を再読み込みした後も、カートの内容が保たれることのテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectInCart,
} from '../../../utils/uiAssertions/cartAssertions';
import { products } from '../../../data/products';

test.describe('カート画面の状態保持', () => {

  test('TC-CART-010：再読み込み後も、カートの内容が保持されること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await cartFlow.openCartWith([backpack, bikeLight]);

    await cartFlow.reloadCart();

    // 並び順は TC-CART-003 で確かめるため、ここでは問わない
    await expectCartItemCount(cartFlow, 2);
    await expectInCart(cartFlow, backpack.name);
    await expectInCart(cartFlow, bikeLight.name);
    await expectBadgeCount(cartFlow, 2);
  });
});
