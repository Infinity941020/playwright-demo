// Checkout Complete画面から移った後の、カートの状態のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectOnCartPage,
  expectOnInventoryPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { expectAddToCartButtonShown } from '../../../utils/uiAssertions/inventoryAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Complete画面から移った後の状態', () => {

  test('TC-CO3-004：Back Home で Products画面へ移っても、カートが空のままであること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await checkoutFlow.openCompleteWith([backpack, bikeLight], checkoutData);

    await checkoutFlow.backHome();

    // 失敗したときに、画面が移らなかったのか、カートが空になっていないのかを区別できるように、先に商品一覧画面であることを確かめる
    await expectOnInventoryPage(checkoutFlow);

    await expectAddToCartButtonShown(inventoryFlow, backpack.name);
    await expectAddToCartButtonShown(inventoryFlow, bikeLight.name);
    await expectBadgeCount(checkoutFlow, 0);
  });

  test('TC-CO3-005：カートアイコンで Cart画面へ移っても、カートが空のままであること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openCompleteWith([products.backpack, products.bikeLight], checkoutData);

    await checkoutFlow.openCart();

    // 行が0件であることとバッジがないことは、画面が移る前の Complete画面でも成り立つため、先にカート画面であることを確かめる
    await expectOnCartPage(checkoutFlow);

    await expectCartItemCount(checkoutFlow, 0);
    await expectBadgeCount(checkoutFlow, 0);
  });
});
