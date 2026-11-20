// Products画面でのカートへの追加と削除のテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectAddToCartButtonShown,
  expectBadgeCount,
  expectRemoveButtonShown,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { products } from '../../../data/products';

test.describe('Products画面のカート操作', () => {

  test('TC-PROD-006：Add to cart を押すと、ボタンが Remove に変わり、バッジが1になること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const backpack = products.backpack.name;

    await inventoryFlow.addToCart(backpack);

    await expectRemoveButtonShown(inventoryFlow, backpack);
    await expectBadgeCount(inventoryFlow, 1);
  });

  test('TC-PROD-007：Remove を押すと、ボタンが Add to cart に戻り、バッジが1減り、他の商品は影響を受けないこと', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const backpack = products.backpack.name;
    const bikeLight = products.bikeLight.name;

    await inventoryFlow.addToCart(backpack);
    await inventoryFlow.addToCart(bikeLight);
    await inventoryFlow.removeFromCart(backpack);

    await expectAddToCartButtonShown(inventoryFlow, backpack);
    await expectRemoveButtonShown(inventoryFlow, bikeLight);
    await expectBadgeCount(inventoryFlow, 1);
  });

  test('TC-PROD-008：カートが0件になると、バッジが表示されなくなること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const backpack = products.backpack.name;

    await inventoryFlow.addToCart(backpack);
    await inventoryFlow.removeFromCart(backpack);

    await expectBadgeCount(inventoryFlow, 0);
  });
});
