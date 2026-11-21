// カート画面を再読み込みした後も、カートの内容が保たれることのテスト。
// 画面で追加した内容が保存されない不具合も見つけられるように、前提の状態はブラウザの保存領域への書き込みではなく、商品一覧画面での操作で作る
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectInCart,
} from '../../../utils/uiAssertions/cartAssertions';
import { expectOnCartPage } from '../../../utils/uiAssertions/inventoryAssertions';
import { products } from '../../../data/products';

test.describe('カート画面の状態保持', () => {

  test('TC-CART-010：再読み込み後も、カートの内容が保持されること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await inventoryFlow.addToCart(backpack.name);
    await inventoryFlow.addToCart(bikeLight.name);
    await inventoryFlow.openCart();

    // 前提の状態が作れていないまま再読み込みに進まないように、カート画面であることと行の数を先に確かめる
    await expectOnCartPage(inventoryFlow);
    await expectCartItemCount(cartFlow, 2);

    await cartFlow.reloadCart();

    // 並び順は TC-CART-003 で確かめるため、ここでは問わない
    await expectCartItemCount(cartFlow, 2);
    await expectInCart(cartFlow, backpack.name);
    await expectInCart(cartFlow, bikeLight.name);
    await expectBadgeCount(cartFlow, 2);
  });
});
