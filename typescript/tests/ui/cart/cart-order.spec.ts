// カート画面の並び順のテスト。
// 追加の操作そのものを確かめるため、前提の状態はブラウザの保存領域への書き込みではなく、商品一覧画面での操作で作る
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { expectCartItemNamesInOrder } from '../../../utils/uiAssertions/cartAssertions';
import { expectOnCartPage } from '../../../utils/uiAssertions/inventoryAssertions';
import { products } from '../../../data/products';

test.describe('カート画面の並び順', () => {

  test('TC-CART-003：カートに追加した順に表示されること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const cartFlow = new CartFlow(loggedPage);

    // 商品名の順（昇順・降順）にも、商品の番号の順（昇順・降順）にもならない並びにして、追加した順で並んでいることを区別できるようにする。
    // 追加する商品の番号は 0→4→2
    const addedOrder = [products.bikeLight.name, products.backpack.name, products.onesie.name];

    for (const productName of addedOrder) {
      await inventoryFlow.addToCart(productName);
    }
    await inventoryFlow.openCart();

    // 失敗したときに、画面が移らなかったのかを区別できるように、先にカート画面であることを確かめる
    await expectOnCartPage(inventoryFlow);

    await expectCartItemNamesInOrder(cartFlow, addedOrder);
  });
});
