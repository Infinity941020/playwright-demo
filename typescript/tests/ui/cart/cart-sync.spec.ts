// カート画面での削除が、Products画面の表示に反映されることのテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectAddToCartButtonShown,
  expectRemoveButtonShown,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { products } from '../../../data/products';

test.describe('カート画面とProducts画面の連動', () => {

  test('TC-CART-009：Cart画面での削除が、Products画面の表示に反映されること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await cartFlow.openCartWith([backpack, bikeLight]);

    await cartFlow.removeFromCart(backpack.name);
    await cartFlow.continueShopping();

    await expectAddToCartButtonShown(inventoryFlow, backpack.name);
    await expectRemoveButtonShown(inventoryFlow, bikeLight.name);
  });
});
