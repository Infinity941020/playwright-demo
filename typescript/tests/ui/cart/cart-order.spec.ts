// カート画面の並び順のテスト。
// 追加の操作そのものを確かめるため、前提の状態はブラウザの保存領域への書き込みではなく、商品一覧画面での操作で作る
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { expectCartItemNamesInOrder } from '../../../utils/uiAssertions/cartAssertions';
import { products } from '../../../data/products';

test.describe('カート画面の並び順', () => {

  test('TC-CART-003：カートに追加した順に表示されること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const cartFlow = new CartFlow(loggedPage);

    // 商品名の順にも商品の番号の順（2→0→4）にもならない並びにして、追加した順で並んでいることを区別できるようにする
    const addedOrder = [products.onesie.name, products.bikeLight.name, products.backpack.name];

    for (const productName of addedOrder) {
      await inventoryFlow.addToCart(productName);
    }
    await inventoryFlow.openCart();

    await expectCartItemNamesInOrder(cartFlow, addedOrder);
  });
});
